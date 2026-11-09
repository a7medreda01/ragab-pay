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
      <div class="relative w-full h-full overflow-y-auto no-scrollbar pb-10 font-arabic bg-slate-900 text-white select-none">
        
        <!-- Success Celebration -->
        <div class="pt-10 pb-5 px-6 text-center">
          <div class="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-2.5 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
            <i class="bi bi-check2 text-2xl"></i>
          </div>

          <h1 class="text-lg font-black text-white">تم تأكيد الحجز بنجاح</h1>
          <p class="text-[11px] text-white/70 mt-0.5">
            تم إرسال إيصال الحجز وكود الدخول إلى هاتفك.
          </p>
        </div>

        <!-- Voucher Card -->
        <div class="px-5">
          <div class="glass-panel-dark rounded-3xl p-4 shadow-xl relative border border-white/20">
            <div class="flex items-center gap-2.5 pb-3 border-b border-white/10">
              <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <app-property-image [src]="booking.propertyImage" [alt]="booking.propertyTitle"></app-property-image>
              </div>
              <div class="min-w-0">
                <span class="text-[9px] text-azure-400 font-bold block">قسيمة إقامة معتمدة</span>
                <h3 class="text-xs font-bold text-white line-clamp-1">{{ booking.propertyTitle }}</h3>
                <span class="text-[10px] text-white/60 block truncate">{{ booking.village }}</span>
              </div>
            </div>

            <!-- Booking Details Grid -->
            <div class="py-3 space-y-2 text-xs border-b border-dashed border-white/20">
              <div class="flex justify-between">
                <span class="text-white/60">رقم الحجز:</span>
                <span class="font-bold text-azure-300 font-sans tracking-wider">{{ booking.bookingRef }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">الاسم:</span>
                <span class="font-bold text-white">{{ booking.guestName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">الفترة:</span>
                <span class="font-bold text-white font-sans">{{ booking.checkIn }} إلى {{ booking.checkOut }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/60">الدفع:</span>
                <span class="font-bold text-emerald-400">مدفوع بالكامل</span>
              </div>
              <div class="flex justify-between pt-1">
                <span class="text-white/60">الإجمالي:</span>
                <span class="font-black text-white text-sm">{{ booking.totalPrice | number }} ج.م</span>
              </div>
            </div>

            <!-- Simulated QR Code -->
            <div class="pt-4 text-center flex flex-col items-center">
              <div class="p-2.5 bg-white rounded-xl shadow-inner mb-1.5 inline-block">
                <svg class="w-24 h-24 text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M10 10h30v30h-30z M15 15h20v20h-20z M20 20h10v10h-10z M60 10h30v30h-30z M65 15h20v20h-20z M70 20h10v10h-10z M10 60h30v30h-30z M15 65h20v20h-20z M20 70h10v10h-10z M50 15h5v5h-5z M50 30h5v15h-5z M60 55h15v5h-15z M80 60h10v15h-10z M50 70h20v5h-20z M75 80h15v10h-15z"/>
                </svg>
              </div>
              <span class="text-[9px] text-white/50 block">رمز الدخول الفندقي السريع</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-5 mt-5 space-y-2">
          <button
            (click)="openWhatsAppConcierge(booking)"
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-md flex items-center justify-center gap-1.5 tap-bounce"
          >
            <i class="bi bi-whatsapp"></i>
            <span>تواصل عبر واتساب</span>
          </button>

          <button
            (click)="returnHome()"
            class="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-full border border-white/20 tap-bounce"
          >
            الرئيسية
          </button>
        </div>
      </div>
    }
  `
})
export class VoucherScreenComponent {
  readonly state = inject(AppStateService);

  openWhatsAppConcierge(booking: any) {
    const text = encodeURIComponent(`مرحباً كونسيرج Ragab Pay، بخصوص حجزي رقم: ${booking.bookingRef} في ${booking.propertyTitle}`);
    window.open(`https://wa.me/201001234567?text=${text}`, '_blank');
  }

  returnHome() {
    this.state.navigateToTab('home');
  }
}
