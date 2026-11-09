import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-full flex flex-col justify-between overflow-hidden bg-slate-950 font-arabic select-none">
      <!-- Background -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85"
          alt="Ragab Pay"
          class="w-full h-full object-cover scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30"></div>
      </div>

      <!-- Top Branding -->
      <div class="relative z-10 pt-14 px-6 flex flex-col items-center text-center">
        <div class="px-5 py-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl border border-white/60 mb-2.5 flex items-center justify-center">
          <img
            src="assets/logo.png"
            alt="Ragab Pay"
            class="h-10 w-auto object-contain"
          />
        </div>

        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[11px] font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>إقامة فندقية وسكن شركات راقٍ</span>
        </div>
      </div>

      <!-- Bottom Card -->
      <div class="relative z-10 p-5 pb-8">
        <div class="glass-panel p-5 rounded-3xl text-center shadow-xl border border-white/60">
          <h1 class="text-lg font-black text-slate-900 leading-snug">
            إقامة استثنائية وإدارة فندقية
          </h1>
          <p class="text-xs text-slate-600 mt-1 leading-relaxed">
            شاليهات وفيلات وسكن شركات بإدارة فندقية متكاملة.
          </p>

          <!-- 3 Value Props -->
          <div class="grid grid-cols-3 gap-2 my-4 text-center">
            <div class="bg-white/80 rounded-xl p-2 border border-white/60 flex flex-col items-center shadow-2xs">
              <i class="bi bi-patch-check text-azure-600 text-base mb-0.5"></i>
              <span class="text-[10px] font-bold text-slate-800">معتمد</span>
            </div>

            <div class="bg-white/80 rounded-xl p-2 border border-white/60 flex flex-col items-center shadow-2xs">
              <i class="bi bi-lightning-charge text-emerald-600 text-base mb-0.5"></i>
              <span class="text-[10px] font-bold text-slate-800">فوري</span>
            </div>

            <div class="bg-white/80 rounded-xl p-2 border border-white/60 flex flex-col items-center shadow-2xs">
              <i class="bi bi-shield-check text-sky-600 text-base mb-0.5"></i>
              <span class="text-[10px] font-bold text-slate-800">إشراف 24/7</span>
            </div>
          </div>

          <!-- Primary CTA -->
          <button
            (click)="startExploring()"
            class="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-full shadow-lg flex items-center justify-center gap-2 tap-bounce tracking-wide"
          >
            <span>استكشف الوحدات</span>
            <i class="bi bi-chevron-left text-xs"></i>
          </button>

          <!-- Secondary Link -->
          <button
            (click)="quickSearch()"
            class="mt-3 text-xs font-semibold text-azure-700 hover:text-azure-800 block mx-auto tap-bounce"
          >
            تصفح كزائر
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
