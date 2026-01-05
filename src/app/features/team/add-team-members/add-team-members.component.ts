import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnackbarService } from '../../auth/services/snack-bar.service';
import { TeamService } from '../../auth/services/team.service';
import { UsersService } from '../../auth/services/users.service';
import { Contact, User } from '../../../interfaces/shared.interface';
import { MatIcon } from "@angular/material/icon";
import { c } from "../../../../../node_modules/@angular/cdk/a11y-module.d-DBHGyKoh";

@Component({
  selector: 'app-add-team-members',
  imports: [CommonModule, MatIcon],
  templateUrl: './add-team-members.component.html',
  styleUrl: './add-team-members.component.scss'
})
export class AddTeamMembersComponent {
  @Input() teamId!: string;
  @Input() teamLeader!: User;
  @Input() teamMembers: User[] = [];
  @Output() closeAddMembers = new EventEmitter<void>();
  @Output() membersUpdated = new EventEmitter<void>();

  searchTerm: string = '';
  myContacts: Contact[] = [];

  constructor(private usersService: UsersService,
    private snackbarService: SnackbarService,
    private teamService: TeamService) {
    this.getContacts();
  }

  closeAddMembersNav() {
    this.closeAddMembers.emit();
  }

  getContacts() {
    this.usersService.getContacts().subscribe({
      next: (item) => {
       this.myContacts =  this.filteredContacts(item?.result?.data)
      },
      error: (err) => {
        this.snackbarService.error('Failed to load contacts');
        console.error(err);
      }
    });
  }

  filteredContacts(contacts: Contact[]) {
    return contacts.filter(c => 
      !this.teamMembers.some(member => member._id === c.contact._id) &&
      c.contact._id !== this.teamLeader._id &&
      (`${c.contact.name} ${c.contact.surname}`.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  notifyMembersUpdated() {
    this.membersUpdated.emit();
  }

  addMemberToTeam(memberId: string) {
    this.teamService.addMembersToTeam(this.teamId, memberId).subscribe(result => {
      if (result.statusCode === 200) {
        this.snackbarService.success('Member added to team');
        this.getContacts();
        this.notifyMembersUpdated();
      } else {
        this.snackbarService.error(result.errors ?? 'Failed to add member to team');
      }
    });
}
}
