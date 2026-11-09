import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="absolute bottom-5 inset-x-4 z-40">
      <!-- Luxury iOS Glass Dock with Brand Blue & Pure White Identity -->
      <div class="relative bg-white/95 backdrop-blur-2xl border border-azure-100/90 rounded-full px-3 py-2 shadow-[0_16px_40px_rgba(2,132,199,0.18)] flex items-center justify-between shadow-[inset_0_1px_2px_rgba(255,255,255,1),_0_12px_36px_rgba(2,132,199,0.14)]">
        
        <!-- 1. Home Tab -->
        <button
          (click)="selectTab('home')"
          class="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl tap-bounce transition-all duration-200"
          [class.bg-azure-50]="state.activeTab() === 'home'"
          [class.text-azure-600]="state.activeTab() === 'home'"
          [class.text-slate-400]="state.activeTab() !== 'home'"
          [class.hover:text-azure-500]="state.activeTab() !== 'home'"
        >
          <svg class="w-5 h-5 mb-0.5 transition-transform duration-200" [class.scale-110]="state.activeTab() === 'home'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span class="text-[10px] font-bold font-arabic leading-tight">الرئيسية</span>
          @if (state.activeTab() === 'home') {
            <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5 animate-pulse"></span>
          }
        </button>

        <!-- 2. Search / Explore Tab -->
        <button
          (click)="selectTab('search')"
          class="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl tap-bounce transition-all duration-200"
          [class.bg-azure-50]="state.activeTab() === 'search'"
          [class.text-azure-600]="state.activeTab() === 'search'"
          [class.text-slate-400]="state.activeTab() !== 'search'"
          [class.hover:text-azure-500]="state.activeTab() !== 'search'"
        >
          <svg class="w-5 h-5 mb-0.5 transition-transform duration-200" [class.scale-110]="state.activeTab() === 'search'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span class="text-[10px] font-bold font-arabic leading-tight">استكشاف</span>
          @if (state.activeTab() === 'search') {
            <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5 animate-pulse"></span>
          }
        </button>

        <!-- 3. Raised Quick Action Floating Center (+) Button -->
        <div class="relative -top-5 flex-1 flex justify-center">
          <button
            (click)="quickAction()"
            class="w-12 h-12 rounded-full bg-gradient-to-tr from-azure-600 via-azure-500 to-sky-400 text-white shadow-[0_10px_24px_rgba(2,132,199,0.45)] ring-4 ring-white flex items-center justify-center tap-bounce hover:scale-105 active:scale-95 transition-all duration-200 group"
            title="حجز سريع وفلاتر ذكية"
          >
            <svg class="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" d="M12 5v14m7-7H5"/>
            </svg>
          </button>
        </div>

        <!-- 4. Favorites Tab -->
        <button
          (click)="selectTab('favorites')"
          class="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl tap-bounce transition-all duration-200"
          [class.bg-azure-50]="state.activeTab() === 'favorites'"
          [class.text-azure-600]="state.activeTab() === 'favorites'"
          [class.text-slate-400]="state.activeTab() !== 'favorites'"
          [class.hover:text-azure-500]="state.activeTab() !== 'favorites'"
        >
          <div class="relative">
            <svg class="w-5 h-5 mb-0.5 transition-transform duration-200" [class.scale-110]="state.activeTab() === 'favorites'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            @if (state.favorites().length > 0) {
              <span class="absolute -top-1 -end-2.5 w-4 h-4 bg-gradient-to-r from-rose-500 to-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                {{ state.favorites().length }}
              </span>
            }
          </div>
          <span class="text-[10px] font-bold font-arabic leading-tight">المفضلة</span>
          @if (state.activeTab() === 'favorites') {
            <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5 animate-pulse"></span>
          }
        </button>

        <!-- 5. Profile Tab -->
        <button
          (click)="selectTab('profile')"
          class="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl tap-bounce transition-all duration-200"
          [class.bg-azure-50]="state.activeTab() === 'profile'"
          [class.text-azure-600]="state.activeTab() === 'profile'"
          [class.text-slate-400]="state.activeTab() !== 'profile'"
          [class.hover:text-azure-500]="state.activeTab() !== 'profile'"
        >
          <svg class="w-5 h-5 mb-0.5 transition-transform duration-200" [class.scale-110]="state.activeTab() === 'profile'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span class="text-[10px] font-bold font-arabic leading-tight">حسابي</span>
          @if (state.activeTab() === 'profile') {
            <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5 animate-pulse"></span>
          }
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
