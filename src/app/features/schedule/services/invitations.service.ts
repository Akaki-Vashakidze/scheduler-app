import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { GenericResponse, Invitation, SendInvitation } from '../../../interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {

  constructor(private http: HttpClient) { }
  ContactAsInviteeId!:string;
  public needToUpdateSentInvitations = new BehaviorSubject<any>(null);
  public needToUpdateRecievedInvitations = new BehaviorSubject<any>(null);

  updateSentInvitations(){
    this.needToUpdateSentInvitations.next(true)
  }

  updateRecievedInvitations(){
    this.needToUpdateRecievedInvitations.next(true)
  }

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

  cancelInvitation(invitationId: string): Observable<GenericResponse<any>> {
    return this.http.post<GenericResponse<any>>(`/consoleApi/invitation/cancel/${invitationId}`,{});
  } 

  reactivateMySentlInvitation(invitationId: string): Observable<GenericResponse<any>> {
    return this.http.post<GenericResponse<any>>(`/consoleApi/invitation/reactivateMySent/${invitationId}`,{});
  } 

  removeMySentlInvitation(invitationId: string): Observable<GenericResponse<any>> {
    return this.http.delete<GenericResponse<any>>(`/consoleApi/invitation/removeMySent/${invitationId}`,{});
  } 

  sendInvitation(data:SendInvitation[]){
    return this.http.post<GenericResponse<any>>(`/consoleApi/invitation/invite`,{invitations:data});
  }

  sendTeamInvitation(data:SendInvitation[]){
    return this.http.post<GenericResponse<any>>(`/consoleApi/invitation/inviteTeam`,{invitations:data});
  }

  GetMySentInvitations( location:string | null, active:number | null, urgent:number | null , approved:number | null ): Observable<GenericResponse<Invitation[]>> {
    let body : {location?: string, active?: number, urgent?: number, approved?: number} = {};
    location != null ? body.location = location : null;
    active != null ? body.active = active : null;
    urgent != null ? body.urgent = urgent : null;
    approved != null ? body.approved = approved : null;
    return this.http.post<GenericResponse<Invitation[]>>(`/consoleApi/invitation/mySentInvitations`, body);
  }
}