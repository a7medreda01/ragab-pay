import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full flex flex-col justify-between overflow-hidden bg-slate-950 font-arabic select-none">
      <!-- Full-bleed Luxury Hero Background -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85"
          alt="Ragab Pay Hero"
          class="w-full h-full object-cover scale-105 transition-transform duration-1000"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30"></div>
      </div>

      <!-- Top Branding Section with Brand Logo Card -->
      <div class="relative z-10 pt-16 px-6 flex flex-col items-center text-center">
        <!-- Logo Container with Soft Frosted Backdrop -->
        <div class="px-6 py-3.5 rounded-3xl bg-white/95 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.3)] border border-white/60 mb-3 flex items-center justify-center">
          <img
            src="assets/logo.png"
            alt="Ragab Pay Logo"
            class="h-12 w-auto object-contain"
          />
        </div>

        <!-- Tagline Pill -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs mt-2 font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>منظومة Ragab Pay للحجز والإدارة الفندقية وسكن الشركات</span>
        </div>
      </div>

      <!-- Bottom Glassmorphic Action Card -->
      <div class="relative z-10 p-6 pb-10">
        <div class="glass-panel p-6 rounded-[36px] text-center shadow-2xl border border-white/60">
          <h1 class="text-xl font-black text-slate-900 leading-snug">
            إقامتك الاستثنائية على أرقى الشواطئ
          </h1>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            استكشف أفضل الشاليهات والفيلات والشقق الفندقية في الساحل الشمالي والقاهرة الجديدة مع إشراف فندقي متكامل.
          </p>

          <!-- 3 Value Props with Sleek Vector Icons -->
          <div class="grid grid-cols-3 gap-2.5 my-5 text-center">
            <div class="bg-white/80 rounded-2xl p-2.5 border border-white/60 flex flex-col items-center shadow-xs">
              <div class="w-8 h-8 rounded-full bg-azure-50 text-azure-600 flex items-center justify-center mb-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <span class="text-[10px] font-bold text-slate-800">وحدات معتمدة</span>
            </div>

            <div class="bg-white/80 rounded-2xl p-2.5 border border-white/60 flex flex-col items-center shadow-xs">
              <div class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <span class="text-[10px] font-bold text-slate-800">حجز فوري</span>
            </div>

            <div class="bg-white/80 rounded-2xl p-2.5 border border-white/60 flex flex-col items-center shadow-xs">
              <div class="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </div>
              <span class="text-[10px] font-bold text-slate-800">إشراف فندقي</span>
            </div>
          </div>

          <!-- Primary CTA Button -->
          <button
            (click)="startExploring()"
            class="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-full shadow-xl flex items-center justify-center gap-2 tap-bounce transition-all tracking-wide"
          >
            <span>ابدأ استكشاف الوحدات الآن</span>
            <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>

          <!-- Secondary Link -->
          <button
            (click)="quickSearch()"
            class="mt-3.5 text-xs font-semibold text-azure-700 hover:text-azure-800 block mx-auto tap-bounce"
          >
            تصفية وبحث مباشر بدون تسجيل
          </button>
        </div>
      </div>
    </div>
  `
})
export class WelcomeScreenComponent {
  readonly state = inject(AppStateService);

  startExploring() {
    this.state.isAuthOpen.set(true);
  }

  quickSearch() {
    this.state.currentScreen.set('main');
    this.state.activeTab.set('search');
    this.state.isFilterOpen.set(true);
  }
}
