import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./sharedComponents/header/header.component";
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { en } from './i18n/en';
import { ka } from './i18n/ka';
import { LoaderComponent } from './sharedComponents/loader/loader.component';
import { LeftSideNavComponent } from "./sharedComponents/left-side-nav/left-side-nav.component";
import { SharedService } from './features/auth/services/shared.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, LeftSideNavComponent, LoaderComponent, HeaderComponent, TranslateModule, LeftSideNavComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  sideNavOpen: boolean = true;
  subscriptions: Subscription[] = [];
  constructor(private translate: TranslateService, private sharedService: SharedService) {
    this.translate.setTranslation('en', en);
    this.translate.setTranslation('ka', ka);
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    this.subscriptions.push(
      this.sharedService.sideNav$.subscribe(item => {
        this.sideNavOpen = item;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  title = 'scheduler-app';

}
