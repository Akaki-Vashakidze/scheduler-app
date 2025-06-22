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

  forgetPass(email: string): Observable<any> {
    return this.http.post(`/consoleApi/auth/forgot-password`, { email });
  }

  changePassword(currentPassword:string, password: string): Observable<any> {
    return this.http.put(`/consoleApi/auth/change-password`, {currentPassword:currentPassword, newPassword:password });
  }

  signUp(email: string, password: string, code:string): Observable<any> {
    const body = { email, password, code };
    return this.http.post(`/consoleApi/auth/signup`, body);
  }

  checkSession(): Observable<any> {
    return this.http.get(`/consoleApi/auth/session`);
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

  logOut(){
    return this.http.post(`/consoleApi/auth/logout`, {});
  }

}
