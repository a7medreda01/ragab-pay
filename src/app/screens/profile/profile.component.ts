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
    <div class="w-full h-full overflow-y-auto no-scrollbar pb-[max(7.5rem,calc(6.5rem+env(safe-area-inset-bottom,24px)))] font-arabic bg-slate-50 select-none">
      
      <!-- User Profile Header -->
      <div class="pt-5 pb-4 px-5 bg-white border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="relative">
            <img [src]="state.currentUser().avatar" alt="Avatar" class="w-12 h-12 rounded-full object-cover ring-2 ring-azure-100"/>
            <span class="absolute bottom-0 end-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center text-[8px] text-white">
              <i class="bi bi-check"></i>
            </span>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="text-xs font-black text-slate-900">{{ state.currentUser().name }}</h1>
              <span class="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold">موثق</span>
            </div>
            <span class="text-[10px] text-slate-400 block mt-0.5 font-sans" dir="ltr">{{ state.currentUser().phone }}</span>
            <span class="text-[9px] text-azure-600 font-semibold block">عضوية بلاتينية</span>
          </div>
        </div>

        <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 tap-bounce" title="الإعدادات">
          <i class="bi bi-gear text-sm"></i>
        </button>
      </div>

      <!-- Owner Portal Gateway Banner -->
      <div class="px-5 pt-3.5">
        <div
          (click)="state.switchToOwnerMode()"
          class="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-azure-950 to-slate-900 text-white shadow-md border border-azure-400/30 cursor-pointer tap-bounce relative overflow-hidden group"
        >
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center text-sm shadow-sm font-bold">
                <i class="bi bi-building"></i>
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h3 class="text-xs font-black text-white">بوابة المالك والمضيفين</h3>
                  <span class="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[8px] font-bold border border-amber-400/30">Host</span>
                </div>
                <p class="text-[10px] text-slate-300 mt-0.5">إدارة شاليهاتك، الحجوزات، وسحب الأرباح</p>
              </div>
            </div>
            <i class="bi bi-chevron-left text-white/70 text-xs"></i>
          </div>
        </div>
      </div>

      <!-- Bookings Section -->
      <div class="p-5">
        <div class="flex items-center justify-between mb-2.5">
          <h2 class="text-xs font-black text-slate-900">سجل الحجوزات</h2>
          <span class="text-[11px] text-slate-400">{{ state.bookings().length }} حجوزات</span>
        </div>

        <!-- Filter Tabs -->
        <div class="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-xl mb-3">
          @for (tab of bookingTabs; track tab.id) {
            <button
              (click)="selectedBookingTab.set(tab.id)"
              class="py-1.5 text-xs font-bold rounded-lg transition-all tap-bounce"
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
        <div class="space-y-2.5">
          @for (bk of filteredBookings(); track bk.id) {
            <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs flex flex-col gap-2">
              <div class="flex gap-2.5">
                <div class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <app-property-image [src]="bk.propertyImage" [alt]="bk.propertyTitle"></app-property-image>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold text-azure-600 font-sans">{{ bk.bookingRef }}</span>
                    <span
                      class="px-1.5 py-0.2 rounded-full text-[8px] font-bold"
                      [class.bg-emerald-50]="bk.status === 'upcoming'"
                      [class.text-emerald-700]="bk.status === 'upcoming'"
                      [class.bg-slate-100]="bk.status === 'completed'"
                      [class.text-slate-600]="bk.status === 'completed'"
                      [class.bg-rose-50]="bk.status === 'cancelled'"
                      [class.text-rose-700]="bk.status === 'cancelled'"
                    >
                      {{ bk.status === 'upcoming' ? 'قادم' : bk.status === 'completed' ? 'مكتمل' : 'ملغي' }}
                    </span>
                  </div>
                  <h4 class="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">{{ bk.propertyTitle }}</h4>
                  <p class="text-[10px] text-slate-400 mt-0.5">{{ bk.checkIn }} إلى {{ bk.checkOut }}</p>
                </div>
              </div>

              <div class="flex items-center justify-between pt-1.5 border-t border-slate-50 text-xs">
                <span class="font-black text-slate-900">{{ bk.totalPrice | number }} ج.م</span>

                <div class="flex items-center gap-1.5">
                  @if (bk.status === 'upcoming') {
                    <button
                      (click)="cancel(bk.id)"
                      class="text-rose-600 font-bold text-[10px] tap-bounce"
                    >
                      إلغاء
                    </button>
                  }
                  <button
                    (click)="openVoucher(bk)"
                    class="px-3 py-1 bg-slate-900 text-white rounded-full font-bold text-[10px] tap-bounce"
                  >
                    عرض القسيمة
                  </button>
                </div>
              </div>
            </div>
          }

          @if (filteredBookings().length === 0) {
            <div class="py-8 text-center text-xs text-slate-400 bg-white rounded-2xl p-4 border border-slate-100">
              لا توجد حجوزات في هذا التصنيف.
            </div>
          }
        </div>
      </div>

      <!-- Settings & Links -->
      <div class="px-5 pb-6">
        <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">الإعدادات والدعم</h3>
        <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
          <button (click)="state.isAuthOpen.set(true)" class="w-full p-3 flex items-center justify-between text-xs font-bold text-azure-700 bg-azure-50/40 hover:bg-azure-50 text-start tap-bounce">
            <span class="flex items-center gap-2">
              <i class="bi bi-box-arrow-in-right text-azure-600 text-sm"></i>
              <span>تسجيل الدخول / تبديل الحساب</span>
            </span>
            <i class="bi bi-chevron-left text-xs text-azure-600"></i>
          </button>
          
          <button (click)="openConcierge()" class="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 text-start tap-bounce">
            <span class="flex items-center gap-2">
              <i class="bi bi-headset text-azure-600 text-sm"></i>
              <span>كونسيرج الدعم المباشر</span>
            </span>
            <i class="bi bi-chevron-left text-xs text-slate-400"></i>
          </button>

          <button class="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 text-start tap-bounce">
            <span class="flex items-center gap-2">
              <i class="bi bi-shield-check text-emerald-600 text-sm"></i>
              <span>معايير الضمان الفندقي</span>
            </span>
            <i class="bi bi-chevron-left text-xs text-slate-400"></i>
          </button>

          <button class="w-full p-3 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 text-start tap-bounce">
            <span class="flex items-center gap-2">
              <i class="bi bi-translate text-sky-600 text-sm"></i>
              <span>اللغة والعملة (العربية - ج.م)</span>
            </span>
            <i class="bi bi-chevron-left text-xs text-slate-400"></i>
          </button>

          <button (click)="logout()" class="w-full p-3 flex items-center justify-between text-xs font-bold text-rose-600 hover:bg-rose-50 text-start tap-bounce">
            <span class="flex items-center gap-2">
              <i class="bi bi-box-arrow-right text-rose-600 text-sm"></i>
              <span>تسجيل الخروج</span>
            </span>
            <i class="bi bi-chevron-left text-xs text-rose-400"></i>
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
    if (confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) {
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
