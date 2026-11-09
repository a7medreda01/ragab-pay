import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-vip-services-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (state.isVipServicesModalOpen()) {
      <div class="absolute inset-0 z-50 flex flex-col justify-end font-arabic">
        <!-- Backdrop Blur -->
        <div (click)="close()" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"></div>

        <!-- Sheet Modal -->
        <div
          (touchstart)="onSheetTouchStart($event)"
          (touchmove)="onSheetTouchMove($event)"
          (touchend)="onSheetTouchEnd($event)"
          [style.transform]="currentTranslateY > 0 ? 'translateY(' + currentTranslateY + 'px)' : ''"
          [style.transition]="isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)'"
          class="relative w-full max-h-[92%] bg-white rounded-t-[32px] shadow-2xl p-5 pt-2 flex flex-col overflow-y-auto no-scrollbar animate-slide-up"
        >
          <!-- Grabber -->
          <div class="w-full flex flex-col items-center justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing">
            <div class="w-10 h-1 bg-slate-300 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="flex items-center justify-between pb-2.5 pt-1 border-b border-slate-100">
            <div class="flex items-center gap-1.5">
              <i class="bi bi-gem text-amber-500 text-sm"></i>
              <h2 class="text-xs font-black text-slate-900">خدمات كبار الشخصيات (VIP)</h2>
            </div>
            <button
              (click)="close()"
              class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs tap-bounce"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- VIP Banner -->
          <div class="my-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white shadow-md border border-amber-500/30 flex items-center justify-between">
            <div>
              <span class="text-[9px] text-amber-300 font-bold uppercase tracking-wider block">VIP Concierge</span>
              <h3 class="text-xs font-black text-white mt-0.5">خدمات خاصة لراحتك</h3>
              <p class="text-[10px] text-white/70 mt-0.5 max-w-[200px]">
                فريق كونسيرج مخصص على مدار 24 ساعة.
              </p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg border border-amber-400/30">
              <i class="bi bi-crown"></i>
            </div>
          </div>

          <!-- VIP Services List -->
          <div class="space-y-2.5">
            @for (srv of vipServices; track srv.id) {
              <div class="p-3 rounded-xl border border-slate-200/90 bg-slate-50/60 flex flex-col gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-100 flex items-center justify-center text-azure-600 flex-shrink-0">
                    <i [class]="srv.icon + ' text-base'"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-bold text-slate-900">{{ srv.title }}</h4>
                    <p class="text-[10px] text-slate-500 leading-snug mt-0.5 truncate">{{ srv.desc }}</p>
                  </div>
                </div>

                <!-- Price and Action -->
                <div class="flex items-center justify-between pt-1.5 border-t border-slate-200/70">
                  <span class="text-xs font-black text-slate-900 font-sans">{{ srv.price }}</span>

                  <button
                    (click)="requestVipService(srv)"
                    class="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold tap-bounce flex items-center gap-1 shadow-2xs"
                  >
                    <span>طلب الخدمة</span>
                    <i class="bi bi-chevron-left text-[9px]"></i>
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Direct Concierge Button -->
          <div class="mt-4 pt-2">
            <button
              (click)="openConciergeDirect()"
              class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold tap-bounce flex items-center justify-center gap-1.5 shadow-sm"
            >
              <i class="bi bi-whatsapp"></i>
              <span>محادثة فورية مع الكونسيرج</span>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class VipServicesModalComponent {
  readonly state = inject(AppStateService);

  touchStartY = 0;
  currentTranslateY = 0;
  isDragging = false;

  readonly vipServices = [
    {
      id: 'limo',
      icon: 'bi bi-car-front-fill',
      title: 'ليموزين وسيارات فارهة',
      desc: 'استقبال بالمطار وتوصيل خاص بسيارات مرسيدس وسائق خاص.',
      price: '2,500 ج.م'
    },
    {
      id: 'chef',
      icon: 'bi bi-person-badge-fill',
      title: 'شيف خاص بالفيلا',
      desc: 'إعداد وجبات الغداء والعشاء والباربكيو داخل فيلتك.',
      price: '3,000 ج.م'
    },
    {
      id: 'yacht',
      icon: 'bi bi-water',
      title: 'يخوت وقوارب خاصة',
      desc: 'رحلات بحرية استثنائية مع كابتن وطاقم ضيافة متكامل.',
      price: '8,500 ج.م'
    },
    {
      id: 'security',
      icon: 'bi bi-shield-fill-check',
      title: 'حراسة وأمن شخصي',
      desc: 'طاقم حراسة مدرب يوفر الخصوصية والراحة التامة.',
      price: '2,000 ج.م'
    }
  ];

  close() {
    this.state.isVipServicesModalOpen.set(false);
  }

  requestVipService(srv: any) {
    const text = encodeURIComponent(`مرحباً كونسيرج Ragab Pay VIP، أود طلب خدمة: ${srv.title} (${srv.price})`);
    window.open(`https://wa.me/201001234567?text=${text}`, '_blank');
  }

  openConciergeDirect() {
    window.open('https://wa.me/201001234567?text=مرحباً كونسيرج Ragab Pay VIP، أحتاج إلى خدمة خاصة', '_blank');
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
    }
  }

  onSheetTouchEnd(e: TouchEvent) {
    this.isDragging = false;
    if (this.currentTranslateY > 100) {
      this.close();
    } else {
      this.currentTranslateY = 0;
    }
  }
}
