import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-qr-pass-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (state.isQrPassModalOpen()) {
      <div class="absolute inset-0 z-50 flex flex-col justify-end font-arabic">
        <!-- Backdrop Blur -->
        <div (click)="close()" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"></div>

        <!-- Sheet Modal with Drag Down to Dismiss -->
        <div
          (touchstart)="onSheetTouchStart($event)"
          (touchmove)="onSheetTouchMove($event)"
          (touchend)="onSheetTouchEnd($event)"
          [style.transform]="currentTranslateY > 0 ? 'translateY(' + currentTranslateY + 'px)' : ''"
          [style.transition]="isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)'"
          class="relative w-full max-h-[92%] bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] p-6 pt-2 flex flex-col overflow-y-auto no-scrollbar animate-slide-up"
        >
          <!-- Grabber Handle with Swipe Down Affordance -->
          <div class="w-full flex flex-col items-center justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing">
            <div class="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors"></div>
            <span class="text-[9px] text-slate-400 mt-1 select-none font-sans">اسحب للأسفل للإغلاق ↓</span>
          </div>

          <!-- Header -->
          <div class="flex items-center justify-between pb-3 pt-1 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2">
                <i class="bi bi-qr-code text-azure-600 text-base"></i>
                <h2 class="text-sm font-black text-slate-900">الـ QR السياحي الفندقي</h2>
              </div>
              <span class="text-[10px] text-slate-400">تصاريح الدخول السريع للقرى والشواطئ</span>
            </div>
            <button
              (click)="close()"
              class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs tap-bounce"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Holographic Digital QR Pass Preview Card -->
          <div class="my-4 p-4 rounded-3xl bg-gradient-to-br from-slate-950 via-azure-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-azure-500/30">
            <!-- Ambient Glow -->
            <div class="absolute -top-10 -end-10 w-32 h-32 bg-azure-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div class="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-lg bg-azure-500 text-white flex items-center justify-center text-xs font-bold">
                  RP
                </div>
                <div>
                  <h3 class="text-xs font-black tracking-tight text-white">Ragab Pay Tourist Pass</h3>
                  <span class="text-[9px] text-azure-300 font-sans block">Official Village Access</span>
                </div>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 flex items-center gap-1">
                <i class="bi bi-patch-check-fill text-emerald-400 text-[10px]"></i>
                تصريح نشط
              </span>
            </div>

            <!-- Pass Content: Dynamic QR Visual -->
            <div class="flex items-center gap-4">
              <!-- Visual Simulated QR Code -->
              <div class="relative w-24 h-24 bg-white p-2 rounded-2xl shadow-lg flex-shrink-0 flex items-center justify-center">
                <svg class="w-full h-full text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                  <!-- QR Matrix SVG -->
                  <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z"/>
                  <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z"/>
                  <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z"/>
                  <rect x="35" y="5" width="10" height="20"/>
                  <rect x="50" y="5" width="15" height="10"/>
                  <rect x="35" y="35" width="30" height="30"/>
                  <rect x="70" y="35" width="15" height="15"/>
                  <rect x="5" y="35" width="15" height="15"/>
                  <rect x="5" y="55" width="20" height="10"/>
                  <rect x="35" y="70" width="15" height="25"/>
                  <rect x="55" y="75" width="20" height="10"/>
                  <rect x="80" y="70" width="15" height="25"/>
                </svg>
                <!-- Central Logo Badge -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-6 h-6 rounded-md bg-azure-600 text-white flex items-center justify-center text-[9px] font-black shadow-xs ring-2 ring-white">
                    RP
                  </div>
                </div>
              </div>

              <!-- Pass Details -->
              <div class="flex-1 space-y-1 text-xs">
                <div>
                  <span class="text-[10px] text-white/50 block">اسم حامل التصريح:</span>
                  <span class="font-bold text-white">{{ state.currentUser().name }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-white/50 block">نوع التصريح:</span>
                  <span class="font-bold text-azure-300">{{ selectedPackage().title }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-white/50 block">صلاحية الدخول:</span>
                  <span class="font-bold text-emerald-400 font-sans">صالحة لـ {{ guestsCount() }} أفراد و {{ carsCount() }} سيارة</span>
                </div>
              </div>
            </div>

            <!-- Pass Barcode Footer -->
            <div class="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
              <span class="font-sans font-bold tracking-widest text-azure-300">#RP-TOUR-2026-9482</span>
              <span>معتمد إلكترونياً</span>
            </div>
          </div>

          <!-- Package Selection -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">اختر باقة التصريح السياحي</h3>

            <div class="grid grid-cols-1 gap-2.5">
              @for (pkg of packages; track pkg.id) {
                <div
                  (click)="selectedPackageId = pkg.id"
                  class="p-3.5 rounded-2xl border-2 transition-all cursor-pointer tap-bounce flex items-center justify-between"
                  [class.border-azure-600]="selectedPackageId === pkg.id"
                  [class.bg-azure-50/50]="selectedPackageId === pkg.id"
                  [class.border-slate-200]="selectedPackageId !== pkg.id"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-xs"
                      [class.bg-azure-600]="selectedPackageId === pkg.id"
                      [class.text-white]="selectedPackageId === pkg.id"
                      [class.bg-slate-100]="selectedPackageId !== pkg.id"
                    >
                      <i class="bi" [class]="pkg.icon"></i>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-900">{{ pkg.title }}</span>
                        @if (pkg.popular) {
                          <span class="px-2 py-0.5 rounded-full bg-azure-600 text-white text-[9px] font-bold">الأكثر طلباً</span>
                        }
                      </div>
                      <span class="text-[10px] text-slate-500 block mt-0.5">{{ pkg.desc }}</span>
                    </div>
                  </div>

                  <div class="text-end">
                    <span class="text-xs font-black text-slate-900 block font-sans">{{ pkg.price | number }} ج.م</span>
                    <span class="text-[9px] text-slate-400">{{ pkg.duration }}</span>
                  </div>
                </div>
              }
            </div>

            <!-- Steppers for Guests & Vehicles -->
            <div class="grid grid-cols-2 gap-3 pt-1">
              <!-- Guests Stepper -->
              <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span class="text-[11px] font-bold text-slate-800 block">عدد الأفراد</span>
                  <span class="text-[9px] text-slate-400 block">المصرح لهم</span>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="decrementGuests()" class="w-7 h-7 rounded-full bg-white text-slate-700 font-bold shadow-xs flex items-center justify-center tap-bounce">-</button>
                  <span class="text-xs font-black text-slate-900 font-sans w-4 text-center">{{ guestsCount() }}</span>
                  <button (click)="incrementGuests()" class="w-7 h-7 rounded-full bg-white text-slate-700 font-bold shadow-xs flex items-center justify-center tap-bounce">+</button>
                </div>
              </div>

              <!-- Cars Stepper -->
              <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span class="text-[11px] font-bold text-slate-800 block">تصاريح السيارات</span>
                  <span class="text-[9px] text-slate-400 block">بوابات إلكترونية</span>
                </div>
                <div class="flex items-center gap-2">
                  <button (click)="decrementCars()" class="w-7 h-7 rounded-full bg-white text-slate-700 font-bold shadow-xs flex items-center justify-center tap-bounce">-</button>
                  <span class="text-xs font-black text-slate-900 font-sans w-4 text-center">{{ carsCount() }}</span>
                  <button (click)="incrementCars()" class="w-7 h-7 rounded-full bg-white text-slate-700 font-bold shadow-xs flex items-center justify-center tap-bounce">+</button>
                </div>
              </div>
            </div>

            <!-- Total and Purchase Button -->
            <div class="mt-4 pt-3 border-t border-slate-100 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs text-slate-400 block">إجمالي رسوم التصريح</span>
                  <span class="text-sm font-black text-slate-900">{{ calculateTotal() | number }} ج.م</span>
                </div>
                <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  تفعيل فوري خلال دقيقة
                </span>
              </div>

              @if (isPurchased()) {
                <div class="p-3 rounded-2xl bg-emerald-500 text-white text-center animate-bounce">
                  <span class="text-xs font-black flex items-center justify-center gap-1.5">
                    <i class="bi bi-check-circle-fill"></i>
                    تم تفعيل الـ QR بنجاح
                  </span>
                  <span class="text-[10px] opacity-90 block mt-0.5">تم إرسال رمز الدخول وتفاصيل التصريح لهاتفك</span>
                </div>
              } @else {
                <button
                  (click)="purchasePass()"
                  class="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-full shadow-xl tap-bounce flex items-center justify-center gap-2"
                >
                  <span>شراء وتفعيل التصريح ({{ calculateTotal() | number }} ج.م)</span>
                  <i class="bi bi-arrow-left"></i>
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class QrPassModalComponent {
  readonly state = inject(AppStateService);

  selectedPackageId: string = 'weekend';
  readonly guestsCount = signal<number>(2);
  readonly carsCount = signal<number>(1);
  readonly isPurchased = signal<boolean>(false);

  // Drag-down to dismiss variables
  touchStartY = 0;
  currentTranslateY = 0;
  isDragging = false;

  readonly packages = [
    {
      id: 'daily',
      icon: 'bi-sun',
      title: 'تصريح اليوم الواحد (Day Pass)',
      desc: 'دخول الشواطئ والنوادي لمدة 24 ساعة',
      price: 500,
      duration: 'صالح 24 ساعة',
      popular: false
    },
    {
      id: 'weekend',
      icon: 'bi-water',
      title: 'تصريح عطلة الويكند (Weekend Pass)',
      desc: 'دخول غير محدود طوال عطلة الأسبوع',
      price: 1200,
      duration: 'صالح 3 أيام',
      popular: true
    },
    {
      id: 'seasonal',
      icon: 'bi-shield-check',
      title: 'تصريح VIP الموسمي الشامل',
      desc: 'بطاقة VIP ذهبية لكافة بوابات الساحل والجونة',
      price: 3500,
      duration: 'صالح طوال الموسم',
      popular: false
    }
  ];

  selectedPackage() {
    return this.packages.find(p => p.id === this.selectedPackageId) || this.packages[1];
  }

  incrementGuests() {
    this.guestsCount.set(this.guestsCount() + 1);
  }

  decrementGuests() {
    if (this.guestsCount() > 1) {
      this.guestsCount.set(this.guestsCount() - 1);
    }
  }

  incrementCars() {
    this.carsCount.set(this.carsCount() + 1);
  }

  decrementCars() {
    if (this.carsCount() > 0) {
      this.carsCount.set(this.carsCount() - 1);
    }
  }

  calculateTotal(): number {
    const base = this.selectedPackage().price;
    const extraGuests = Math.max(0, this.guestsCount() - 1) * 200;
    const carsFee = this.carsCount() * 150;
    return base + extraGuests + carsFee;
  }

  purchasePass() {
    this.isPurchased.set(true);
    setTimeout(() => {
      this.isPurchased.set(false);
      this.close();
    }, 2800);
  }

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
    this.state.isQrPassModalOpen.set(false);
  }
}

