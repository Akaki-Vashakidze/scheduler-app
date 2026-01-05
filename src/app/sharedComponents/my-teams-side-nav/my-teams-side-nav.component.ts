import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TeamService } from '../../features/auth/services/team.service';
import { Team } from '../../interfaces/shared.interface';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-teams-side-nav',
  imports: [CommonModule, MatMenuModule, MatIconModule, RouterModule],
  templateUrl: './my-teams-side-nav.component.html',
  styleUrl: './my-teams-side-nav.component.scss'
})
export class MyTeamsSideNavComponent {
  myTeams: Team[] = [];
  constructor(private teamService:TeamService){
    this.getMyTeams()
  }

  getMyTeams() {
    this.teamService.getMyTeams().subscribe(response => {
      this.myTeams = response.result.data;
    }); 
  }

  deleteTeam(teamId:string){

  }

  inviteTeammates(teamId:string){

  }
}
