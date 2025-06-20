import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'; 
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatButtonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  lang:string = 'en'
  constructor(private translateService:TranslateService) {

  }
   changeLang(event:any) {
    let lang = event.target.value
    this.translateService.use(lang);
  }
}
