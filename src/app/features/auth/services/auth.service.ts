import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`/consoleApi/auth/login`, body);
  }

  signUp(email: string, password: string, code:string): Observable<any> {
    const body = { email, password, code };
    return this.http.post(`/consoleApi/auth/signup`, body);
  }

  sendVerificationCode(email: string): Observable<any> {
    const body = { email };
    return this.http.post(`/consoleApi/auth/sendVerificationCodeEmail`, body);
  } 

  confirmCode(email:string,code: string): Observable<any> {
    console.log(email,code)
    const body = { email, code };
    return this.http.post(`/consoleApi/auth/confirmCodeEmail`, body);
  }

}
