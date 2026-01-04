import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateTeamData, GenericResponse, Team } from '../../../interfaces/shared.interface';

@Injectable({
    providedIn: 'root',
})
export class TeamService {
    private teamSubject = new BehaviorSubject<any>(null);
    public team$: Observable<any> = this.teamSubject.asObservable();

    team!: any;
    constructor(private http: HttpClient) { }

    createTeam(data: CreateTeamData): Observable<GenericResponse<Team>> {
        return this.http.post<GenericResponse<Team>>(`/consoleApi/team/create`, data);
    }

}
