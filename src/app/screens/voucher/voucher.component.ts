import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../../components/property-image/property-image.component';

@Component({
  selector: 'app-voucher-screen',
  standalone: true,
  imports: [CommonModule, PropertyImageComponent],
  template: `
    @if (state.lastCompletedBooking(); as booking) {
      <div class="relative w-full h-full overflow-y-auto no-scrollbar pb-12 font-arabic bg-slate-900 text-white select-none">
        <!-- Top Success Celebration -->
        <div class="pt-12 pb-6 px-6 text-center">
          <!-- Animated Checkmark Circle -->
          <div class="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          <h1 class="text-xl font-black text-white">تم تأكيد حجزك بنجاح!</h1>
          <p class="text-xs text-white/70 mt-1 max-w-xs mx-auto">
            تم إرسال إيصال الحجز وكود الدخول الفندقي إلى هاتفك وبريدك الإلكتروني.
          </p>
        </div>

        <!-- Digital Glass Voucher Card -->
        <div class="px-5">
          <div class="glass-panel-dark rounded-[32px] p-5 shadow-2xl relative border border-white/20">
            <!-- Cutout Circles for Ticket Look -->
            <div class="absolute -start-3 top-48 w-6 h-6 rounded-full bg-slate-900 border-r border-white/20"></div>
            <div class="absolute -end-3 top-48 w-6 h-6 rounded-full bg-slate-900 border-l border-white/20"></div>

            <!-- Property Preview -->
            <div class="flex items-center gap-3 pb-4 border-b border-white/10">
              <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <app-property-image [src]="booking.propertyImage" [alt]="booking.propertyTitle"></app-property-image>
              </div>
              <div class="min-w-0">
                <span class="text-[10px] text-azure-400 font-bold block">قسيمة إقامة فندقية معتمدة</span>
                <h3 class="text-xs font-bold text-white line-clamp-1">{{ booking.propertyTitle }}</h3>
                <span class="text-[10px] text-white/60 block truncate">{{ booking.village }}</span>
              </div>
            </div>

            <!-- Booking Details Grid -->
            <div class="py-4 space-y-3 text-xs border-b border-dashed border-white/20">
              <div class="flex justify-between">
                <span class="text-white/60">رقم الحجز المرجعي:</span>
                <span class="font-extrabold text-azure-300 font-sans tracking-wider">{{ booking.bookingRef }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">اسم النزيل:</span>
                <span class="font-bold text-white">{{ booking.guestName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">تواريخ الإقامة:</span>
                <span class="font-bold text-white">{{ booking.checkIn }} إلى {{ booking.checkOut }} ({{ booking.rentalTypeArabic }})</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">طريقة الدفع:</span>
                <span class="font-bold text-emerald-400">{{ booking.paymentMethod }} (مدفوع)</span>
              </div>
              <div class="flex justify-between pt-1">
                <span class="text-white/60">المبلغ الإجمالي:</span>
                <span class="font-black text-white text-sm">{{ booking.totalPrice | number }} ج.م</span>
              </div>
            </div>

            <!-- Simulated QR Code for Reception Check-in -->
            <div class="pt-5 text-center flex flex-col items-center">
              <div class="p-3 bg-white rounded-2xl shadow-inner mb-2 inline-block">
                <!-- SVG QR Pattern -->
                <svg class="w-28 h-28 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M10 10h30v30h-30z M15 15h20v20h-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15h20v20h-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65h20v20h-20z M20 70h10v10h-10z M50 15h5v5h-5z M50 30h5v15h-5z M60 55h15v5h-15z M80 60h10v15h-10z M50 70h20v5h-20z M75 80h15v10h-15z"/>
                </svg>
              </div>
              <span class="text-[10px] text-white/50 block">أظهر هذا الرمز لمسؤول الاستقبال الفندقي عند الوصول</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-5 mt-6 space-y-3">
          <button
            (click)="openWhatsAppConcierge(booking)"
            class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-lg flex items-center justify-center gap-2 tap-bounce"
          >
            <span>💬 تواصل مع كونسيرج Ragab Pay عبر واتساب</span>
          </button>

          <button
            (click)="returnHome()"
            class="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-full border border-white/20 tap-bounce"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    }
  `
})
export class VoucherScreenComponent {
  readonly state = inject(AppStateService);

  openWhatsAppConcierge(booking: any) {
    const text = `مرحباً كونسيرج Ragab Pay، أنا النزيل ${booking.guestName} برقم الحجز ${booking.bookingRef} بخصوص الإقامة في ${booking.propertyTitle}`;
    window.open(`https://wa.me/201000001234?text=${encodeURIComponent(text)}`, '_blank');
  }

  returnHome() {
    this.state.currentScreen.set('main');
    this.state.activeTab.set('home');
  }
}

