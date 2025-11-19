import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
      constructor(private http: HttpClient) { }

      getUserSchedule(userId:string){
        return this.http.get(`/consoleApi/schedule/${userId}`)
      }
}