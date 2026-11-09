import { Component, inject, signal } from '@angular/core';
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
                <span class="text-sm">💎</span>
                <h2 class="text-sm font-black text-slate-900">خدمات كبار الشخصيات والكونسيرج (VIP)</h2>
              </div>
              <span class="text-[10px] text-slate-400">خدمات ضيافة وتسهيلات راقية بإشراف فريق Ragab Pay</span>
            </div>
            <button
              (click)="close()"
              class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs tap-bounce"
            >
              ✕
            </button>
          </div>

          <!-- VIP Banner -->
          <div class="my-4 p-4 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white shadow-lg border border-amber-500/30 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Executive Concierge 24/7</span>
              <h3 class="text-xs font-black text-white mt-0.5">خدمات مصممة خصيصاً لراحتك المطلقة</h3>
              <p class="text-[10px] text-white/70 mt-1 max-w-[220px]">
                فريق كونسيرج مخصص يرافقك طوال إقامتك لتلبية جميع متطلبات الرفاهية والخصوصية.
              </p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-2xl border border-amber-400/30">
              👑
            </div>
          </div>

          <!-- VIP Services List -->
          <div class="space-y-3">
            @for (srv of vipServices; track srv.id) {
              <div class="p-3.5 rounded-2xl border border-slate-200/90 hover:border-amber-400/80 bg-slate-50/60 transition-all flex flex-col gap-2.5">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-xl flex-shrink-0">
                      {{ srv.icon }}
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-slate-900">{{ srv.title }}</h4>
                      <p class="text-[10px] text-slate-500 leading-snug mt-0.5">{{ srv.desc }}</p>
                    </div>
                  </div>
                </div>

                <!-- Features Badges -->
                <div class="flex flex-wrap gap-1.5 pt-1">
                  @for (feat of srv.perks; track feat) {
                    <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[9px] font-bold">
                      ✓ {{ feat }}
                    </span>
                  }
                </div>

                <!-- Price and Action CTA -->
                <div class="flex items-center justify-between pt-2 border-t border-slate-200/70 mt-1">
                  <div>
                    <span class="text-xs font-black text-slate-900 block font-sans">{{ srv.price }}</span>
                    <span class="text-[9px] text-slate-400">{{ srv.unit }}</span>
                  </div>

                  <button
                    (click)="requestVipService(srv)"
                    class="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold tap-bounce flex items-center gap-1.5 shadow-sm"
                  >
                    <span>طلب الخدمة</span>
                    <span class="text-[10px]">✨</span>
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Direct Concierge Contact Button -->
          <div class="mt-4 pt-3 border-t border-slate-100">
            <button
              (click)="openConciergeDirect()"
              class="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-full shadow-lg tap-bounce flex items-center justify-center gap-2"
            >
              <span>محادثة فورية مع مدير الكونسيرج عبر واتساب</span>
              <span class="text-sm">💬</span>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class VipServicesModalComponent {
  readonly state = inject(AppStateService);

  // Drag-down to dismiss variables
  touchStartY = 0;
  currentTranslateY = 0;
  isDragging = false;

  readonly vipServices = [
    {
      id: 'limo',
      icon: '🚗',
      title: 'أسطول ليموزين وسيارات فارهة',
      desc: 'استقبال بالمطار وتوصيل خاص بأحدث سيارات مرسيدس S-Class أو كاديلاك مع سائق خاص يتحدث الإنجليزية.',
      price: '2,500 ج.م',
      unit: 'لكل رحلة شاملة المشروبات والإنترنت',
      perks: ['استقبال VIP بالمطار', 'سائق محترف خاص', 'إنترنت ومشروبات فندقية']
    },
    {
      id: 'chef',
      icon: '👨‍🍳',
      title: 'شيف فندقي خاص بالفيلا (Private Chef)',
      desc: 'طهاة محترفون 5 نجوم لإعداد وجبات الغداء والعشاء الطازجة وحفلات الباربكيو الخاصة داخل فيلتك.',
      price: '3,000 ج.م',
      unit: 'يومياً (شامل التجهيز والخدمة)',
      perks: ['مأكولات بحرية ومشويات', 'قائمة طعام مخصصة', 'تنظيف فندقي بعد الوجبات']
    },
    {
      id: 'yacht',
      icon: '🛥️',
      title: 'يخوت وقوارب خاصة (Private Yacht Charter)',
      desc: 'يخت فاخر 45 قدم مع كابتن وطاقم ضيافة متكامل لرحلات بحرية استثنائية لمشاهدة الغروب والسباحة.',
      price: '8,500 ج.م',
      unit: 'رحلة بحرية خاصة 4 ساعات',
      perks: ['طاقم كابتن معتمد', 'مشروبات وفواكه استوائية', 'أدوات غطس وسنوركلينج']
    },
    {
      id: 'security',
      icon: '🛡️',
      title: 'حراسة وأمن شخصي (Executive Bodyguard)',
      desc: 'طاقم حراسة محترف ومدرب يوفر الخصوصية والراحة التامة للنزيل وعائلته خلال فترة الإقامة.',
      price: '2,000 ج.م',
      unit: 'يومياً على مدار 24 ساعة',
      perks: ['حراسة 24/7', 'طاقم مرخص ومدرب', 'أقصى درجات الخصوصية']
    }
  ];

  requestVipService(srv: any) {
    const text = encodeURIComponent(`مرحباً كونسيرج Ragab Pay VIP، أود طلب خدمة: ${srv.title} (${srv.price})`);
    window.open(`https://wa.me/201001234567?text=${text}`, '_blank');
  }

  openConciergeDirect() {
    window.open('https://wa.me/201001234567?text=مرحباً كونسيرج Ragab Pay VIP، أحتاج إلى خدمة خاصة فورية', '_blank');
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
    this.state.isVipServicesModalOpen.set(false);
  }
}

