import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  rightSideNavChosenSchedulHelper: boolean = true;
  public rightSideNavChosenSchedulHelper$ = new BehaviorSubject<any>(false);
  public rightSideNavChosenSchedul$: Observable<any> = this.rightSideNavChosenSchedulHelper$.asObservable();
  public invitationForMe: boolean = false;
  
  setRightSideNavContent(body:any, type:string){
    this.invitationForMe = body?.forMe || false;
    this.rightSideNavChosenSchedulHelper = body;
    this.rightSideNavChosenSchedulHelper$.next({...body, type});
  }
}