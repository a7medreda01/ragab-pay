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
        <div (click)="close()" class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"></div>

        <div class="relative w-full max-h-[80%] bg-white rounded-t-[36px] shadow-2xl p-5 flex flex-col animate-slide-up font-arabic">
          <div class="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3"></div>

          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 class="text-sm font-bold text-slate-900">مركز التنبيهات والإشعارات</h2>
            <button (click)="close()" class="text-slate-400 hover:text-slate-600 text-xs">✕</button>
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

  close() {
    this.state.isNotificationOpen.set(false);
  }
}

