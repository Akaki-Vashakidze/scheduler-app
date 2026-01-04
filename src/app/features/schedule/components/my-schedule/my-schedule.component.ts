import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvitationsService } from '../../services/invitations.service';
import { CalendarDay, Invitation, SelectedSchedule } from '../../../../interfaces/shared.interface';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../auth/services/shared.service';
import { SideNavsService } from '../../../auth/services/side-navs.service';
import { ScheduleService } from '../../../auth/services/schedule.service';
import { RightNavContentType } from '../../../../enums/shared.enums';

@Component({
  selector: 'app-my-schedule',
  imports: [CommonModule, TranslateModule, MatTabsModule, FormsModule, MatSlideToggleModule],
  templateUrl: './my-schedule.component.html',
  styleUrl: './my-schedule.component.scss'
})
export class MyScheduleComponent implements OnInit, OnDestroy {
  daysArray: any[] = [];
  calendarDays!: CalendarDay[];
  userSchedule!: Invitation[];
  selectedStartTime: any;
  startTimeOrEndTime: string = 'start';
  selectedItems: SelectedSchedule[] = [];
  subscriptions: Subscription[] = []

  constructor(private route: ActivatedRoute, private invitationsService: InvitationsService, private sharedService: SharedService, private sideNavService: SideNavsService, private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.invitationsService.needToUpdateRecievedInvitations.subscribe(item => {
        this.getUserSchedule()
        this.selectedItems = []
        this.sideNavService.closeRightSideNav()
      })  
    );
  }

  getUserSchedule() {
    this.scheduleService.getMySchedule().subscribe(item => {
      this.userSchedule = item.result.data || [];
      this.generateDays();
      this.calendarDays = this.mergeDaysWithEvents(this.daysArray, this.userSchedule);
    })
  }

  generateDays() {
    const today = new Date();
    const daysInMonth = 30;
    this.daysArray = [];

    for (let i = 0; i < daysInMonth; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() + i);

      this.daysArray.push({
        weekday: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        date: currentDate.getDate(),
        month: currentDate.toLocaleDateString('en-US', { month: 'long' }),
        fullDate: new Date(currentDate.toISOString())  // ← ISO DATE HERE
      });
    }

    // this.invitationsService.sendInvitation()
  }

  mergeDaysWithEvents(days: any[], events: any[]) {
    const ev = events || [];
    return days.map(day => {
      const matchedEvents = ev.filter((e: any) => {

        let eventDate = new Date(e.date).toISOString().slice(0, 10);
        let dayDate = new Date(day.fullDate).toISOString().slice(0, 10);

        if ((e.weekday === day.weekday && !e.isSingleUse) || eventDate == dayDate) {
          return e;
        }
      });

      return {
        ...day,
        events: matchedEvents,
        // generate fresh timeline for the day (safe)
        timeline: this.generateTimeline({ ...day, events: matchedEvents })
      };
    });
  }

  generateTimeline(day: any) {
    const timeline: string[] = [];
    for (let hour = 6; hour <= 24; hour++) {
      timeline.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    const events = day.events || [];
    events.forEach((ev: any) => {
      if (ev?.start && !timeline.includes(ev.start)) timeline.push(ev.start);
      if (ev?.end && !timeline.includes(ev.end)) timeline.push(ev.end);
    });

    timeline.sort((a, b) => {
      const [ah, am] = a.split(':').map(Number);
      const [bh, bm] = b.split(':').map(Number);
      return ah * 60 + am - (bh * 60 + bm);
    });

    return timeline.map(time => ({
      time,
      event: events.find((ev: any) => ev.start && ev.end && time >= ev.start && time < ev.end) || null,
      justEnded: !!events.find((ev: any) => ev.end === time),
      selected: false,
      isStart: false,
      isEnd: false,
      showMiniSlots: false,
      miniSlots: []
    }));
  }

  chooseTime(slot: any, nextSlot: any, day: any) {
    if (!nextSlot || slot.event || slot.selected) return;

    // hide any other mini slots for this day
    this.hideMiniSlotsEverywhere(day);

    slot.showMiniSlots = true;
    slot.miniSlots = this.generate5MinIntervals(slot.time, nextSlot.time).map(t => ({
      time: t,
      selected: false,
      isStart: false,
      isEnd: false,
      isBetween: false
    }));
  }

  hideMiniSlotsEverywhere(day: any) {
    if (!day?.timeline) return;
    day.timeline.forEach((s: any) => s.showMiniSlots = false);
  }

  selectMiniSlot(mainSlot: any, mini: any, event: MouseEvent, day: any) {
    event.stopPropagation();

    // ensure daySelection exists
    let daySelection = this.selectedItems?.find((d: any) => d.date.getTime() === day.fullDate.getTime());
    if (!daySelection) {
      daySelection = { day: day.weekday, date: day.fullDate, start: null, end: null, title: '', description: '', urgent: 0, location: '' };
      this.selectedItems.push(daySelection);
    }

    // If selecting start while start exists -> ask to reset
    if (this.startTimeOrEndTime === 'start' && daySelection.start) {
      if (!confirm('A start time already exists for this day. Reset?')) return;

      // reset selection for the day
      daySelection.start = null;
      daySelection.end = null;

      // clear visual flags
      day.timeline.forEach((slot: any) => {
        slot.selected = false;
        slot.isStart = false;
        slot.isEnd = false;
        if (Array.isArray(slot.miniSlots)) {
          slot.miniSlots.forEach((m: any) => {
            m.selected = false;
            m.isStart = false;
            m.isEnd = false;
            m.isBetween = false;
          });
        }
      });
    }

    // SELECT START
    if (this.startTimeOrEndTime === 'start') {
      // reset mini flags in this main slot
      if (Array.isArray(mainSlot.miniSlots)) {
        mainSlot.miniSlots.forEach((m: any) => {
          m.selected = false;
          m.isStart = false;
          m.isEnd = false;
          m.isBetween = false;
        });
      }

      // mark clicked mini as start
      mini.selected = true;
      mini.isStart = true;

      // update main slot visual/time
      mainSlot.time = mini.time;
      mainSlot.selected = true;
      mainSlot.isStart = true;
      mainSlot.isEnd = false;
      mainSlot.showMiniSlots = true;

      daySelection.start = mini.time;
      daySelection.end = null;
      this.startTimeOrEndTime = 'end';
      return;
    }

    // SELECT END
    if (this.startTimeOrEndTime === 'end') {
      if (!daySelection.start) return;
      if (this.compareTimes(mini.time, daySelection.start) < 0) {
        alert('End time cannot be before start time!');
        return;
      }

      daySelection.end = mini.time;
      const startTime = daySelection.start;
      const endTime = daySelection.end;

      // mark main slots + mini slots in range
      day.timeline.forEach((slot: any) => {
        const slotStart = slot.time;
        // determine slot end using its miniSlots last item if exists
        const slotEnd = (Array.isArray(slot.miniSlots) && slot.miniSlots.length)
          ? slot.miniSlots[slot.miniSlots.length - 1].time
          : slot.time;

        const inRange = this.compareTimes(slotEnd, startTime) >= 0 && this.compareTimes(slotStart, endTime ?? '') <= 0;
        slot.selected = inRange;
        // main slot isStart/isEnd if its time or its miniSlots contain the start/end
        slot.isStart = slot.time === startTime || (Array.isArray(slot.miniSlots) && slot.miniSlots.some((m: any) => m.time === startTime));
        slot.isEnd = slot.time === endTime || (Array.isArray(slot.miniSlots) && slot.miniSlots.some((m: any) => m.time === endTime));

        if (Array.isArray(slot.miniSlots)) {
          slot.miniSlots.forEach((m: any) => {
            const inMiniRange = this.compareTimes(m.time, startTime) >= 0 && this.compareTimes(m.time, endTime ?? '') <= 0;
            m.selected = inMiniRange;
            m.isStart = m.time === startTime;
            m.isEnd = m.time === endTime;
            m.isBetween = inMiniRange && m.time !== startTime && m.time !== endTime;
          });
        }

        // keep mini slots visible for affected slots until user resets or cancels
        if (inRange) slot.showMiniSlots = true;
      });
      this.selectedItems = [...this.selectedItems].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      this.sharedService.setRightSideNavContent({invitations:this.selectedItems, forMe:true}, RightNavContentType.INVITATIONS);
      this.sideNavService.openRightSideNav()
      this.startTimeOrEndTime = 'start';
      return;
    }
  }

  cancelChosenSlots(day: any) {
    // remove from selectedItems
    const index = this.selectedItems.findIndex((d: any) => d.date.getTime() === day.fullDate.getTime());
    if (index !== -1) this.selectedItems.splice(index, 1);

    // restore the timeline to its original hourly intervals and clear flags
    // regenerate the timeline for the day using its events (this restores proper times)
    const matchedEvents = (day.events || []);
    const freshTimeline = this.generateTimeline({ ...day, events: matchedEvents });

    // replace day's timeline with fresh timeline
    day.timeline = freshTimeline;

    // reset flags on new timeline entries (generateTimeline already initializes flags)
    // ensure no miniSlots are present
    day.timeline.forEach((slot: any) => {
      slot.showMiniSlots = false;
      slot.miniSlots = [];
    });

    this.startTimeOrEndTime = 'start';
    if (this.selectedItems.length == 0) {
      this.sideNavService.closeRightSideNav()
    }
    this.sharedService.setRightSideNavContent({invitations:this.selectedItems, forMe:true}, RightNavContentType.INVITATIONS)
  }

  compareTimes(a: string, b: string): number {
    const [ah, am] = a.split(':').map(Number);
    const [bh, bm] = b.split(':').map(Number);
    return ah * 60 + am - (bh * 60 + bm);
  }

  generate5MinIntervals(start: string, end: string): string[] {
    const result: string[] = [];
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(sh, sm, 0, 0);
    const endDate = new Date();
    endDate.setHours(eh, em, 0, 0);

    while (startDate < endDate) {
      const h = startDate.getHours().toString().padStart(2, '0');
      const m = startDate.getMinutes().toString().padStart(2, '0');
      result.push(`${h}:${m}`);
      startDate.setMinutes(startDate.getMinutes() + 5);
    }
    return result;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.sharedService.setRightSideNavContent(null, RightNavContentType.NONE);
  }
}

