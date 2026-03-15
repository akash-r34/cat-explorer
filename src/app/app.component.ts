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
    <mat-toolbar color="primary" class="app-toolbar desktop-only">
      <div class="brand" routerLink="/dashboard">
        <mat-icon>pets</mat-icon>
        <span class="brand-name">CatExplorer</span>
      </div>
      <nav class="nav-links">
        <a mat-button routerLink="/dashboard" routerLinkActive="active-link">Dashboard</a>
        <a mat-button routerLink="/cats" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">Explorer</a>
      </nav>
    </mat-toolbar>

    <main class="app-main">
      <router-outlet />
    </main>

    <!-- Mobile Bottom Tab Bar -->
    <nav class="mobile-tab-bar mobile-only">
      <a routerLink="/dashboard" routerLinkActive="active-tab" class="tab-item">
        <mat-icon>dashboard</mat-icon>
        <span>Home</span>
      </a>
      <a routerLink="/cats" routerLinkActive="active-tab" [routerLinkActiveOptions]="{exact: true}" class="tab-item">
        <mat-icon>explore</mat-icon>
        <span>Explore</span>
      </a>
      <a routerLink="/cats/new" routerLinkActive="active-tab" class="tab-item add-tab">
        <div class="fab-mimic">
          <mat-icon>add</mat-icon>
        </div>
        <span>Add</span>
      </a>
    </nav>

    <footer class="app-footer desktop-only">
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
