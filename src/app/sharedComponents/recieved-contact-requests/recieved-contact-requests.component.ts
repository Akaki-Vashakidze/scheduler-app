
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersService } from '../../features/auth/services/users.service';
import { RecievedContactRequest } from '../../interfaces/shared.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-recieved-contact-requests',
  imports: [CommonModule, TranslateModule],
  templateUrl: './recieved-contact-requests.component.html',
  styleUrl: './recieved-contact-requests.component.scss'
})
export class RecievedContactRequestsComponent {
  recievedContacts: RecievedContactRequest[] = [];
  constructor(private usersService: UsersService) {
    this.usersService.getReceivedContactRequests().subscribe(response => {
      this.recievedContacts = response.result.data;
    });
   }
}
