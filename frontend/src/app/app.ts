
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);

  authService = inject(AuthService);

  get showNavigation(): boolean {
    return this.authService.isLoggedIn()
      && !['/login', '/register'].includes(this.router.url);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
