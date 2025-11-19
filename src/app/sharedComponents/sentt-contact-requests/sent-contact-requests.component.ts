import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { UsersService } from '../../features/auth/services/users.service';
import { SentContactRequest } from '../../interfaces/shared.interface';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../features/auth/services/user.service';
import { SnackbarService } from '../../features/auth/services/snack-bar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sent-contact-requests',
  imports: [CommonModule, TranslateModule],
  templateUrl: './sent-contact-requests.component.html',
  styleUrl: './sent-contact-requests.component.scss'
})
export class SentContactRequestsComponent implements OnDestroy{
  sentContacts: SentContactRequest[] = [];
  subscriptions: Subscription[] = [];
  constructor(private usersService: UsersService, private snackbarService:SnackbarService) {
    this.subscriptions.push(
      usersService.sentContactRequestsUpdated.subscribe(item => {
      this.getSentRequests()
    })
    )
   }

   getSentRequests(){
    this.usersService.getSentContactRequests().subscribe(response => {
      this.sentContacts = response.result.data;
    });
   }

   cancelContactRequest(requestId:string){
      this.usersService.removeContactRequest(requestId).subscribe(item => {
        if(item.statusCode != 200) {
          this.snackbarService.error(item.errors ?? '')
          this.getSentRequests()
        } else {
          this.snackbarService.success('Request deleted')
        }
      })
   }

   ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
   }
}
