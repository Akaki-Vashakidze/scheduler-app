import { Component } from '@angular/core';
import { CreateTeamComponent } from "../create-team/create-team.component";

@Component({
  selector: 'app-teams',
  imports: [CreateTeamComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent {

}
