import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-side-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (state.isSideDrawerOpen()) {
      <div class="absolute inset-0 z-50 flex font-arabic overflow-hidden">
        <!-- Backdrop Blur -->
        <div
          (click)="close()"
          class="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
        ></div>

        <!-- Side Drawer Panel -->
        <div
          (touchstart)="onTouchStart($event)"
          (touchmove)="onTouchMove($event)"
          (touchend)="onTouchEnd($event)"
          [style.transform]="currentTranslateX !== 0 ? 'translateX(' + currentTranslateX + 'px)' : ''"
          [style.transition]="isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)'"
          class="relative w-[85%] max-w-[320px] h-full bg-slate-900 text-white shadow-2xl flex flex-col justify-between overflow-y-auto no-scrollbar z-10 border-s border-white/10"
        >
          <div>
            <!-- Header -->
            <div class="p-4 pb-3 border-b border-white/10 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-azure-600 flex items-center justify-center text-white font-bold text-xs">
                  RP
                </div>
                <h2 class="text-xs font-black text-white">خدمات Ragab Pay</h2>
              </div>

              <button
                (click)="close()"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center tap-bounce"
                aria-label="إغلاق القائمة الجانبية"
                title="إغلاق"
              >
                <i class="bi bi-x-lg text-xs"></i>
              </button>
            </div>

            <!-- User Profile Card -->
            <div class="p-3.5 mx-3 mt-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div class="flex items-center gap-2.5">
                <div class="relative">
                  <img
                    [src]="state.currentUser().avatar"
                    alt="User"
                    class="w-10 h-10 rounded-full object-cover ring-2 ring-slate-600"
                  />
                  <span class="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] ring-1 ring-slate-900">
                    <i class="bi bi-check"></i>
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-xs font-bold text-white truncate">{{ state.currentUser().name }}</h3>
                  <span class="text-[11px] text-slate-400 font-medium block">عضوية بلاتينية VIP</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-700/60 text-center">
                <div class="bg-slate-700/30 py-1.5 px-2 rounded-xl border border-slate-700/40">
                  <span class="text-[10px] text-slate-400 block">المكافآت</span>
                  <span class="text-xs font-bold text-slate-200 font-sans">1,450 نقطة</span>
                </div>
                <div class="bg-slate-700/30 py-1.5 px-2 rounded-xl border border-slate-700/40">
                  <span class="text-[10px] text-slate-400 block">تصريح QR</span>
                  <span class="text-xs font-bold text-emerald-400">مفعل</span>
                </div>
              </div>
            </div>

            <!-- Services Section -->
            <div class="p-3 space-y-2">
              <span class="text-[11px] font-bold text-slate-400 tracking-wider block px-1">الخدمات السريعة</span>

              <!-- AI Search -->
              <div
                (click)="openAiChat()"
                class="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 transition-all cursor-pointer tap-bounce flex items-center gap-2.5"
              >
                <div class="w-8 h-8 rounded-lg bg-azure-500/10 text-azure-400 border border-azure-500/20 flex items-center justify-center text-sm flex-shrink-0">
                  <i class="bi bi-robot"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-bold text-white">مستشار AI</h5>
                  <p class="text-[10px] text-slate-400 truncate">اقتراح وحدات تناسب طلبك</p>
                </div>
                <i class="bi bi-chevron-left text-slate-500 text-xs"></i>
              </div>

              <!-- QR Pass -->
              <div
                (click)="openQrPass()"
                class="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 transition-all cursor-pointer tap-bounce flex items-center gap-2.5"
              >
                <div class="w-8 h-8 rounded-lg bg-azure-500/10 text-azure-400 border border-azure-500/20 flex items-center justify-center text-sm flex-shrink-0">
                  <i class="bi bi-qr-code"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-bold text-white">الـ QR السياحي</h5>
                  <p class="text-[10px] text-slate-400 truncate">تصاريح دخول الشواطئ والقرى</p>
                </div>
                <i class="bi bi-chevron-left text-slate-500 text-xs"></i>
              </div>

              <!-- VIP Services -->
              <div
                (click)="openVipServices()"
                class="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 transition-all cursor-pointer tap-bounce flex items-center gap-2.5"
              >
                <div class="w-8 h-8 rounded-lg bg-azure-500/10 text-azure-400 border border-azure-500/20 flex items-center justify-center text-sm flex-shrink-0">
                  <i class="bi bi-gem"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-bold text-white">خدمات VIP</h5>
                  <p class="text-[10px] text-slate-400 truncate">ليموزين، شيف، ويخوت خاصة</p>
                </div>
                <i class="bi bi-chevron-left text-slate-500 text-xs"></i>
              </div>

              <!-- Owner Portal -->
              <div
                (click)="openOwnerPortal()"
                class="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 transition-all cursor-pointer tap-bounce flex items-center gap-2.5"
              >
                <div class="w-8 h-8 rounded-lg bg-azure-500/10 text-azure-400 border border-azure-500/20 flex items-center justify-center text-sm flex-shrink-0">
                  <i class="bi bi-building"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-bold text-white">بوابة المالك</h5>
                  <p class="text-[10px] text-slate-400 truncate">إدارة الشاليهات والأرباح</p>
                </div>
                <i class="bi bi-chevron-left text-slate-500 text-xs"></i>
              </div>
            </div>

            <!-- Links -->
            <div class="px-3 py-1 space-y-1 text-xs">
              <span class="text-[11px] font-bold text-slate-400 tracking-wider block px-1 mb-1">الحساب والدعم</span>

              <button
                (click)="goToBookings()"
                class="w-full p-2.5 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white flex items-center justify-between tap-bounce transition-colors"
              >
                <span class="flex items-center gap-2.5">
                  <i class="bi bi-card-checklist text-slate-400 text-sm"></i>
                  <span>حجوزاتي</span>
                </span>
                <span class="text-[10px] text-slate-300 font-bold bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">{{ state.bookings().length }}</span>
              </button>

              <button
                (click)="openWhatsAppSupport()"
                class="w-full p-2.5 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white flex items-center justify-between tap-bounce transition-colors"
              >
                <span class="flex items-center gap-2.5">
                  <i class="bi bi-whatsapp text-emerald-400 text-sm"></i>
                  <span>دعم الكونسيرج 24/7</span>
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">متاح</span>
              </button>

              <button
                (click)="openAuth()"
                class="w-full p-2.5 rounded-xl hover:bg-slate-800/60 text-slate-300 hover:text-white flex items-center justify-between tap-bounce transition-colors"
              >
                <span class="flex items-center gap-2.5">
                  <i class="bi bi-person-circle text-slate-400 text-sm"></i>
                  <span>تبديل الحساب</span>
                </span>
                <i class="bi bi-chevron-left text-slate-500 text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="p-3 border-t border-slate-800 bg-slate-950/60 text-center">
            <span class="text-[11px] text-slate-400">منظومة Ragab Pay الفندقية</span>
          </div>
        </div>
      </div>
    }
  `
})
export class SideDrawerComponent {
  readonly state = inject(AppStateService);

  touchStartX = 0;
  currentTranslateX = 0;
  isDragging = false;

  close() {
    this.state.isSideDrawerOpen.set(false);
    this.currentTranslateX = 0;
  }

  onTouchStart(e: TouchEvent) {
    if (e.touches.length > 0) {
      this.touchStartX = e.touches[0].clientX;
      this.isDragging = true;
    }
  }

  onTouchMove(e: TouchEvent) {
    if (!this.isDragging || e.touches.length === 0) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - this.touchStartX;
    if (deltaX > 0) {
      this.currentTranslateX = deltaX;
    }
  }

  onTouchEnd(e: TouchEvent) {
    this.isDragging = false;
    if (this.currentTranslateX > 80) {
      this.close();
    } else {
      this.currentTranslateX = 0;
    }
  }

  openAiChat() {
    this.close();
    this.state.isAiChatOpen.set(true);
  }

  openQrPass() {
    this.close();
    this.state.isQrPassModalOpen.set(true);
  }

  openVipServices() {
    this.close();
    this.state.isVipServicesModalOpen.set(true);
  }

  openOwnerPortal() {
    this.close();
    this.state.switchToOwnerMode();
  }

  goToBookings() {
    this.close();
    this.state.navigateToTab('profile');
  }

  openWhatsAppSupport() {
    window.open('https://wa.me/201000001234?text=مرحباً كونسيرج Ragab Pay، أحتاج لمساعدة', '_blank');
  }

  openAuth() {
    this.close();
    this.state.isAuthOpen.set(true);
  }
}
