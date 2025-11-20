import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  leftSideNavOpen: boolean = true;
  public leftSideNavOpen$ = new BehaviorSubject<any>(false);
  public sideNav$: Observable<any> = this.leftSideNavOpen$.asObservable();
  
  constructor() { 
   this.leftSideNavOpen = localStorage.getItem('scheduler-side-nav_open') == 'true' ? true : false;
    this.leftSideNavOpen$.next(this.leftSideNavOpen);
  }

  openSideNav(){
    this.leftSideNavOpen = true;
    this.leftSideNavOpen$.next(true);
    localStorage.setItem('scheduler-side-nav_open','true')
  }
  
  closeSideNav(){
    this.leftSideNavOpen = false;
    this.leftSideNavOpen$.next(false);
    localStorage.setItem('scheduler-side-nav_open','false')
  }
} 
