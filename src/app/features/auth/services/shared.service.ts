import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  rightSideNavChosenSchedulHelper: boolean = true;
  public rightSideNavChosenSchedulHelper$ = new BehaviorSubject<any>(false);
  public rightSideNavChosenSchedul$: Observable<any> = this.rightSideNavChosenSchedulHelper$.asObservable();
  
  setRightSideNavContent(body:any){
    this.rightSideNavChosenSchedulHelper = body;
    this.rightSideNavChosenSchedulHelper$.next(body)
  }
} 
