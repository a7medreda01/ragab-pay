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
      <div class="relative w-full h-full overflow-y-auto no-scrollbar pb-[max(8.5rem,calc(7.5rem+env(safe-area-inset-bottom,28px)))] font-arabic bg-slate-50 select-none">
        <!-- Header -->
        <div class="sticky top-0 z-20 px-5 py-3.5 bg-white/90 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between shadow-xs">
          <button
            (click)="goBack()"
            class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 tap-bounce hover:bg-slate-200 transition-colors"
          >
            <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-xs font-black text-slate-900">تأكيد الحجز والدفع - Ragab Pay</h1>
          <div class="w-9"></div>
        </div>

        <div class="p-5 space-y-4">
          <!-- Property Summary Card -->
          <div class="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex gap-3.5">
            <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-xs">
              <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>
            </div>
            <div class="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <span class="text-[10px] text-azure-600 font-bold block">{{ prop.categoryArabic }}</span>
                <h3 class="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">{{ prop.title }}</h3>
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
            <div class="p-3 bg-azure-50/70 border border-azure-100 rounded-2xl flex items-center justify-between text-xs">
              <span class="text-azure-900 font-bold">نظام الحجز المعتمد للوحدة:</span>
              <span class="px-3 py-1 bg-white text-azure-700 font-black rounded-full shadow-xs">
                إيجار {{ rentalUnitLabel() }} فقط
              </span>
            </div>
          }

          <!-- Duration Counter -->
          <div class="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
            <div class="flex items-center justify-between p-2.5 bg-azure-50/70 rounded-xl border border-azure-100">
              <span class="text-xs font-bold text-azure-900">المدة المطلوبة ({{ durationLabel() }}):</span>
              <div class="flex items-center gap-3">
                <button (click)="decrementDuration()" class="w-8 h-8 rounded-full bg-white text-azure-900 font-bold flex items-center justify-center shadow-xs tap-bounce text-base hover:bg-slate-50">-</button>
                <span class="text-sm font-black text-azure-950 font-sans w-6 text-center">{{ durationUnits() }}</span>
                <button (click)="incrementDuration()" class="w-8 h-8 rounded-full bg-white text-azure-900 font-bold flex items-center justify-center shadow-xs tap-bounce text-base hover:bg-slate-50">+</button>
              </div>
            </div>
          </div>

          <!-- Dynamic Date Synchronization -->
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">تواريخ استلام وتسليم الوحدة</h3>
            <div class="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label class="text-[11px] font-bold text-slate-600 block mb-1">تاريخ البدء (الوصول)</label>
                <input
                  type="date"
                  [(ngModel)]="checkInDate"
                  (ngModelChange)="onCheckInChange()"
                  class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-500"
                />
              </div>
              <div>
                <label class="text-[11px] font-bold text-slate-600 block mb-1">تاريخ الانتهاء (المغادرة)</label>
                <input
                  type="date"
                  [(ngModel)]="checkOutDate"
                  (ngModelChange)="onCheckOutChange()"
                  class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-500"
                />
              </div>
            </div>
            <div class="flex items-center gap-1.5 text-[10px] text-azure-700 bg-azure-50 p-2 rounded-lg mt-1.5 font-medium">
              <span>ℹ️</span>
              <span>يتغير تاريخ الانتهاء تلقائياً بناءً على عدد {{ durationLabel() }} المحدد أعلاه.</span>
            </div>
          </div>

          <!-- Guests Stepper -->
          <div class="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-900 block">عدد الأفراد أو الكوادر</span>
              <span class="text-[10px] text-slate-400 block">سعة الوحدة القصوى {{ prop.maxGuests }} فرد</span>
            </div>
            <div class="flex items-center gap-3">
              <button
                (click)="decrementGuests()"
                class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 tap-bounce hover:bg-slate-200"
              >
                -
              </button>
              <span class="text-xs font-black text-slate-900 w-4 text-center">{{ guestsCount() }}</span>
              <button
                (click)="incrementGuests(prop.maxGuests)"
                class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 tap-bounce hover:bg-slate-200"
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
                class="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-500"
              />
            </div>
            <div>
              <label class="text-[11px] font-bold text-slate-600 block mb-1">رقم الهاتف (لإرسال كود الدخول وواتساب)</label>
              <input
                type="tel"
                [(ngModel)]="guestPhone"
                class="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-500"
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
                  class="w-full text-xs p-2.5 bg-azure-50/50 rounded-xl border border-azure-200 outline-none focus:border-azure-500"
                />
              </div>
            }
          </div>

          <!-- STREAMLINED PAYMENT SYSTEM: Pay Now (Card) + Apple Pay -->
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div class="flex items-center justify-between mb-1">
              <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">طريقة السداد والدفع المعتمدة</h3>
              <span class="text-[10px] text-azure-600 font-bold bg-azure-50 px-2.5 py-0.5 rounded-full border border-azure-100">بوابة آمنة</span>
            </div>

            <!-- Option 1: دفع الآن (بطاقة بنكية مع حقول الإدخال الجاهزة) -->
            <div
              (click)="selectedPaymentMethod = 'card'"
              class="rounded-2xl border-2 transition-all p-3.5 cursor-pointer tap-bounce"
              [class.border-azure-600]="selectedPaymentMethod === 'card'"
              [class.bg-azure-50/40]="selectedPaymentMethod === 'card'"
              [class.border-slate-200]="selectedPaymentMethod !== 'card'"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-xs"
                    [class.bg-azure-600]="selectedPaymentMethod === 'card'"
                    [class.text-white]="selectedPaymentMethod === 'card'"
                    [class.bg-slate-100]="selectedPaymentMethod !== 'card'"
                    [class.text-slate-600]="selectedPaymentMethod !== 'card'"
                  >
                    💳
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-black text-slate-900">دفع الآن</span>
                      <span class="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded-md">Visa / MC</span>
                    </div>
                    <span class="text-[10px] text-slate-500 block mt-0.5">سداد مباشر ومحمي بتشفير بنكي مشدد</span>
                  </div>
                </div>

                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  [class.border-azure-600]="selectedPaymentMethod === 'card'"
                  [class.bg-azure-600]="selectedPaymentMethod === 'card'"
                  [class.border-slate-300]="selectedPaymentMethod !== 'card'"
                >
                  @if (selectedPaymentMethod === 'card') {
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  }
                </div>
              </div>

              <!-- Ready Input Fields for Card Details (Directly Below 'دفع الآن') -->
              @if (selectedPaymentMethod === 'card') {
                <div class="mt-4 pt-4 border-t border-azure-100/80 space-y-3" (click)="$event.stopPropagation()">
                  <!-- Card Number Input -->
                  <div>
                    <label class="text-[11px] font-bold text-slate-700 block mb-1 flex items-center justify-between">
                      <span>رقم البطاقة الائتمانية</span>
                      <span class="text-[10px] text-azure-600 font-normal">مدعوم ميزة، فيزا، ماستركارد</span>
                    </label>
                    <div class="relative">
                      <input
                        type="text"
                        [(ngModel)]="cardNumber"
                        placeholder="4532 •••• •••• 8942"
                        maxlength="19"
                        class="w-full text-xs font-sans tracking-widest font-bold p-2.5 ps-9 bg-white rounded-xl border border-slate-200 outline-none focus:border-azure-600 shadow-2xs"
                        dir="ltr"
                      />
                      <span class="absolute start-2.5 top-2.5 text-xs">💳</span>
                    </div>
                  </div>

                  <!-- Expiry & CVV in two columns -->
                  <div class="grid grid-cols-2 gap-2.5">
                    <div>
                      <label class="text-[10px] font-bold text-slate-700 block mb-1">تاريخ الصلاحية (MM/YY)</label>
                      <input
                        type="text"
                        [(ngModel)]="cardExpiry"
                        placeholder="12/28"
                        maxlength="5"
                        class="w-full text-xs font-sans font-bold p-2.5 text-center bg-white rounded-xl border border-slate-200 outline-none focus:border-azure-600 shadow-2xs"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label class="text-[10px] font-bold text-slate-700 block mb-1 flex items-center justify-between">
                        <span>رمز الأمان (CVV)</span>
                        <span class="text-[9px] text-slate-400">🔒 3 أرقام</span>
                      </label>
                      <input
                        type="password"
                        [(ngModel)]="cardCvv"
                        placeholder="•••"
                        maxlength="4"
                        class="w-full text-xs font-sans font-bold p-2.5 text-center bg-white rounded-xl border border-slate-200 outline-none focus:border-azure-600 shadow-2xs"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <!-- Cardholder Name -->
                  <div>
                    <label class="text-[10px] font-bold text-slate-700 block mb-1">اسم حامل البطاقة (كما هو مدون)</label>
                    <input
                      type="text"
                      [(ngModel)]="cardHolderName"
                      placeholder="AHMED MOHAMED"
                      class="w-full text-xs font-sans font-bold uppercase p-2.5 bg-white rounded-xl border border-slate-200 outline-none focus:border-azure-600 shadow-2xs"
                      dir="ltr"
                    />
                  </div>

                  <!-- Security Reassurance Pill -->
                  <div class="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded-xl font-medium border border-emerald-100">
                    <svg class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    <span>معاملة مشفرة بنكياً 256-Bit SSL تحت إشراف منظومة Ragab Pay</span>
                  </div>
                </div>
              }
            </div>

            <!-- Option 2: Apple Pay -->
            <div
              (click)="selectedPaymentMethod = 'apple-pay'"
              class="rounded-2xl border-2 transition-all p-3.5 cursor-pointer tap-bounce flex items-center justify-between"
              [class.border-slate-900]="selectedPaymentMethod === 'apple-pay'"
              [class.bg-slate-900/5]="selectedPaymentMethod === 'apple-pay'"
              [class.border-slate-200]="selectedPaymentMethod !== 'apple-pay'"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-sans font-bold text-sm shadow-xs">
                  
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-black text-slate-900">Apple Pay</span>
                    <span class="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold rounded-md">1-Tap</span>
                  </div>
                  <span class="text-[10px] text-slate-500 block mt-0.5">دفع لحظي فوري وسريع عبر بصمة الوجه Face ID</span>
                </div>
              </div>

              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                [class.border-slate-900]="selectedPaymentMethod === 'apple-pay'"
                [class.bg-slate-900]="selectedPaymentMethod === 'apple-pay'"
                [class.border-slate-300]="selectedPaymentMethod !== 'apple-pay'"
              >
                @if (selectedPaymentMethod === 'apple-pay') {
                  <div class="w-2 h-2 bg-white rounded-full"></div>
                }
              </div>
            </div>
          </div>

          <!-- Price Calculation Breakdown & PROMINENT GRAND TOTAL -->
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

            <!-- Highlighted Grand Total Card in Egyptian Pounds -->
            <div class="pt-3 mt-2 border-t border-slate-100 bg-gradient-to-r from-azure-50/80 to-sky-50/50 -mx-4 -mb-4 p-4 rounded-b-2xl flex justify-between items-center">
              <div>
                <span class="text-[11px] font-bold text-azure-900 block">المبلغ الإجمالي المطلوب سداده</span>
                <span class="text-[10px] text-slate-400">شامل الضرائب والخدمات الفندقية</span>
              </div>
              <div class="text-end">
                <span class="text-lg font-black text-azure-700 tracking-tight block">{{ totalPrice() | number }} ج.م</span>
              </div>
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

        <!-- Sticky Bottom Checkout Action with Total & CTA (Elevated Safely Above Mobile Browser Bars & Safari Address Bar) -->
        <div class="fixed bottom-0 inset-x-0 z-30 px-5 pt-3.5 pb-[max(2.5rem,calc(1.5rem+env(safe-area-inset-bottom,34px)))] bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-12px_32px_rgba(0,0,0,0.08)] flex items-center justify-between">
          <div>
            <span class="text-[11px] text-slate-400 block font-medium">الإجمالي المستحق</span>
            <span class="text-base font-black text-slate-900">{{ totalPrice() | number }} <span class="text-xs text-azure-600 font-bold">ج.م</span></span>
          </div>

          @if (selectedPaymentMethod === 'apple-pay') {
            <!-- Apple Pay Button -->
            <button
              (click)="submitBooking(prop)"
              [disabled]="!termsAccepted"
              class="px-8 py-3.5 bg-black hover:bg-neutral-900 disabled:bg-slate-300 text-white font-bold text-xs rounded-full shadow-xl tap-bounce flex items-center gap-2 transition-transform"
            >
              <span class="font-sans text-sm">Pay</span>
              <span>دفع سريع</span>
            </button>
          } @else {
            <!-- Direct Card Pay Button -->
            <button
              (click)="submitBooking(prop)"
              [disabled]="!termsAccepted"
              class="px-7 py-3.5 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold text-xs rounded-full shadow-xl tap-bounce flex items-center gap-2 transition-transform"
            >
              <span>دفع الآن ({{ totalPrice() | number }} ج.م)</span>
              <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          }
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

  // Streamlined payment method: 'card' (دفع الآن) or 'apple-pay'
  selectedPaymentMethod: 'card' | 'apple-pay' = 'card';
  cardNumber: string = '4532 8900 1234 8942';
  cardExpiry: string = '12/28';
  cardCvv: string = '382';
  cardHolderName: string = 'AHMED MOHAMED';

  termsAccepted: boolean = true;

  readonly allRentalTypes = [
    { id: 'daily' as const, label: 'يومي' },
    { id: 'weekly' as const, label: 'أسبوعي' },
    { id: 'monthly' as const, label: 'شهري' },
    { id: 'yearly' as const, label: 'سنوي' }
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
    const paymentLabel = this.selectedPaymentMethod === 'apple-pay' ? 'Apple Pay (Pay)' : 'دفع الآن بالبطاقة (Visa/MC)';

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
      paymentMethod: paymentLabel,
      bookingRef: '#RP-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().split('T')[0],
      guestName: this.guestName,
      guestPhone: this.guestPhone,
      companyName: this.companyName || undefined
    };

    this.state.confirmBooking(newBooking);
  }
}
