import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CatService } from '../../core/services/cat.service';
import { Cat } from '../../core/models/cat.model';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { AgeLabelPipe } from '../../shared/pipes/age-label.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule,
    PageHeaderComponent, LoadingSpinnerComponent, AgeLabelPipe
  ],
  template: `
    <div class="page-container">
      <div class="dashboard-header">
        <app-page-header title="Dashboard" subtitle="Welcome back! Here's your cat collection overview." />
        <div class="header-actions">
          <button mat-flat-button color="primary" routerLink="/cats/new" class="add-btn">
            <mat-icon>add</mat-icon> Add Cat
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <div class="stat-icon-wrapper total"><mat-icon>pets</mat-icon></div>
          <div class="stat-content">
            <h3>{{ totalCats() }}</h3>
            <p>Total Cats</p>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-icon-wrapper age"><mat-icon>cake</mat-icon></div>
          <div class="stat-content">
            <h3>{{ averageAge() }}y</h3>
            <p>Average Age</p>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-icon-wrapper young"><mat-icon>child_care</mat-icon></div>
          <div class="stat-content">
            <h3>{{ youngestCat()?.info?.name || 'N/A' }}</h3>
            <p>Youngest · {{ youngestCat()?.info?.age || 0 }}y</p>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-icon-wrapper old"><mat-icon>elderly</mat-icon></div>
          <div class="stat-content">
            <h3>{{ oldestCat()?.info?.name || 'N/A' }}</h3>
            <p>Oldest · {{ oldestCat()?.info?.age || 0 }}y</p>
          </div>
        </mat-card>
      </div>

      <div class="dashboard-layout">
        <!-- Age Distribution Chart -->
        <div class="chart-section">
          <mat-card class="chart-card glass-card">
            <div class="card-header">
              <h3>Age Distribution</h3>
              <p>Breakdown of your cats by age groups</p>
            </div>
            <div class="chart-container">
              <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                @for (bar of ageChartData(); track $index) {
                  <g class="bar-group">
                    <rect [attr.x]="bar.x" [attr.y]="bar.y" [attr.width]="bar.width" [attr.height]="bar.height" 
                          [attr.fill]="bar.color" rx="4" class="bar-rect">
                    </rect>
                    <text [attr.x]="bar.x + bar.width/2" [attr.y]="195" text-anchor="middle" class="bar-label">
                      {{ bar.label }}
                    </text>
                    <text [attr.x]="bar.x + bar.width/2" [attr.y]="bar.y - 10" text-anchor="middle" class="bar-value">
                      {{ bar.count }}
                    </text>
                  </g>
                }
              </svg>
            </div>
          </mat-card>
        </div>

        <!-- Recent Cats -->
        <div class="recent-section">
          <div class="section-header">
            <h3>Recently Added</h3>
            <button mat-button color="primary" routerLink="/cats">View All</button>
          </div>
          @if (isLoading()) {
            <div class="loading-overlay">
              <app-loading-spinner message="Fetching recent activity..." />
            </div>
          } @else {
            <div class="recent-list">
              @for (cat of recentCats(); track cat.id; let i = $index) {
                <div class="recent-item animate-in" [style.animation-delay]="(i * 0.1) + 's'" (click)="navigateTo(cat.id)">
                  <div class="item-left">
                    <div class="avatar">{{ cat.info.name.charAt(0) | uppercase }}</div>
                    <div class="item-info">
                      <span class="name">{{ cat.info.name }}</span>
                      <span class="desc">{{ cat.info.description || 'Awesome cat' }}</span>
                    </div>
                  </div>
                  <mat-icon class="chevron">chevron_right</mat-icon>
                </div>
              } @empty {
                <div class="empty-recent">
                  <mat-icon>history</mat-icon>
                  <p>No recent activity</p>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly catService = inject(CatService);
  private readonly router = inject(Router);

  readonly cats = signal<Cat[]>([]);
  readonly isLoading = signal(false);

  readonly totalCats = computed(() => this.cats().length);
  readonly averageAge = computed(() => {
    const total = this.cats().length;
    if (total === 0) return 0;
    const sum = this.cats().reduce((acc, cat) => acc + (Number(cat.info.age) || 0), 0);
    return Number((sum / total).toFixed(1));
  });

  readonly youngestCat = computed(() => {
    const cats = this.cats();
    if (cats.length === 0) return null;
    return cats.reduce((youngest, cat) => 
      (Number(cat.info.age) < Number(youngest.info.age) ? cat : youngest), cats[0]);
  });

  readonly oldestCat = computed(() => {
    const cats = this.cats();
    if (cats.length === 0) return null;
    return cats.reduce((oldest, cat) => 
      (Number(cat.info.age) > Number(oldest.info.age) ? cat : oldest), cats[0]);
  });

  readonly recentCats = computed(() => {
    // Return the 3 most recently added cats (assuming API returns them in chronological order, so we reverse)
    return [...this.cats()].reverse().slice(0, 3);
  });

  readonly ageChartData = computed(() => {
    const data = this.cats();
    const bins = [
      { label: '0-2y', filter: (age: number) => age <= 2, color: '#00C6FF' },
      { label: '3-5y', filter: (age: number) => age > 2 && age <= 5, color: '#FF0055' },
      { label: '6-9y', filter: (age: number) => age > 5 && age <= 9, color: '#F5AF19' },
      { label: '10y+', filter: (age: number) => age > 9, color: '#11998E' },
    ];

    const counts = bins.map(bin => ({
      ...bin,
      count: data.filter(c => bin.filter(Number(c.info.age))).length
    }));

    const maxCount = Math.max(...counts.map(c => c.count), 1);
    const chartWidth = 360;
    const chartHeight = 140;
    const barSpacing = chartWidth / bins.length;

    return counts.map((c, i) => {
      const height = (c.count / maxCount) * chartHeight;
      return {
        ...c,
        x: (i * barSpacing) + 20,
        y: chartHeight - height + 30,
        width: barSpacing - 20,
        height: height
      };
    });
  });

  ngOnInit(): void {
    this.loadCats();
  }

  loadCats(): void {
    this.isLoading.set(true);
    this.catService.getAll().subscribe({
      next: (cats: Cat[]) => {
        this.cats.set(cats);
        this.isLoading.set(false);
      },
      error: (err: unknown) => this.isLoading.set(false)
    });
  }

  navigateTo(id: string): void {
    this.router.navigate(['/cats', id]);
  }
}
