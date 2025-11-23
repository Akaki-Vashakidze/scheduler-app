import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavsService {
  leftSideNavOpen: boolean = true;
  public leftSideNavOpen$ = new BehaviorSubject<any>(false);
  public leftSideNav$: Observable<any> = this.leftSideNavOpen$.asObservable();
  

  rightSideNavOpen: boolean = true;
  public rightSideNavOpen$ = new BehaviorSubject<any>(false);
  public rightSideNav$: Observable<any> = this.rightSideNavOpen$.asObservable();
  
  constructor() { 
   this.leftSideNavOpen = localStorage.getItem('scheduler-left-side-nav_open') == 'true' ? true : false;
    this.leftSideNavOpen$.next(this.leftSideNavOpen);

   this.rightSideNavOpen = localStorage.getItem('scheduler-right-side-nav_open') == 'true' ? true : false;
    this.rightSideNavOpen$.next(this.rightSideNavOpen);
  }

  openLeftSideNav(){
    this.leftSideNavOpen = true;
    this.leftSideNavOpen$.next(true);
    localStorage.setItem('scheduler-left-side-nav_open','true')
  }
  
  closeLeftSideNav(){
    this.leftSideNavOpen = false;
    this.leftSideNavOpen$.next(false);
    localStorage.setItem('scheduler-left-side-nav_open','false')
  }

  openRightSideNav(){
    this.rightSideNavOpen = true;
    this.rightSideNavOpen$.next(true);
    localStorage.setItem('scheduler-right-side-nav_open','true')
  }
  
  closeRightSideNav(){
    this.rightSideNavOpen = false;
    this.rightSideNavOpen$.next(false);
    localStorage.setItem('scheduler-right-side-nav_open','false')
  }
} 
