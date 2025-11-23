import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./sharedComponents/header/header.component";
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { en } from './i18n/en';
import { ka } from './i18n/ka';
import { LoaderComponent } from './sharedComponents/loader/loader.component';
import { SharedService } from './features/auth/services/shared.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RightSideNavComponent } from "./sharedComponents/right-side-nav/right-side-nav.component";
import { LeftSideNavComponent } from './sharedComponents/left-side-nav/left-side-nav.component';
import { SideNavsService } from './features/auth/services/side-navs.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent,RightSideNavComponent, LoaderComponent, HeaderComponent, TranslateModule, CommonModule, LeftSideNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  leftSideNavOpen: boolean = false;
  rightSideNavOpen: boolean = false;
  subscriptions: Subscription[] = [];
  constructor(private translate: TranslateService, private sharedService: SharedService, private sideNavsService:SideNavsService) {
    this.translate.setTranslation('en', en);
    this.translate.setTranslation('ka', ka);
    this.translate.setDefaultLang('en');
    this.translate.use('en');

    this.subscriptions.push(
      this.sideNavsService.leftSideNav$.subscribe(item => {
        this.leftSideNavOpen = item;
      })
    );

    this.subscriptions.push(
      this.sideNavsService.rightSideNav$.subscribe(item => {
        this.rightSideNavOpen = item;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  sizeSiteFromSideNavs = () => {
    let containerClass = '';
    if (this.leftSideNavOpen) {
      containerClass = 'oneNavOpenSite';
    }
    if (this.rightSideNavOpen) {
      containerClass = 'oneNavOpenSite';
    }
    if (this.leftSideNavOpen && this.rightSideNavOpen) {
      containerClass = 'bothNavsOpenSite';
    }
    return containerClass;
  };

  sizeContentContainerFromSideNavs = () => {
    let containerClass = '';
    if (this.leftSideNavOpen) {
      containerClass = 'leftNavOpenContent';
    }
    if (this.rightSideNavOpen) {
      containerClass = 'rightNavOpenContent';
    }
    if (this.leftSideNavOpen && this.rightSideNavOpen) {
      containerClass = 'bothNavsOpenContent';
    }
    return containerClass;
  };

  title = 'scheduler-app';

}
