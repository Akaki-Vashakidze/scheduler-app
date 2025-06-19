import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./sharedComponents/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'scheduler-app';
}
