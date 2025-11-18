import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersService } from '../../features/auth/services/users.service';
import { SentContactRequest } from '../../interfaces/shared.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sent-contact-requests',
  imports: [CommonModule, TranslateModule],
  templateUrl: './sent-contact-requests.component.html',
  styleUrl: './sent-contact-requests.component.scss'
})
export class SentContactRequestsComponent {
  sentContacts: SentContactRequest[] = [];
  constructor(private usersService: UsersService) {
    this.usersService.getSentContactRequests().subscribe(response => {
      this.sentContacts = response.result.data;
    });
   }
}
