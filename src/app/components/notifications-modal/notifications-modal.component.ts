import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-notifications-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (state.isNotificationOpen()) {
      <div class="absolute inset-0 z-50 flex flex-col justify-end">
        <div (click)="close()" class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"></div>

        <div
          (touchstart)="onSheetTouchStart($event)"
          (touchmove)="onSheetTouchMove($event)"
          (touchend)="onSheetTouchEnd($event)"
          [style.transform]="currentTranslateY > 0 ? 'translateY(' + currentTranslateY + 'px)' : ''"
          [style.transition]="isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)'"
          class="relative w-full max-h-[80%] bg-white rounded-t-[36px] shadow-2xl p-5 pt-2.5 flex flex-col animate-slide-up font-arabic"
        >
          <!-- Drag Handle -->
          <div class="w-full flex flex-col items-center justify-center pt-1 pb-1 cursor-grab active:cursor-grabbing">
            <div class="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors"></div>
            <span class="text-[9px] text-slate-400 mt-1 select-none font-sans">اسحب للأسفل للإغلاق ↓</span>
          </div>

          <div class="flex items-center justify-between pb-3 pt-1 border-b border-slate-100">
            <h2 class="text-sm font-bold text-slate-900">مركز التنبيهات والإشعارات - Ragab Pay</h2>
            <button (click)="close()" class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs tap-bounce">✕</button>
          </div>

          <div class="py-3 space-y-2.5 overflow-y-auto no-scrollbar">
            @for (notif of state.notifications(); track notif.id) {
              <div
                class="p-3 rounded-2xl border transition-all"
                [class.bg-azure-50]="!notif.read"
                [class.border-azure-200]="!notif.read"
                [class.bg-white]="notif.read"
                [class.border-slate-100]="notif.read"
              >
                <div class="flex items-start justify-between">
                  <h4 class="text-xs font-bold text-slate-900">{{ notif.title }}</h4>
                  <span class="text-[10px] text-slate-400">{{ notif.time }}</span>
                </div>
                <p class="text-[11px] text-slate-600 mt-1 leading-relaxed">{{ notif.body }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class NotificationsModalComponent {
  readonly state = inject(AppStateService);

  touchStartY = 0;
  currentTranslateY = 0;
  isDragging = false;

  onSheetTouchStart(e: TouchEvent) {
    if (e.touches.length > 0) {
      this.touchStartY = e.touches[0].clientY;
      this.isDragging = true;
    }
  }

  onSheetTouchMove(e: TouchEvent) {
    if (!this.isDragging || e.touches.length === 0) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - this.touchStartY;
    if (deltaY > 0) {
      this.currentTranslateY = deltaY;
    } else {
      this.currentTranslateY = 0;
    }
  }

  onSheetTouchEnd(e: TouchEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.currentTranslateY > 75) {
      this.close();
    }
    this.currentTranslateY = 0;
  }

  close() {
    this.state.isNotificationOpen.set(false);
  }
}
