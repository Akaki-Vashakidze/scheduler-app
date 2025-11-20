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
    return { ...day, events: matchedEvents };
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


}
