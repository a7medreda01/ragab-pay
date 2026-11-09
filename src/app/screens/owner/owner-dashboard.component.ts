import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../../components/property-image/property-image.component';
import { Property } from '../../data/properties.data';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyImageComponent],
  template: `
    <div class="relative w-full h-full overflow-hidden font-arabic bg-slate-50 select-none">
      
      <!-- Scrollable Main Viewport -->
      <div class="w-full h-full overflow-y-auto no-scrollbar pb-[max(7rem,calc(6rem+env(safe-area-inset-bottom,24px)))]">
        
        <!-- Top App Bar -->
        <div class="sticky top-0 z-30 px-5 pt-3 pb-2.5 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 text-white flex items-center justify-between shadow-md">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-azure-600 flex items-center justify-center text-white font-bold text-xs">
              RP
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h1 class="text-xs font-black text-white">بوابة المالك</h1>
                <span class="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">Host</span>
              </div>
            </div>
          </div>

          <!-- Quick Switch to Guest Mode Button -->
          <button
            (click)="switchToGuest()"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold border border-white/15 tap-bounce transition-colors"
            title="الرجوع إلى وضع النزيل"
          >
            <i class="bi bi-arrow-repeat text-azure-300 text-xs"></i>
            <span>وضع النزيل</span>
          </button>
        </div>

        <!-- Owner Profile & Host Status Header Card -->
        <div class="p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-azure-950 text-white border-b border-white/10 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="relative">
                <img
                  [src]="state.currentUser().avatar"
                  alt="Owner"
                  class="w-11 h-11 rounded-full object-cover ring-2 ring-azure-500 shadow-sm"
                />
                <span class="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] ring-2 ring-slate-900">
                  <i class="bi bi-check"></i>
                </span>
              </div>
              <div>
                <h2 class="text-xs font-black text-white">{{ state.currentUser().name }}</h2>
                <span class="text-[9px] text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                  <i class="bi bi-patch-check-fill text-amber-400"></i>
                  <span>مضيف معتمد</span>
                </span>
              </div>
            </div>

            <!-- Add Unit Button -->
            <button
              (click)="openAddModal()"
              class="px-3 py-1.5 rounded-xl bg-azure-600 hover:bg-azure-700 text-white text-[11px] font-bold tap-bounce flex items-center gap-1.5 transition-all shadow-sm"
            >
              <i class="bi bi-plus-lg text-xs"></i>
              <span>إضافة وحدة</span>
            </button>
          </div>

          <!-- Metric KPI Cards Grid -->
          <div class="grid grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-white/10">
            <div class="bg-white/5 p-2 rounded-xl text-center">
              <span class="text-[9px] text-white/60 block">الأرباح</span>
              <span class="text-xs font-black text-emerald-400 font-sans mt-0.5 block">185,000</span>
              <span class="text-[8px] text-white/40 block">ج.م</span>
            </div>

            <div class="bg-white/5 p-2 rounded-xl text-center">
              <span class="text-[9px] text-white/60 block">الإشغال</span>
              <span class="text-xs font-black text-azure-400 font-sans mt-0.5 block">88%</span>
              <span class="text-[8px] text-white/40 block">نشط</span>
            </div>

            <div class="bg-white/5 p-2 rounded-xl text-center">
              <span class="text-[9px] text-white/60 block">الوحدات</span>
              <span class="text-xs font-black text-amber-400 font-sans mt-0.5 block">{{ myProperties().length }}</span>
              <span class="text-[8px] text-white/40 block">وحدة</span>
            </div>

            <div class="bg-white/5 p-2 rounded-xl text-center">
              <span class="text-[9px] text-white/60 block">التقييم</span>
              <span class="text-xs font-black text-amber-300 font-sans mt-0.5 flex items-center justify-center gap-0.5">
                <span>4.95</span>
                <i class="bi bi-star-fill text-[9px] text-amber-400"></i>
              </span>
              <span class="text-[8px] text-white/40 block">ممتاز</span>
            </div>
          </div>
        </div>

        <!-- MAIN CONTENT CONTAINER -->
        <div class="p-4">

          <!-- ============================================== -->
          <!-- TAB 1: وحداتي (Units) -->
          <!-- ============================================== -->
          @if (activeSubTab() === 'units') {
            <div class="space-y-3.5 animate-fade-in">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-black text-slate-900">الوحدات المدارة</h3>
                <span class="text-xs font-bold text-azure-600 bg-azure-50 px-2 py-0.5 rounded-full border border-azure-100">
                  {{ filteredMyProperties().length }} وحدات
                </span>
              </div>

              <!-- Category Filter Chips -->
              <div class="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                @for (cat of ownerCategories; track cat) {
                  <button
                    (click)="selectedOwnerCategory.set(cat)"
                    class="px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap tap-bounce border transition-all"
                    [class.bg-slate-900]="selectedOwnerCategory() === cat"
                    [class.text-white]="selectedOwnerCategory() === cat"
                    [class.border-slate-900]="selectedOwnerCategory() === cat"
                    [class.bg-white]="selectedOwnerCategory() !== cat"
                    [class.text-slate-600]="selectedOwnerCategory() !== cat"
                    [class.border-slate-200]="selectedOwnerCategory() !== cat"
                  >
                    {{ cat }}
                  </button>
                }
              </div>

              <!-- Property Cards -->
              <div class="space-y-3">
                @for (prop of filteredMyProperties(); track prop.id) {
                  <div class="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-col gap-2.5">
                    <div class="flex gap-2.5">
                      <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                        <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>
                        <span class="absolute top-1 start-1 px-1.5 py-0.2 rounded bg-slate-900/80 text-white text-[8px] font-bold">
                          {{ prop.categoryArabic }}
                        </span>
                      </div>

                      <div class="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div class="flex items-center justify-between">
                            <span class="text-[10px] text-azure-600 font-bold truncate max-w-[120px]">{{ prop.village }}</span>
                            <span class="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>متاحة</span>
                            </span>
                          </div>
                          <h4 class="text-xs font-black text-slate-900 truncate mt-0.5">{{ prop.title }}</h4>
                          <div class="flex items-center gap-1.5 text-[9px] text-slate-500 mt-0.5">
                            <span>{{ prop.bedrooms }} غرف</span>
                            <span>•</span>
                            <span>{{ prop.bathrooms }} حمام</span>
                            <span>•</span>
                            <span>{{ prop.area }} م²</span>
                          </div>
                        </div>

                        <div class="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span class="text-xs font-black text-slate-900 font-sans">
                            {{ prop.pricePerDay | number }} ج.م <span class="text-[9px] font-normal text-slate-400">/ ليلة</span>
                          </span>
                          <span class="text-[9px] text-slate-500 font-sans">
                            {{ prop.pricePerMonth ? (prop.pricePerMonth | number) + ' ج.م/شهر' : (prop.blockedDates.length + ' أيام مغلقة') }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Badges -->
                    <div class="flex flex-wrap gap-1 text-[9px]">
                      @if (prop.hasPrivatePool) {
                        <span class="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-bold border border-sky-100 flex items-center gap-1">
                          <i class="bi bi-water text-sky-600"></i> مسبح خاص
                        </span>
                      }
                      @if (prop.isCorporateReady) {
                        <span class="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-100 flex items-center gap-1">
                          <i class="bi bi-building text-purple-600"></i> سكن شركات
                        </span>
                      }
                      <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold flex items-center gap-1">
                        <i class="bi bi-geo-alt text-slate-500"></i> {{ prop.regionArabic }}
                      </span>
                    </div>

                    <!-- Actions -->
                    <div class="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-100">
                      <button
                        (click)="openEditModal(prop)"
                        class="py-1.5 px-2 rounded-lg bg-azure-50 hover:bg-azure-100 text-azure-700 text-[11px] font-bold tap-bounce transition-colors flex items-center justify-center gap-1 border border-azure-100"
                      >
                        <i class="bi bi-pencil-square text-xs"></i>
                        <span>تعديل</span>
                      </button>

                      <button
                        (click)="openCalendarForUnit(prop)"
                        class="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold tap-bounce transition-colors flex items-center justify-center gap-1"
                      >
                        <i class="bi bi-calendar3 text-xs"></i>
                        <span>التقويم</span>
                      </button>

                      <button
                        (click)="previewUnit(prop)"
                        class="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold tap-bounce transition-colors flex items-center justify-center gap-1"
                      >
                        <i class="bi bi-eye text-xs text-azure-300"></i>
                        <span>معاينة</span>
                      </button>
                    </div>
                  </div>
                }

                @if (filteredMyProperties().length === 0) {
                  <div class="py-10 text-center text-xs text-slate-400 bg-white rounded-2xl p-5 border border-slate-100">
                    <i class="bi bi-building-slash text-2xl text-slate-300 mb-2 block"></i>
                    <span class="block font-bold text-slate-600">لا توجد وحدات مسجلة</span>
                    <button
                      (click)="openAddModal()"
                      class="mt-2.5 px-3.5 py-1.5 rounded-lg bg-azure-600 text-white text-xs font-bold tap-bounce"
                    >
                      إضافة وحدة
                    </button>
                  </div>
                }
              </div>
            </div>
          }

          <!-- ============================================== -->
          <!-- TAB 2: التقويم (Calendar) -->
          <!-- ============================================== -->
          @if (activeSubTab() === 'calendar') {
            <div class="space-y-3 animate-fade-in">
              <!-- Property Selector Strip -->
              <div class="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                @for (prop of myProperties(); track prop.id) {
                  <button
                    (click)="selectedCalendarPropertyId.set(prop.id)"
                    class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap tap-bounce border transition-all"
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

              <!-- Calendar Container Card -->
              <div class="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs space-y-3">
                <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 class="text-xs font-black text-slate-900">نوفمبر 2026</h3>
                  <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <i class="bi bi-lock-fill text-[9px]"></i>
                    <span>{{ currentCalendarProp() ? currentCalendarProp()!.blockedDates.length : 0 }} مغلق</span>
                  </span>
                </div>

                <!-- Legend -->
                <div class="flex items-center justify-between text-[10px] text-slate-500 px-1">
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>متاح</span>
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-azure-600"></span>
                    <span>محجوز</span>
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span>مغلق</span>
                  </span>
                </div>

                <!-- Days of week -->
                <div class="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
                  <span>س</span><span>ح</span><span>ن</span><span>ث</span><span>ر</span><span>خ</span><span>ج</span>
                </div>

                <!-- Days Grid -->
                <div class="grid grid-cols-7 gap-1">
                  @for (day of calendarDays; track day.dateStr) {
                    <button
                      (click)="toggleDayBlock(day.dateStr)"
                      class="h-10 rounded-xl flex flex-col items-center justify-center p-0.5 tap-bounce transition-all relative"
                      [class.bg-azure-600]="isDateBooked(day.dateStr)"
                      [class.text-white]="isDateBooked(day.dateStr)"
                      [class.bg-slate-200]="isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                      [class.text-slate-600]="isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                      [class.bg-white]="!isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                      [class.border]="!isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                      [class.border-slate-200]="!isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                      [class.text-slate-900]="!isDateBlocked(day.dateStr) && !isDateBooked(day.dateStr)"
                    >
                      <span class="text-xs font-black font-sans leading-none">{{ day.dayNumber }}</span>
                      @if (isDateBooked(day.dateStr)) {
                        <span class="text-[7px] text-white/90 font-bold block mt-0.5">حجز</span>
                      } @else if (isDateBlocked(day.dateStr)) {
                        <span class="text-[7px] text-slate-500 font-bold block mt-0.5">قفل</span>
                      } @else {
                        <span class="text-[7px] text-emerald-600 font-bold block mt-0.5">متاح</span>
                      }
                    </button>
                  }
                </div>

                <!-- Quick Tools -->
                <div class="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span class="text-[10px] text-slate-400">إجراءات سريعة:</span>
                  <div class="flex gap-1.5">
                    <button
                      (click)="blockWeekend()"
                      class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold tap-bounce"
                    >
                      حظر الويكند
                    </button>
                    <button
                      (click)="unblockAll()"
                      class="px-2 py-1 rounded-lg bg-azure-50 hover:bg-azure-100 text-azure-700 text-[10px] font-bold tap-bounce"
                    >
                      فتح الكل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- ============================================== -->
          <!-- TAB 3: الحجوزات (Bookings) -->
          <!-- ============================================== -->
          @if (activeSubTab() === 'bookings') {
            <div class="space-y-3 animate-fade-in">
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-black text-slate-900">سجل الحجوزات</h3>
                <span class="text-xs font-bold text-azure-600 bg-azure-50 px-2 py-0.5 rounded-full border border-azure-100">
                  {{ hostBookings.length }} حجز
                </span>
              </div>

              <div class="space-y-2.5">
                @for (bk of hostBookings; track bk.id) {
                  <div class="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-2.5">
                    <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div class="flex items-center gap-2">
                        <img [src]="bk.guestAvatar" alt="Guest" class="w-8 h-8 rounded-full object-cover ring-1 ring-azure-100"/>
                        <div>
                          <h4 class="text-xs font-bold text-slate-900">{{ bk.guestName }}</h4>
                          <span class="text-[9px] text-slate-400 font-sans" dir="ltr">{{ bk.guestPhone }}</span>
                        </div>
                      </div>
                      <span
                        class="px-2 py-0.2 rounded-full text-[9px] font-bold border"
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

                    <div class="space-y-1 text-[11px] text-slate-600">
                      <div class="flex justify-between">
                        <span class="text-slate-400">الوحدة:</span>
                        <span class="font-bold text-slate-900 truncate max-w-[180px]">{{ bk.propertyTitle }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-slate-400">المدة:</span>
                        <span class="font-bold text-slate-900 font-sans">{{ bk.checkIn }} ← {{ bk.checkOut }} ({{ bk.nights }} ليالٍ)</span>
                      </div>
                      <div class="flex justify-between items-center pt-1 border-t border-slate-100">
                        <span class="text-slate-400">صافي الربح:</span>
                        <span class="text-xs font-black text-emerald-600 font-sans">{{ bk.netEarnings | number }} ج.م</span>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        (click)="openGuestWhatsApp(bk.guestPhone, bk.guestName, bk.propertyTitle)"
                        class="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold tap-bounce flex items-center justify-center gap-1 border border-emerald-200"
                      >
                        <i class="bi bi-whatsapp text-emerald-600"></i>
                        <span>واتساب</span>
                      </button>

                      <a
                        [href]="'tel:' + bk.guestPhone"
                        class="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold tap-bounce flex items-center justify-center gap-1"
                      >
                        <i class="bi bi-telephone text-slate-700"></i>
                        <span>اتصال</span>
                      </a>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- ============================================== -->
          <!-- TAB 4: الأرباح (Earnings) -->
          <!-- ============================================== -->
          @if (activeSubTab() === 'earnings') {
            <div class="space-y-3 animate-fade-in">
              <div class="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-azure-950 to-slate-900 text-white shadow-md border border-azure-500/30 relative overflow-hidden">
                <div class="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <span class="text-[10px] text-azure-300 font-bold">محفظة المالك</span>
                  <i class="bi bi-wallet2 text-base text-azure-300"></i>
                </div>

                <div class="my-3">
                  <span class="text-[10px] text-white/70 block">الرصيد المتاح للسحب</span>
                  <div class="flex items-baseline gap-1.5 mt-0.5">
                    <span class="text-2xl font-black text-white font-sans tracking-tight">
                      {{ state.ownerEarnings().availableBalance | number }}
                    </span>
                    <span class="text-xs font-bold text-azure-300">ج.م</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/10 text-center">
                  <div class="bg-white/5 p-1.5 rounded-lg">
                    <span class="text-[9px] text-white/50 block">قيد المعالجة</span>
                    <span class="text-xs font-bold text-amber-300 font-sans mt-0.5 block">
                      {{ state.ownerEarnings().pendingBalance | number }} ج.م
                    </span>
                  </div>
                  <div class="bg-white/5 p-1.5 rounded-lg">
                    <span class="text-[9px] text-white/50 block">إجمالي المسحوب</span>
                    <span class="text-xs font-bold text-emerald-400 font-sans mt-0.5 block">
                      {{ state.ownerEarnings().totalPaidOut | number }} ج.م
                    </span>
                  </div>
                </div>

                <button
                  (click)="openPayoutModal()"
                  class="w-full mt-3 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white font-black text-xs rounded-xl tap-bounce flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <i class="bi bi-send text-xs"></i>
                  <span>طلب سحب الأرباح (InstaPay / بنك)</span>
                </button>
              </div>

              <!-- Transactions -->
              <div class="space-y-2 pt-1">
                <h4 class="text-xs font-black text-slate-900">سجل التحويلات</h4>

                <div class="space-y-1.5">
                  @for (tx of state.ownerEarnings().transactions; track tx.id) {
                    <div class="p-2.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                          [class.bg-emerald-50]="tx.amount > 0"
                          [class.text-emerald-600]="tx.amount > 0"
                          [class.bg-slate-100]="tx.amount <= 0"
                          [class.text-slate-600]="tx.amount <= 0"
                        >
                          <i class="bi" [class.bi-arrow-down-left]="tx.amount > 0" [class.bi-arrow-up-right]="tx.amount <= 0"></i>
                        </div>
                        <div>
                          <span class="text-xs font-bold text-slate-900 block truncate max-w-[150px]">{{ tx.method }}</span>
                          <span class="text-[9px] text-slate-400 font-sans block">{{ tx.date }}</span>
                        </div>
                      </div>

                      <div class="text-end">
                        <span class="text-xs font-black font-sans block text-emerald-600">
                          +{{ tx.amount | number }} ج.م
                        </span>
                        <span class="text-[8px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">
                          {{ tx.status === 'completed' ? 'معتمد' : 'معالجة' }}
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

        </div>
      </div>

      <!-- ============================================================== -->
      <!-- LUXURY FLOATING BOTTOM NAVIGATION BAR (Bootstrap Icons) -->
      <!-- ============================================================== -->
      <nav class="absolute bottom-[max(1.75rem,calc(1.25rem+env(safe-area-inset-bottom,28px)))] inset-x-4 z-40">
        <div class="relative bg-white/95 backdrop-blur-2xl border border-azure-100/90 rounded-full px-3 py-1.5 shadow-[0_16px_40px_rgba(2,132,199,0.16)] flex items-center justify-between">
          
          <!-- 1. Units -->
          <button
            (click)="activeSubTab.set('units')"
            class="relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl tap-bounce transition-all duration-200"
            [class.bg-azure-50]="activeSubTab() === 'units'"
            [class.text-azure-600]="activeSubTab() === 'units'"
            [class.text-slate-400]="activeSubTab() !== 'units'"
          >
            <i class="bi bi-houses text-lg mb-0.5" [class.scale-110]="activeSubTab() === 'units'"></i>
            <span class="text-[10px] font-bold font-arabic leading-tight">وحداتي</span>
            @if (activeSubTab() === 'units') {
              <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5"></span>
            }
          </button>

          <!-- 2. Calendar -->
          <button
            (click)="activeSubTab.set('calendar')"
            class="relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl tap-bounce transition-all duration-200"
            [class.bg-azure-50]="activeSubTab() === 'calendar'"
            [class.text-azure-600]="activeSubTab() === 'calendar'"
            [class.text-slate-400]="activeSubTab() !== 'calendar'"
          >
            <i class="bi bi-calendar3 text-base mb-0.5" [class.scale-110]="activeSubTab() === 'calendar'"></i>
            <span class="text-[10px] font-bold font-arabic leading-tight">التقويم</span>
            @if (activeSubTab() === 'calendar') {
              <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5"></span>
            }
          </button>

          <!-- 3. Center Button: Add Unit -->
          <div class="relative -top-5 flex-1 flex flex-col items-center justify-center">
            <button
              (click)="openAddModal()"
              class="relative w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-azure-600 to-sky-400 text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)] ring-4 ring-white flex items-center justify-center tap-bounce hover:scale-105 active:scale-95 transition-all duration-200"
              title="إضافة وحدة جديدة"
            >
              <i class="bi bi-plus-lg text-xl font-bold"></i>
            </button>
            <span class="text-[9px] font-bold text-indigo-700 tracking-tight mt-0.5 font-arabic">إضافة وحدة</span>
          </div>

          <!-- 4. Bookings -->
          <button
            (click)="activeSubTab.set('bookings')"
            class="relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl tap-bounce transition-all duration-200"
            [class.bg-azure-50]="activeSubTab() === 'bookings'"
            [class.text-azure-600]="activeSubTab() === 'bookings'"
            [class.text-slate-400]="activeSubTab() !== 'bookings'"
          >
            <div class="relative">
              <i class="bi bi-card-checklist text-lg mb-0.5" [class.scale-110]="activeSubTab() === 'bookings'"></i>
              @if (activeBookings().length > 0) {
                <span class="absolute -top-1 -end-2 w-3.5 h-3.5 bg-azure-600 text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                  {{ activeBookings().length }}
                </span>
              }
            </div>
            <span class="text-[10px] font-bold font-arabic leading-tight">الحجوزات</span>
            @if (activeSubTab() === 'bookings') {
              <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5"></span>
            }
          </button>

          <!-- 5. Earnings -->
          <button
            (click)="activeSubTab.set('earnings')"
            class="relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl tap-bounce transition-all duration-200"
            [class.bg-azure-50]="activeSubTab() === 'earnings'"
            [class.text-azure-600]="activeSubTab() === 'earnings'"
            [class.text-slate-400]="activeSubTab() !== 'earnings'"
          >
            <i class="bi bi-wallet2 text-base mb-0.5" [class.scale-110]="activeSubTab() === 'earnings'"></i>
            <span class="text-[10px] font-bold font-arabic leading-tight">الأرباح</span>
            @if (activeSubTab() === 'earnings') {
              <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5"></span>
            }
          </button>

        </div>
      </nav>

      <!-- ============================================== -->
      <!-- MODAL 1: سحب الأرباح (Payout Modal) -->
      <!-- ============================================== -->
      @if (isPayoutModalOpen()) {
        <div class="fixed inset-0 z-50 flex flex-col justify-end font-arabic">
          <div (click)="isPayoutModalOpen.set(false)" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md"></div>
          <div class="relative w-full bg-white rounded-t-[32px] shadow-2xl p-5 flex flex-col animate-slide-up">
            <div class="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3"></div>

            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 class="text-xs font-black text-slate-900">طلب سحب الأرباح</h3>
              <button (click)="isPayoutModalOpen.set(false)" class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 tap-bounce">
                <i class="bi bi-x-lg text-xs"></i>
              </button>
            </div>

            <div class="space-y-3 my-3">
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">المبلغ (ج.م)</label>
                <input
                  type="number"
                  [(ngModel)]="payoutAmount"
                  [max]="state.ownerEarnings().availableBalance"
                  class="w-full text-sm font-black font-sans p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                />
                <div class="flex gap-2 mt-1.5">
                  <button (click)="setPayoutPreset(0.50)" class="flex-1 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 tap-bounce">50%</button>
                  <button (click)="setPayoutPreset(1.00)" class="flex-1 py-1 bg-azure-50 rounded-lg text-[10px] font-bold text-azure-700 tap-bounce">100%</button>
                </div>
              </div>

              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">طريقة الاستلام:</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    (click)="selectedPayoutMethod = 'instapay'"
                    class="p-2 rounded-xl border text-center transition-all tap-bounce"
                    [class.border-azure-600]="selectedPayoutMethod === 'instapay'"
                    [class.bg-azure-50]="selectedPayoutMethod === 'instapay'"
                    [class.border-slate-200]="selectedPayoutMethod !== 'instapay'"
                  >
                    <i class="bi bi-lightning-charge-fill text-amber-500 text-sm block mb-0.5"></i>
                    <span class="text-[10px] font-bold text-slate-900 block">InstaPay</span>
                  </button>

                  <button
                    (click)="selectedPayoutMethod = 'bank'"
                    class="p-2 rounded-xl border text-center transition-all tap-bounce"
                    [class.border-azure-600]="selectedPayoutMethod === 'bank'"
                    [class.bg-azure-50]="selectedPayoutMethod === 'bank'"
                    [class.border-slate-200]="selectedPayoutMethod !== 'bank'"
                  >
                    <i class="bi bi-bank text-azure-600 text-sm block mb-0.5"></i>
                    <span class="text-[10px] font-bold text-slate-900 block">حساب بنكي</span>
                  </button>

                  <button
                    (click)="selectedPayoutMethod = 'wallet'"
                    class="p-2 rounded-xl border text-center transition-all tap-bounce"
                    [class.border-azure-600]="selectedPayoutMethod === 'wallet'"
                    [class.bg-azure-50]="selectedPayoutMethod === 'wallet'"
                    [class.border-slate-200]="selectedPayoutMethod !== 'wallet'"
                  >
                    <i class="bi bi-phone text-emerald-600 text-sm block mb-0.5"></i>
                    <span class="text-[10px] font-bold text-slate-900 block">محفظة</span>
                  </button>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-bold text-slate-700 block mb-1">بيانات الحساب / الرقم</label>
                <input
                  type="text"
                  [(ngModel)]="payoutDestination"
                  placeholder="ahmed@instapay أو رقم الهاتف"
                  dir="ltr"
                  class="w-full text-xs font-sans font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                />
              </div>

              @if (payoutSuccess()) {
                <div class="p-2.5 bg-emerald-500 text-white rounded-xl text-center flex items-center justify-center gap-1.5">
                  <i class="bi bi-check-circle-fill text-white"></i>
                  <span class="text-xs font-bold">تم تحويل الأرباح بنجاح</span>
                </div>
              } @else {
                <button
                  (click)="submitPayout()"
                  [disabled]="payoutAmount <= 0 || payoutAmount > state.ownerEarnings().availableBalance"
                  class="w-full py-2.5 bg-slate-950 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl tap-bounce"
                >
                  تأكيد التحويل ({{ payoutAmount | number }} ج.م)
                </button>
              }
            </div>
          </div>
        </div>
      }

      <!-- ============================================== -->
      <!-- MODAL 2: تعديل تفاصيل الوحدة (Edit Modal) -->
      <!-- ============================================== -->
      @if (editingProp(); as prop) {
        <div class="fixed inset-0 z-50 flex flex-col justify-end font-arabic">
          <div (click)="editingProp.set(null)" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md"></div>
          <div class="relative w-full max-h-[92%] bg-white rounded-t-[32px] shadow-2xl p-5 flex flex-col overflow-y-auto no-scrollbar animate-slide-up">
            <div class="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2.5"></div>

            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 class="text-xs font-black text-slate-900">تعديل بيانات الوحدة</h3>
              <button (click)="editingProp.set(null)" class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 tap-bounce">
                <i class="bi bi-x-lg text-xs"></i>
              </button>
            </div>

            <div class="space-y-3 my-2.5 text-slate-800">
              <div>
                <label class="text-[10px] font-bold text-slate-700 block mb-1">اسم الوحدة</label>
                <input
                  type="text"
                  [(ngModel)]="editTitle"
                  class="w-full text-xs font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">القرية / الكمبوند</label>
                  <input
                    type="text"
                    [(ngModel)]="editVillage"
                    class="w-full text-xs font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">المنطقة</label>
                  <select
                    [(ngModel)]="editRegion"
                    class="w-full text-xs font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  >
                    <option value="north-coast">الساحل الشمالي</option>
                    <option value="new-cairo">القاهرة الجديدة</option>
                    <option value="zayed-october">الشيخ زايد وأكتوبر</option>
                    <option value="new-capital">العاصمة الإدارية</option>
                    <option value="red-sea">البحر الأحمر والجونة</option>
                    <option value="zamalek">الزمالك</option>
                    <option value="maadi">المعادي</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">التصنيف</label>
                  <select
                    [(ngModel)]="editCategory"
                    class="w-full text-xs font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  >
                    <option value="chalet">شاليه فاخر</option>
                    <option value="villa">فيلا مستقلة</option>
                    <option value="penthouse">بنتهاوس تنفيذي</option>
                    <option value="apartment">شقة فندقية</option>
                    <option value="corporate-housing">سكن شركات</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">السعر لليلة (ج.م)</label>
                  <input
                    type="number"
                    [(ngModel)]="editPriceDay"
                    class="w-full text-xs font-sans font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[9px] font-bold text-slate-600 block mb-0.5">غرف النوم</label>
                  <input
                    type="number"
                    [(ngModel)]="editBedrooms"
                    class="w-full text-xs font-sans font-bold p-1.5 bg-slate-50 rounded-lg border border-slate-200 text-center outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[9px] font-bold text-slate-600 block mb-0.5">الحمامات</label>
                  <input
                    type="number"
                    [(ngModel)]="editBathrooms"
                    class="w-full text-xs font-sans font-bold p-1.5 bg-slate-50 rounded-lg border border-slate-200 text-center outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[9px] font-bold text-slate-600 block mb-0.5">المساحة م²</label>
                  <input
                    type="number"
                    [(ngModel)]="editArea"
                    class="w-full text-xs font-sans font-bold p-1.5 bg-slate-50 rounded-lg border border-slate-200 text-center outline-none focus:border-azure-600"
                  />
                </div>
              </div>

              <div>
                <label class="text-[10px] font-bold text-slate-700 block mb-1">المزايا المتاحة</label>
                <div class="flex flex-wrap gap-1 mb-1.5">
                  @for (feat of editFeaturesList; track feat) {
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-azure-50 text-azure-700 text-[9px] font-bold border border-azure-200">
                      <span>{{ feat }}</span>
                      <button (click)="removeFeature(feat)" class="text-rose-500 hover:text-rose-700 text-[10px]">
                        <i class="bi bi-x"></i>
                      </button>
                    </span>
                  }
                </div>
                <div class="flex gap-1.5">
                  <input
                    type="text"
                    [(ngModel)]="newFeatureInput"
                    placeholder="ميزة جديدة..."
                    class="flex-1 text-xs p-1.5 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-azure-600"
                    (keyup.enter)="addFeature()"
                  />
                  <button
                    (click)="addFeature()"
                    class="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold tap-bounce"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label class="text-[10px] font-bold text-slate-700 block mb-1">الوصف</label>
                <textarea
                  [(ngModel)]="editDescription"
                  rows="2"
                  class="w-full text-xs p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600 leading-relaxed"
                ></textarea>
              </div>

              <div class="space-y-1.5 pt-1">
                <button
                  (click)="savePropertyEdit(prop.id)"
                  class="w-full py-2.5 bg-azure-600 hover:bg-azure-700 text-white text-xs font-bold rounded-xl tap-bounce flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <i class="bi bi-check2"></i>
                  <span>حفظ التعديلات</span>
                </button>

                <button
                  (click)="deleteProperty(prop.id)"
                  class="w-full py-1.5 text-rose-600 hover:bg-rose-50 text-[11px] font-bold rounded-lg tap-bounce"
                >
                  <i class="bi bi-trash3 text-xs me-1"></i>
                  <span>حذف الوحدة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ============================================== -->
      <!-- MODAL 3: إضافة وحدة جديدة (Add Modal) -->
      <!-- ============================================== -->
      @if (isAddModalOpen()) {
        <div class="fixed inset-0 z-50 flex flex-col justify-end font-arabic">
          <div (click)="isAddModalOpen.set(false)" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md"></div>
          <div class="relative w-full max-h-[92%] bg-white rounded-t-[32px] shadow-2xl p-5 flex flex-col overflow-y-auto no-scrollbar animate-slide-up">
            <div class="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-2.5"></div>

            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 class="text-xs font-black text-slate-900">إضافة وحدة جديدة</h3>
              <button (click)="isAddModalOpen.set(false)" class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 tap-bounce">
                <i class="bi bi-x-lg text-xs"></i>
              </button>
            </div>

            <div class="space-y-3 my-2.5">
              <div>
                <label class="text-[10px] font-bold text-slate-700 block mb-1">اسم الوحدة</label>
                <input
                  type="text"
                  [(ngModel)]="newUnitTitle"
                  placeholder="شاليه لاجون فيو - مراسي"
                  class="w-full text-xs font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">القرية / الكمبوند</label>
                  <input
                    type="text"
                    [(ngModel)]="newUnitVillage"
                    placeholder="مراسي"
                    class="w-full text-xs font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">السعر لليلة (ج.م)</label>
                  <input
                    type="number"
                    [(ngModel)]="newUnitPrice"
                    placeholder="7500"
                    class="w-full text-xs font-sans font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[9px] font-bold text-slate-600 block mb-0.5">غرف النوم</label>
                  <input
                    type="number"
                    [(ngModel)]="newUnitBedrooms"
                    class="w-full text-xs font-sans font-bold p-1.5 bg-slate-50 rounded-lg border border-slate-200 text-center outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[9px] font-bold text-slate-600 block mb-0.5">الحمامات</label>
                  <input
                    type="number"
                    [(ngModel)]="newUnitBathrooms"
                    class="w-full text-xs font-sans font-bold p-1.5 bg-slate-50 rounded-lg border border-slate-200 text-center outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[9px] font-bold text-slate-600 block mb-0.5">المساحة م²</label>
                  <input
                    type="number"
                    [(ngModel)]="newUnitArea"
                    class="w-full text-xs font-sans font-bold p-1.5 bg-slate-50 rounded-lg border border-slate-200 text-center outline-none focus:border-azure-600"
                  />
                </div>
              </div>

              <div>
                <label class="text-[10px] font-bold text-slate-700 block mb-1">الوصف</label>
                <textarea
                  [(ngModel)]="newUnitDescription"
                  rows="2"
                  placeholder="وصف مختصر للوحدة..."
                  class="w-full text-xs p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600 leading-relaxed"
                ></textarea>
              </div>

              <button
                (click)="saveNewUnit()"
                class="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-xl tap-bounce flex items-center justify-center gap-1.5"
              >
                <i class="bi bi-plus-circle text-xs"></i>
                <span>إدراج الوحدة</span>
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
  readonly selectedCalendarPropertyId = signal<string>('rp-01');
  readonly selectedOwnerCategory = signal<string>('الكل');

  readonly ownerCategories = ['الكل', 'شاليهات', 'فيلات', 'بنتهاوس وشقق', 'سكن شركات'];

  // Modals state
  readonly isPayoutModalOpen = signal<boolean>(false);
  payoutAmount: number = 25000;
  selectedPayoutMethod: 'instapay' | 'bank' | 'wallet' = 'instapay';
  payoutDestination: string = 'ahmed@instapay';
  readonly payoutSuccess = signal<boolean>(false);

  // Full Unit Edit State
  readonly editingProp = signal<Property | null>(null);
  editTitle: string = '';
  editVillage: string = '';
  editRegion: 'north-coast' | 'new-cairo' | 'zayed-october' | 'zamalek' | 'maadi' | 'new-capital' | 'red-sea' = 'north-coast';
  editCategory: 'chalet' | 'villa' | 'apartment' | 'penthouse' | 'corporate-housing' | 'staff-residence' = 'chalet';
  editTargetAudience: 'عائلات وفنادق' | 'سياحة شاطئية' | 'رجال أعمال وشركات' | 'سكن مهندسين وعمال ومشاريع' = 'سياحة شاطئية';
  editPriceDay: number = 0;
  editPriceWeek: number = 0;
  editPriceMonth: number = 0;
  editPriceYear: number = 0;
  editArea: number = 0;
  editBedrooms: number = 0;
  editBathrooms: number = 0;
  editMaxGuests: number = 0;
  editDistanceToBeach: string = '';
  editPoolType: 'خاص إنفينيتي' | 'خاص مع جاكوزي' | 'مشترك فاخر' | 'بدون مسبح' = 'خاص إنفينيتي';
  editHasPrivatePool: boolean = true;
  editIsCorporateReady: boolean = false;
  editFeaturesList: string[] = [];
  newFeatureInput: string = '';
  editMainImage: string = '';
  editDescription: string = '';

  // Add New Unit Modal State
  readonly isAddModalOpen = signal<boolean>(false);
  newUnitTitle: string = '';
  newUnitVillage: string = '';
  newUnitRegion: 'north-coast' | 'new-cairo' | 'zayed-october' | 'zamalek' | 'maadi' | 'new-capital' | 'red-sea' = 'north-coast';
  newUnitCategory: 'chalet' | 'villa' | 'apartment' | 'penthouse' | 'corporate-housing' = 'chalet';
  newUnitPrice: number = 7500;
  newUnitBedrooms: number = 3;
  newUnitBathrooms: number = 2;
  newUnitArea: number = 180;
  newUnitDescription: string = '';

  readonly myProperties = computed(() => {
    const ids = this.state.ownerPropertyIds();
    return this.state.properties().filter(p => ids.includes(p.id));
  });

  readonly filteredMyProperties = computed(() => {
    const list = this.myProperties();
    const cat = this.selectedOwnerCategory();
    if (cat === 'الكل') return list;
    if (cat === 'شاليهات') return list.filter(p => p.category === 'chalet');
    if (cat === 'فيلات') return list.filter(p => p.category === 'villa');
    if (cat === 'بنتهاوس وشقق') return list.filter(p => p.category === 'penthouse' || p.category === 'apartment');
    if (cat === 'سكن شركات') return list.filter(p => p.isCorporateReady || p.category === 'corporate-housing' || p.category === 'staff-residence');
    return list;
  });

  readonly currentCalendarProp = computed(() => {
    const list = this.state.properties();
    return list.find(p => p.id === this.selectedCalendarPropertyId()) || this.myProperties()[0];
  });

  readonly calendarDays = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const dateStr = `2026-11-${String(day).padStart(2, '0')}`;
    return {
      dayNumber: day,
      dateStr: dateStr
    };
  });

  readonly hostBookings = [
    {
      id: 'hb-1',
      guestName: 'كريم عبد العزيز',
      guestAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      guestPhone: '+20 100 456 7890',
      propertyTitle: 'شاليه ملكي بفيو بانورامي',
      checkIn: '2026-11-20',
      checkOut: '2026-11-23',
      nights: 3,
      netEarnings: 12000,
      status: 'confirmed',
      statusLabel: 'قادم'
    },
    {
      id: 'hb-2',
      guestName: 'د. ياسمين فهمي',
      guestAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      guestPhone: '+20 102 334 5566',
      propertyTitle: 'فيلا قصر البحر - مراسي',
      checkIn: '2026-11-14',
      checkOut: '2026-11-17',
      nights: 3,
      netEarnings: 36000,
      status: 'confirmed',
      statusLabel: 'مؤكد'
    },
    {
      id: 'hb-3',
      guestName: 'شركة المقاولات الهندسية',
      guestAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      guestPhone: '+20 111 999 8888',
      propertyTitle: 'مجمع سكني تنفيذي - العاصمة',
      checkIn: '2026-11-01',
      checkOut: '2026-11-30',
      nights: 30,
      netEarnings: 75000,
      status: 'current',
      statusLabel: 'مقيم حالياً'
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

  previewUnit(prop: Property) {
    this.state.openDetails(prop);
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
    const booked = [
      '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04',
      '2026-11-14', '2026-11-15', '2026-11-16',
      '2026-11-20', '2026-11-21', '2026-11-22'
    ];
    return booked.includes(dateStr);
  }

  toggleDayBlock(dateStr: string) {
    if (this.isDateBooked(dateStr)) return;
    const propId = this.selectedCalendarPropertyId();
    this.state.toggleDateBlock(propId, dateStr);
  }

  blockWeekend() {
    const propId = this.selectedCalendarPropertyId();
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
    this.editVillage = prop.village;
    this.editRegion = prop.region;
    this.editCategory = prop.category;
    this.editTargetAudience = prop.targetAudience;
    this.editPriceDay = prop.pricePerDay;
    this.editPriceWeek = prop.pricePerWeek || prop.pricePerDay * 6;
    this.editPriceMonth = prop.pricePerMonth || prop.pricePerDay * 22;
    this.editPriceYear = prop.pricePerYear || prop.pricePerDay * 200;
    this.editArea = prop.area;
    this.editBedrooms = prop.bedrooms;
    this.editBathrooms = prop.bathrooms;
    this.editMaxGuests = prop.maxGuests;
    this.editDistanceToBeach = prop.distanceToBeach;
    this.editPoolType = prop.poolType;
    this.editHasPrivatePool = prop.hasPrivatePool;
    this.editIsCorporateReady = prop.isCorporateReady;
    this.editFeaturesList = [...prop.features];
    this.editMainImage = prop.images[0] || '';
    this.editDescription = prop.description;
  }

  addFeature() {
    const feat = this.newFeatureInput.trim();
    if (feat && !this.editFeaturesList.includes(feat)) {
      this.editFeaturesList.push(feat);
      this.newFeatureInput = '';
    }
  }

  removeFeature(feat: string) {
    this.editFeaturesList = this.editFeaturesList.filter(f => f !== feat);
  }

  savePropertyEdit(propId: string) {
    const regionNames: Record<string, string> = {
      'north-coast': 'الساحل الشمالي',
      'new-cairo': 'القاهرة الجديدة',
      'zayed-october': 'الشيخ زايد وأكتوبر',
      'new-capital': 'العاصمة الإدارية',
      'red-sea': 'البحر الأحمر والجونة',
      'zamalek': 'الزمالك',
      'maadi': 'المعادي'
    };

    const categoryNames: Record<string, string> = {
      'chalet': 'شاليه فاخر',
      'villa': 'فيلا مستقلة',
      'penthouse': 'بنتهاوس تنفيذي',
      'apartment': 'شقة فندقية',
      'corporate-housing': 'سكن شركات',
      'staff-residence': 'سكن عمال وكوادر'
    };

    const prop = this.editingProp();
    const updatedImages = prop ? [...prop.images] : [];
    if (this.editMainImage) {
      updatedImages[0] = this.editMainImage;
    }

    this.state.updatePropertyDetails(propId, {
      title: this.editTitle,
      village: this.editVillage,
      region: this.editRegion,
      regionArabic: regionNames[this.editRegion] || 'الساحل الشمالي',
      category: this.editCategory,
      categoryArabic: categoryNames[this.editCategory] || 'شاليه فاخر',
      targetAudience: this.editTargetAudience,
      pricePerDay: Number(this.editPriceDay),
      pricePerWeek: Number(this.editPriceWeek),
      pricePerMonth: Number(this.editPriceMonth),
      pricePerYear: Number(this.editPriceYear),
      area: Number(this.editArea),
      bedrooms: Number(this.editBedrooms),
      bathrooms: Number(this.editBathrooms),
      maxGuests: Number(this.editMaxGuests),
      distanceToBeach: this.editDistanceToBeach,
      poolType: this.editPoolType,
      hasPrivatePool: this.editHasPrivatePool,
      isCorporateReady: this.editIsCorporateReady,
      features: this.editFeaturesList,
      images: updatedImages,
      description: this.editDescription
    });

    this.editingProp.set(null);
  }

  deleteProperty(propId: string) {
    if (confirm('هل أنت متأكد من حذف هذه الوحدة؟')) {
      this.state.deleteProperty(propId);
      this.editingProp.set(null);
    }
  }

  openAddModal() {
    this.newUnitTitle = '';
    this.newUnitVillage = 'مراسي';
    this.newUnitRegion = 'north-coast';
    this.newUnitCategory = 'chalet';
    this.newUnitPrice = 7500;
    this.newUnitBedrooms = 3;
    this.newUnitBathrooms = 2;
    this.newUnitArea = 180;
    this.newUnitDescription = 'شاليه متكامل التجهيزات الفندقية بإطلالة مميزة.';
    this.isAddModalOpen.set(true);
  }

  saveNewUnit() {
    if (!this.newUnitTitle) return;

    const regionNames: Record<string, string> = {
      'north-coast': 'الساحل الشمالي',
      'new-cairo': 'القاهرة الجديدة',
      'zayed-october': 'الشيخ زايد وأكتوبر',
      'new-capital': 'العاصمة الإدارية',
      'red-sea': 'البحر الأحمر',
      'zamalek': 'الزمالك',
      'maadi': 'المعادي'
    };

    const categoryNames: Record<string, string> = {
      'chalet': 'شاليه فاخر',
      'villa': 'فيلا مستقلة',
      'penthouse': 'بنتهاوس تنفيذي',
      'apartment': 'شقة فندقية',
      'corporate-housing': 'سكن شركات'
    };

    const newId = 'unit-' + Date.now();
    const newP: Property = {
      id: newId,
      title: this.newUnitTitle,
      village: this.newUnitVillage || 'الساحل الشمالي',
      region: this.newUnitRegion,
      regionArabic: regionNames[this.newUnitRegion] || 'الساحل الشمالي',
      category: this.newUnitCategory,
      categoryArabic: categoryNames[this.newUnitCategory] || 'شاليه فاخر',
      pricePerDay: Number(this.newUnitPrice) || 7500,
      pricePerWeek: (Number(this.newUnitPrice) || 7500) * 6,
      pricePerMonth: (Number(this.newUnitPrice) || 7500) * 22,
      pricePerYear: (Number(this.newUnitPrice) || 7500) * 200,
      supportedRentalTypes: ['daily', 'weekly', 'monthly', 'yearly'],
      rating: 5.0,
      reviewsCount: 1,
      distanceToBeach: 'صف أول 50م',
      distanceToBeachValue: 50,
      area: Number(this.newUnitArea) || 180,
      bedrooms: Number(this.newUnitBedrooms) || 3,
      bathrooms: Number(this.newUnitBathrooms) || 2,
      poolType: 'خاص إنفينيتي',
      hasPrivatePool: true,
      maxGuests: 6,
      isCorporateReady: this.newUnitCategory === 'corporate-housing',
      targetAudience: this.newUnitCategory === 'corporate-housing' ? 'سكن مهندسين وعمال ومشاريع' : 'سياحة شاطئية',
      features: ['مكيف', 'شاطئ خاص', 'واي فاي', 'أمن 24 ساعة'],
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
      description: this.newUnitDescription || 'شاليه تم إدراجه حديثاً.',
      reviews: []
    };

    this.state.addNewProperty(newP);
    this.selectedCalendarPropertyId.set(newId);
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
    }, 2000);
  }

  openGuestWhatsApp(phone: string, name: string, prop: string) {
    const clean = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`مرحباً أستاذ ${name}، بخصوص حجزك في ${prop}...`);
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  }
}
