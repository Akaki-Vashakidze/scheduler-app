import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../auth/services/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-info',
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './account-info.component.html',
  styleUrl: './account-info.component.scss'
})
export class AccountInfoComponent {
  constructor(userService:UserService){
  }
}