import { Component, OnDestroy} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from "@angular/material/icon";
import { SideNavsService } from '../../features/auth/services/side-navs.service';
import { CommonModule } from '@angular/common';
import { InvitationCreatorBoxComponent } from '../invitation-creator-box/invitation-creator-box.component';
import { MySentInvitationsComponent } from "../my-sent-invitations/my-sent-invitations.component";
import { PendingRecievedInvitationsComponent } from "../recieved-invitations/pending-recieved-invitations.component";
import { SharedService } from '../../features/auth/services/shared.service';
import { Subject, takeUntil } from 'rxjs';
import { CreateTeamComponent } from "../../features/team/create-team/create-team.component";

@Component({
  selector: 'app-right-side-nav',
  standalone: true,
  imports: [TranslateModule, CommonModule, MatIcon, InvitationCreatorBoxComponent, CreateTeamComponent,MySentInvitationsComponent, PendingRecievedInvitationsComponent, CreateTeamComponent],
  templateUrl: './right-side-nav.component.html',
  styleUrls: ['./right-side-nav.component.scss']
})
export class RightSideNavComponent implements OnDestroy {
  contentType!:string;
  private destroy$ = new Subject<void>();
  constructor(private sideNavService:SideNavsService, private sharedService:SharedService){
    this.sharedService.rightSideNavChosenSchedulHelper$
          .pipe(takeUntil(this.destroy$))
          .subscribe(newItems => {
            console.log('RightSideNavComponent - newItems:', newItems);
            this.contentType = newItems.type;
          });
  }

  closeRightNav(): void {
    this.sideNavService.closeRightSideNav();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}