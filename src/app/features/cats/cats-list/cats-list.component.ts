import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
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
      <app-page-header title="Cats" subtitle="Manage and explore your cats" />

      <div class="search-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search Cats</mat-label>
          <input matInput (input)="onSearch($event)" placeholder="Search by name..." />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>
      
      @if (isLoading()) {
        <app-loading-spinner message="Fetching cats..." />
      } @else if (error()) {
        <app-empty-state icon="error_outline" title="Error" [message]="error() || ''" actionLabel="Retry" (click)="loadCats()" />
      } @else if (isEmpty()) {
        <app-empty-state icon="pets" title="No cats yet" message="Add your first cat to get started." actionLabel="Add Cat" actionRoute="/cats/new" />
      } @else {
        <div class="cat-grid">
          @for (cat of filteredCats(); track cat.id) {
            <mat-card class="cat-card" (click)="navigateTo(cat.id)">
              <mat-card-header>
                <div mat-card-avatar class="cat-avatar"><mat-icon>pets</mat-icon></div>
                <mat-card-title>{{ cat.info.name }}</mat-card-title>
                <mat-card-subtitle>Age: {{ cat.info.age | ageLabel }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-actions align="end">
                <button mat-icon-button color="warn" aria-label="Delete cat"
                  (click)="$event.stopPropagation(); openDeleteConfirm(cat)">
                  <mat-icon>delete</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          } @empty {
            <app-empty-state icon="search_off" title="No matches" message="Try a different search term." />
          }
        </div>
      }
      
      <button mat-fab class="floating-fab" color="primary" routerLink="/cats/new" aria-label="Add new cat">
        <mat-icon>add</mat-icon>
      </button>
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
  readonly searchQuery = signal('');

  readonly filteredCats = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return query
      ? this.cats().filter((c) => c.info.name.toLowerCase().includes(query))
      : this.cats();
  });

  readonly isEmpty = computed(() => !this.isLoading() && this.cats().length === 0);

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
    this.searchQuery.set(target.value);
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
}
