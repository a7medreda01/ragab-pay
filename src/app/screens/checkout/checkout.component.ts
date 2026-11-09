import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../../components/property-image/property-image.component';
import { Booking, Property } from '../../data/properties.data';

@Component({
  selector: 'app-checkout-screen',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyImageComponent],
  template: `
    @if (state.selectedProperty(); as prop) {
      <div class="relative w-full h-full overflow-y-auto no-scrollbar pb-32 font-arabic bg-slate-50 select-none">
        <!-- Header -->
        <div class="sticky top-0 z-20 px-5 py-3.5 bg-white/90 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between">
          <button
            (click)="goBack()"
            class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 tap-bounce"
          >
            <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-xs font-black text-slate-900">تأكيد الحجز والدفع - Ragab Pay</h1>
          <div class="w-9"></div>
        </div>

        <div class="p-5 space-y-5">
          <!-- Property Summary Card -->
          <div class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-3">
            <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
              <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <span class="text-[10px] text-azure-600 font-bold block">{{ prop.categoryArabic }}</span>
                <h3 class="text-xs font-bold text-slate-900 line-clamp-1">{{ prop.title }}</h3>
                <p class="text-[10px] text-slate-400 mt-0.5 truncate">{{ prop.village }}</p>
              </div>
              <span class="text-xs font-black text-slate-900">{{ currentRate() | number }} ج.م <span class="text-[10px] font-normal text-slate-400">/ {{ rentalUnitLabel() }}</span></span>
            </div>
          </div>

          <!-- Rental Duration Option (Only shown if property supports multiple durations) -->
          @if (prop.supportedRentalTypes.length > 1) {
            <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">نظام الإيجار المتاح للوحدة</h3>
              <div class="flex gap-1.5 bg-slate-100 p-1 rounded-2xl">
                @for (type of availableRentalTypes(prop); track type.id) {
                  <button
                    (click)="changeRentalType(type.id)"
                    class="flex-1 py-2 text-[11px] font-bold rounded-xl transition-all tap-bounce text-center"
                    [class.bg-white]="selectedRentalType === type.id"
                    [class.text-slate-900]="selectedRentalType === type.id"
                    [class.shadow-xs]="selectedRentalType === type.id"
                    [class.text-slate-500]="selectedRentalType !== type.id"
                  >
                    {{ type.label }}
                  </button>
                }
              </div>
            </div>
          } @else {
            <!-- Single duration notice if only 1 is supported (e.g. Daily only) -->
            <div class="p-3 bg-azure-50/70 border border-azure-100 rounded-2xl flex items-center justify-between text-xs">
              <span class="text-azure-900 font-bold">نظام الحجز المعتمد للوحدة:</span>
              <span class="px-3 py-1 bg-white text-azure-700 font-black rounded-full shadow-xs">
                إيجار {{ rentalUnitLabel() }} فقط
              </span>
            </div>
          }

          <!-- Duration Counter -->
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div class="flex items-center justify-between p-2.5 bg-azure-50/70 rounded-xl border border-azure-100">
              <span class="text-xs font-bold text-azure-900">المدة المطلوبة ({{ durationLabel() }}):</span>
              <div class="flex items-center gap-3">
                <button (click)="decrementDuration()" class="w-8 h-8 rounded-full bg-white text-azure-900 font-bold flex items-center justify-center shadow-xs tap-bounce text-base">-</button>
                <span class="text-sm font-black text-azure-950 font-sans w-6 text-center">{{ durationUnits() }}</span>
                <button (click)="incrementDuration()" class="w-8 h-8 rounded-full bg-white text-azure-900 font-bold flex items-center justify-center shadow-xs tap-bounce text-base">+</button>
              </div>
            </div>
          </div>

          <!-- Dynamic Date Synchronization -->
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">تواريخ استلام وتسليم الوحدة</h3>
            <div class="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label class="text-[11px] font-bold text-slate-600 block mb-1">تاريخ البدء (الوصول)</label>
                <input
                  type="date"
                  [(ngModel)]="checkInDate"
                  (ngModelChange)="onCheckInChange()"
                  class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                />
              </div>
              <div>
                <label class="text-[11px] font-bold text-slate-600 block mb-1">تاريخ الانتهاء (المغادرة)</label>
                <input
                  type="date"
                  [(ngModel)]="checkOutDate"
                  (ngModelChange)="onCheckOutChange()"
                  class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>
            <div class="flex items-center gap-1.5 text-[10px] text-azure-700 bg-azure-50 p-2 rounded-lg mt-2 font-medium">
              <span>ℹ️</span>
              <span>يتغير تاريخ الانتهاء تلقائياً بناءً على عدد {{ durationLabel() }} المحدد أعلاه.</span>
            </div>
          </div>

          <!-- Guests Stepper -->
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-900 block">عدد الأفراد أو الكوادر</span>
              <span class="text-[10px] text-slate-400 block">سعة الوحدة القصوى {{ prop.maxGuests }} فرد</span>
            </div>
            <div class="flex items-center gap-3">
              <button
                (click)="decrementGuests()"
                class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 tap-bounce"
              >
                -
              </button>
              <span class="text-xs font-black text-slate-900 w-4 text-center">{{ guestsCount() }}</span>
              <button
                (click)="incrementGuests(prop.maxGuests)"
                class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 tap-bounce"
              >
                +
              </button>
            </div>
          </div>

          <!-- Guest Contact Info & Company Name -->
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">بيانات النزيل أو الجهة المتعاقدة</h3>
            <div>
              <label class="text-[11px] font-bold text-slate-600 block mb-1">الاسم بالكامل أو اسم المسؤول</label>
              <input
                type="text"
                [(ngModel)]="guestName"
                class="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none"
              />
            </div>
            <div>
              <label class="text-[11px] font-bold text-slate-600 block mb-1">رقم الهاتف (لإرسال كود الدخول وواتساب)</label>
              <input
                type="tel"
                [(ngModel)]="guestPhone"
                class="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none"
                dir="ltr"
              />
            </div>
            @if (prop.isCorporateReady) {
              <div>
                <label class="text-[11px] font-bold text-azure-700 block mb-1">اسم الشركة / المؤسسة (لإصدار فاتورة ضريبية)</label>
                <input
                  type="text"
                  [(ngModel)]="companyName"
                  placeholder="مثال: شركة المقاولات الهندسية"
                  class="w-full text-xs p-2.5 bg-azure-50/50 rounded-xl border border-azure-200 outline-none"
                />
              </div>
            }
          </div>

          <!-- Payment Methods with Ragab Pay Priority -->
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">بوابة الدفع - Ragab Pay Gateway</h3>
            <div class="space-y-2">
              @for (method of paymentMethods; track method.id) {
                <div
                  (click)="selectedPaymentMethod = method.id"
                  class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all tap-bounce"
                  [class.bg-azure-50]="selectedPaymentMethod === method.id"
                  [class.border-azure-400]="selectedPaymentMethod === method.id"
                  [class.border-slate-200]="selectedPaymentMethod !== method.id"
                >
                  <div class="flex items-center gap-2.5">
                    <span class="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs shadow-xs border border-slate-100">
                      {{ method.badge }}
                    </span>
                    <div>
                      <span class="text-xs font-bold text-slate-800 block">{{ method.label }}</span>
                      <span class="text-[10px] text-slate-400 block">{{ method.sub }}</span>
                    </div>
                  </div>
                  <div
                    class="w-4 h-4 rounded-full border flex items-center justify-center"
                    [class.border-azure-600]="selectedPaymentMethod === method.id"
                    [class.bg-azure-600]="selectedPaymentMethod === method.id"
                  >
                    @if (selectedPaymentMethod === method.id) {
                      <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Price Calculation Breakdown -->
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2 text-xs">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">تفاصيل الفاتورة الرسمية</h3>
            <div class="flex justify-between py-1 text-slate-600">
              <span>{{ currentRate() | number }} ج.م × {{ durationUnits() }} {{ durationLabel() }}</span>
              <span class="font-bold text-slate-900">{{ baseStayPrice() | number }} ج.م</span>
            </div>
            <div class="flex justify-between py-1 text-slate-600">
              <span>رسوم التعقيم الفندقي والتجهيز</span>
              <span class="font-bold text-slate-900">{{ cleaningFee | number }} ج.م</span>
            </div>
            <div class="flex justify-between py-1 text-slate-600">
              <span>رسوم الخدمة وإشراف منصة Ragab Pay</span>
              <span class="font-bold text-slate-900">{{ serviceFee | number }} ج.م</span>
            </div>
            <div class="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
              <span class="font-extrabold text-slate-900">الإجمالي النهائي المطلوب</span>
              <span class="font-black text-azure-700 text-base">{{ totalPrice() | number }} ج.م</span>
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-start gap-2.5 p-2 text-xs text-slate-500">
            <input type="checkbox" [(ngModel)]="termsAccepted" id="terms" class="mt-0.5 rounded accent-azure-600"/>
            <label for="terms" class="cursor-pointer leading-relaxed">
              أوافق على سياسة الإلغاء المرنة وضوابط الإقامة الفندقية المعتمدة من منظومة <strong>Ragab Pay</strong>.
            </label>
          </div>
        </div>

        <!-- Sticky Bottom Checkout Action -->
        <div class="fixed bottom-0 inset-x-0 z-30 p-4 bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <div>
            <span class="text-xs text-slate-400 block">الإجمالي بالدفع</span>
            <span class="text-sm font-black text-slate-900">{{ totalPrice() | number }} ج.م</span>
          </div>

          <button
            (click)="submitBooking(prop)"
            [disabled]="!termsAccepted"
            class="px-8 py-3.5 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold text-xs rounded-full shadow-xl tap-bounce flex items-center gap-2"
          >
            <span>تأكيد الحجز والدفع عبر Ragab Pay</span>
            <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
        </div>
      </div>
    }
  `
})
export class CheckoutScreenComponent implements OnInit {
  readonly state = inject(AppStateService);

  selectedRentalType: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'daily';
  readonly durationUnits = signal<number>(3);

  checkInDate: string = '2026-11-20';
  checkOutDate: string = '2026-11-23';
  readonly guestsCount = signal<number>(4);

  guestName: string = this.state.currentUser().name;
  guestPhone: string = this.state.currentUser().phone;
  companyName: string = '';

  selectedPaymentMethod: string = 'ragabpay-card';
  termsAccepted: boolean = true;

  readonly allRentalTypes = [
    { id: 'daily' as const, label: 'يومي' },
    { id: 'weekly' as const, label: 'أسبوعي' },
    { id: 'monthly' as const, label: 'شهري' },
    { id: 'yearly' as const, label: 'سنوي' }
  ];

  readonly paymentMethods = [
    { id: 'ragabpay-card', label: 'بطاقة بنكية عبر Ragab Pay', sub: 'دفع مباشر ومشفر بالكامل (Visa / Mastercard)', badge: '💳' },
    { id: 'ragabpay-corp', label: 'Ragab Pay Corporate (عقود شركات)', sub: 'فواتير رسمية ودفع آجل للمؤسسات المسجلة', badge: '🏢' },
    { id: 'instapay', label: 'إنستاباي (InstaPay)', sub: 'تحويل لحظي فوري عبر البنك المركزي', badge: '⚡' },
    { id: 'vodafone', label: 'محفظة إلكترونية (فودافون كاش)', sub: 'سداد سريع برقم المحفظة', badge: '📱' },
    { id: 'fawry', label: 'فوري (Fawry Pay)', sub: 'سداد نقدي في أي منفذ برقم مرجعي', badge: '🏪' }
  ];

  ngOnInit() {
    const prop = this.state.selectedProperty();
    if (prop && prop.supportedRentalTypes && prop.supportedRentalTypes.length > 0) {
      this.selectedRentalType = prop.supportedRentalTypes[0];
      if (this.selectedRentalType === 'daily') {
        this.durationUnits.set(3);
      } else {
        this.durationUnits.set(1);
      }
    }
    this.updateCheckOutFromDuration();
  }

  availableRentalTypes(prop: Property) {
    return this.allRentalTypes.filter(t => prop.supportedRentalTypes.includes(t.id));
  }

  changeRentalType(type: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    this.selectedRentalType = type;
    if (type !== 'daily' && this.durationUnits() > 12) {
      this.durationUnits.set(1);
    }
    this.updateCheckOutFromDuration();
  }

  currentRate(): number {
    const prop = this.state.selectedProperty();
    if (!prop) return 0;
    if (this.selectedRentalType === 'weekly') return prop.pricePerWeek;
    if (this.selectedRentalType === 'monthly') return prop.pricePerMonth;
    if (this.selectedRentalType === 'yearly') return prop.pricePerYear;
    return prop.pricePerDay;
  }

  rentalUnitLabel(): string {
    if (this.selectedRentalType === 'weekly') return 'أسبوع';
    if (this.selectedRentalType === 'monthly') return 'شهر';
    if (this.selectedRentalType === 'yearly') return 'سنة';
    return 'ليلة';
  }

  durationLabel(): string {
    if (this.selectedRentalType === 'weekly') return 'أسابيع';
    if (this.selectedRentalType === 'monthly') return 'أشهر';
    if (this.selectedRentalType === 'yearly') return 'سنوات';
    return 'ليالٍ';
  }

  incrementDuration() {
    this.durationUnits.set(this.durationUnits() + 1);
    this.updateCheckOutFromDuration();
  }

  decrementDuration() {
    if (this.durationUnits() > 1) {
      this.durationUnits.set(this.durationUnits() - 1);
      this.updateCheckOutFromDuration();
    }
  }

  // Synchronize checkOutDate whenever duration or checkInDate changes
  updateCheckOutFromDuration() {
    try {
      const start = new Date(this.checkInDate);
      if (isNaN(start.getTime())) return;
      let daysToAdd = this.durationUnits();
      if (this.selectedRentalType === 'weekly') daysToAdd *= 7;
      if (this.selectedRentalType === 'monthly') daysToAdd *= 30;
      if (this.selectedRentalType === 'yearly') daysToAdd *= 365;

      const end = new Date(start.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      this.checkOutDate = end.toISOString().split('T')[0];
    } catch (e) {}
  }

  onCheckInChange() {
    this.updateCheckOutFromDuration();
  }

  // Synchronize durationUnits if user modifies checkOutDate manually
  onCheckOutChange() {
    try {
      const d1 = new Date(this.checkInDate);
      const d2 = new Date(this.checkOutDate);
      if (d2 <= d1) {
        this.updateCheckOutFromDuration();
        return;
      }
      const diffDays = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
      if (this.selectedRentalType === 'weekly') {
        this.durationUnits.set(Math.max(1, Math.round(diffDays / 7)));
      } else if (this.selectedRentalType === 'monthly') {
        this.durationUnits.set(Math.max(1, Math.round(diffDays / 30)));
      } else if (this.selectedRentalType === 'yearly') {
        this.durationUnits.set(Math.max(1, Math.round(diffDays / 365)));
      } else {
        this.durationUnits.set(diffDays);
      }
    } catch (e) {}
  }

  readonly cleaningFee = 800;
  readonly serviceFee = 600;

  readonly baseStayPrice = computed(() => {
    return this.currentRate() * this.durationUnits();
  });

  readonly totalPrice = computed(() => {
    return this.baseStayPrice() + this.cleaningFee + this.serviceFee;
  });

  incrementGuests(max: number) {
    if (this.guestsCount() < max) {
      this.guestsCount.set(this.guestsCount() + 1);
    }
  }

  decrementGuests() {
    if (this.guestsCount() > 1) {
      this.guestsCount.set(this.guestsCount() - 1);
    }
  }

  goBack() {
    this.state.currentScreen.set('details');
  }

  submitBooking(prop: any) {
    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyImage: prop.images[0],
      village: prop.village,
      rentalType: this.selectedRentalType,
      rentalTypeArabic: `إيجار ${this.rentalUnitLabel()} (${this.durationUnits()} ${this.durationLabel()})`,
      checkIn: this.checkInDate,
      checkOut: this.checkOutDate,
      durationUnits: this.durationUnits(),
      nightsCount: this.durationUnits(),
      guestsCount: this.guestsCount(),
      unitPrice: this.currentRate(),
      cleaningFee: this.cleaningFee,
      serviceFee: this.serviceFee,
      totalPrice: this.totalPrice(),
      status: 'upcoming',
      paymentMethod: this.paymentMethods.find(m => m.id === this.selectedPaymentMethod)?.label || 'Ragab Pay',
      bookingRef: '#RP-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().split('T')[0],
      guestName: this.guestName,
      guestPhone: this.guestPhone,
      companyName: this.companyName || undefined
    };

    this.state.confirmBooking(newBooking);
  }
}
