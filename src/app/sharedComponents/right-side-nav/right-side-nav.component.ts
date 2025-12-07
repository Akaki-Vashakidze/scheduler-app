import { Component, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { MatIcon } from "@angular/material/icon";
import { SideNavsService } from '../../features/auth/services/side-navs.service';
import { SharedService } from '../../features/auth/services/shared.service';
import { SelectedSchedule } from '../../interfaces/shared.interface';
import { CommonModule } from '@angular/common';
import { InvitationsService } from '../../features/schedule/services/invitations.service';
import { SnackbarService } from '../../features/auth/services/snack-bar.service';
import { ErrorBoxComponent } from "../error-box/error-box.component";
import { InvitationCreatorBoxComponent } from '../invitation-creator-box/invitation-creator-box.component';

@Component({
  selector: 'app-right-side-nav',
  standalone: true,
  imports: [TranslateModule, CommonModule, MatIcon, ErrorBoxComponent, InvitationCreatorBoxComponent],
  templateUrl: './right-side-nav.component.html',
  styleUrls: ['./right-side-nav.component.scss']
})
export class RightSideNavComponent {

  constructor(private sideNavService:SideNavsService){}

  closeRightNav(): void {
    this.sideNavService.closeRightSideNav();
  }
}