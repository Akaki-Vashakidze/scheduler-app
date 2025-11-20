import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../../auth/services/schedule.service';
import { CalendarDay, Invitation } from '../../../../interfaces/shared.interface';

@Component({
  selector: 'app-contact-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-schedule.component.html',
  styleUrls: ['./contact-schedule.component.scss']
})

export class ContactScheduleComponent implements OnInit {

  userId!: string | null;
  daysArray: { weekday: string; date: number; month: string; fullDate: Date }[] = [];
  calendarDays!: CalendarDay[];
  userSchedule!: Invitation[];

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService
  ) {}

ngOnInit() {
  this.userId = this.route.snapshot.paramMap.get('id');

  if (this.userId) {
    this.scheduleService.getUserSchedule(this.userId).subscribe(item => {
      console.log('User schedule:', item);
      this.userSchedule = item.result.data;

      this.generateDays();

      this.calendarDays = this.mergeDaysWithEvents(this.daysArray, this.userSchedule);
      console.log('Merged calendar:', this.calendarDays);
    });
  }
}

generateTimeline(day: any) {
  const timeline: string[] = [];

  // 1. Add hours from 6:00 to 24:00
  for (let hour = 6; hour <= 24; hour++) {
    timeline.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  // 2. Add event start/end times if they are not on the hour
  if (day.events) {
    day.events.forEach((ev:any) => {
      if (!timeline.includes(ev.start)) timeline.push(ev.start);
      if (!timeline.includes(ev.end)) timeline.push(ev.end);
    });
  }

  // 3. Sort timeline
  timeline.sort((a, b) => {
    const [ah, am] = a.split(':').map(Number);
    const [bh, bm] = b.split(':').map(Number);
    return ah * 60 + am - (bh * 60 + bm);
  });

  return timeline.map(time => ({
    time,
    event: day.events.find((ev:any) => time >= ev.start && time < ev.end) || null
  }));
}


generateDays() {
  const today = new Date();
  const daysInMonth = 30;

  for (let i = 0; i < daysInMonth; i++) {
    const currentDate = new Date();
    currentDate.setDate(today.getDate() + i);

    const weekdayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const day = currentDate.getDate();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });

    this.daysArray.push({
      weekday: weekdayName,
      date: day,
      month: monthName,
      fullDate: currentDate
    });
  }
}

mergeDaysWithEvents(days: any[], events: any[]) {
  return days.map(day => {
    const matchedEvents = events.filter(ev => ev.weekday === day.weekday);
    return {
      ...day,
      events: matchedEvents,
      timeline: this.generateTimeline({ ...day, events: matchedEvents })
    };
  });
}


getHoursForDay(day: any) {
  let hours = [];

  for (let h = 6; h <= 24; h++) {
    const label = h.toString().padStart(2, '0') + ':00';

    const hasEvent = day.events?.some((ev:any) => {
      const startHour = +ev.start.split(':')[0];
      const endHour = +ev.end.split(':')[0];
      return h >= startHour && h < endHour;
    });

    hours.push({
      label,
      busy: hasEvent
    });
  }

  return hours;
}

generateTimeSlots(startHour = 6, endHour = 24, intervalMinutes = 5) {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      const hh = hour.toString().padStart(2, '0');
      const mm = min.toString().padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}
}
