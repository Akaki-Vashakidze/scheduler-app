import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { GenericResponse, Invitation, SentContactRequest } from '../../../interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
      constructor(private http: HttpClient) { }

      getUserSchedule(userId:string): Observable<GenericResponse<Invitation[]>>{
        return this.http
          .get<GenericResponse<Invitation[]>>(`/consoleApi/schedule/${userId}`)
          .pipe(
            map(response => {
              const data = response.result.data || [];

              const editedData = data.map(invitation => ({
                ...invitation,
                start: this.timeConverter(invitation.startHour, invitation.startMinute),
                end: this.timeConverter(invitation.endHour, invitation.endMinute)
              }));

              return {
                ...response,
                result: {
                  ...response.result,
                  data: editedData
                }
              };
            })
          );
      }

      getMySchedule(): Observable<GenericResponse<Invitation[]>> {
        return this.http
          .get<GenericResponse<Invitation[]>>('/consoleApi/schedule/my')
          .pipe(
            map(response => {
              const data = response.result.data || [];

              const editedData = data.map(invitation => ({
                ...invitation,
                start: this.timeConverter(invitation.startHour, invitation.startMinute),
                end: this.timeConverter(invitation.endHour, invitation.endMinute)
              }));

              return {
                ...response,
                result: {
                  ...response.result,
                  data: editedData
                }
              };
            })
          );
      }

      timeConverter(hour: number, minute: number): string {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        return `${formattedHour}:${formattedMinute}`;
      }

}