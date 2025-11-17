import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InvitationsService } from '../../services/invitations.service';

@Component({
  selector: 'app-my-invitations',
  imports: [CommonModule],
  templateUrl: './my-invitations.component.html',
  styleUrl: './my-invitations.component.scss'
})
export class MyInvitationsComponent {
  constructor(private invitationService: InvitationsService) {
    invitationService.GetInvitations('sss', null, null, null, null, null, null).subscribe(invitations => {
      console.log('Invitations:', invitations);
    });
  }
}
