import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../interfaces/shared.interface';
import { SharedService } from '../../auth/services/shared.service';
import { UsersService } from '../../auth/services/users.service';
import { RightNavContentType } from '../../../enums/shared.enums';
import { TeamService } from '../../auth/services/team.service';
import { SideNavsService } from '../../auth/services/side-navs.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnDestroy{
  myTeams: Team[] = [];

  constructor(
    private sharedService: SharedService, 
    private teamService: TeamService, 
    private usersService: UsersService,
    private sideNavsService:SideNavsService
  ) {
    teamService.updateMyTeams.subscribe(teams => {
      this.getMyTeams();
      this.openCreateTeamNav();
    }); 
  }

  openCreateTeamNav() {
    this.usersService.getContacts().subscribe(item => {
      this.sharedService.setRightSideNavContent(item.result.data, RightNavContentType.TEAMCREATE);
      this.sideNavsService.openRightSideNav()
    });
  }

  getMyTeams() {
    this.teamService.getMyTeams().subscribe(response => {
      this.myTeams = response.result.data;
    }); 
  }

  ngOnDestroy(): void {
    this.sharedService.setRightSideNavContent(null, RightNavContentType.NONE);
  }
}