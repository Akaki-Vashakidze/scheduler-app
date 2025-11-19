import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { UsersService } from '../../features/auth/services/users.service';
import { TranslateModule } from '@ngx-translate/core';
import { Contact } from '../../interfaces/shared.interface';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../features/auth/services/snack-bar.service';
import { Subscription } from 'rxjs';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-my-contacts-list',
  imports: [CommonModule, TranslateModule, MatIconModule, MatMenuModule, MatButtonModule, RouterLink],
  templateUrl: './my-contacts-list.component.html',
  styleUrl: './my-contacts-list.component.scss'
})
export class MyContactsListComponent implements OnDestroy {
  myContacts!:Contact[];
  subscriptions: Subscription[] = [];
  constructor(private usersService:UsersService, private snackbarService:SnackbarService){
    this.subscriptions.push(
      usersService.contactsListUpdated.subscribe(item => {
        this.getContacts()
      })
    )
  }

  deleteContact(contact:Contact){
    this.usersService.deleteContact(contact.contact._id).subscribe(item => {
      if(item.statusCode == 200) {
        this.snackbarService.success('Contact deleted')
        this.getContacts()
      } else {
        this.snackbarService.error(item.errors ?? '')
      }
    })
  }

  inviteContact(contact:Contact){

  }

  getContacts(){
    this.usersService.getContacts().subscribe(item => {
      this.myContacts = item.result.data;
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
