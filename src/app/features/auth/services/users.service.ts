import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(searchQuery: string): Observable<any> {
    const body = { searchQuery };
    return this.http.post(`/consoleApi/users/list`, body);
  }

}
