import { Component } from '@angular/core';
import { CreateTeamComponent } from "../create-team/create-team.component";
import { BehaviorSubject } from 'rxjs';
import { Team } from '../../../interfaces/shared.interface';

@Component({
  selector: 'app-teams',
  imports: [CreateTeamComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {
    public myTeams = new BehaviorSubject<Team[]>([]);

    updateMyTeams(teams: Team[]) {
        this.myTeams.next(teams);
    }
    

}
