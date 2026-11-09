import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService, PayoutTransaction } from '../../services/app-state.service';
import { PropertyImageComponent } from '../../components/property-image/property-image.component';
import { Property } from '../../data/properties.data';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyImageComponent],
  template: `
    <div class="relative w-full h-full overflow-y-auto no-scrollbar pb-[max(7rem,calc(6rem+env(safe-area-inset-bottom,24px)))] font-arabic bg-slate-50 select-none">
      
      <!-- Top Sticky App Bar for Owner -->
      <div class="sticky top-0 z-30 px-5 pt-3.5 pb-3 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 text-white flex items-center justify-between shadow-lg">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-azure-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            RP
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="text-xs font-black text-white">بوابة المالك والمضيفين</h1>
              <span class="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">Host</span>
            </div>
            <span class="text-[9px] text-azure-300 font-sans block">Ragab Pay Owner Portal</span>
          </div>
        </div>

        <!-- Quick Switch to Guest Mode Button -->
        <button
          (click)="switchToGuest()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold border border-white/15 tap-bounce transition-colors"
          title="الرجوع إلى وضع النزيل وتصفح الوحدات"
        >
          <span>🔄</span>
          <span>وضع النزيل</span>
        </button>
      </div>

      <!-- Owner Profile & Host Status Header Card -->
      <div class="p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-azure-950 text-white border-b border-white/10 shadow-md">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <img
                [src]="state.currentUser().avatar"
                alt="Owner Avatar"
                class="w-13 h-13 rounded-full object-cover ring-3 ring-azure-500 shadow-md"
              />
              <span class="absolute -bottom-0.5 -end-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] ring-2 ring-slate-900">✓</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-sm font-black text-white">{{ state.currentUser().name }}</h2>
              </div>
              <span class="text-[10px] text-amber-300 font-bold block mt-0.5">⭐️ مضيف سوبر معتمد (Superhost)</span>
              <span class="text-[9px] text-white/50 block font-sans" dir="ltr">{{ state.currentUser().phone }}</span>
            </div>
          </div>

          <!-- Add Unit Quick Button -->
          <button
            (click)="openAddModal()"
            class="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-azure-600 to-sky-500 hover:from-azure-700 hover:to-sky-600 text-white text-xs font-bold shadow-md shadow-azure-600/30 tap-bounce flex items-center gap-1.5 transition-all"
          >
            <span>+</span>
            <span>إضافة وحدة</span>
          </button>
        </div>

        <!-- Metric KPI Cards Grid -->
        <div class="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/10">
          <div class="bg-white/5 p-2 rounded-2xl text-center border border-white/5">
            <span class="text-[9px] text-white/60 block">أرباح الشهر</span>
            <span class="text-xs font-black text-emerald-400 font-sans mt-0.5 block">185,000</span>
            <span class="text-[8px] text-white/40 block">ج.م</span>
          </div>

          <div class="bg-white/5 p-2 rounded-2xl text-center border border-white/5">
            <span class="text-[9px] text-white/60 block">نسبة الإشغال</span>
            <span class="text-xs font-black text-azure-400 font-sans mt-0.5 block">88%</span>
            <span class="text-[8px] text-white/40 block">مرتفع</span>
          </div>

          <div class="bg-white/5 p-2 rounded-2xl text-center border border-white/5">
            <span class="text-[9px] text-white/60 block">الشاليهات</span>
            <span class="text-xs font-black text-amber-400 font-sans mt-0.5 block">{{ myProperties().length }}</span>
            <span class="text-[8px] text-white/40 block">وحدات</span>
          </div>

          <div class="bg-white/5 p-2 rounded-2xl text-center border border-white/5">
            <span class="text-[9px] text-white/60 block">التقييم</span>
            <span class="text-xs font-black text-amber-300 font-sans mt-0.5 block">4.95 ★</span>
            <span class="text-[8px] text-white/40 block">ممتاز</span>
          </div>
        </div>
      </div>

      <!-- Segmented Sub-Navigation Tabs (Apple iOS Style) -->
      <div class="sticky top-[58px] z-20 px-5 py-2.5 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs">
        <div class="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            (click)="activeSubTab.set('units')"
            class="py-2 text-[11px] font-bold rounded-xl transition-all tap-bounce text-center truncate"
            [class.bg-white]="activeSubTab() === 'units'"
            [class.text-slate-900]="activeSubTab() === 'units'"
            [class.shadow-xs]="activeSubTab() === 'units'"
            [class.text-slate-500]="activeSubTab() !== 'units'"
          >
            🏡 وحداتي
          </button>

          <button
            (click)="activeSubTab.set('calendar')"
            class="py-2 text-[11px] font-bold rounded-xl transition-all tap-bounce text-center truncate"
            [class.bg-white]="activeSubTab() === 'calendar'"
            [class.text-slate-900]="activeSubTab() === 'calendar'"
            [class.shadow-xs]="activeSubTab() === 'calendar'"
            [class.text-slate-500]="activeSubTab() !== 'calendar'"
          >
            📅 التقويم
          </button>

          <button
            (click)="activeSubTab.set('bookings')"
            class="py-2 text-[11px] font-bold rounded-xl transition-all tap-bounce text-center truncate relative"
            [class.bg-white]="activeSubTab() === 'bookings'"
            [class.text-slate-900]="activeSubTab() === 'bookings'"
            [class.shadow-xs]="activeSubTab() === 'bookings'"
            [class.text-slate-500]="activeSubTab() !== 'bookings'"
          >
            📑 الحجوزات
            @if (activeBookings().length > 0) {
              <span class="w-1.5 h-1.5 rounded-full bg-azure-600 inline-block align-middle ms-0.5"></span>
            }
          </button>

          <button
            (click)="activeSubTab.set('earnings')"
            class="py-2 text-[11px] font-bold rounded-xl transition-all tap-bounce text-center truncate"
            [class.bg-white]="activeSubTab() === 'earnings'"
            [class.text-slate-900]="activeSubTab() === 'earnings'"
            [class.shadow-xs]="activeSubTab() === 'earnings'"
            [class.text-slate-500]="activeSubTab() !== 'earnings'"
          >
            💰 الأرباح
          </button>
        </div>
      </div>

      <!-- MAIN TAB CONTENT CONTAINER -->
      <div class="p-5">

        <!-- ============================================== -->
        <!-- TAB 1: وحداتي وشاليهاتي (My Properties) -->
        <!-- ============================================== -->
        @if (activeSubTab() === 'units') {
          <div class="space-y-4 animate-fade-in">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xs font-black text-slate-900">شاليهاتي والوحدات المدارة</h3>
                <span class="text-[10px] text-slate-400">إدارة الأسعار، التوافر، وحالة التجهيز الفندقي</span>
              </div>
              <span class="text-xs font-bold text-azure-600 bg-azure-50 px-2.5 py-1 rounded-full border border-azure-100">
                {{ myProperties().length }} وحدات
              </span>
            </div>

            <!-- Property Cards -->
            <div class="space-y-3.5">
              @for (prop of myProperties(); track prop.id) {
                <div class="bg-white rounded-3xl p-3.5 border border-slate-200/80 shadow-sm flex flex-col gap-3">
                  <div class="flex gap-3">
                    <div class="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-2xs">
                      <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>
                      <span class="absolute top-1.5 start-1.5 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[9px] font-bold backdrop-blur-xs">
                        {{ prop.categoryArabic }}
                      </span>
                    </div>

                    <div class="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div class="flex items-center justify-between">
                          <span class="text-[10px] text-azure-600 font-bold">{{ prop.village }}</span>
                          <span class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>نشطة ومتاحة</span>
                          </span>
                        </div>
                        <h4 class="text-xs font-black text-slate-900 truncate mt-0.5">{{ prop.title }}</h4>
                        <div class="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                          <span>{{ prop.bedrooms }} غرف نوم</span>
                          <span>•</span>
                          <span>{{ prop.bathrooms }} حمام</span>
                          <span>•</span>
                          <span class="text-amber-500 font-bold">★ {{ prop.rating }}</span>
                        </div>
                      </div>

                      <div class="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span class="text-xs font-black text-slate-900 font-sans">
                          {{ prop.pricePerDay | number }} ج.م <span class="text-[9px] font-normal text-slate-400">/ ليلة</span>
                        </span>
                        <span class="text-[10px] text-slate-400 font-sans">
                          {{ prop.blockedDates.length }} أيام محظورة
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Property Quick Action Buttons -->
                  <div class="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <button
                      (click)="openCalendarForUnit(prop)"
                      class="py-2 px-3 rounded-xl bg-azure-50 hover:bg-azure-100 text-azure-700 text-xs font-bold tap-bounce transition-colors flex items-center justify-center gap-1.5 border border-azure-100"
                    >
                      <span>📅</span>
                      <span>تقويم الحجوزات</span>
                    </button>

                    <button
                      (click)="openEditModal(prop)"
                      class="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold tap-bounce transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>✏️</span>
                      <span>تعديل الأسعار</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ============================================== -->
        <!-- TAB 2: تقويم الحجوزات والتواريخ المحظورة (Interactive Calendar) -->
        <!-- ============================================== -->
        @if (activeSubTab() === 'calendar') {
          <div class="space-y-4 animate-fade-in">
            <!-- Property Selector Strip -->
            <div>
              <label class="text-[11px] font-bold text-slate-500 block mb-1.5">اختر الشاليه أو الوحدة لعرض وتعديل التوافر:</label>
              <div class="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                @for (prop of myProperties(); track prop.id) {
                  <button
                    (click)="selectedCalendarPropertyId.set(prop.id)"
                    class="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap tap-bounce border transition-all"
                    [class.bg-slate-900]="selectedCalendarPropertyId() === prop.id"
                    [class.text-white]="selectedCalendarPropertyId() === prop.id"
                    [class.border-slate-900]="selectedCalendarPropertyId() === prop.id"
                    [class.bg-white]="selectedCalendarPropertyId() !== prop.id"
                    [class.text-slate-700]="selectedCalendarPropertyId() !== prop.id"
                    [class.border-slate-200]="selectedCalendarPropertyId() !== prop.id"
                  >
                    {{ prop.title.split('-')[0] }}
                  </button>
                }
              </div>
            </div>

            <!-- Calendar Container Card -->
            <div class="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-3.5">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 class="text-xs font-black text-slate-900">نوفمبر / ديسمبر 2026</h3>
                  <span class="text-[10px] text-slate-400">انقر على أي يوم لقفله أو فتحه للحجز فوراً</span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    🔒 {{ currentCalendarProp() ? currentCalendarProp()!.blockedDates.length : 0 }} محظور
                  </span>
                </div>
              </div>

              <!-- Calendar Legend -->
              <div class="flex items-center justify-between text-[10px] text-slate-500 px-1">
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>متاح للحجز</span>
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-azure-600"></span>
                  <span>محجوز لنزيل</span>
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span>محظور / مغلق</span>
                </span>
              </div>

              <!-- Days of the week header -->
              <div class="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
                <span>س</span>
                <span>ح</span>
                <span>ن</span>
                <span>ث</span>
                <span>ر</span>
                <span>خ</span>
                <span>ج</span>
              </div>

              <!-- Interactive Days Grid -->
              <div class="grid grid-cols-7 gap-1.5">
                @for (day of calendarDays; track day.dateStr) {
                  <button
                    (click)="toggleDayBlock(day.dateStr)"
                    class="h-11 rounded-2xl flex flex-col items-center justify-center p-1 tap-bounce transition-all relative"
                    [class.bg-azure-600]="isDateBooked(day.dateStr)"
                    [class.text-white]="isDateBooked(day.dateStr)"
                    [class.bg-slate-200]="isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                    [class.text-slate-600]="isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                    [class.bg-white]="!isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                    [class.border]="!isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                    [class.border-slate-200]="!isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                    [class.text-slate-900]="!isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                    [title]="day.dateStr"
                  >
                    <span class="text-xs font-black font-sans leading-none">{{ day.dayNumber }}</span>
                    @if (isDateBooked(day.dateStr)) {
                      <span class="text-[7px] text-white/90 font-bold block mt-0.5">محجوز</span>
                    } @else if (isDateBlocked(day.dateStr)) {
                      <span class="text-[7px] text-slate-500 font-bold block mt-0.5">🔒 مغلق</span>
                    } @else {
                      <span class="text-[7px] text-emerald-600 font-bold block mt-0.5">متاح</span>
                    }
                  </button>
                }
              </div>

              <!-- Fast Calendar Tools -->
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span class="text-[10px] text-slate-400">تحكم سريع بالتواريخ:</span>
                <div class="flex gap-2">
                  <button
                    (click)="blockWeekend()"
                    class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold tap-bounce"
                  >
                    حظر الويكند
                  </button>
                  <button
                    (click)="unblockAll()"
                    class="px-2.5 py-1 rounded-xl bg-azure-50 hover:bg-azure-100 text-azure-700 text-[10px] font-bold tap-bounce"
                  >
                    فتح كل الأيام
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- ============================================== -->
        <!-- TAB 3: حجوزات النزلاء (Guest Bookings) -->
        <!-- ============================================== -->
        @if (activeSubTab() === 'bookings') {
          <div class="space-y-4 animate-fade-in">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xs font-black text-slate-900">سجل حجوزات النزلاء</h3>
                <span class="text-[10px] text-slate-400">متابعة مواعيد الوصول، أرقام النزلاء، والأرباح</span>
              </div>
              <span class="text-xs font-bold text-azure-600 bg-azure-50 px-2.5 py-1 rounded-full border border-azure-100">
                {{ hostBookings.length }} حجز
              </span>
            </div>

            <!-- Bookings List -->
            <div class="space-y-3">
              @for (bk of hostBookings; track bk.id) {
                <div class="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-3">
                  <!-- Booking Header -->
                  <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div class="flex items-center gap-2.5">
                      <img [src]="bk.guestAvatar" alt="Guest" class="w-9 h-9 rounded-full object-cover ring-2 ring-azure-100"/>
                      <div>
                        <h4 class="text-xs font-bold text-slate-900">{{ bk.guestName }}</h4>
                        <span class="text-[10px] text-slate-400 font-sans" dir="ltr">{{ bk.guestPhone }}</span>
                      </div>
                    </div>
                    <span
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                      [class.bg-emerald-50]="bk.status === 'confirmed'"
                      [class.text-emerald-700]="bk.status === 'confirmed'"
                      [class.border-emerald-200]="bk.status === 'confirmed'"
                      [class.bg-azure-50]="bk.status === 'current'"
                      [class.text-azure-700]="bk.status === 'current'"
                      [class.border-azure-200]="bk.status === 'current'"
                    >
                      {{ bk.statusLabel }}
                    </span>
                  </div>

                  <!-- Property & Dates Details -->
                  <div class="space-y-1.5 text-xs text-slate-600">
                    <div class="flex justify-between">
                      <span class="text-slate-400">الوحدة المحجوزة:</span>
                      <span class="font-bold text-slate-900">{{ bk.propertyTitle }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-slate-400">تواريخ الإقامة:</span>
                      <span class="font-bold text-slate-900 font-sans">{{ bk.checkIn }} ← {{ bk.checkOut }} ({{ bk.nights }} ليالٍ)</span>
                    </div>
                    <div class="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span class="text-slate-400">صافي ربح المالك المستحق:</span>
                      <span class="text-sm font-black text-emerald-600 font-sans">{{ bk.netEarnings | number }} ج.م</span>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="grid grid-cols-2 gap-2 pt-1">
                    <button
                      (click)="openGuestWhatsApp(bk.guestPhone, bk.guestName, bk.propertyTitle)"
                      class="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold tap-bounce flex items-center justify-center gap-1.5 border border-emerald-200"
                    >
                      <span>💬</span>
                      <span>مراسلة واتساب</span>
                    </button>

                    <a
                      [href]="'tel:' + bk.guestPhone"
                      class="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold tap-bounce flex items-center justify-center gap-1.5"
                    >
                      <span>📞</span>
                      <span>اتصال مباشر</span>
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- ============================================== -->
        <!-- TAB 4: الأرباح والمحفظة وطلب السحب (Earnings & Payouts) -->
        <!-- ============================================== -->
        @if (activeSubTab() === 'earnings') {
          <div class="space-y-4 animate-fade-in">
            <!-- Luxury Gold/Navy Wallet Card -->
            <div class="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-azure-950 to-slate-900 text-white shadow-xl border border-azure-500/30 relative overflow-hidden">
              <div class="absolute -top-10 -end-10 w-40 h-40 bg-azure-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div class="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span class="text-[10px] text-azure-300 font-bold uppercase tracking-wider block">محفظة المالك المعتمدة</span>
                  <h3 class="text-xs font-black text-white">Ragab Pay Owner Wallet</h3>
                </div>
                <div class="w-8 h-8 rounded-xl bg-azure-500/20 border border-azure-400/30 flex items-center justify-center text-sm">
                  💳
                </div>
              </div>

              <!-- Available Balance -->
              <div class="my-4">
                <span class="text-[11px] text-white/70 block">الرصيد المتاح للسحب الفوري الآن</span>
                <div class="flex items-baseline gap-2 mt-1">
                  <span class="text-3xl font-black text-white font-sans tracking-tight">
                    {{ state.ownerEarnings().availableBalance | number }}
                  </span>
                  <span class="text-sm font-bold text-azure-300">جنيه مصري</span>
                </div>
              </div>

              <!-- Financial breakdown bar -->
              <div class="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-center">
                <div class="bg-white/5 p-2 rounded-2xl">
                  <span class="text-[9px] text-white/50 block">أرباح معلقة قيد المقاصة</span>
                  <span class="text-xs font-bold text-amber-300 font-sans mt-0.5 block">
                    {{ state.ownerEarnings().pendingBalance | number }} ج.م
                  </span>
                </div>
                <div class="bg-white/5 p-2 rounded-2xl">
                  <span class="text-[9px] text-white/50 block">إجمالي ما تم سحبه لحسابك</span>
                  <span class="text-xs font-bold text-emerald-400 font-sans mt-0.5 block">
                    {{ state.ownerEarnings().totalPaidOut | number }} ج.م
                  </span>
                </div>
              </div>

              <!-- Request Payout Button -->
              <button
                (click)="openPayoutModal()"
                class="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-lg tap-bounce flex items-center justify-center gap-2 transition-all"
              >
                <span>💸 طلب سحب الأرباح لحسابك البنكي أو InstaPay</span>
                <span class="rtl:rotate-180">›</span>
              </button>
            </div>

            <!-- Recent Earnings Transactions Ledger -->
            <div class="space-y-3 pt-1">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-black text-slate-900">سجل معاملات وأرباح الحجوزات</h4>
                <span class="text-[10px] text-slate-400">آخر التحويلات</span>
              </div>

              <div class="space-y-2">
                @for (tx of state.ownerEarnings().transactions; track tx.id) {
                  <div class="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-9 h-9 rounded-xl flex items-center justify-center text-sm shadow-xs"
                        [class.bg-emerald-50]="tx.amount > 0"
                        [class.text-emerald-600]="tx.amount > 0"
                        [class.bg-slate-100]="tx.amount <= 0"
                        [class.text-slate-600]="tx.amount <= 0"
                      >
                        {{ tx.amount > 0 ? '↓' : '↑' }}
                      </div>
                      <div>
                        <span class="text-xs font-bold text-slate-900 block">{{ tx.method }}</span>
                        <div class="flex items-center gap-2 text-[9px] text-slate-400 mt-0.5">
                          <span>{{ tx.destination }}</span>
                          <span>•</span>
                          <span class="font-sans">{{ tx.date }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="text-end">
                      <span class="text-xs font-black font-sans block text-emerald-600">
                        +{{ tx.amount | number }} ج.م
                      </span>
                      <span class="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                        {{ tx.status === 'completed' ? 'معتمد ومحول' : 'قيد المعالجة' }}
                      </span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

      </div>

      <!-- ============================================== -->
      <!-- MODAL 1: طلب سحب الأرباح (Payout Request Modal) -->
      <!-- ============================================== -->
      @if (isPayoutModalOpen()) {
        <div class="fixed inset-0 z-50 flex flex-col justify-end font-arabic">
          <div (click)="isPayoutModalOpen.set(false)" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md"></div>
          <div class="relative w-full bg-white rounded-t-[36px] shadow-2xl p-6 flex flex-col animate-slide-up">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4"></div>

            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-sm font-black text-slate-900">طلب سحب الأرباح الفندقية</h3>
                <span class="text-[10px] text-slate-400">الرصيد المتاح: {{ state.ownerEarnings().availableBalance | number }} ج.م</span>
              </div>
              <button (click)="isPayoutModalOpen.set(false)" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">✕</button>
            </div>

            <div class="space-y-3.5 my-4">
              <!-- Amount Input with Presets -->
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">المبلغ المطلوب سحبه (جنيه مصري)</label>
                <input
                  type="number"
                  [(ngModel)]="payoutAmount"
                  [max]="state.ownerEarnings().availableBalance"
                  class="w-full text-base font-black font-sans p-3 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:border-azure-600"
                />
                <!-- Preset percentage buttons -->
                <div class="flex gap-2 mt-2">
                  <button (click)="setPayoutPreset(0.25)" class="flex-1 py-1 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-600">25%</button>
                  <button (click)="setPayoutPreset(0.50)" class="flex-1 py-1 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-600">50%</button>
                  <button (click)="setPayoutPreset(1.00)" class="flex-1 py-1 bg-azure-50 rounded-xl text-[10px] font-bold text-azure-700">كامل الرصيد (100%)</button>
                </div>
              </div>

              <!-- Payout Method Selector -->
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1.5">طريقة استلام الأرباح:</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    (click)="selectedPayoutMethod = 'instapay'"
                    class="p-2.5 rounded-2xl border text-center transition-all tap-bounce"
                    [class.border-azure-600]="selectedPayoutMethod === 'instapay'"
                    [class.bg-azure-50]="selectedPayoutMethod === 'instapay'"
                    [class.border-slate-200]="selectedPayoutMethod !== 'instapay'"
                  >
                    <span class="text-sm block">⚡</span>
                    <span class="text-[10px] font-bold text-slate-900 block">InstaPay</span>
                  </button>

                  <button
                    (click)="selectedPayoutMethod = 'bank'"
                    class="p-2.5 rounded-2xl border text-center transition-all tap-bounce"
                    [class.border-azure-600]="selectedPayoutMethod === 'bank'"
                    [class.bg-azure-50]="selectedPayoutMethod === 'bank'"
                    [class.border-slate-200]="selectedPayoutMethod !== 'bank'"
                  >
                    <span class="text-sm block">🏦</span>
                    <span class="text-[10px] font-bold text-slate-900 block">حساب بنكي</span>
                  </button>

                  <button
                    (click)="selectedPayoutMethod = 'wallet'"
                    class="p-2.5 rounded-2xl border text-center transition-all tap-bounce"
                    [class.border-azure-600]="selectedPayoutMethod === 'wallet'"
                    [class.bg-azure-50]="selectedPayoutMethod === 'wallet'"
                    [class.border-slate-200]="selectedPayoutMethod !== 'wallet'"
                  >
                    <span class="text-sm block">📱</span>
                    <span class="text-[10px] font-bold text-slate-900 block">محفظة كاش</span>
                  </button>
                </div>
              </div>

              <!-- Account Details Input -->
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">
                  {{ selectedPayoutMethod === 'instapay' ? 'عنوان الدفع اللحظي (IPA) أو رقم الهاتف' : (selectedPayoutMethod === 'bank' ? 'رقم الحساب البنكي أو الآيبان (IBAN)' : 'رقم محفظة فودافون كاش') }}
                </label>
                <input
                  type="text"
                  [(ngModel)]="payoutDestination"
                  placeholder="مثال: ahmed@instapay أو 01001234567"
                  dir="ltr"
                  class="w-full text-xs font-sans font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                />
              </div>

              @if (payoutSuccess()) {
                <div class="p-3 bg-emerald-500 text-white rounded-2xl text-center animate-bounce">
                  <span class="text-xs font-bold block">🎉 تم تنفيذ طلب التحويل بنجاح!</span>
                  <span class="text-[10px] opacity-90 block mt-0.5">تم إرسال إشعار السداد لحسابك البنكي</span>
                </div>
              } @else {
                <button
                  (click)="submitPayout()"
                  [disabled]="payoutAmount <= 0 || payoutAmount > state.ownerEarnings().availableBalance"
                  class="w-full py-3 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold rounded-full shadow-lg tap-bounce"
                >
                  تأكيد سحب المبلغ ({{ payoutAmount | number }} ج.م)
                </button>
              }
            </div>
          </div>
        </div>
      }

      <!-- ============================================== -->
      <!-- MODAL 2: تعديل تفاصيل وأسعار الشاليه (Edit Property Modal) -->
      <!-- ============================================== -->
      @if (editingProp(); as prop) {
        <div class="fixed inset-0 z-50 flex flex-col justify-end font-arabic">
          <div (click)="editingProp.set(null)" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md"></div>
          <div class="relative w-full max-h-[90%] bg-white rounded-t-[36px] shadow-2xl p-6 flex flex-col overflow-y-auto no-scrollbar animate-slide-up">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3"></div>

            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-sm font-black text-slate-900">تعديل بيانات وأسعار الشاليه</h3>
              <button (click)="editingProp.set(null)" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">✕</button>
            </div>

            <div class="space-y-3.5 my-3">
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">عنوان الوحدة</label>
                <input
                  type="text"
                  [(ngModel)]="editTitle"
                  class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                />
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">السعر / ليلة (ج.م)</label>
                  <input
                    type="number"
                    [(ngModel)]="editPriceDay"
                    class="w-full text-xs font-sans font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">السعر / شهر (ج.م)</label>
                  <input
                    type="number"
                    [(ngModel)]="editPriceMonth"
                    class="w-full text-xs font-sans font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
              </div>

              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">الوصف والمزايا</label>
                <textarea
                  [(ngModel)]="editDescription"
                  rows="3"
                  class="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600 leading-relaxed"
                ></textarea>
              </div>

              <button
                (click)="savePropertyEdit(prop.id)"
                class="w-full py-3 bg-azure-600 hover:bg-azure-700 text-white text-xs font-bold rounded-full shadow-lg tap-bounce"
              >
                حفظ التعديلات وتحديث الأسعار
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ============================================== -->
      <!-- MODAL 3: إضافة شاليه جديد (Add New Property Modal) -->
      <!-- ============================================== -->
      @if (isAddModalOpen()) {
        <div class="fixed inset-0 z-50 flex flex-col justify-end font-arabic">
          <div (click)="isAddModalOpen.set(false)" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md"></div>
          <div class="relative w-full max-h-[90%] bg-white rounded-t-[36px] shadow-2xl p-6 flex flex-col overflow-y-auto no-scrollbar animate-slide-up">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3"></div>

            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="text-sm font-black text-slate-900">إضافة شاليه أو فيلا جديدة</h3>
              <button (click)="isAddModalOpen.set(false)" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">✕</button>
            </div>

            <div class="space-y-3.5 my-3">
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">اسم الوحدة والشاليه</label>
                <input
                  type="text"
                  [(ngModel)]="newUnitTitle"
                  placeholder="مثال: شاليه لاجون فيو - مراسي الساحل"
                  class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                />
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">المنطقة والقرية</label>
                  <input
                    type="text"
                    [(ngModel)]="newUnitVillage"
                    placeholder="مراسي - سيدي عبد الرحمن"
                    class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">السعر لليلة (ج.م)</label>
                  <input
                    type="number"
                    [(ngModel)]="newUnitPrice"
                    placeholder="6500"
                    class="w-full text-xs font-sans font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
              </div>

              <button
                (click)="saveNewUnit()"
                class="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-full shadow-lg tap-bounce"
              >
                إدراج الوحدة في منظومة Ragab Pay
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class OwnerDashboardComponent implements OnInit {
  readonly state = inject(AppStateService);

  readonly activeSubTab = signal<'units' | 'calendar' | 'bookings' | 'earnings'>('units');
  readonly selectedCalendarPropertyId = signal<string>('villa-1');

  // Modals state
  readonly isPayoutModalOpen = signal<boolean>(false);
  payoutAmount: number = 25000;
  selectedPayoutMethod: 'instapay' | 'bank' | 'wallet' = 'instapay';
  payoutDestination: string = 'ahmed@instapay';
  readonly payoutSuccess = signal<boolean>(false);

  readonly editingProp = signal<Property | null>(null);
  editTitle: string = '';
  editPriceDay: number = 0;
  editPriceMonth: number = 0;
  editDescription: string = '';

  readonly isAddModalOpen = signal<boolean>(false);
  newUnitTitle: string = '';
  newUnitVillage: string = '';
  newUnitPrice: number = 6500;

  // Owner Properties computed from all properties
  readonly myProperties = computed(() => {
    const all = this.state.properties();
    // 4 representative units for this owner
    return all.filter(p =>
      p.id === 'villa-1' || p.id === 'chalet-2' || p.id === 'corp-5' || p.id === 'pent-4'
    );
  });

  readonly currentCalendarProp = computed(() => {
    const list = this.state.properties();
    return list.find(p => p.id === this.selectedCalendarPropertyId()) || this.myProperties()[0];
  });

  // Calendar Days for November 2026
  readonly calendarDays = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const dateStr = `2026-11-${String(day).padStart(2, '0')}`;
    return {
      dayNumber: day,
      dateStr: dateStr
    };
  });

  // Sample guest bookings for this owner
  readonly hostBookings = [
    {
      id: 'hb-1',
      guestName: 'كريم عبد العزيز',
      guestAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      guestPhone: '+20 100 456 7890',
      propertyTitle: 'فيلا لوتس لاجون إنفينيتي',
      checkIn: '2026-11-20',
      checkOut: '2026-11-23',
      nights: 3,
      netEarnings: 28000,
      status: 'confirmed',
      statusLabel: 'قادم قريباً'
    },
    {
      id: 'hb-2',
      guestName: 'د. ياسمين فهمي',
      guestAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      guestPhone: '+20 102 334 5566',
      propertyTitle: 'شاليه بيتش فرونت فاخر - هاسيندا',
      checkIn: '2026-11-14',
      checkOut: '2026-11-17',
      nights: 3,
      netEarnings: 14000,
      status: 'confirmed',
      statusLabel: 'مؤكد ومسدد'
    },
    {
      id: 'hb-3',
      guestName: 'شركة المقاولات الهندسية',
      guestAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      guestPhone: '+20 111 999 8888',
      propertyTitle: 'سكن مهندسين وكوادر - العاصمة',
      checkIn: '2026-11-01',
      checkOut: '2026-11-30',
      nights: 30,
      netEarnings: 32000,
      status: 'current',
      statusLabel: 'نزيل مقيم حالياً'
    }
  ];

  readonly activeBookings = computed(() => {
    return this.hostBookings.filter(b => b.status === 'confirmed' || b.status === 'current');
  });

  ngOnInit() {
    if (this.myProperties().length > 0) {
      this.selectedCalendarPropertyId.set(this.myProperties()[0].id);
    }
  }

  switchToGuest() {
    this.state.switchToGuestMode();
  }

  openCalendarForUnit(prop: Property) {
    this.selectedCalendarPropertyId.set(prop.id);
    this.activeSubTab.set('calendar');
  }

  isDateBlocked(dateStr: string): boolean {
    const prop = this.currentCalendarProp();
    return !!(prop && prop.blockedDates && prop.blockedDates.includes(dateStr));
  }

  isDateBooked(dateStr: string): boolean {
    // Dates booked by sample bookings: Nov 20-22, Nov 14-16, Nov 1-10
    const booked = [
      '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04',
      '2026-11-14', '2026-11-15', '2026-11-16',
      '2026-11-20', '2026-11-21', '2026-11-22'
    ];
    return booked.includes(dateStr);
  }

  toggleDayBlock(dateStr: string) {
    if (this.isDateBooked(dateStr)) return; // Can't block a date already occupied by a guest
    const propId = this.selectedCalendarPropertyId();
    this.state.toggleDateBlock(propId, dateStr);
  }

  blockWeekend() {
    const propId = this.selectedCalendarPropertyId();
    // Block upcoming Thursday/Friday/Saturday (Nov 26, 27, 28)
    ['2026-11-26', '2026-11-27', '2026-11-28'].forEach(d => {
      if (!this.isDateBlocked(d)) {
        this.state.toggleDateBlock(propId, d);
      }
    });
  }

  unblockAll() {
    const prop = this.currentCalendarProp();
    if (!prop) return;
    [...prop.blockedDates].forEach(d => {
      this.state.toggleDateBlock(prop.id, d);
    });
  }

  openEditModal(prop: Property) {
    this.editingProp.set(prop);
    this.editTitle = prop.title;
    this.editPriceDay = prop.pricePerDay;
    this.editPriceMonth = prop.pricePerMonth;
    this.editDescription = prop.description;
  }

  savePropertyEdit(propId: string) {
    this.state.updatePropertyDetails(propId, {
      title: this.editTitle,
      pricePerDay: this.editPriceDay,
      pricePerMonth: this.editPriceMonth,
      description: this.editDescription
    });
    this.editingProp.set(null);
  }

  openAddModal() {
    this.newUnitTitle = '';
    this.newUnitVillage = 'مراسي - الساحل الشمالي';
    this.newUnitPrice = 7500;
    this.isAddModalOpen.set(true);
  }

  saveNewUnit() {
    if (!this.newUnitTitle) return;
    const newId = 'unit-' + Date.now();
    const newP: Property = {
      id: newId,
      title: this.newUnitTitle,
      village: this.newUnitVillage || 'الساحل الشمالي',
      region: 'north-coast',
      regionArabic: 'الساحل الشمالي',
      category: 'chalet',
      categoryArabic: 'شاليه بحري فاخر',
      pricePerDay: this.newUnitPrice || 7000,
      pricePerWeek: (this.newUnitPrice || 7000) * 6,
      pricePerMonth: (this.newUnitPrice || 7000) * 22,
      pricePerYear: (this.newUnitPrice || 7000) * 200,
      supportedRentalTypes: ['daily', 'weekly', 'monthly'],
      rating: 5.0,
      reviewsCount: 1,
      distanceToBeach: 'صف أول مباشر 50م',
      distanceToBeachValue: 50,
      area: 165,
      bedrooms: 3,
      bathrooms: 2,
      poolType: 'مشترك فاخر',
      hasPrivatePool: false,
      maxGuests: 6,
      isCorporateReady: false,
      targetAudience: 'عائلات وفنادق',
      features: ['مكيف بالكامل', 'شاطئ خاص', 'واي فاي فائق السرعة', 'أمن 24 ساعة'],
      host: {
        name: this.state.currentUser().name,
        avatar: this.state.currentUser().avatar,
        verified: true,
        responseTime: 'أقل من 10 دقائق',
        rating: 5,
        phone: this.state.currentUser().phone
      },
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80'
      ],
      featured: true,
      blockedDates: [],
      description: 'شاليه تم إضافته حديثاً من المالك عبر بوابة Ragab Pay مع كامل التجهيزات الفندقية والإطلالة البحرية.',
      reviews: []
    };

    this.state.addNewProperty(newP);
    this.isAddModalOpen.set(false);
  }

  openPayoutModal() {
    this.payoutAmount = Math.min(25000, this.state.ownerEarnings().availableBalance);
    this.payoutSuccess.set(false);
    this.isPayoutModalOpen.set(true);
  }

  setPayoutPreset(ratio: number) {
    this.payoutAmount = Math.round(this.state.ownerEarnings().availableBalance * ratio);
  }

  submitPayout() {
    if (this.payoutAmount <= 0) return;
    this.state.requestPayout(this.payoutAmount, this.selectedPayoutMethod.toUpperCase(), this.payoutDestination);
    this.payoutSuccess.set(true);
    setTimeout(() => {
      this.payoutSuccess.set(false);
      this.isPayoutModalOpen.set(false);
    }, 2200);
  }

  openGuestWhatsApp(phone: string, name: string, prop: string) {
    const clean = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`مرحباً أستاذ ${name}، أنا مالك ومضيف ${prop} في منصة Ragab Pay. بخصوص حجزك القادم...`);
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  }
}
