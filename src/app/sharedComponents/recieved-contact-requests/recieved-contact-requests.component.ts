
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersService } from '../../features/auth/services/users.service';
import { RecievedContactRequest } from '../../interfaces/shared.interface';
import { TranslateModule } from '@ngx-translate/core';
import { SnackbarService } from '../../features/auth/services/snack-bar.service';

@Component({
  selector: 'app-recieved-contact-requests',
  imports: [CommonModule, TranslateModule],
  templateUrl: './recieved-contact-requests.component.html',
  styleUrl: './recieved-contact-requests.component.scss'
})
export class RecievedContactRequestsComponent {
  recievedContacts: RecievedContactRequest[] = [];
  constructor(private usersService: UsersService, private snackbarService:SnackbarService) {
    this.getRecievedContactRequests()
   }

   getRecievedContactRequests(){
      this.usersService.getReceivedContactRequests().subscribe(response => {
      this.recievedContacts = response.result.data;
    });
   }

   rejectContactRequest(requestId:string){
    this.usersService.removeContactRequest(requestId).subscribe(item => {
      if(item.statusCode == 200) {
        this.snackbarService.success('Contact request rejected')
        this.getRecievedContactRequests()
      } else {
        this.snackbarService.error(item.errors ?? '')
      }
    }) 
   }

   acceptContactRequest(requestId:string){
    this.usersService.acceptContactRequest(requestId).subscribe(item => {
      if(item.statusCode == 200) {
        this.snackbarService.success('Contact request accepted')
        this.getRecievedContactRequests()
        this.usersService.contactsListUpdates()
      } else {
        this.snackbarService.error(item.errors ?? '')
      }
    })
   }
}
