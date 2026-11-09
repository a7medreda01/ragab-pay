import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../../components/property-image/property-image.component';
import { Booking } from '../../data/properties.data';

@Component({
  selector: 'app-profile-screen',
  standalone: true,
  imports: [CommonModule, PropertyImageComponent],
  template: `
    <div class="w-full h-full overflow-y-auto no-scrollbar pb-32 font-arabic bg-slate-50 select-none">
      <!-- User Profile Header -->
      <div class="pt-6 pb-5 px-5 bg-white border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="relative">
            <img [src]="state.currentUser().avatar" alt="Avatar" class="w-14 h-14 rounded-full object-cover ring-4 ring-azure-100"/>
            <span class="absolute bottom-0 end-0 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center text-[9px] text-white">✓</span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="text-xs font-black text-slate-900">{{ state.currentUser().name }}</h1>
              <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">عضو موثق</span>
            </div>
            <span class="text-xs text-slate-400 block mt-0.5 font-sans" dir="ltr">{{ state.currentUser().phone }}</span>
            <span class="text-[10px] text-azure-600 font-semibold block">عضوية بلاتينية منذ {{ state.currentUser().memberSince }}</span>
          </div>
        </div>

        <button class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 tap-bounce" title="الإعدادات">
          <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
      </div>

      <!-- Bookings Section Tabs -->
      <div class="p-5">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-black text-slate-900">سجل الحجوزات الفندقية</h2>
          <span class="text-xs text-slate-400">{{ state.bookings().length }} حجوزات</span>
        </div>

        <!-- Bookings Status Filter Tabs -->
        <div class="grid grid-cols-3 gap-2 bg-slate-200/70 p-1 rounded-2xl mb-4">
          @for (tab of bookingTabs; track tab.id) {
            <button
              (click)="selectedBookingTab.set(tab.id)"
              class="py-2 text-xs font-bold rounded-xl transition-all tap-bounce"
              [class.bg-white]="selectedBookingTab() === tab.id"
              [class.text-slate-900]="selectedBookingTab() === tab.id"
              [class.shadow-xs]="selectedBookingTab() === tab.id"
              [class.text-slate-500]="selectedBookingTab() !== tab.id"
            >
              {{ tab.label }}
            </button>
          }
        </div>

        <!-- Bookings List -->
        <div class="space-y-3">
          @for (bk of filteredBookings(); track bk.id) {
            <div class="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2.5">
              <div class="flex gap-3">
                <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <app-property-image [src]="bk.propertyImage" [alt]="bk.propertyTitle"></app-property-image>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold text-azure-600 font-sans">{{ bk.bookingRef }}</span>
                    <span
                      class="px-2 py-0.5 rounded-full text-[9px] font-bold"
                      [class.bg-emerald-50]="bk.status === 'upcoming'"
                      [class.text-emerald-700]="bk.status === 'upcoming'"
                      [class.bg-slate-100]="bk.status === 'completed'"
                      [class.text-slate-600]="bk.status === 'completed'"
                      [class.bg-rose-50]="bk.status === 'cancelled'"
                      [class.text-rose-700]="bk.status === 'cancelled'"
                    >
                      {{ bk.status === 'upcoming' ? 'مؤكد قادم' : bk.status === 'completed' ? 'مكتمل' : 'ملغي' }}
                    </span>
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">{{ bk.propertyTitle }}</h4>
                  <p class="text-[10px] text-slate-400 mt-0.5">{{ bk.checkIn }} إلى {{ bk.checkOut }} ({{ bk.rentalTypeArabic }})</p>
                </div>
              </div>

              <!-- Actions on booking -->
              <div class="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                <span class="font-black text-slate-900">{{ bk.totalPrice | number }} ج.م</span>

                <div class="flex items-center gap-2">
                  @if (bk.status === 'upcoming') {
                    <button
                      (click)="cancel(bk.id)"
                      class="text-rose-600 font-bold hover:underline text-[11px] tap-bounce"
                    >
                      إلغاء الحجز
                    </button>
                  }
                  <button
                    (click)="openVoucher(bk)"
                    class="px-3.5 py-1 bg-slate-900 text-white rounded-full font-bold text-[11px] tap-bounce"
                  >
                    عرض القسيمة
                  </button>
                </div>
              </div>
            </div>
          }

          @if (filteredBookings().length === 0) {
            <div class="py-10 text-center text-xs text-slate-400 bg-white rounded-2xl p-6 border border-slate-100">
              لا توجد حجوزات في هذا التصنيف حالياً.
            </div>
          }
        </div>
      </div>

      <!-- Settings & Support Links (Vector SVGs) -->
      <div class="px-5 pb-6">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">المساعدة والإعدادات</h3>
        <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
          <button (click)="state.isAuthOpen.set(true)" class="w-full p-3.5 flex items-center justify-between text-xs font-bold text-azure-700 bg-azure-50/50 hover:bg-azure-50 text-start tap-bounce">
            <span class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-azure-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
              تسجيل الدخول / تبديل الحساب أو دخول كزائر
            </span>
            <span class="text-azure-600">←</span>
          </button>
          <button (click)="openConcierge()" class="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 text-start tap-bounce">
            <span class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-azure-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
              كونسيرج Ragab Pay الفندقي (دعم 24/7)
            </span>
            <span class="text-slate-400">←</span>
          </button>
          <button class="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 text-start tap-bounce">
            <span class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              معايير الجودة والضمان الفندقي
            </span>
            <span class="text-slate-400">←</span>
          </button>
          <button class="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 text-start tap-bounce">
            <span class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              لغة التطبيق والعملة (العربية - ج.م)
            </span>
            <span class="text-slate-400">←</span>
          </button>
          <button (click)="logout()" class="w-full p-3.5 flex items-center justify-between text-xs font-bold text-rose-600 hover:bg-rose-50 text-start tap-bounce">
            <span class="flex items-center gap-2.5">
              <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              تسجيل الخروج
            </span>
            <span class="text-rose-400">←</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProfileScreenComponent {
  readonly state = inject(AppStateService);

  readonly selectedBookingTab = signal<'all' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');

  readonly bookingTabs = [
    { id: 'upcoming' as const, label: 'القادمة' },
    { id: 'completed' as const, label: 'السابقة' },
    { id: 'all' as const, label: 'الكل' }
  ];

  readonly filteredBookings = computed(() => {
    const tab = this.selectedBookingTab();
    const list = this.state.bookings();
    if (tab === 'all') return list;
    return list.filter(b => b.status === tab);
  });

  cancel(bookingId: string) {
    if (confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز الفندقي؟')) {
      this.state.cancelBooking(bookingId);
    }
  }

  openVoucher(bk: Booking) {
    this.state.lastCompletedBooking.set(bk);
    this.state.currentScreen.set('voucher');
  }

  openConcierge() {
    window.open('https://wa.me/201000001234?text=مرحباً، أحتاج مساعدة بخصوص حجوزاتي في Ragab Pay', '_blank');
  }

  logout() {
    this.state.currentScreen.set('welcome');
  }
}
