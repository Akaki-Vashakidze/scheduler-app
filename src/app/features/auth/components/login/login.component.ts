import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Route, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  lang: string = 'en';
  email: string = '';
  password: string = '';
  errorMessage:string | null = null;

  constructor(private userService:UserService,private translateService: TranslateService, private router:Router,private authService:AuthService) {}

  changeLang(event: any) {
    const lang = event.target.value;
    this.translateService.use(lang);
  }

  onLogin() {
    this.errorMessage = null;
    console.log('Login with:', this.email, this.password);
    this.authService.login(this.email,this.password).subscribe(item => {
      if(item.error) {
        this.errorMessage = item.keyword || 'Login failed';
      } else {
        this.router.navigate(['dashboard'])
        this.userService.setUser(item)
        localStorage.setItem('schedule_user',JSON.stringify(item))
        localStorage.setItem('schedule_token',item.token)
      }
    })
  }
}
