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
        <!-- Backdrop Blur with Fade -->
        <div
          (click)="close()"
          class="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
        ></div>

        <!-- Side Drawer Panel (Slides smoothly from the right in RTL) -->
        <div
          (touchstart)="onTouchStart($event)"
          (touchmove)="onTouchMove($event)"
          (touchend)="onTouchEnd($event)"
          [style.transform]="currentTranslateX !== 0 ? 'translateX(' + currentTranslateX + 'px)' : ''"
          [style.transition]="isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)'"
          class="relative w-[85%] max-w-[340px] h-full bg-slate-900 text-white shadow-[20px_0_60px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-y-auto no-scrollbar z-10 border-s border-white/10"
        >
          <!-- Top Drawer Header & Close -->
          <div>
            <div class="p-5 pb-3 border-b border-white/10 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-azure-600 flex items-center justify-center text-white shadow-md shadow-azure-600/30">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10m-10 6h16"/>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xs font-black text-white">قائمة خدمات Ragab Pay</h2>
                  <span class="text-[9px] text-azure-400 font-sans block">Elite Services & Tourism</span>
                </div>
              </div>

              <!-- Close Button -->
              <button
                (click)="close()"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center tap-bounce transition-colors"
                title="إغلاق القائمة"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- User Profile & Loyalty Badge Card -->
            <div class="p-4 mx-4 mt-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <img
                    [src]="state.currentUser().avatar"
                    alt="User"
                    class="w-12 h-12 rounded-full object-cover ring-2 ring-azure-400"
                  />
                  <span class="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] ring-2 ring-slate-900">✓</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5">
                    <h3 class="text-xs font-bold text-white truncate">{{ state.currentUser().name }}</h3>
                  </div>
                  <span class="text-[10px] text-azure-300 font-medium block">عضوية Ragab Pay البلاتينية VIP</span>
                  <span class="text-[9px] text-white/50 block font-sans" dir="ltr">{{ state.currentUser().phone }}</span>
                </div>
              </div>

              <!-- Quick Stats Pill -->
              <div class="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/10 text-center">
                <div class="bg-white/5 py-1.5 px-2 rounded-xl">
                  <span class="text-[9px] text-white/60 block">نقاط المكافآت</span>
                  <span class="text-xs font-black text-amber-400 font-sans">1,450 نقطة</span>
                </div>
                <div class="bg-white/5 py-1.5 px-2 rounded-xl">
                  <span class="text-[9px] text-white/60 block">تصاريح الـ QR</span>
                  <span class="text-xs font-black text-emerald-400 font-sans">مفعلّة ⚡</span>
                </div>
              </div>
            </div>

            <!-- SECTION: Our Exclusive Services (خدماتنا الاستثنائية) -->
            <div class="p-4 space-y-2.5">
              <div class="flex items-center justify-between mb-1">
                <h4 class="text-[10px] font-black uppercase text-azure-400 tracking-wider">خدماتنا الفندقية والسياحية</h4>
                <span class="text-[9px] text-white/40">Exclusive</span>
              </div>

              <!-- AI Search Assistant Service -->
              <div
                (click)="openAiChat()"
                class="group p-3.5 rounded-2xl bg-gradient-to-r from-indigo-900/70 via-azure-900/60 to-slate-900 hover:from-indigo-900/90 border border-indigo-400/40 hover:border-indigo-300 transition-all cursor-pointer tap-bounce shadow-sm flex items-start gap-3"
              >
                <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-indigo-400/30">
                  <span class="text-lg">🤖</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h5 class="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">مستشار السيرش الذكي (AI)</h5>
                    <span class="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[9px] font-bold border border-indigo-500/30">جديد ✨</span>
                  </div>
                  <p class="text-[10px] text-white/70 mt-0.5 leading-snug">
                    تحدث مع الذكاء الاصطناعي ليحلل رغباتك ويقترح لك الوحدة الأنسب فوراً.
                  </p>
                </div>
              </div>

              <!-- Service 1: شراء وتفعيل QR السياحي -->
              <div
                (click)="openQrPass()"
                class="group p-3.5 rounded-2xl bg-gradient-to-r from-azure-900/60 to-sky-900/40 hover:from-azure-900/90 hover:to-sky-900/70 border border-azure-500/30 hover:border-azure-400 transition-all cursor-pointer tap-bounce shadow-sm flex items-start gap-3"
              >
                <div class="w-10 h-10 rounded-xl bg-azure-500/20 text-azure-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-azure-400/30">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h5 class="text-xs font-bold text-white group-hover:text-azure-300 transition-colors">شراء الـ QR السياحي</h5>
                    <span class="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">تصريح فوري</span>
                  </div>
                  <p class="text-[10px] text-white/70 mt-0.5 leading-snug">
                    تصريح الدخول الرقمي المعتمد للشواطئ الخاصة ونوادي قرى الساحل والجونة.
                  </p>
                </div>
              </div>

              <!-- Service 2: خدمات كبار الشخصيات VIP -->
              <div
                (click)="openVipServices()"
                class="group p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 hover:from-amber-950/60 hover:to-slate-900 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer tap-bounce shadow-sm flex items-start gap-3"
              >
                <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-amber-400/30">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h5 class="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">خدمات كبار الشخصيات (VIP)</h5>
                    <span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">Concierge</span>
                  </div>
                  <p class="text-[10px] text-white/70 mt-0.5 leading-snug">
                    ليموزين فاخر، شيف خاص بالفيلا، حراسة، ويخوت بحرية خاصة بأعلى معايير الرفاهية.
                  </p>
                </div>
              </div>

              <!-- Service 3: سكن الشركات وإسكان المشروعات -->
              <div
                (click)="filterCorporate()"
                class="group p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer tap-bounce flex items-start gap-3"
              >
                <div class="w-9 h-9 rounded-xl bg-white/10 text-azure-400 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h5 class="text-xs font-bold text-white">سكن الشركات والعمال</h5>
                    <span class="text-[9px] text-azure-400 font-bold">عقود جملة</span>
                  </div>
                  <p class="text-[10px] text-white/60 mt-0.5 leading-snug">
                    مجمعات سكنية مجهزة ومطابقة لاشتراطات السلامة المهنية وفواتير ضريبية معتمدة.
                  </p>
                </div>
              </div>

              <!-- Service 4: بوابة الملاك والمضيفين (Owner Dashboard) -->
              <div
                (click)="openOwnerPortal()"
                class="group p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-800 to-slate-900 hover:from-amber-500/30 border border-amber-400/40 hover:border-amber-400 transition-all cursor-pointer tap-bounce shadow-sm flex items-start gap-3"
              >
                <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform border border-amber-400/30 text-lg">
                  🏢
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h5 class="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">بوابة الملاك والمضيفين</h5>
                    <span class="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[9px] font-bold border border-amber-400/30">Host Portal</span>
                  </div>
                  <p class="text-[10px] text-white/70 mt-0.5 leading-snug">
                    إدارة شاليهاتك، تقويم الحجوزات، إيقاف الأيام، ومتابعة وسحب أرباحك فورياً.
                  </p>
                </div>
              </div>

              <!-- Service 4: إدارة العقارات للملاك والمستثمرين -->
              <div
                (click)="openHostContact()"
                class="group p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer tap-bounce flex items-start gap-3"
              >
                <div class="w-9 h-9 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h5 class="text-xs font-bold text-white">إدارة وتأجير عقارك</h5>
                    <span class="text-[9px] text-emerald-400 font-bold">عوائد شهرية</span>
                  </div>
                  <p class="text-[10px] text-white/60 mt-0.5 leading-snug">
                    سلّم شاليهك أو شقتك لفريق Ragab Pay وتولّى جني العوائد الاستثمارية براحة بال.
                  </p>
                </div>
              </div>
            </div>

            <!-- SECTION: Quick Links & Assistance -->
            <div class="px-4 py-2 space-y-1 text-xs">
              <h4 class="text-[10px] font-black uppercase text-white/40 tracking-wider mb-2">الدعم والحجوزات</h4>

              <button
                (click)="goToBookings()"
                class="w-full p-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white flex items-center justify-between transition-colors tap-bounce"
              >
                <span class="flex items-center gap-2">
                  <span>📑</span>
                  <span>قسائم وتفاصيل حجوزاتي</span>
                </span>
                <span class="text-[10px] text-azure-400 font-bold">{{ state.bookings().length }} حجز</span>
              </button>

              <button
                (click)="openWhatsAppSupport()"
                class="w-full p-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white flex items-center justify-between transition-colors tap-bounce"
              >
                <span class="flex items-center gap-2">
                  <span>💬</span>
                  <span>كونسيرج الدعم المباشر 24/7</span>
                </span>
                <span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">متاح الآن</span>
              </button>

              <button
                (click)="openAuth()"
                class="w-full p-2.5 rounded-xl hover:bg-white/5 text-white/80 hover:text-white flex items-center justify-between transition-colors tap-bounce"
              >
                <span class="flex items-center gap-2">
                  <span>👤</span>
                  <span>تبديل الحساب / تسجيل الدخول</span>
                </span>
                <span class="text-white/40">›</span>
              </button>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="p-4 border-t border-white/10 bg-slate-950/40 text-center">
            <div class="flex items-center justify-center gap-2 mb-1">
              <span class="w-2 h-2 rounded-full bg-azure-500 animate-pulse"></span>
              <span class="text-[10px] font-bold text-white/70">منظومة Ragab Pay الفندقية المعتمدة</span>
            </div>
            <span class="text-[9px] text-white/40 font-sans block">v2.4.0 Luxury Edition • iOS Glassmorphism</span>
          </div>
        </div>
      </div>
    }
  `
})
export class SideDrawerComponent {
  readonly state = inject(AppStateService);

  // Touch Swipe Gesture tracking to close the drawer
  touchStartX = 0;
  currentTranslateX = 0;
  isDragging = false;

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
    // In RTL, drawer is on the right. Swiping right (deltaX > 0) closes it!
    if (deltaX > 0) {
      this.currentTranslateX = deltaX;
    } else {
      this.currentTranslateX = 0;
    }
  }

  onTouchEnd(e: TouchEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.currentTranslateX > 80) {
      this.close();
    }
    this.currentTranslateX = 0;
  }

  close() {
    this.state.isSideDrawerOpen.set(false);
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

  filterCorporate() {
    this.close();
    this.state.filterCriteria.update(c => ({ ...c, corporateOnly: true }));
    this.state.navigateToTab('search');
  }

  openHostContact() {
    window.open('https://wa.me/201001234567?text=مرحباً فريق Ragab Pay، أود تسجيل وإدارة عقاري على المنصة', '_blank');
  }

  goToBookings() {
    this.close();
    this.state.navigateToTab('profile');
  }

  openWhatsAppSupport() {
    window.open('https://wa.me/201001234567?text=مرحباً كونسيرج Ragab Pay VIP، أحتاج إلى استفسار فوري', '_blank');
  }

  openAuth() {
    this.close();
    this.state.isAuthOpen.set(true);
  }
}
