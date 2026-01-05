import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateTeamData, GenericResponse, Team } from '../../../interfaces/shared.interface';

@Injectable({
    providedIn: 'root',
})
export class TeamService {
    public updateMyTeams = new BehaviorSubject<boolean>(false);

    team!: any;
    constructor(private http: HttpClient) { }

    createTeam(data: CreateTeamData): Observable<GenericResponse<Team>> {
        return this.http.post<GenericResponse<Team>>(`/consoleApi/team/create`, data);
    }

    getMyTeams(): Observable<GenericResponse<Team[]>> {
        return this.http.get<GenericResponse<Team[]>>(`/consoleApi/team/my-teams`);
    }

    doUpdateMyTeams(bool: boolean) {
        this.updateMyTeams.next(bool);
    }

    removeMemberFromMyTeam(teamId: string, memberId: string): Observable<GenericResponse<Team>> {
        return this.http.delete<GenericResponse<Team>>(`/consoleApi/team/${teamId}/remove-member/${memberId}`,{});
    }

    addMembersToTeam(teamId: string, memberId: string): Observable<GenericResponse<Team>> {
        return this.http.post<GenericResponse<Team>>(`/consoleApi/team/${teamId}/add-members/${memberId}`,{});
    }   

    giveLeaderShipToMember(teamId: string, newLeaderId: string): Observable<GenericResponse<Team>> {
        return this.http.post<GenericResponse<Team>>(`/consoleApi/team/${teamId}/giveLeaderShip/${newLeaderId}`,{});
    }   
}
