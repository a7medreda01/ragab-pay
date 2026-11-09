import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Floating Bottom Navigation Dock -->
    <nav class="absolute bottom-[max(1.75rem,calc(1.25rem+env(safe-area-inset-bottom,28px)))] inset-x-4 z-40">
      <div class="relative bg-white/95 backdrop-blur-2xl border border-azure-100/90 rounded-full px-3 py-1.5 shadow-[0_16px_40px_rgba(2,132,199,0.16)] flex items-center justify-between">
        
        <!-- 1. Home Tab -->
        <button
          (click)="selectTab('home')"
          class="relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl tap-bounce transition-all duration-200"
          [class.bg-azure-50]="state.activeTab() === 'home'"
          [class.text-azure-600]="state.activeTab() === 'home'"
          [class.text-slate-400]="state.activeTab() !== 'home'"
        >
          <i class="bi bi-house-door-fill text-lg mb-0.5" [class.scale-110]="state.activeTab() === 'home'"></i>
          <span class="text-[10px] font-bold font-arabic leading-tight">الرئيسية</span>
          @if (state.activeTab() === 'home') {
            <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5"></span>
          }
        </button>

        <!-- 2. Search Tab -->
        <button
          (click)="selectTab('search')"
          class="relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl tap-bounce transition-all duration-200"
          [class.bg-azure-50]="state.activeTab() === 'search'"
          [class.text-azure-600]="state.activeTab() === 'search'"
          [class.text-slate-400]="state.activeTab() !== 'search'"
        >
          <i class="bi bi-search text-base mb-0.5" [class.scale-110]="state.activeTab() === 'search'"></i>
          <span class="text-[10px] font-bold font-arabic leading-tight">استكشاف</span>
          @if (state.activeTab() === 'search') {
            <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5"></span>
          }
        </button>

        <!-- 3. Center Button: AI Assistant -->
        <div class="relative -top-5 flex-1 flex flex-col items-center justify-center">
          <button
            (click)="openAiChat()"
            class="relative w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-azure-600 to-sky-400 text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)] ring-4 ring-white flex items-center justify-center tap-bounce hover:scale-105 active:scale-95 transition-all duration-200"
            title="مساعد AI"
          >
            <i class="bi bi-stars text-xl"></i>
          </button>
          <span class="text-[9px] font-bold text-indigo-700 tracking-tight mt-0.5 font-arabic">مساعد AI</span>
        </div>

        <!-- 4. Favorites Tab -->
        <button
          (click)="selectTab('favorites')"
          class="relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl tap-bounce transition-all duration-200"
          [class.bg-azure-50]="state.activeTab() === 'favorites'"
          [class.text-azure-600]="state.activeTab() === 'favorites'"
          [class.text-slate-400]="state.activeTab() !== 'favorites'"
        >
          <div class="relative">
            <i class="bi bi-heart-fill text-base mb-0.5" [class.scale-110]="state.activeTab() === 'favorites'"></i>
            @if (state.favorites().length > 0) {
              <span class="absolute -top-1 -end-2 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                {{ state.favorites().length }}
              </span>
            }
          </div>
          <span class="text-[10px] font-bold font-arabic leading-tight">المفضلة</span>
          @if (state.activeTab() === 'favorites') {
            <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5"></span>
          }
        </button>

        <!-- 5. Profile Tab -->
        <button
          (click)="selectTab('profile')"
          class="relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl tap-bounce transition-all duration-200"
          [class.bg-azure-50]="state.activeTab() === 'profile'"
          [class.text-azure-600]="state.activeTab() === 'profile'"
          [class.text-slate-400]="state.activeTab() !== 'profile'"
        >
          <i class="bi bi-person-fill text-lg mb-0.5" [class.scale-110]="state.activeTab() === 'profile'"></i>
          <span class="text-[10px] font-bold font-arabic leading-tight">حسابي</span>
          @if (state.activeTab() === 'profile') {
            <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5"></span>
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

  openAiChat() {
    this.state.isAiChatOpen.set(true);
  }
}
