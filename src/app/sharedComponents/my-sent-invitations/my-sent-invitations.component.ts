import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InvitationsService } from '../../features/schedule/services/invitations.service';
import { Invitation } from '../../interfaces/shared.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-my-sent-invitations',
  imports: [CommonModule],
  templateUrl: './my-sent-invitations.component.html',
  styleUrl: './my-sent-invitations.component.scss'
})
export class MySentInvitationsComponent implements OnInit, OnDestroy {
  mySentInvitations!: Invitation[];
  private destroy$ = new Subject<void>();

  constructor(private invitationsService: InvitationsService) {}

  ngOnInit(): void {
    this.invitationsService.needToUpdateMySentInvitations
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getMySentInvitations();
      });

    this.getMySentInvitations();
  }

  getMySentInvitations(): void {
    this.invitationsService.GetMySentInvitations('Pool A', 1, 0, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe(item => {
        this.mySentInvitations = item.result.data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancelInvitationRequest(invitationId:string){
    this.invitationsService.cancelInvitation(invitationId).subscribe(item => {
      if(item.statusCode == 200) {
        this.invitationsService.updateMySentInvitations()
      }
    })
  }

  reactivateMySentInvitationRequest(invitationId:string){
    this.invitationsService.reactivateMySentlInvitation(invitationId).subscribe(item => {
      if(item.statusCode == 200) {
        this.invitationsService.updateMySentInvitations()
      }
    })
  }

  removeMySentlInvitation(invitationId:string){
    this.invitationsService.removeMySentlInvitation(invitationId).subscribe(item => {
      if(item.statusCode == 200) {
        this.invitationsService.updateMySentInvitations()
      }
    })
  }
}
