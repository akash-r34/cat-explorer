import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule,
  ],
  template: `
    <mat-toolbar class="app-toolbar" color="primary">
      <span class="brand" routerLink="/cats">
        <mat-icon>pets</mat-icon>
        <span class="brand-name">CatExplorer</span>
      </span>
      <nav class="nav-links">
        <a mat-button routerLink="/cats" routerLinkActive="active-link">
          <mat-icon>dashboard</mat-icon> Cats
        </a>
      </nav>
    </mat-toolbar>
    <main class="app-main">
      <router-outlet />
    </main>
    <footer class="app-footer">
      <div class="footer-content">
        <div class="brand-section">
          <mat-icon>pets</mat-icon>
          <div>
            <h3>Cat Explorer</h3>
            <p>Angular 21 + Material Design</p>
          </div>
        </div>
        <div class="links-section">
          <a href="mailto:hello@example.com"><mat-icon>email</mat-icon> hello@example.com</a>
          <a href="#"><mat-icon>code</mat-icon> github.com/user</a>
          <a href="#"><mat-icon>work</mat-icon> linkedin.com/in/user</a>
        </div>
        <div class="author-section">
          <div class="avatar-ring">
            <img src="https://ui-avatars.com/api/?name=User&background=FF0055&color=fff&rounded=true&bold=true" alt="Author">
          </div>
          <div>
            <h3>Your Name Here</h3>
            <p>© 2026 - Clean Apple UI</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {}
