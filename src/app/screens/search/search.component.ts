import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../../components/property-image/property-image.component';
import { Property } from '../../data/properties.data';

@Component({
  selector: 'app-search-screen',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyImageComponent],
  template: `
    <div class="w-full h-full overflow-y-auto no-scrollbar pb-[max(7.5rem,calc(6.5rem+env(safe-area-inset-bottom,24px)))] font-arabic bg-slate-50 select-none">
      
      <!-- Search Header -->
      <div class="sticky top-0 z-20 px-5 pt-3.5 pb-2.5 bg-white/85 backdrop-blur-xl border-b border-slate-100 shadow-2xs">
        <div class="flex items-center gap-2">
          <!-- Search Input -->
          <div class="flex-1 relative flex items-center bg-slate-100/90 rounded-2xl px-3 py-2 border border-slate-200/70 focus-within:border-azure-500 focus-within:bg-white transition-all">
            <i class="bi bi-search text-slate-400 ms-1 text-xs"></i>
            <input
              type="text"
              placeholder="ابحث بالمنطقة أو القرية..."
              [ngModel]="state.searchQuery()"
              (ngModelChange)="onQueryChange($event)"
              class="w-full bg-transparent border-none outline-none text-xs font-semibold text-slate-800 placeholder-slate-400 ms-2"
            />
            @if (state.searchQuery()) {
              <button (click)="clearSearch()" class="text-slate-400 hover:text-slate-600 text-xs p-0.5">
                <i class="bi bi-x-lg"></i>
              </button>
            }
          </div>

          <!-- Filter Button -->
          <button
            (click)="openFilters()"
            class="relative w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center tap-bounce shadow-xs"
            title="تصفية النتائج"
          >
            <i class="bi bi-sliders text-sm"></i>
            @if (activeFilterCount() > 0) {
              <span class="absolute -top-1 -end-1 w-3.5 h-3.5 bg-azure-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {{ activeFilterCount() }}
              </span>
            }
          </button>
        </div>

        <!-- Category Chips -->
        <div class="flex gap-1.5 overflow-x-auto no-scrollbar pt-2.5">
          @for (cat of quickCategories; track cat) {
            <button
              (click)="selectCategory(cat)"
              class="px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap tap-bounce transition-all border"
              [class.bg-azure-600]="state.selectedCategory() === cat"
              [class.text-white]="state.selectedCategory() === cat"
              [class.border-azure-600]="state.selectedCategory() === cat"
              [class.bg-white]="state.selectedCategory() !== cat"
              [class.text-slate-600]="state.selectedCategory() !== cat"
              [class.border-slate-200]="state.selectedCategory() !== cat"
            >
              {{ cat }}
            </button>
          }
        </div>
      </div>

      <!-- Count & Sort -->
      <div class="px-5 py-2.5 flex items-center justify-between text-xs font-arabic border-b border-slate-100 bg-white">
        <div class="flex items-center gap-1">
          <span class="font-extrabold text-slate-900">{{ state.matchedCount() }}</span>
          <span class="text-slate-500">وحدة متوفرة</span>
        </div>

        <div class="flex items-center gap-1 text-slate-600">
          <span class="text-[10px] text-slate-400">الترتيب:</span>
          <select
            [ngModel]="state.sortBy()"
            (ngModelChange)="onSortChange($event)"
            class="bg-transparent font-bold text-xs text-azure-700 outline-none cursor-pointer"
          >
            <option value="recommended">الموصى به</option>
            <option value="price-asc">الأقل سعراً</option>
            <option value="price-desc">الأعلى سعراً</option>
            <option value="beach">الأقرب للبحر</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>
      </div>

      <!-- Property Cards List -->
      <div class="px-5 py-3 space-y-3.5">
        @for (prop of state.filteredProperties(); track prop.id) {
          <div
            (click)="viewDetails(prop)"
            class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer tap-bounce"
          >
            <div class="relative h-48 w-full">
              <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>

              <div class="absolute top-3 start-3 flex items-center gap-1.5 z-10 flex-wrap">
                <span class="px-2.5 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[9px] font-bold">
                  {{ prop.categoryArabic }}
                </span>
                @if (prop.isCorporateReady) {
                  <span class="px-2 py-0.5 rounded-full bg-azure-600/90 backdrop-blur-md text-white text-[9px] font-bold">
                    سكن شركات
                  </span>
                }
              </div>

              <div class="absolute top-3 end-3 flex items-center gap-1.5 z-10">
                <button
                  (click)="$event.stopPropagation(); toggleFav(prop.id)"
                  [attr.aria-label]="state.isFavorite(prop.id) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'"
                  class="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md text-slate-700 flex items-center justify-center shadow-md tap-bounce"
                >
                  <i
                    class="bi text-sm"
                    [class.bi-heart-fill]="state.isFavorite(prop.id)"
                    [class.text-rose-500]="state.isFavorite(prop.id)"
                    [class.bi-heart]="!state.isFavorite(prop.id)"
                  ></i>
                </button>
              </div>

              <div class="absolute bottom-2.5 start-2.5 z-10">
                <span class="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                  <i class="bi bi-water text-azure-300"></i>
                  <span>{{ prop.distanceToBeach }}</span>
                </span>
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="text-xs font-bold text-slate-900 leading-snug">{{ prop.title }}</h3>
                  <p class="text-[11px] text-azure-700 font-semibold mt-0.5">{{ prop.village }}</p>
                </div>
                <div class="flex items-center gap-0.5 text-amber-500 text-xs font-extrabold flex-shrink-0">
                  <i class="bi bi-star-fill text-[10px]"></i>
                  <span>{{ prop.rating }}</span>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2 my-3">
                <div class="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                  <span class="block text-xs font-bold text-slate-900">{{ prop.bedrooms }} غرف</span>
                  <span class="block text-[10px] text-slate-600 font-medium">نوم</span>
                </div>
                <div class="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                  <span class="block text-xs font-bold text-slate-900">{{ prop.area }} م²</span>
                  <span class="block text-[10px] text-slate-600 font-medium">المساحة</span>
                </div>
                <div class="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                  <span class="block text-xs font-bold text-azure-700 truncate">{{ prop.poolType }}</span>
                  <span class="block text-[10px] text-slate-600 font-medium">مسبح</span>
                </div>
              </div>

              <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span class="text-sm font-black text-slate-900">{{ prop.pricePerDay | number }} ج.م</span>
                  <span class="text-[10px] text-slate-600"> / ليلة</span>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    (click)="$event.stopPropagation(); toggleComparison(prop)"
                    [attr.aria-label]="state.isInComparison(prop.id) ? 'إزالة من المقارنة' : 'إضافة إلى المقارنة'"
                    class="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors tap-bounce"
                    [class.bg-azure-50]="state.isInComparison(prop.id)"
                    [class.text-azure-700]="state.isInComparison(prop.id)"
                    [class.border-azure-400]="state.isInComparison(prop.id)"
                    [class.bg-white]="!state.isInComparison(prop.id)"
                    [class.text-slate-700]="!state.isInComparison(prop.id)"
                    [class.border-slate-200]="!state.isInComparison(prop.id)"
                  >
                    {{ state.isInComparison(prop.id) ? 'تمت الإضافة' : '+ مقارنة' }}
                  </button>

                  <button
                    (click)="$event.stopPropagation(); bookDirect(prop)"
                    class="px-4 py-1.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold rounded-full tap-bounce shadow-sm"
                  >
                    احجز الآن
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        @if (state.matchedCount() === 0) {
          <div class="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs my-4">
            <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3 text-2xl shadow-inner">
              <i class="bi bi-search"></i>
            </div>
            <h3 class="text-sm font-bold text-slate-900">لا توجد وحدات مطابقة لبحثك</h3>
            <p class="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
              جرّب تعديل الكلمات الدلالية أو إعادة ضبط الفلاتر لتصفح كافة الشاليهات والفيلات المتاحة.
            </p>
            <button
              (click)="resetAllFilters()"
              class="mt-4 px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-full text-xs font-bold tap-bounce shadow-md flex items-center gap-1.5"
            >
              <i class="bi bi-arrow-repeat text-xs"></i>
              <span>إعادة ضبط الفلاتر والبحث</span>
            </button>
          </div>
        }
      </div>

      <!-- Floating Comparison Bar -->
      @if (state.comparisonList().length > 0) {
        <div class="fixed bottom-24 inset-x-8 z-30">
          <button
            (click)="openComparison()"
            class="w-full py-2.5 px-4 bg-gradient-to-r from-azure-700 to-slate-900 text-white rounded-full shadow-lg border border-white/20 flex items-center justify-between tap-bounce"
          >
            <div class="flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-black flex items-center justify-center">
                {{ state.comparisonList().length }}
              </span>
              <span class="text-xs font-bold">مقارنة الوحدات</span>
            </div>
            <i class="bi bi-chevron-left text-xs text-azure-200"></i>
          </button>
        </div>
      }
    </div>
  `
})
export class SearchScreenComponent {
  readonly state = inject(AppStateService);

  readonly quickCategories = [
    'الكل',
    'سكن شركات وعمال',
    'شاليهات بحرية',
    'فيلات مستقلة',
    'إقامات شهرية',
    'عقود سنوية',
    'صف أول عالبحر'
  ];

  activeFilterCount(): number {
    let count = 0;
    const f = this.state.filterCriteria();
    if (f.region !== 'all') count++;
    if (f.beachDistanceMax < 5000) count++;
    if (f.bedrooms !== null) count++;
    if (f.hasPrivatePool === true) count++;
    if (f.maxPrice < 15000) count++;
    return count;
  }

  onQueryChange(q: string) {
    this.state.setSearchQuery(q);
  }

  clearSearch() {
    this.state.setSearchQuery('');
  }

  selectCategory(cat: string) {
    this.state.setCategory(cat);
  }

  onSortChange(sort: any) {
    this.state.setSortBy(sort);
  }

  openFilters() {
    this.state.isFilterOpen.set(true);
  }

  viewDetails(prop: Property) {
    this.state.openDetails(prop);
  }

  toggleFav(id: string) {
    this.state.toggleFavorite(id);
  }

  toggleComparison(prop: Property) {
    if (this.state.isInComparison(prop.id)) {
      this.state.removeFromComparison(prop.id);
    } else {
      this.state.addToComparison(prop);
    }
  }

  bookDirect(prop: Property) {
    this.state.startBooking(prop);
  }

  openComparison() {
    this.state.isComparisonOpen.set(true);
  }

  resetAllFilters() {
    this.state.resetFilters();
  }
}
