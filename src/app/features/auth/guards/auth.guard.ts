import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private userService: UserService,
        private router: Router
    ) { }

    canActivate() {
        return this.auth.checkSession().pipe(
            map((res) => {
                if (res) {
                    this.userService.setUser(res.result.data.user);
                    localStorage.setItem('schedule_token',res.result.data.token)
                    return true;
                } else {
                    this.userService.setUser(null);
                    this.router.navigate(['/login']);
                    return false;
                }

            }),
            catchError(() => {
                this.userService.setUser(null);
                this.router.navigate(['/login']);
                return of(false);
            })
        );
    }
}
