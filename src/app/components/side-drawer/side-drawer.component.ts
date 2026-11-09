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
          class="relative w-[85%] max-w-[320px] h-full bg-white text-slate-900 shadow-2xl flex flex-col justify-between overflow-y-auto no-scrollbar z-10 border-s border-slate-100 font-arabic"
        >
          <div>
            <!-- Header -->
            <div class="p-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-azure-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                  RP
                </div>
                <h2 class="text-xs font-black text-slate-900">خدمات Ragab Pay</h2>
              </div>

              <button
                (click)="close()"
                class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center tap-bounce transition-colors"
                aria-label="إغلاق القائمة الجانبية"
                title="إغلاق"
              >
                <i class="bi bi-x-lg text-xs"></i>
              </button>
            </div>

            <!-- User Profile Card (White & Azure Brand Theme) -->
            <div class="p-3.5 mx-3 mt-3 rounded-2xl bg-gradient-to-br from-azure-50/80 via-white to-sky-50/50 border border-azure-100/80 shadow-2xs">
              <div class="flex items-center gap-2.5">
                <div class="relative">
                  <img
                    [src]="state.currentUser().avatar"
                    alt="User"
                    class="w-10 h-10 rounded-full object-cover ring-2 ring-azure-500 shadow-xs"
                  />
                  <span class="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] ring-1 ring-white">
                    <i class="bi bi-check"></i>
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-xs font-black text-slate-900 truncate">{{ state.currentUser().name }}</h3>
                  <span class="text-[11px] text-azure-700 font-bold block">عضوية بلاتينية VIP</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-azure-100/60 text-center">
                <div class="bg-white py-1.5 px-2 rounded-xl border border-slate-100 shadow-2xs">
                  <span class="text-[10px] text-slate-500 block">المكافآت</span>
                  <span class="text-xs font-black text-slate-900 font-sans">1,450 نقطة</span>
                </div>
                <div class="bg-white py-1.5 px-2 rounded-xl border border-slate-100 shadow-2xs">
                  <span class="text-[10px] text-slate-500 block">تصريح QR</span>
                  <span class="text-xs font-bold text-emerald-600">مفعل</span>
                </div>
              </div>
            </div>

            <!-- Services Section -->
            <div class="p-3 space-y-2">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1">الخدمات السريعة</span>

              <!-- AI Search -->
              <div
                (click)="openAiChat()"
                class="p-2.5 rounded-xl bg-slate-50/80 hover:bg-azure-50/60 border border-slate-200/80 hover:border-azure-300 transition-all cursor-pointer tap-bounce flex items-center gap-2.5 group"
              >
                <div class="w-8 h-8 rounded-lg bg-azure-600 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-2xs">
                  <i class="bi bi-robot"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-black text-slate-900 group-hover:text-azure-700 transition-colors">مستشار AI</h5>
                  <p class="text-[10px] text-slate-500 truncate">اقتراح وحدات تناسب طلبك</p>
                </div>
                <i class="bi bi-chevron-left text-slate-400 group-hover:text-azure-600 text-xs transition-colors"></i>
              </div>

              <!-- QR Pass -->
              <div
                (click)="openQrPass()"
                class="p-2.5 rounded-xl bg-slate-50/80 hover:bg-azure-50/60 border border-slate-200/80 hover:border-azure-300 transition-all cursor-pointer tap-bounce flex items-center gap-2.5 group"
              >
                <div class="w-8 h-8 rounded-lg bg-azure-600 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-2xs">
                  <i class="bi bi-qr-code"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-black text-slate-900 group-hover:text-azure-700 transition-colors">الـ QR السياحي</h5>
                  <p class="text-[10px] text-slate-500 truncate">تصاريح دخول الشواطئ والقرى</p>
                </div>
                <i class="bi bi-chevron-left text-slate-400 group-hover:text-azure-600 text-xs transition-colors"></i>
              </div>

              <!-- VIP Services -->
              <div
                (click)="openVipServices()"
                class="p-2.5 rounded-xl bg-slate-50/80 hover:bg-azure-50/60 border border-slate-200/80 hover:border-azure-300 transition-all cursor-pointer tap-bounce flex items-center gap-2.5 group"
              >
                <div class="w-8 h-8 rounded-lg bg-azure-600 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-2xs">
                  <i class="bi bi-gem"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-black text-slate-900 group-hover:text-azure-700 transition-colors">خدمات VIP</h5>
                  <p class="text-[10px] text-slate-500 truncate">ليموزين، شيف، ويخوت خاصة</p>
                </div>
                <i class="bi bi-chevron-left text-slate-400 group-hover:text-azure-600 text-xs transition-colors"></i>
              </div>

              <!-- Owner Portal -->
              <div
                (click)="openOwnerPortal()"
                class="p-2.5 rounded-xl bg-slate-50/80 hover:bg-azure-50/60 border border-slate-200/80 hover:border-azure-300 transition-all cursor-pointer tap-bounce flex items-center gap-2.5 group"
              >
                <div class="w-8 h-8 rounded-lg bg-azure-600 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-2xs">
                  <i class="bi bi-building"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-black text-slate-900 group-hover:text-azure-700 transition-colors">بوابة المالك</h5>
                  <p class="text-[10px] text-slate-500 truncate">إدارة الشاليهات والأرباح</p>
                </div>
                <i class="bi bi-chevron-left text-slate-400 group-hover:text-azure-600 text-xs transition-colors"></i>
              </div>
            </div>

            <!-- Links -->
            <div class="px-3 py-1 space-y-1 text-xs">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1">الحساب والدعم</span>

              <button
                (click)="goToBookings()"
                class="w-full p-2.5 rounded-xl hover:bg-azure-50/70 text-slate-700 hover:text-azure-700 flex items-center justify-between tap-bounce transition-colors"
              >
                <span class="flex items-center gap-2.5">
                  <i class="bi bi-card-checklist text-azure-600 text-sm"></i>
                  <span class="font-bold">حجوزاتي</span>
                </span>
                <span class="text-[10px] text-azure-800 font-bold bg-azure-100 px-2.5 py-0.5 rounded-full">{{ state.bookings().length }}</span>
              </button>

              <button
                (click)="openWhatsAppSupport()"
                class="w-full p-2.5 rounded-xl hover:bg-azure-50/70 text-slate-700 hover:text-azure-700 flex items-center justify-between tap-bounce transition-colors"
              >
                <span class="flex items-center gap-2.5">
                  <i class="bi bi-whatsapp text-emerald-600 text-sm"></i>
                  <span class="font-bold">دعم الكونسيرج 24/7</span>
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">متاح</span>
              </button>

              <button
                (click)="openAuth()"
                class="w-full p-2.5 rounded-xl hover:bg-azure-50/70 text-slate-700 hover:text-azure-700 flex items-center justify-between tap-bounce transition-colors"
              >
                <span class="flex items-center gap-2.5">
                  <i class="bi bi-person-circle text-azure-600 text-sm"></i>
                  <span class="font-bold">تبديل الحساب</span>
                </span>
                <i class="bi bi-chevron-left text-slate-400 text-xs"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="p-3.5 border-t border-slate-100 bg-slate-50/80 text-center">
            <span class="text-[11px] text-slate-400 font-medium">منظومة Ragab Pay الفندقية</span>
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
