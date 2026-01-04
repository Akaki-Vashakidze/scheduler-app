import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../auth/services/users.service';
import { Contact } from '../../../interfaces/shared.interface';
import { TeamService } from '../../auth/services/team.service';
import { SnackbarService } from '../../auth/services/snack-bar.service';

@Component({
  selector: 'app-create-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.scss'
})
export class CreateTeamComponent implements OnInit {
  myContacts: Contact[] = [];
  teamMembers: Contact[] = [];
  searchTerm: string = '';
  title: string = '';

  constructor(private usersService: UsersService, private snackbarService:SnackbarService, private teamService: TeamService) { }

  ngOnInit() {
    this.getContacts();
  }

  getContacts() {
    this.usersService.getContacts().subscribe(item => {
      this.myContacts = item.result.data;
    });
  }

  get filteredContacts() {
    return this.myContacts.filter(c =>
      `${c.contact.name} ${c.contact.surname}`
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  addToTeam(contact: Contact) {
    this.teamMembers.push(contact);
    this.myContacts = this.myContacts.filter(c => c._id !== contact._id);
  }

  removeFromTeam(member: Contact) {
    this.myContacts.push(member);
    this.teamMembers = this.teamMembers.filter(m => m._id !== member._id);
  }

  saveTeam() {
    if(this.title.trim() === '') {
      this.snackbarService.error('Team title cannot be empty');
      return;
    } else {
      const data =  {
        members: this.teamMembers.map(member => member.contact._id),
        title: this.title.trim()
      }

      this.teamService.createTeam(data).subscribe(response => {
        if (response.statusCode === 200) {
          this.snackbarService.success('Team created successfully');
          this.title = '';
          this.teamMembers = [];
        } else {
          this.snackbarService.error(response.errors || 'Error creating team');
        }
      })
    }

  }
}