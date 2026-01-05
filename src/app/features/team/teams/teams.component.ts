import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../interfaces/shared.interface';
import { SharedService } from '../../auth/services/shared.service';
import { UsersService } from '../../auth/services/users.service';
import { RightNavContentType } from '../../../enums/shared.enums';
import { TeamService } from '../../auth/services/team.service';
import { SideNavsService } from '../../auth/services/side-navs.service';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import { AddTeamMembersComponent } from '../add-team-members/add-team-members.component';
import { SnackbarService } from '../../auth/services/snack-bar.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, AddTeamMembersComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnDestroy{
  myTeams: Team[] = [];
  membersDisplayed:boolean | number = false;
  AddMembersDisplayed:boolean | number = false;

  constructor(
    private sharedService: SharedService, 
    private teamService: TeamService, 
    private usersService: UsersService,
    private sideNavsService:SideNavsService,
    private snackbarService:SnackbarService
  ) {
    teamService.updateMyTeams.subscribe(teams => {
      this.getMyTeams();
      this.openCreateTeamNav();
    }); 
  }

  hideMembers() {
    this.membersDisplayed = false;
    this.AddMembersDisplayed = false;
  }

  toggleAddMembers() {
    if (this.AddMembersDisplayed) {
      this.AddMembersDisplayed = false;
    } else {
      this.AddMembersDisplayed = this.membersDisplayed;
    }
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

  removeMemberFromMyTeam(teamId:string,memberId:string) {
    this.teamService.removeMemberFromMyTeam(teamId,memberId).subscribe(response => {
      if(response.statusCode == 200) {
        this.snackbarService.success('Member deleted')
        this.getMyTeams();
      } else {
        this.snackbarService.error(response.errors || '')
      }
    });
  }

  giveLeaderPosition(teamId:string,newLeaderId:string) {
    this.teamService.giveLeaderShipToMember(teamId,newLeaderId).subscribe(response => {
      if(response.statusCode == 200) {
        this.snackbarService.success('Leader is changed')
        this.getMyTeams();
      } else {
        this.snackbarService.error(response.errors || '')
      }
    });
  }

  ngOnDestroy(): void {
    this.sharedService.setRightSideNavContent(null, RightNavContentType.NONE);
  }
}