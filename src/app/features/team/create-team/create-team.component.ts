import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../auth/services/user.service';
import { UsersService } from '../../auth/services/users.service';
import { Contact } from '../../../interfaces/shared.interface';

@Component({
  selector: 'app-create-team',
  imports: [CommonModule],
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.scss'
})
export class CreateTeamComponent {

  constructor(public usersService:UsersService){ 
    this.getContacts();
  }

  myContacts: Contact[] = [];

  getContacts(){
    this.usersService.getContacts().subscribe(item => {
      this.myContacts = item.result.data;
    })
  }
}
