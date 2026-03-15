import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { CatService } from '../../../core/services/cat.service';
import { Cat } from '../../../core/models/cat.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AgeLabelPipe } from '../../../shared/pipes/age-label.pipe';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cats-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatSnackBarModule,
    PageHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent, AgeLabelPipe
  ],
  template: `
    <div class="page-container">
      <div class="list-header explorer-top">
        <app-page-header title="Cat Explorer" subtitle="Manage and search through your entire cat collection." />
        <div class="header-actions">
          <button mat-flat-button color="primary" class="add-btn desktop-only" routerLink="/cats/new">
            <mat-icon>add</mat-icon> Add Cat
          </button>
          <button mat-stroked-button color="primary" class="export-btn" (click)="exportCsv()" [disabled]="cats().length === 0">
            <mat-icon>download</mat-icon> Export CSV
          </button>
        </div>
      </div>

      <div class="search-filter-row">
        <div class="search-bar">
          <mat-form-field appearance="outline" class="search-field" subscriptSizing="dynamic">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (input)="onSearch($event)" placeholder="Search names..." />
          </mat-form-field>
        </div>
      </div>
      
      @if (error()) {
        <app-empty-state icon="error_outline" title="Error" [message]="error() || ''" actionLabel="Retry" (click)="loadCats()" />
      } @else if (isEmpty()) {
        <app-empty-state icon="pets" title="No cats yet" message="Add your first cat to get started." actionLabel="Add Cat" actionRoute="/cats/new" />
      } @else {
        <div class="sleek-list-container">
          @if (isLoading()) {
            @for (dummy of skeletonArray; track dummy) {
              <div class="sleek-list-item skeleton-item">
                <div class="item-left">
                  <div class="skeleton-avatar"></div>
                  <div class="item-info">
                    <div class="skeleton-text skeleton-title"></div>
                    <div class="skeleton-text skeleton-desc"></div>
                  </div>
                </div>
                <div class="item-right">
                  <div class="skeleton-pill"></div>
                </div>
              </div>
            }
          } @else {
            @for (cat of filteredCats(); track cat.id; let i = $index) {
              <div class="sleek-list-item animate-in" [style.animation-delay]="(i * 0.05) + 's'" (click)="navigateTo(cat.id)">
                <div class="item-left">
                  <div class="avatar" [attr.data-letter]="cat.info.name.charAt(0) | uppercase">
                    {{ cat.info.name.charAt(0) | uppercase }}
                  </div>
                  <div class="item-info">
                    <span class="name">{{ cat.info.name }}</span>
                    <span class="desc">{{ cat.info.description || 'Awesome cat' }}</span>
                  </div>
                </div>
                <div class="item-right">
                  <span class="age-pill">{{ cat.info.age }}y</span>
                  <button mat-icon-button color="warn" class="delete-btn" aria-label="Delete cat"
                    (click)="$event.stopPropagation(); openDeleteConfirm(cat)">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                  <mat-icon class="chevron">chevron_right</mat-icon>
                </div>
              </div>
            } @empty {
              <div class="no-results-list">
                <mat-icon>search_off</mat-icon>
                <p>No matches found using your exact specified search term.</p>
              </div>
            }
          }
        </div>
      }
      
      <!-- Floating FAB removed in favor of mobile tab bar + -->
    </div>
  `,
  styleUrl: './cats-list.component.scss'
})
export class CatsListComponent implements OnInit {
  private readonly catService = inject(CatService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly cats = signal<Cat[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  // Search Logic with RxJS -> Signal interop
  private readonly searchSubject = new Subject<string>();
  readonly debouncedQuery = toSignal(
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  readonly filteredCats = computed(() => {
    const query = this.debouncedQuery().toLowerCase();
    return query
      ? this.cats().filter((c) => c.info.name.toLowerCase().includes(query))
      : this.cats();
  });

  readonly isEmpty = computed(() => !this.isLoading() && this.cats().length === 0);
  readonly skeletonArray = [1, 2, 3, 4, 5, 6, 7, 8];


  ngOnInit(): void {
    this.loadCats();
  }

  loadCats(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.catService.getAll().subscribe({
      next: (cats) => {
        this.cats.set(cats);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Failed to load cats');
        this.isLoading.set(false);
      },
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  navigateTo(id: string): void {
    this.router.navigate(['/cats', id]);
  }

  openDeleteConfirm(cat: Cat): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Cat',
        message: `Are you sure you want to delete "${cat.info.name}"?`,
        confirmLabel: 'Delete',
      } satisfies ConfirmDialogData,
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) this.deleteCat(cat.id);
    });
  }

  deleteCat(id: string): void {
    this.catService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Cat deleted successfully', 'Close', { duration: 3000 });
        this.loadCats(); // Refresh list
      },
      error: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to delete cat';
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      }
    });
  }

  exportCsv(): void {
    const cats = this.filteredCats();
    if (!cats.length) return;

    const headers = ['ID', 'Name', 'Age', 'Description'];
    const rows = cats.map(cat => [
      cat.id,
      `"${cat.info.name.replace(/"/g, '""')}"`,
      cat.info.age,
      `"${(cat.info.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    
    saveAs(blob, 'cat_explorer_export.csv');
  }
}

