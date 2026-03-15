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
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {}
