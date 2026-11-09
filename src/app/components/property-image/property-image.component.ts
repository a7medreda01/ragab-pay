import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full overflow-hidden bg-slate-800" [ngClass]="containerClass">
      <!-- Skeleton shimmer before load -->
      @if (!isLoaded() && !hasError()) {
        <div class="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-pulse"></div>
      }

      <!-- Actual Image -->
      @if (!hasError()) {
        <img
          [src]="src"
          [alt]="alt"
          loading="lazy"
          (load)="onLoad()"
          (error)="onError()"
          class="w-full h-full object-cover transition-all duration-700 ease-out"
          [class.opacity-0]="!isLoaded()"
          [class.opacity-100]="isLoaded()"
          [class.scale-105]="!isLoaded()"
          [class.scale-100]="isLoaded()"
        />
      }

      <!-- Branded Luxury Fallback if error -->
      @if (hasError()) {
        <div class="absolute inset-0 bg-gradient-to-br from-azure-800 via-navy-900 to-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
          <div class="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/20">
            <svg class="w-6 h-6 text-azure-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <span class="text-xs font-semibold tracking-wider text-azure-200">RAGAB PAY</span>
          <span class="text-[11px] text-white/70 mt-1 font-arabic">{{ alt || 'إقامة فندقية فاخرة' }}</span>
        </div>
      }
    </div>
  `
})
export class PropertyImageComponent {
  @Input({ required: true }) src!: string;
  @Input() alt: string = 'Ragab Pay Luxury Unit';
  @Input() containerClass: string = '';

  readonly isLoaded = signal(false);
  readonly hasError = signal(false);

  onLoad() {
    this.isLoaded.set(true);
  }

  onError() {
    this.hasError.set(true);
    this.isLoaded.set(true);
  }
}

