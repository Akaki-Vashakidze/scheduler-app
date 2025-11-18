import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  leftSideNavOpen: boolean = true;
  public leftSideNavOpen$ = new BehaviorSubject<any>(true);
  public sideNav$: Observable<any> = this.leftSideNavOpen$.asObservable();
  
  constructor() { }

  openSideNav(){
    this.leftSideNavOpen = true;
    this.leftSideNavOpen$.next(this.leftSideNavOpen);
  }
  
  closeSideNav(){
    this.leftSideNavOpen = false;
    this.leftSideNavOpen$.next(this.leftSideNavOpen);
  }
} 
