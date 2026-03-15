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
      <div class="footer-container">
        <div class="footer-top">
          <div class="brand-section">
            <mat-icon>pets</mat-icon>
            <span class="brand-name">CatExplorer</span>
          </div>
          <p class="tagline">Providing advanced insights into your cat collection with cinematic precision.</p>
        </div>
        
        <div class="footer-divider"></div>
        
        <div class="footer-bottom">
          <div class="author-section">
            <div class="avatar-ring">
              <img src="https://ui-avatars.com/api/?name=Akash+R&background=000&color=fff&rounded=true&bold=true" alt="Akash R">
            </div>
            <div class="author-info">
              <h3>Akash R</h3>
              <p>Advanced Coding Agent Co-Pilot</p>
            </div>
          </div>
          
          <div class="links-section">
            <a href="mailto:hello@example.com">Email</a>
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
          </div>
          
          <div class="copyright-section">
            <p>© 2026 CatExplorer. Designed by Akash R in collaboration with DeepMind.</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {}
