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
    <div class="relative w-full h-full overflow-hidden font-arabic bg-slate-50 select-none">
      
      <!-- Scrollable Main Viewport (Elevated above bottom floating nav) -->
      <div class="w-full h-full overflow-y-auto no-scrollbar pb-[max(7.5rem,calc(6.5rem+env(safe-area-inset-bottom,28px)))]">
        
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
            <svg class="w-3.5 h-3.5 text-azure-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
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

        <!-- MAIN CONTENT CONTAINER -->
        <div class="p-5">

          <!-- ============================================== -->
          <!-- TAB 1: وحداتي وشاليهاتي (My Properties) -->
          <!-- ============================================== -->
          @if (activeSubTab() === 'units') {
            <div class="space-y-4 animate-fade-in">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xs font-black text-slate-900">شاليهاتي والوحدات المدارة</h3>
                  <span class="text-[10px] text-slate-400">إدارة التفاصيل، الأسعار، المواصفات والتواريخ</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-azure-600 bg-azure-50 px-2.5 py-1 rounded-full border border-azure-100">
                    {{ filteredMyProperties().length }} وحدات
                  </span>
                </div>
              </div>

              <!-- Quick category filter for owner's units -->
              <div class="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                @for (cat of ownerCategories; track cat) {
                  <button
                    (click)="selectedOwnerCategory.set(cat)"
                    class="px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap tap-bounce border transition-all"
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
              <div class="space-y-3.5">
                @for (prop of filteredMyProperties(); track prop.id) {
                  <div class="bg-white rounded-3xl p-3.5 border border-slate-200/80 shadow-sm flex flex-col gap-3 transition-all hover:shadow-md">
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
                            <span class="text-[10px] text-azure-600 font-bold truncate max-w-[130px]">{{ prop.village }}</span>
                            <span class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>نشطة ومتاحة</span>
                            </span>
                          </div>
                          <h4 class="text-xs font-black text-slate-900 truncate mt-0.5">{{ prop.title }}</h4>
                          <div class="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                            <span>{{ prop.bedrooms }} غرف</span>
                            <span>•</span>
                            <span>{{ prop.bathrooms }} حمام</span>
                            <span>•</span>
                            <span>{{ prop.area }} م²</span>
                            <span>•</span>
                            <span class="text-amber-500 font-bold">★ {{ prop.rating }}</span>
                          </div>
                        </div>

                        <div class="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span class="text-xs font-black text-slate-900 font-sans">
                            {{ prop.pricePerDay | number }} ج.م <span class="text-[9px] font-normal text-slate-400">/ ليلة</span>
                          </span>
                          <span class="text-[10px] text-slate-500 font-sans">
                            {{ prop.pricePerMonth ? (prop.pricePerMonth | number) + ' ج.م/شهر' : (prop.blockedDates.length + ' أيام محظورة') }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Property Quick Badges -->
                    <div class="flex flex-wrap gap-1 text-[9px]">
                      @if (prop.hasPrivatePool) {
                        <span class="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-bold border border-sky-100">🏊 مسبح خاص</span>
                      }
                      @if (prop.isCorporateReady) {
                        <span class="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold border border-purple-100">🏢 سكن شركات</span>
                      }
                      <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">📍 {{ prop.regionArabic }}</span>
                      <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">🏖 {{ prop.distanceToBeach }}</span>
                    </div>

                    <!-- Property Action Buttons -->
                    <div class="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                      <!-- Edit Details Button -->
                      <button
                        (click)="openEditModal(prop)"
                        class="py-2 px-2 rounded-xl bg-azure-50 hover:bg-azure-100 text-azure-700 text-[11px] font-bold tap-bounce transition-colors flex items-center justify-center gap-1 border border-azure-100"
                        title="تعديل تفاصيل وأسعار الوحدة"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        <span>تعديل الوحدة</span>
                      </button>

                      <!-- Calendar Button -->
                      <button
                        (click)="openCalendarForUnit(prop)"
                        class="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold tap-bounce transition-colors flex items-center justify-center gap-1"
                        title="عرض وإدارة تقويم الإشغال"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span>التقويم</span>
                      </button>

                      <!-- Preview as Guest Button -->
                      <button
                        (click)="previewUnit(prop)"
                        class="py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold tap-bounce transition-colors flex items-center justify-center gap-1"
                        title="معاينة الشاليه كما يظهر للنزيل"
                      >
                        <svg class="w-3.5 h-3.5 text-azure-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        <span>معاينة</span>
                      </button>
                    </div>
                  </div>
                }

                @if (filteredMyProperties().length === 0) {
                  <div class="py-12 text-center text-xs text-slate-400 bg-white rounded-3xl p-6 border border-slate-100">
                    <div class="text-3xl mb-2">🏖</div>
                    <span class="block font-bold text-slate-600">لا توجد وحدات في هذا التصنيف</span>
                    <button
                      (click)="openAddModal()"
                      class="mt-3 px-4 py-2 rounded-xl bg-azure-600 text-white text-xs font-bold tap-bounce"
                    >
                      + إضافة أول وحدة الآن
                    </button>
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
      </div>

      <!-- ============================================================== -->
      <!-- LUXURY FLOATING BOTTOM NAVIGATION BAR (Identical to Client Dock) -->
      <!-- ============================================================== -->
      <nav class="absolute bottom-[max(1.75rem,calc(1.25rem+env(safe-area-inset-bottom,28px)))] inset-x-4 z-40">
        <div class="relative bg-white/95 backdrop-blur-2xl border border-azure-100/90 rounded-full px-3 py-2 shadow-[0_16px_40px_rgba(2,132,199,0.18)] flex items-center justify-between shadow-[inset_0_1px_2px_rgba(255,255,255,1),_0_12px_36px_rgba(2,132,199,0.14)]">
          
          <!-- 1. وحداتي (Units Tab) -->
          <button
            (click)="activeSubTab.set('units')"
            class="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl tap-bounce transition-all duration-200"
            [class.bg-azure-50]="activeSubTab() === 'units'"
            [class.text-azure-600]="activeSubTab() === 'units'"
            [class.text-slate-400]="activeSubTab() !== 'units'"
            [class.hover:text-azure-500]="activeSubTab() !== 'units'"
          >
            <svg class="w-5 h-5 mb-0.5 transition-transform duration-200" [class.scale-110]="activeSubTab() === 'units'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="text-[10px] font-bold font-arabic leading-tight">وحداتي</span>
            @if (activeSubTab() === 'units') {
              <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5 animate-pulse"></span>
            }
          </button>

          <!-- 2. التقويم (Calendar Tab) -->
          <button
            (click)="activeSubTab.set('calendar')"
            class="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl tap-bounce transition-all duration-200"
            [class.bg-azure-50]="activeSubTab() === 'calendar'"
            [class.text-azure-600]="activeSubTab() === 'calendar'"
            [class.text-slate-400]="activeSubTab() !== 'calendar'"
            [class.hover:text-azure-500]="activeSubTab() !== 'calendar'"
          >
            <svg class="w-5 h-5 mb-0.5 transition-transform duration-200" [class.scale-110]="activeSubTab() === 'calendar'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span class="text-[10px] font-bold font-arabic leading-tight">التقويم</span>
            @if (activeSubTab() === 'calendar') {
              <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5 animate-pulse"></span>
            }
          </button>

          <!-- 3. Raised Center Button: إضافة وحدة جديدة (+ Add Unit) -->
          <div class="relative -top-5 flex-1 flex flex-col items-center justify-center">
            <button
              (click)="openAddModal()"
              class="relative w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 via-azure-600 to-sky-400 text-white shadow-[0_10px_25px_rgba(79,70,229,0.45)] ring-4 ring-white flex items-center justify-center tap-bounce hover:scale-110 active:scale-95 transition-all duration-200 group"
              title="إضافة شاليه أو وحدة جديدة للمنظومة"
            >
              <!-- Glowing Ambient Ring -->
              <span class="absolute inset-0 rounded-full bg-azure-400/25 animate-ping pointer-events-none"></span>

              <!-- Plus Vector Icon -->
              <svg class="w-6 h-6 transition-transform group-hover:scale-110 duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
            <span class="text-[9px] font-black text-indigo-700 tracking-tight mt-0.5 font-arabic">إضافة وحدة</span>
          </div>

          <!-- 4. الحجوزات (Bookings Tab) -->
          <button
            (click)="activeSubTab.set('bookings')"
            class="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl tap-bounce transition-all duration-200"
            [class.bg-azure-50]="activeSubTab() === 'bookings'"
            [class.text-azure-600]="activeSubTab() === 'bookings'"
            [class.text-slate-400]="activeSubTab() !== 'bookings'"
            [class.hover:text-azure-500]="activeSubTab() !== 'bookings'"
          >
            <div class="relative">
              <svg class="w-5 h-5 mb-0.5 transition-transform duration-200" [class.scale-110]="activeSubTab() === 'bookings'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              @if (activeBookings().length > 0) {
                <span class="absolute -top-1 -end-2.5 w-4 h-4 bg-gradient-to-r from-azure-600 to-sky-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                  {{ activeBookings().length }}
                </span>
              }
            </div>
            <span class="text-[10px] font-bold font-arabic leading-tight">الحجوزات</span>
            @if (activeSubTab() === 'bookings') {
              <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5 animate-pulse"></span>
            }
          </button>

          <!-- 5. الأرباح (Earnings Tab) -->
          <button
            (click)="activeSubTab.set('earnings')"
            class="relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-2xl tap-bounce transition-all duration-200"
            [class.bg-azure-50]="activeSubTab() === 'earnings'"
            [class.text-azure-600]="activeSubTab() === 'earnings'"
            [class.text-slate-400]="activeSubTab() !== 'earnings'"
            [class.hover:text-azure-500]="activeSubTab() !== 'earnings'"
          >
            <svg class="w-5 h-5 mb-0.5 transition-transform duration-200" [class.scale-110]="activeSubTab() === 'earnings'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
            <span class="text-[10px] font-bold font-arabic leading-tight">الأرباح</span>
            @if (activeSubTab() === 'earnings') {
              <span class="w-1 h-1 rounded-full bg-azure-600 mt-0.5 animate-pulse"></span>
            }
          </button>

        </div>
      </nav>

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
              <button (click)="isPayoutModalOpen.set(false)" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 tap-bounce">✕</button>
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
                  <button (click)="setPayoutPreset(0.25)" class="flex-1 py-1 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-600 tap-bounce">25%</button>
                  <button (click)="setPayoutPreset(0.50)" class="flex-1 py-1 bg-slate-100 rounded-xl text-[10px] font-bold text-slate-600 tap-bounce">50%</button>
                  <button (click)="setPayoutPreset(1.00)" class="flex-1 py-1 bg-azure-50 rounded-xl text-[10px] font-bold text-azure-700 tap-bounce">كامل الرصيد (100%)</button>
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

      <!-- ============================================================== -->
      <!-- MODAL 2: تعديل كامل تفاصيل الوحدة والشاليه (Full Comprehensive Edit) -->
      <!-- ============================================================== -->
      @if (editingProp(); as prop) {
        <div class="fixed inset-0 z-50 flex flex-col justify-end font-arabic">
          <div (click)="editingProp.set(null)" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md"></div>
          <div class="relative w-full max-h-[92%] bg-white rounded-t-[36px] shadow-2xl p-6 flex flex-col overflow-y-auto no-scrollbar animate-slide-up">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3"></div>

            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-sm font-black text-slate-900">تعديل بيانات وتفاصيل الوحدة</h3>
                <span class="text-[10px] text-slate-400">تحديث الأسعار، المواصفات، الصور، والمزايا</span>
              </div>
              <button (click)="editingProp.set(null)" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 tap-bounce">✕</button>
            </div>

            <!-- Edit Form -->
            <div class="space-y-4 my-3 text-slate-800">
              
              <!-- 1. Title & Village -->
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">عنوان الوحدة الرئيسي</label>
                <input
                  type="text"
                  [(ngModel)]="editTitle"
                  class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                />
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">القرية أو الكمبوند</label>
                  <input
                    type="text"
                    [(ngModel)]="editVillage"
                    class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">المنطقة الجغرافية</label>
                  <select
                    [(ngModel)]="editRegion"
                    class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  >
                    <option value="north-coast">الساحل الشمالي</option>
                    <option value="new-cairo">القاهرة الجديدة (التجمع)</option>
                    <option value="zayed-october">الشيخ زايد و6 أكتوبر</option>
                    <option value="new-capital">العاصمة الإدارية الجديدة</option>
                    <option value="red-sea">البحر الأحمر والجونة</option>
                    <option value="zamalek">الزمالك والنيل</option>
                    <option value="maadi">المعادي</option>
                  </select>
                </div>
              </div>

              <!-- 2. Category & Target Audience -->
              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">نوع وتصنيف الوحدة</label>
                  <select
                    [(ngModel)]="editCategory"
                    class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  >
                    <option value="chalet">شاليه فاخر</option>
                    <option value="villa">فيلا مستقلة</option>
                    <option value="penthouse">بنتهاوس تنفيذي</option>
                    <option value="apartment">شقة فندقية</option>
                    <option value="corporate-housing">سكن شركات وخبراء</option>
                    <option value="staff-residence">سكن عمال وكوادر</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">الفئة المستهدفة</label>
                  <select
                    [(ngModel)]="editTargetAudience"
                    class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  >
                    <option value="سياحة شاطئية">سياحة شاطئية</option>
                    <option value="عائلات وفنادق">عائلات وفنادق</option>
                    <option value="رجال أعمال وشركات">رجال أعمال وشركات</option>
                    <option value="سكن مهندسين وعمال ومشاريع">سكن مهندسين وعمال</option>
                  </select>
                </div>
              </div>

              <!-- 3. Pricing Matrix -->
              <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <span class="text-[11px] font-black text-slate-900 block">خطط الأسعار (جنيه مصري)</span>
                <div class="grid grid-cols-2 gap-2.5">
                  <div>
                    <label class="text-[10px] font-bold text-slate-600 block mb-0.5">السعر / ليلة</label>
                    <input
                      type="number"
                      [(ngModel)]="editPriceDay"
                      class="w-full text-xs font-sans font-bold p-2 bg-white rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                    />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-600 block mb-0.5">السعر / أسبوع</label>
                    <input
                      type="number"
                      [(ngModel)]="editPriceWeek"
                      class="w-full text-xs font-sans font-bold p-2 bg-white rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                    />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-600 block mb-0.5">السعر / شهر</label>
                    <input
                      type="number"
                      [(ngModel)]="editPriceMonth"
                      class="w-full text-xs font-sans font-bold p-2 bg-white rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                    />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-slate-600 block mb-0.5">السعر / سنة</label>
                    <input
                      type="number"
                      [(ngModel)]="editPriceYear"
                      class="w-full text-xs font-sans font-bold p-2 bg-white rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                    />
                  </div>
                </div>
              </div>

              <!-- 4. Specifications: Area, Bedrooms, Bathrooms, Max Guests -->
              <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <span class="text-[11px] font-black text-slate-900 block">مواصفات السعة والغرف</span>
                <div class="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <label class="text-[9px] font-bold text-slate-500 block mb-0.5">المساحة م²</label>
                    <input
                      type="number"
                      [(ngModel)]="editArea"
                      class="w-full text-xs font-sans font-bold p-2 bg-white rounded-xl border border-slate-200 text-center outline-none focus:border-azure-600"
                    />
                  </div>
                  <div>
                    <label class="text-[9px] font-bold text-slate-500 block mb-0.5">غرف النوم</label>
                    <input
                      type="number"
                      [(ngModel)]="editBedrooms"
                      class="w-full text-xs font-sans font-bold p-2 bg-white rounded-xl border border-slate-200 text-center outline-none focus:border-azure-600"
                    />
                  </div>
                  <div>
                    <label class="text-[9px] font-bold text-slate-500 block mb-0.5">الحمامات</label>
                    <input
                      type="number"
                      [(ngModel)]="editBathrooms"
                      class="w-full text-xs font-sans font-bold p-2 bg-white rounded-xl border border-slate-200 text-center outline-none focus:border-azure-600"
                    />
                  </div>
                  <div>
                    <label class="text-[9px] font-bold text-slate-500 block mb-0.5">أقصى نزلاء</label>
                    <input
                      type="number"
                      [(ngModel)]="editMaxGuests"
                      class="w-full text-xs font-sans font-bold p-2 bg-white rounded-xl border border-slate-200 text-center outline-none focus:border-azure-600"
                    />
                  </div>
                </div>
              </div>

              <!-- 5. Pool, Beach & Corporate Options -->
              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">نوع المسبح</label>
                  <select
                    [(ngModel)]="editPoolType"
                    class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  >
                    <option value="خاص إنفينيتي">خاص إنفينيتي</option>
                    <option value="خاص مع جاكوزي">خاص مع جاكوزي</option>
                    <option value="مشترك فاخر">مشترك فاخر</option>
                    <option value="بدون مسبح">بدون مسبح</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">المسافة للشاطئ</label>
                  <input
                    type="text"
                    [(ngModel)]="editDistanceToBeach"
                    placeholder="صف أول على البحر مباشرة"
                    class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
              </div>

              <!-- Toggles: Private pool & Corporate ready -->
              <div class="grid grid-cols-2 gap-2 pt-1">
                <label class="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input type="checkbox" [(ngModel)]="editHasPrivatePool" class="rounded accent-azure-600"/>
                  <span class="text-[11px] font-bold text-slate-700">مسبح خاص بالوحدة</span>
                </label>
                <label class="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input type="checkbox" [(ngModel)]="editIsCorporateReady" class="rounded accent-azure-600"/>
                  <span class="text-[11px] font-bold text-slate-700">مخصص لوفود الشركات</span>
                </label>
              </div>

              <!-- 6. Features / Amenities Tags -->
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">المميزات والخدمات المتاحة</label>
                <div class="flex flex-wrap gap-1.5 mb-2">
                  @for (feat of editFeaturesList; track feat) {
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-azure-50 text-azure-700 text-[10px] font-bold border border-azure-200">
                      <span>{{ feat }}</span>
                      <button (click)="removeFeature(feat)" class="text-rose-500 hover:text-rose-700 text-xs">✕</button>
                    </span>
                  }
                </div>
                <!-- Quick add custom amenity -->
                <div class="flex gap-2">
                  <input
                    type="text"
                    [(ngModel)]="newFeatureInput"
                    placeholder="أضف ميزة جديدة (مثال: شاحن سيارات كهربائية)..."
                    class="flex-1 text-xs p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                    (keyup.enter)="addFeature()"
                  />
                  <button
                    (click)="addFeature()"
                    class="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold tap-bounce"
                  >
                    + إضافة
                  </button>
                </div>
              </div>

              <!-- 7. Image URL & Preview -->
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">رابط صورة الوحدة الرئيسية</label>
                <div class="flex gap-2 items-center">
                  <input
                    type="text"
                    [(ngModel)]="editMainImage"
                    dir="ltr"
                    class="flex-1 text-xs p-2 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600 font-sans"
                  />
                  <div class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                    <img [src]="editMainImage" alt="Preview" class="w-full h-full object-cover"/>
                  </div>
                </div>
              </div>

              <!-- 8. Description -->
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">الوصف التفصيلي والخدمات</label>
                <textarea
                  [(ngModel)]="editDescription"
                  rows="3"
                  class="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600 leading-relaxed"
                ></textarea>
              </div>

              <!-- Save / Delete Buttons -->
              <div class="space-y-2 pt-2">
                <button
                  (click)="savePropertyEdit(prop.id)"
                  class="w-full py-3.5 bg-azure-600 hover:bg-azure-700 text-white text-xs font-black rounded-full shadow-lg tap-bounce flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>حفظ جميع التعديلات وتحديث المنظومة</span>
                </button>

                <button
                  (click)="deleteProperty(prop.id)"
                  class="w-full py-2.5 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl tap-bounce transition-colors"
                >
                  🗑 حذف هذه الوحدة من قائمة شاليهاتي
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ============================================== -->
      <!-- MODAL 3: إضافة شاليه أو وحدة جديدة (Add Modal) -->
      <!-- ============================================== -->
      @if (isAddModalOpen()) {
        <div class="fixed inset-0 z-50 flex flex-col justify-end font-arabic">
          <div (click)="isAddModalOpen.set(false)" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md"></div>
          <div class="relative w-full max-h-[92%] bg-white rounded-t-[36px] shadow-2xl p-6 flex flex-col overflow-y-auto no-scrollbar animate-slide-up">
            <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3"></div>

            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 class="text-sm font-black text-slate-900">إضافة شاليه أو فيلا جديدة</h3>
                <span class="text-[10px] text-slate-400">إدراج الوحدة في محرك بحث Ragab Pay فوراً</span>
              </div>
              <button (click)="isAddModalOpen.set(false)" class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 tap-bounce">✕</button>
            </div>

            <div class="space-y-3.5 my-3">
              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">اسم الوحدة والشاليه</label>
                <input
                  type="text"
                  [(ngModel)]="newUnitTitle"
                  placeholder="مثال: شاليه لاجون فيو - مراسي الساحل الشمالي"
                  class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                />
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">القرية أو الكمبوند</label>
                  <input
                    type="text"
                    [(ngModel)]="newUnitVillage"
                    placeholder="مراسي - سيدي عبد الرحمن"
                    class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">المنطقة</label>
                  <select
                    [(ngModel)]="newUnitRegion"
                    class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  >
                    <option value="north-coast">الساحل الشمالي</option>
                    <option value="new-cairo">القاهرة الجديدة</option>
                    <option value="zayed-october">الشيخ زايد و6 أكتوبر</option>
                    <option value="new-capital">العاصمة الإدارية</option>
                    <option value="red-sea">البحر الأحمر</option>
                    <option value="zamalek">الزمالك</option>
                    <option value="maadi">المعادي</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label class="text-[10px] font-bold text-slate-700 block mb-1">نوع وتصنيف الوحدة</label>
                  <select
                    [(ngModel)]="newUnitCategory"
                    class="w-full text-xs font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
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
                    [(ngModel)]="newUnitPrice"
                    placeholder="7500"
                    class="w-full text-xs font-sans font-bold p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600"
                  />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[9px] font-bold text-slate-600 block mb-1">غرف النوم</label>
                  <input
                    type="number"
                    [(ngModel)]="newUnitBedrooms"
                    class="w-full text-xs font-sans font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 text-center outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[9px] font-bold text-slate-600 block mb-1">الحمامات</label>
                  <input
                    type="number"
                    [(ngModel)]="newUnitBathrooms"
                    class="w-full text-xs font-sans font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 text-center outline-none focus:border-azure-600"
                  />
                </div>
                <div>
                  <label class="text-[9px] font-bold text-slate-600 block mb-1">المساحة م²</label>
                  <input
                    type="number"
                    [(ngModel)]="newUnitArea"
                    class="w-full text-xs font-sans font-bold p-2 bg-slate-50 rounded-xl border border-slate-200 text-center outline-none focus:border-azure-600"
                  />
                </div>
              </div>

              <div>
                <label class="text-[11px] font-bold text-slate-700 block mb-1">الوصف</label>
                <textarea
                  [(ngModel)]="newUnitDescription"
                  rows="2"
                  placeholder="وصف مميزات الشاليه والتجهيزات الفندقية..."
                  class="w-full text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-600 leading-relaxed"
                ></textarea>
              </div>

              <button
                (click)="saveNewUnit()"
                class="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-full shadow-lg tap-bounce flex items-center justify-center gap-2"
              >
                <span>✨ إدراج الوحدة في منظومة Ragab Pay</span>
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

  // Owner Properties computed from AppStateService
  readonly myProperties = computed(() => {
    const ids = this.state.ownerPropertyIds();
    return this.state.properties().filter(p => ids.includes(p.id));
  });

  // Filtered properties based on owner category
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
      propertyTitle: 'شاليه ملكي بفيو بانورامي على الشاطئ',
      checkIn: '2026-11-20',
      checkOut: '2026-11-23',
      nights: 3,
      netEarnings: 12000,
      status: 'confirmed',
      statusLabel: 'قادم قريباً'
    },
    {
      id: 'hb-2',
      guestName: 'د. ياسمين فهمي',
      guestAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      guestPhone: '+20 102 334 5566',
      propertyTitle: 'فيلا قصر البحر الملكي - مراسي',
      checkIn: '2026-11-14',
      checkOut: '2026-11-17',
      nights: 3,
      netEarnings: 36000,
      status: 'confirmed',
      statusLabel: 'مؤكد ومسدد'
    },
    {
      id: 'hb-3',
      guestName: 'شركة المقاولات الهندسية الكبرى',
      guestAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      guestPhone: '+20 111 999 8888',
      propertyTitle: 'مجمع سكني تنفيذي للمهندسين - العاصمة',
      checkIn: '2026-11-01',
      checkOut: '2026-11-30',
      nights: 30,
      netEarnings: 75000,
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

  // Comprehensive Edit Modal Open
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
      'zayed-october': 'الشيخ زايد و6 أكتوبر',
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
      'corporate-housing': 'سكن شركات وخبراء',
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
    if (confirm('هل أنت متأكد من رغبتك في حذف هذه الوحدة من قائمة وحداتك؟')) {
      this.state.deleteProperty(propId);
      this.editingProp.set(null);
    }
  }

  openAddModal() {
    this.newUnitTitle = '';
    this.newUnitVillage = 'مراسي - سيدي عبد الرحمن';
    this.newUnitRegion = 'north-coast';
    this.newUnitCategory = 'chalet';
    this.newUnitPrice = 7500;
    this.newUnitBedrooms = 3;
    this.newUnitBathrooms = 2;
    this.newUnitArea = 180;
    this.newUnitDescription = 'شاليه حديث متكامل التجهيزات الفندقية مع إطلالة بحرية خلابة، خدمة كونسيرج 24/7.';
    this.isAddModalOpen.set(true);
  }

  saveNewUnit() {
    if (!this.newUnitTitle) return;

    const regionNames: Record<string, string> = {
      'north-coast': 'الساحل الشمالي',
      'new-cairo': 'القاهرة الجديدة',
      'zayed-october': 'الشيخ زايد و6 أكتوبر',
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
      distanceToBeach: 'صف أول مباشر 50م',
      distanceToBeachValue: 50,
      area: Number(this.newUnitArea) || 180,
      bedrooms: Number(this.newUnitBedrooms) || 3,
      bathrooms: Number(this.newUnitBathrooms) || 2,
      poolType: 'خاص إنفينيتي',
      hasPrivatePool: true,
      maxGuests: 6,
      isCorporateReady: this.newUnitCategory === 'corporate-housing',
      targetAudience: this.newUnitCategory === 'corporate-housing' ? 'سكن مهندسين وعمال ومشاريع' : 'سياحة شاطئية',
      features: ['مكيف بالكامل', 'شاطئ خاص', 'واي فاي فائق السرعة', 'أمن 24 ساعة', 'تنظيف فندقي يومي'],
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
      description: this.newUnitDescription || 'شاليه تم إدراجه حديثاً عبر بوابة الملاك لمنظومة Ragab Pay.',
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
    }, 2200);
  }

  openGuestWhatsApp(phone: string, name: string, prop: string) {
    const clean = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`مرحباً أستاذ ${name}، أنا مالك ومضيف ${prop} في منصة Ragab Pay. بخصوص حجزك القادم...`);
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  }
}
