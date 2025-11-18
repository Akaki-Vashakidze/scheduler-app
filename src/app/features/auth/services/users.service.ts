import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactRequest, GenericResponse } from '../../../interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(searchQuery: string): Observable<any> {
    const body = { searchQuery };
    return this.http.post(`/consoleApi/users/list`, body);
  }

  createContactRequest( contactId: string): Observable<GenericResponse<ContactRequest>> {
    return this.http.post<GenericResponse<ContactRequest>>(`/consoleApi/users/contact/request/${contactId}`, {});
  }     

  getSentContactRequests(): Observable<GenericResponse<ContactRequest[]>> {
    return this.http.get<GenericResponse<ContactRequest[]>>(`/consoleApi/users/contact/requests/sent`);
  }

  getReceivedContactRequests(): Observable<GenericResponse<ContactRequest[]>> {
    return this.http.get<GenericResponse<ContactRequest[]>>(`/consoleApi/users/contact/requests/received`);
  }

//   respondToContactRequest(requestId: string, accept: boolean): Observable<any> {
//     const body = { accept };
//     return this.http.post(`/consoleApi/users/contact/respond/${requestId}`, body);
//   }

    removeContactRequest(contactId: string): Observable<GenericResponse<ContactRequest>> {
        return this.http.delete<GenericResponse<ContactRequest>>(`/consoleApi/users/contact/request/${contactId}`);
    }
}
