import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  lang: string = 'en';
  currentPassword: string = '';
  password: string = '';
  password2: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private userService: UserService, private translateService: TranslateService, private router: Router, private authService: AuthService) { }

  changeLang(event: any) {
    const lang = event.target.value;
    this.translateService.use(lang);
  }

  onReset() {
    this.resetResponceMessages()
    if (this.password = this.password2) {
      this.authService.resetPassword(this.currentPassword,this.password).subscribe(item => {
        if (item.error) {
          this.errorMessage = item.keyword || 'Reset failed';
        } else {
          this.successMessage = 'Password Changed'
          this.router.navigate(['/dashboard'])
        }
      })
    }
  }

  resetResponceMessages() {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
