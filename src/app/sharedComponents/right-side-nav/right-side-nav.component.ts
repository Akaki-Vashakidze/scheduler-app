import { Component} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIcon } from "@angular/material/icon";
import { SideNavsService } from '../../features/auth/services/side-navs.service';
import { CommonModule } from '@angular/common';
import { InvitationCreatorBoxComponent } from '../invitation-creator-box/invitation-creator-box.component';
import { MySentInvitationsComponent } from "../my-sent-invitations/my-sent-invitations.component";

@Component({
  selector: 'app-right-side-nav',
  standalone: true,
  imports: [TranslateModule, CommonModule, MatIcon, InvitationCreatorBoxComponent, MySentInvitationsComponent],
  templateUrl: './right-side-nav.component.html',
  styleUrls: ['./right-side-nav.component.scss']
})
export class RightSideNavComponent {

  constructor(private sideNavService:SideNavsService){}

  closeRightNav(): void {
    this.sideNavService.closeRightSideNav();
  }
}