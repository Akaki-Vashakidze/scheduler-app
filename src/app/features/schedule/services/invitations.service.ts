import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse, Invitation, SendInvitation } from '../../../interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {

  constructor(private http: HttpClient) { }

  GetInvitations(searchQuery: string | null, location:string | null, approved:number | null, active:number | null, weekday:string | null, specificDate:Date | null, urgent:number | null ): Observable<GenericResponse<Invitation[]>> {
    let body : {searchQuery?: string, location?: string, approved?: number, active?: number, weekday?: string, specificDate?: Date, urgent?: number} = {};
    searchQuery != null ? body.searchQuery = searchQuery : null;
    location != null ? body.location = location : null;
    approved != null ? body.approved = approved : null;
    active != null ? body.active = active : null;
    weekday != null ? body.weekday = weekday : null;
    specificDate != null ? body.specificDate = specificDate : null;  
    urgent != null ? body.urgent = urgent : null;
    return this.http.post<GenericResponse<Invitation[]>>(`/consoleApi/invitation/list`, body);
  }

  acceptInvitation(invitationId: string): Observable<GenericResponse<any>> {
    return this.http.post<GenericResponse<any>>(`/consoleApi/invitation/accept/${invitationId}`,{});
  }

  declineInvitation(invitationId: string): Observable<GenericResponse<any>> {
    return this.http.post<GenericResponse<any>>(`/consoleApi/invitation/decline/${invitationId}`,{});
  } 

  sendInvitation(data:SendInvitation[]){
    return this.http.post<GenericResponse<any>>(`/consoleApi/invitation/invite`,{invitations:data});
  }

}