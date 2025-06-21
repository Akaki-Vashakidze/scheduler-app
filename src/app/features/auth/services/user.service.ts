import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$: Observable<any> = this.userSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('schedule_user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    this.userSubject.next(parsedUser);
  }

  setUser(user: any) {
    this.userSubject.next(user);
    if (user) {
      localStorage.setItem('schedule_user', JSON.stringify(user));
      localStorage.setItem('schedule_token', JSON.stringify(user));
    } else {
      localStorage.removeItem('schedule_user');
      localStorage.removeItem('schedule_token');
    }
  }

  getUser(): any {
    return this.userSubject.value;
  }
}
