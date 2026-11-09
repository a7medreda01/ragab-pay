import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService, FilterCriteria } from '../../services/app-state.service';

@Component({
  selector: 'app-filter-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (state.isFilterOpen()) {
      <div class="absolute inset-0 z-50 flex flex-col justify-end">
        <!-- Backdrop Blur -->
        <div
          (click)="close()"
          class="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
        ></div>

        <!-- Sheet Body -->
        <div class="relative w-full max-h-[88%] bg-white/95 backdrop-blur-2xl rounded-t-[36px] shadow-2xl border-t border-white/50 flex flex-col overflow-hidden animate-slide-up">
          <!-- Grabber Handle -->
          <div class="w-full flex justify-center pt-3 pb-1 cursor-pointer" (click)="close()">
            <div class="w-12 h-1.5 bg-slate-300 rounded-full"></div>
          </div>

          <!-- Header -->
          <div class="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 class="text-sm font-bold text-slate-900 font-arabic">محرك البحث والتصفية المتقدم - Ragab Pay</h2>
            <button
              (click)="reset()"
              class="text-xs font-semibold text-azure-600 hover:text-azure-700 font-arabic tap-bounce"
            >
              إعادة ضبط
            </button>
          </div>

          <!-- Scrollable Content -->
          <div class="px-6 py-4 overflow-y-auto space-y-5 no-scrollbar pb-28 font-arabic">
            <!-- 1. نظام الإقامة والتعاقد -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">مدة ونظام الإقامة</label>
              <div class="grid grid-cols-4 gap-2 bg-slate-100 p-1 rounded-2xl">
                @for (type of rentalTypes; track type.id) {
                  <button
                    (click)="setRentalType(type.id)"
                    class="py-2 text-xs font-semibold rounded-xl transition-all duration-200 tap-bounce"
                    [class.bg-white]="criteria.rentalType === type.id"
                    [class.text-slate-900]="criteria.rentalType === type.id"
                    [class.shadow-xs]="criteria.rentalType === type.id"
                    [class.text-slate-500]="criteria.rentalType !== type.id"
                  >
                    {{ type.label }}
                  </button>
                }
              </div>
            </div>

            <!-- 2. النطاق الجغرافي الشامل (7 مناطق مصرية كبرى) -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">الوجهة أو النطاق الجغرافي</label>
              <div class="flex flex-wrap gap-2">
                @for (r of regions; track r.id) {
                  <button
                    (click)="setRegion(r.id)"
                    class="px-3 py-1.5 text-xs font-semibold rounded-full border transition-all tap-bounce"
                    [class.bg-slate-900]="criteria.region === r.id"
                    [class.text-white]="criteria.region === r.id"
                    [class.border-slate-900]="criteria.region === r.id"
                    [class.bg-white]="criteria.region !== r.id"
                    [class.text-slate-700]="criteria.region !== r.id"
                    [class.border-slate-200]="criteria.region !== r.id"
                  >
                    {{ r.label }}
                  </button>
                }
              </div>
            </div>

            <!-- 3. سكن شركات وعمال ومشاريع Toggle -->
            <div class="flex items-center justify-between p-3.5 bg-azure-50/70 rounded-2xl border border-azure-200/70">
              <div>
                <span class="block text-xs font-bold text-azure-950">سكن شركات وعمال ووفود هندسية</span>
                <span class="block text-[10px] text-azure-700">عرض المجمعات السكنية متعددة الغرف المجهزة للمشاريع</span>
              </div>
              <button
                (click)="toggleCorporateOnly()"
                class="w-11 h-6 rounded-full transition-colors relative tap-bounce p-0.5"
                [class.bg-azure-600]="criteria.corporateOnly === true"
                [class.bg-slate-300]="criteria.corporateOnly !== true"
              >
                <div
                  class="w-5 h-5 bg-white rounded-full transition-transform shadow-xs"
                  [class.translate-x-5]="criteria.corporateOnly === true"
                  [class.translate-x-0]="criteria.corporateOnly !== true"
                ></div>
              </button>
            </div>

            <!-- 4. الميزانية اليومية (جنيه مصري) -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">الحد الأقصى للسعر / ليلة</label>
                <span class="text-xs font-bold text-azure-600 font-sans">
                  {{ criteria.maxPrice | number }} ج.م
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="30000"
                step="1000"
                [(ngModel)]="criteria.maxPrice"
                (ngModelChange)="onPriceChange()"
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-azure-600"
              />
              <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>2,000 ج.م</span>
                <span>15,000 ج.م</span>
                <span>30,000+ ج.م</span>
              </div>
            </div>

            <!-- 5. القرب من الشاطئ -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">المسافة للبحر</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  (click)="setBeachDistance(60)"
                  class="py-2.5 px-3 text-xs font-bold rounded-2xl border text-center transition-all tap-bounce flex items-center justify-center gap-1.5"
                  [class.bg-azure-50]="criteria.beachDistanceMax === 60"
                  [class.text-azure-700]="criteria.beachDistanceMax === 60"
                  [class.border-azure-400]="criteria.beachDistanceMax === 60"
                  [class.bg-white]="criteria.beachDistanceMax !== 60"
                  [class.text-slate-700]="criteria.beachDistanceMax !== 60"
                  [class.border-slate-200]="criteria.beachDistanceMax !== 60"
                >
                  <svg class="w-3.5 h-3.5 text-azure-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M3 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/></svg>
                  <span>صف أول مباشر</span>
                </button>
                <button
                  (click)="setBeachDistance(300)"
                  class="py-2.5 px-3 text-xs font-bold rounded-2xl border text-center transition-all tap-bounce flex items-center justify-center gap-1.5"
                  [class.bg-azure-50]="criteria.beachDistanceMax === 300"
                  [class.text-azure-700]="criteria.beachDistanceMax === 300"
                  [class.border-azure-400]="criteria.beachDistanceMax === 300"
                  [class.bg-white]="criteria.beachDistanceMax !== 300"
                  [class.text-slate-700]="criteria.beachDistanceMax !== 300"
                  [class.border-slate-200]="criteria.beachDistanceMax !== 300"
                >
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>أقل من 300م</span>
                </button>
                <button
                  (click)="setBeachDistance(5000)"
                  class="py-2.5 px-3 text-xs font-bold rounded-2xl border text-center transition-all tap-bounce flex items-center justify-center gap-1.5"
                  [class.bg-azure-50]="criteria.beachDistanceMax === 5000"
                  [class.text-azure-700]="criteria.beachDistanceMax === 5000"
                  [class.border-azure-400]="criteria.beachDistanceMax === 5000"
                  [class.bg-white]="criteria.beachDistanceMax !== 5000"
                  [class.text-slate-700]="criteria.beachDistanceMax !== 5000"
                  [class.border-slate-200]="criteria.beachDistanceMax !== 5000"
                >
                  <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>أي مسافة</span>
                </button>
              </div>
            </div>

            <!-- 6. عدد غرف النوم (من 1 إلى 8+ غرف) -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">عدد الغرف الأدنى</label>
              <div class="flex gap-1.5">
                @for (bed of [null, 1, 2, 3, 4, 6, 8]; track $index) {
                  <button
                    (click)="setBedrooms(bed)"
                    class="flex-1 py-2 text-xs font-bold rounded-xl border transition-all tap-bounce"
                    [class.bg-slate-900]="criteria.bedrooms === bed"
                    [class.text-white]="criteria.bedrooms === bed"
                    [class.border-slate-900]="criteria.bedrooms === bed"
                    [class.bg-white]="criteria.bedrooms !== bed"
                    [class.text-slate-700]="criteria.bedrooms !== bed"
                    [class.border-slate-200]="criteria.bedrooms !== bed"
                  >
                    {{ bed === null ? 'الكل' : bed + '+' }}
                  </button>
                }
              </div>
            </div>

            <!-- 7. مسبح خاص -->
            <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <span class="block text-xs font-bold text-slate-900">مسبح خاص (Private Pool)</span>
                <span class="block text-[10px] text-slate-400">عرض الفيلات والشاليهات التي تحوي مسبحاً مستقلاً</span>
              </div>
              <button
                (click)="togglePrivatePool()"
                class="w-11 h-6 rounded-full transition-colors relative tap-bounce p-0.5"
                [class.bg-azure-600]="criteria.hasPrivatePool === true"
                [class.bg-slate-300]="criteria.hasPrivatePool !== true"
              >
                <div
                  class="w-5 h-5 bg-white rounded-full transition-transform shadow-xs"
                  [class.translate-x-5]="criteria.hasPrivatePool === true"
                  [class.translate-x-0]="criteria.hasPrivatePool !== true"
                ></div>
              </button>
            </div>
          </div>

          <!-- Sticky Apply Button -->
          <div class="absolute bottom-0 inset-x-0 p-5 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center gap-3">
            <button
              (click)="apply()"
              class="flex-1 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-full shadow-lg flex items-center justify-center gap-2 tap-bounce font-arabic"
            >
              <span>عرض ({{ state.matchedCount() }}) وحدة متوافقة في Ragab Pay</span>
              <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class FilterSheetComponent {
  readonly state = inject(AppStateService);

  criteria: FilterCriteria = { ...this.state.filterCriteria() };

  readonly rentalTypes = [
    { id: 'daily' as const, label: 'يومي' },
    { id: 'weekly' as const, label: 'أسبوعي' },
    { id: 'monthly' as const, label: 'شهري' },
    { id: 'yearly' as const, label: 'سنوي' }
  ];

  readonly regions = [
    { id: 'all', label: 'كل مصر' },
    { id: 'north-coast', label: 'الساحل الشمالي' },
    { id: 'new-capital', label: 'العاصمة الإدارية' },
    { id: 'new-cairo', label: 'التجمع والقاهرة الجديدة' },
    { id: 'zayed-october', label: 'الشيخ زايد و6 أكتوبر' },
    { id: 'zamalek', label: 'الزمالك' },
    { id: 'maadi', label: 'المعادي' },
    { id: 'red-sea', label: 'البحر الأحمر والجونة' }
  ];

  setRentalType(type: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    this.criteria.rentalType = type;
    this.syncState();
  }

  setRegion(region: string) {
    this.criteria.region = region;
    this.syncState();
  }

  setBeachDistance(dist: number) {
    this.criteria.beachDistanceMax = dist;
    this.syncState();
  }

  setBedrooms(bed: number | null) {
    this.criteria.bedrooms = bed;
    this.syncState();
  }

  togglePrivatePool() {
    this.criteria.hasPrivatePool = this.criteria.hasPrivatePool === true ? null : true;
    this.syncState();
  }

  toggleCorporateOnly() {
    this.criteria.corporateOnly = this.criteria.corporateOnly === true ? null : true;
    this.syncState();
  }

  onPriceChange() {
    this.syncState();
  }

  syncState() {
    this.state.updateFilters(this.criteria);
  }

  apply() {
    this.state.isFilterOpen.set(false);
    this.state.navigateToTab('search');
  }

  reset() {
    this.state.resetFilters();
    this.criteria = { ...this.state.filterCriteria() };
  }

  close() {
    this.state.isFilterOpen.set(false);
  }
}
