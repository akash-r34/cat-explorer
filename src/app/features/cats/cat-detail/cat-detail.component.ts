import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CatService } from '../../../core/services/cat.service';
import { Cat } from '../../../core/models/cat.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PawLoaderComponent } from '../../../shared/components/paw-loader/paw-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AgeLabelPipe } from '../../../shared/pipes/age-label.pipe';

@Component({
  selector: 'app-cat-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, PageHeaderComponent, LoadingSpinnerComponent, PawLoaderComponent, EmptyStateComponent, AgeLabelPipe],
  template: `
    <div class="page-container">
      <app-page-header [title]="cat()?.info?.name || 'Cat Details'" backRoute="/cats" />

      @if (isLoading()) {
        <app-paw-loader message="Gathering cat details..." />
      } @else if (error()) {
        <app-empty-state icon="error_outline" title="Error" [message]="error() || ''" actionLabel="Go Back" actionRoute="/cats" />
      } @else if (cat()) {
        <mat-card class="detail-card">
          <mat-card-header>
            <div mat-card-avatar class="cat-avatar"><mat-icon>pets</mat-icon></div>
            <mat-card-title>{{ cat()!.info.name }}</mat-card-title>
            <mat-card-subtitle>Age: {{ cat()!.info.age | ageLabel }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="description">{{ cat()!.info.description }}</p>
          </mat-card-content>
          <mat-card-actions align="end" class="actions-container">
            <button mat-button color="primary" [routerLink]="['/cats', cat()!.id, 'edit']" aria-label="Edit cat">
              <mat-icon>edit</mat-icon> Edit
            </button>
            <button mat-flat-button color="warn" (click)="openDeleteConfirm()" aria-label="Delete cat">
              <mat-icon>delete</mat-icon> Delete
            </button>
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styleUrl: './cat-detail.component.scss'
})
export class CatDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catService = inject(CatService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly cat = signal<Cat | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCat(id);
    }
  }

  loadCat(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.catService.getById(id).subscribe({
      next: (cat) => {
        this.cat.set(cat);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Failed to load cat');
        this.isLoading.set(false);
      }
    });
  }

  openDeleteConfirm(): void {
    const currentCat = this.cat();
    if (!currentCat) return;
    
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Cat',
        message: `Are you sure you want to delete "${currentCat.info.name}"?`,
        confirmLabel: 'Delete',
      } satisfies ConfirmDialogData,
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) this.deleteCat(currentCat.id);
    });
  }

  deleteCat(id: string): void {
    this.catService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Cat deleted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/cats']);
      },
      error: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to delete cat';
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      }
    });
  }
}
