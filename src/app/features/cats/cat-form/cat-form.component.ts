import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CatService } from '../../../core/services/cat.service';
import { CreateCatPayload } from '../../../core/models/cat.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-cat-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatSnackBarModule, PageHeaderComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="page-container">
      <app-page-header [title]="isEditMode() ? 'Edit Cat' : 'Add New Cat'" backRoute="/cats" />

      @if (isLoading()) {
        <app-loading-spinner [message]="isEditMode() ? 'Loading cat data...' : 'Saving cat...'" />
      } @else if (error()) {
        <app-empty-state icon="error_outline" title="Error" [message]="error() || ''" actionLabel="Go Back" actionRoute="/cats" />
      } @else {
        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Name</mat-label>
                <input matInput formControlName="name" placeholder="E.g., Whiskers" />
                @if (form.get('name')?.hasError('required')) {
                  <mat-error>Name is required</mat-error>
                }
                @if (form.get('name')?.hasError('minlength')) {
                  <mat-error>Name must be at least 2 characters</mat-error>
                }
                @if (form.get('name')?.hasError('maxlength')) {
                  <mat-error>Name cannot exceed 50 characters</mat-error>
                }
                @if (form.get('name')?.hasError('pattern')) {
                  <mat-error>Name can only contain letters and spaces</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Age</mat-label>
                <input matInput type="number" formControlName="age" placeholder="E.g., 2" />
                @if (form.get('age')?.hasError('required')) {
                  <mat-error>Age is required</mat-error>
                }
                @if (form.get('age')?.hasError('min') || form.get('age')?.hasError('max')) {
                  <mat-error>Age must be between 0 and 30</mat-error>
                }
                @if (form.get('age')?.hasError('pattern')) {
                  <mat-error>Age must be a valid whole number</mat-error>
                }
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description (or Breed Info)</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="Describe the cat..."></textarea>
                @if (form.get('description')?.hasError('required')) {
                  <mat-error>Description is required</mat-error>
                }
                @if (form.get('description')?.hasError('maxlength')) {
                  <mat-error>Description cannot exceed 500 characters</mat-error>
                }
              </mat-form-field>


              <div class="form-actions">
                <button mat-button type="button" (click)="onCancel()" [disabled]="isSaving()">Cancel</button>
                <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || isSaving()">
                  {{ isEditMode() ? 'Save Changes' : 'Create Cat' }}
                </button>
              </div>

            </form>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styleUrl: './cat-form.component.scss'
})
export class CatFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catService = inject(CatService);
  private readonly snackBar = inject(MatSnackBar);

  readonly isEditMode = signal(false);
  readonly catId = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: [
      '', 
      [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]*$/) // Only letters and spaces allowed
      ]
    ],
    age: [
      '0', 
      [
        Validators.required, 
        Validators.min(0), 
        Validators.max(30),
        Validators.pattern(/^(0|[1-9]\d*)$/) // Only positive integers
      ]
    ],
    description: [
      '', 
      [
        Validators.required,
        Validators.maxLength(500)
      ]
    ],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const isEdit = this.route.snapshot.url.some(segment => segment.path === 'edit');
    
    if (id && isEdit) {
      this.isEditMode.set(true);
      this.catId.set(id);
      this.loadCatData(id);
    }
  }

  loadCatData(id: string): void {
    this.isLoading.set(true);
    this.catService.getById(id).subscribe({
      next: (cat) => {
        this.form.patchValue({
          name: cat.info.name,
          age: cat.info.age.toString(),
          description: cat.info.description
        });
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.error.set(err instanceof Error ? err.message : 'Failed to load cat data');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSaving.set(true);
    const formVal = this.form.getRawValue();
    const payload: CreateCatPayload = {
      name: formVal.name,
      age: formVal.age.toString(),
      description: formVal.description
    };

    const request$ = this.isEditMode() && this.catId()
      ? this.catService.update(this.catId()!, payload)
      : this.catService.create(payload);

    request$.subscribe({
      next: () => {
        this.snackBar.open(this.isEditMode() ? 'Cat updated successfully' : 'Cat created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/cats']);
      },
      error: (err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to save cat';
        this.snackBar.open(msg, 'Close', { duration: 5000 });
        this.isSaving.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/cats']);
  }
}
