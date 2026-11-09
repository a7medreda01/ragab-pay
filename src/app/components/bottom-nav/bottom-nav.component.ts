import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="absolute bottom-5 inset-x-5 z-40">
      <div class="relative bg-slate-950/90 backdrop-blur-2xl border border-white/15 rounded-full px-4 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] flex items-center justify-between">
        <!-- 1. Home -->
        <button
          (click)="selectTab('home')"
          class="flex flex-col items-center justify-center flex-1 py-1 tap-bounce transition-colors duration-200"
          [class.text-azure-400]="state.activeTab() === 'home'"
          [class.text-white/50]="state.activeTab() !== 'home'"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-[10px] font-medium font-arabic">الرئيسية</span>
        </button>

        <!-- 2. Search -->
        <button
          (click)="selectTab('search')"
          class="flex flex-col items-center justify-center flex-1 py-1 tap-bounce transition-colors duration-200"
          [class.text-azure-400]="state.activeTab() === 'search'"
          [class.text-white/50]="state.activeTab() !== 'search'"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span class="text-[10px] font-medium font-arabic">بحث ذكي</span>
        </button>

        <!-- 3. Raised Quick Action (+) -->
        <div class="relative -top-5 flex-1 flex justify-center">
          <button
            (click)="quickAction()"
            class="w-13 h-13 rounded-full bg-gradient-to-tr from-azure-600 to-sky-400 text-white p-3 shadow-[0_8px_24px_rgba(2,132,199,0.5)] ring-4 ring-slate-950 flex items-center justify-center tap-bounce hover:scale-105 transition-transform"
            title="حجز سريع واستكشاف فوري"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>

        <!-- 4. Favorites -->
        <button
          (click)="selectTab('favorites')"
          class="relative flex flex-col items-center justify-center flex-1 py-1 tap-bounce transition-colors duration-200"
          [class.text-azure-400]="state.activeTab() === 'favorites'"
          [class.text-white/50]="state.activeTab() !== 'favorites'"
        >
          <div class="relative">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            @if (state.favorites().length > 0) {
              <span class="absolute -top-1 -end-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-950">
                {{ state.favorites().length }}
              </span>
            }
          </div>
          <span class="text-[10px] font-medium font-arabic">المفضلة</span>
        </button>

        <!-- 5. Profile -->
        <button
          (click)="selectTab('profile')"
          class="flex flex-col items-center justify-center flex-1 py-1 tap-bounce transition-colors duration-200"
          [class.text-azure-400]="state.activeTab() === 'profile'"
          [class.text-white/50]="state.activeTab() !== 'profile'"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span class="text-[10px] font-medium font-arabic">حسابي</span>
        </button>
      </div>
    </nav>
  `
})
export class BottomNavComponent {
  readonly state = inject(AppStateService);

  selectTab(tab: 'home' | 'search' | 'quick-book' | 'favorites' | 'profile') {
    this.state.navigateToTab(tab);
  }

  quickAction() {
    this.state.isFilterOpen.set(true);
  }
}

