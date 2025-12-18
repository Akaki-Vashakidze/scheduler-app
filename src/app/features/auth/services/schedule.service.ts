import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericResponse, Invitation, SentContactRequest } from '../../../interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
      constructor(private http: HttpClient) { }

      getUserSchedule(userId:string): Observable<GenericResponse<Invitation[]>>{
        return this.http.get<GenericResponse<Invitation[]>>(`/consoleApi/schedule/${userId}`)
      }

      getMySchedule(): Observable<GenericResponse<Invitation[]>>{
        return this.http.get<GenericResponse<Invitation[]>>(`/consoleApi/schedule/my`)
      }
}