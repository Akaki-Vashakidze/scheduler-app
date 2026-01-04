import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../auth/services/users.service';
import { TeamService } from '../../auth/services/team.service';
import { SnackbarService } from '../../auth/services/snack-bar.service';
import { Contact } from '../../../interfaces/shared.interface';

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

  @Output() onSaved = new EventEmitter<void>();

  constructor(
    private usersService: UsersService,
    private snackbarService: SnackbarService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts() {
    this.usersService.getContacts().subscribe({
      next: (item) => {
        this.myContacts = item?.result?.data || [];
      },
      error: (err) => {
        this.snackbarService.error('Failed to load contacts');
        console.error(err);
      }
    });
  }

  get filteredContacts() {
    if (!this.myContacts) return [];
    
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
    const trimmedTitle = this.title.trim();

    if (!trimmedTitle) {
      this.snackbarService.error('Team title cannot be empty');
      return;
    }

    if (this.teamMembers.length === 0) {
      this.snackbarService.error('Please add at least one member');
      return;
    }

    const data = {
      members: this.teamMembers.map(member => member.contact._id),
      title: trimmedTitle
    };

    this.teamService.createTeam(data).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.statusCode === 201) {
          this.snackbarService.success('Team created successfully');
          this.resetForm();
          this.onSaved.emit(); 
        } else {
          this.snackbarService.error(response.errors || 'Error creating team');
        }
      },
      error: (err) => {
        this.snackbarService.error('An unexpected error occurred');
      }
    });
  }

  private resetForm() {
    this.title = '';
    this.teamMembers = [];
    this.getContacts(); 
  }
}