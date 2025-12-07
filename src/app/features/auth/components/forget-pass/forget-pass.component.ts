import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-forget-pass',
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, TranslateModule],
  templateUrl: './forget-pass.component.html',
  styleUrl: './forget-pass.component.scss'
})
export class ForgetPassComponent {
  lang: string = 'en';
  email: string = '';
  errorMessage:string | null = null;
  successMessage:string | null = null;

  constructor(private userService:UserService,private translateService: TranslateService, private router:Router,private authService:AuthService) {}

  changeLang(event: any) {
    const lang = event.target.value;
    this.translateService.use(lang);
  }

  sendMail() {
    this.resetResponceMessages()
    this.authService.forgetPass(this.email).subscribe(item => {
      if(item.result.data) {
        this.successMessage = item.result.data.message;
      } else {
        this.errorMessage = item.keyword || 'Send mail failed';
      }
    })
  }

  resetResponceMessages(){
    this.errorMessage = null;
    this.successMessage = null;
  }
}

