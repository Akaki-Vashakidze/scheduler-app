import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericResponse, Invitation } from '../../../interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {

  constructor(private http: HttpClient) { }

  GetInvitations(searchQuery: string | null, location:string | null, approved:number | null, active:number | null, weekday:string | null, specificDate:Date | null, urjent:number | null ): Observable<GenericResponse<Invitation[]>> {
    let body : {searchQuery?: string, location?: string, approved?: number, active?: number, weekday?: string, specificDate?: Date, urjent?: number} = {};
    searchQuery ? body.searchQuery = searchQuery : null;
    location ? body.location = location : null;
    approved ? body.approved = approved : null;
    active ? body.active = active : null;
    weekday ? body.weekday = weekday : null;
    specificDate ? body.specificDate = specificDate : null;  
    urjent ? body.urjent = urjent : null;
    return this.http.post<GenericResponse<Invitation[]>>(`/consoleApi/invitation/list`, body);
  }

}