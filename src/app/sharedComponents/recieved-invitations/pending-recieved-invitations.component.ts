import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvitationsService } from '../../features/schedule/services/invitations.service';
import { Invitation } from '../../interfaces/shared.interface';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SnackbarService } from '../../features/auth/services/snack-bar.service';
import { TimeFormatPipe } from "../../pipes/time-format.pipe";
@Component({
  selector: 'app-pending-recieved-invitations',
  imports: [CommonModule, TimeFormatPipe],
  templateUrl: './pending-recieved-invitations.component.html',
  styleUrl: './pending-recieved-invitations.component.scss'
})
export class PendingRecievedInvitationsComponent implements OnInit, OnDestroy{
  invitations:Invitation[] = [];
  subscriptions:Subscription[] = [];
  private destroy$ = new Subject<void>();

  constructor(private invitationsService: InvitationsService, private snackbarService:SnackbarService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.invitationsService.needToUpdateRecievedInvitations.subscribe(item => {
        this.getInvitations(null, 0,null,null)
      })
    )
  }

  getInvitations(searchQuery: string | null, approved: number | null, sortByWeekday: string | null = null, isUrgent: number | null = null) {
    this.invitationsService.GetInvitations(searchQuery, null, approved, null, sortByWeekday, null, isUrgent).subscribe(result => {
      this.invitations = result.result.data;
    });
  }

    acceptInvitation(invitationId: string) {
    this.invitationsService.acceptInvitation(invitationId).subscribe(response => {
      if(response.statusCode === 200) {
        this.getInvitations(null, 0,null,null)
        this.invitationsService.updateRecievedInvitations()
        this.snackbarService.success('Invitation accepted');
      } 
    });
  }

  declineInvitation(invitationId: string) {
    this.invitationsService.declineInvitation(invitationId).subscribe(response => {
      if(response.statusCode === 200) {
        this.getInvitations(null, 0,null,null)
        this.invitationsService.updateRecievedInvitations()
        this.snackbarService.success('Invitation declined');
      } 
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
