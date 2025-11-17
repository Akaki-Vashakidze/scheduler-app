import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InvitationsService } from '../../services/invitations.service';
import { Invitation } from '../../../../interfaces/shared.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-invitations',
  imports: [CommonModule, TranslateModule],
  templateUrl: './my-invitations.component.html',
  styleUrl: './my-invitations.component.scss'
})
export class MyInvitationsComponent {
  invitations!: Invitation[];
  constructor(private invitationService: InvitationsService) {
    invitationService.GetInvitations(null, null, null, null, null, null, null).subscribe(result => {
      console.log('Invitations:', result);
      this.invitations = result.result.data;
    });
  }

  acceptInvitation(invitation: string) {
    // this.invitationService.respondToInvitation(invitation.id, true).subscribe(response => {
    //   console.log('Accepted invitation response:', response);
    //   // Optionally update the UI or invitations list here
    // });
    console.log(invitation)
  }

  declineInvitation(invitation: string) {
    // this.invitationService.respondToInvitation(invitation.id, false).subscribe(response => {
    //   console.log('Declined invitation response:', response);
    //   // Optionally update the UI or invitations list here
    // });
  }   
}
