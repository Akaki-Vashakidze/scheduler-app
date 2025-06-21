import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pass-recovery',
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, TranslateModule],
  templateUrl: './pass-recovery.component.html',
  styleUrl: './pass-recovery.component.scss'
})
export class PassRecoveryComponent {

  lang: string = 'en';
  email: string = '';
  password: string = '';
  errorMessage:string | null = null;

  constructor(private translateService: TranslateService, private router:Router,private authService:AuthService) {}

  changeLang(event: any) {
    const lang = event.target.value;
    this.translateService.use(lang);
  }

  onLogin() {
    this.errorMessage = null;
    console.log('Login with:', this.email, this.password);
    this.authService.login(this.email,this.password).subscribe(item => {
      console.log(item)
      if(item.error) {
        this.errorMessage = item.keyword || 'Login failed';
      } else {
        this.router.navigate(['dashboard'])
        localStorage.setItem('schedule_user',JSON.stringify(item))
        localStorage.setItem('schedule_token',item.token)
      }
    })
  }
}
