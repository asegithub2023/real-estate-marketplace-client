import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  constructor(private router: Router) {}

  showFooter(): boolean {
    return !['/login', '/register'].includes(this.router.url);
  }
}
