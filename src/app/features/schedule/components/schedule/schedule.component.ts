import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../../auth/services/schedule.service';

@Component({
  selector: 'app-schedule',
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {

  userId!: string | null;

  constructor(private route: ActivatedRoute,private scheduleService:ScheduleService) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    console.log(this.userId)
    this.scheduleService.getUserSchedule(this.userId ?? '').subscribe(item => {
      console.log(item)
    })
  }
}
