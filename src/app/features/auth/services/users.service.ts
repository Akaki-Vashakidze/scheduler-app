import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SentContactRequest, GenericResponse, RecievedContactRequest } from '../../../interfaces/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(searchQuery: string): Observable<any> {
    const body = { searchQuery };
    return this.http.post(`/consoleApi/users/list`, body);
  }

  createContactRequest( contactId: string): Observable<GenericResponse<SentContactRequest>> {
    return this.http.post<GenericResponse<SentContactRequest>>(`/consoleApi/users/contact/request/${contactId}`, {});
  }     

  getSentContactRequests(): Observable<GenericResponse<SentContactRequest[]>> {
    return this.http.get<GenericResponse<SentContactRequest[]>>(`/consoleApi/users/contact/requests/sent`);
  }

  getReceivedContactRequests(): Observable<GenericResponse<RecievedContactRequest[]>> {
    return this.http.get<GenericResponse<RecievedContactRequest[]>>(`/consoleApi/users/contact/requests/received`);
  }

//   respondToContactRequest(requestId: string, accept: boolean): Observable<any> {
//     const body = { accept };
//     return this.http.post(`/consoleApi/users/contact/respond/${requestId}`, body);
//   }

    removeContactRequest(contactId: string): Observable<GenericResponse<SentContactRequest>> {
        return this.http.delete<GenericResponse<SentContactRequest>>(`/consoleApi/users/contact/request/${contactId}`);
    }
}
