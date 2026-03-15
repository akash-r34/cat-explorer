import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-paw-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loader-wrapper">
      <div class="paw-icon"></div>
      @if (message()) {
        <p class="loader-message">{{ message() }}</p>
      }
    </div>
  `,
  styleUrl: './paw-loader.component.scss'
})
export class PawLoaderComponent {
  readonly message = input<string>('Searching for cat...');
}
