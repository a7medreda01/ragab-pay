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
      <!-- Search Header & Omni-Search Bar -->
      <div class="sticky top-0 z-20 px-5 pt-4 pb-3 bg-white/85 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div class="flex items-center gap-2.5">
          <!-- Input Container -->
          <div class="flex-1 relative flex items-center bg-slate-100/90 rounded-2xl px-3.5 py-2.5 border border-slate-200/70 focus-within:border-azure-500 focus-within:bg-white transition-all">
            <svg class="w-5 h-5 text-slate-400 ms-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="ابحث بالمنطقة، القرية، أو الميزة..."
              [ngModel]="state.searchQuery()"
              (ngModelChange)="onQueryChange($event)"
              class="w-full bg-transparent border-none outline-none text-xs font-semibold text-slate-800 placeholder-slate-400 ms-2"
            />
            @if (state.searchQuery()) {
              <button (click)="clearSearch()" class="text-slate-400 hover:text-slate-600 text-xs p-1">
                ✕
              </button>
            }
          </div>

          <!-- Filter Trigger Button with Active Count Badge -->
          <button
            (click)="openFilters()"
            class="relative w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center tap-bounce shadow-md"
            title="تصفية النتائج"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
            @if (activeFilterCount() > 0) {
              <span class="absolute -top-1 -end-1 w-4 h-4 bg-azure-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {{ activeFilterCount() }}
              </span>
            }
          </button>
        </div>

        <!-- Quick Horizontal Category Chips -->
        <div class="flex gap-2 overflow-x-auto no-scrollbar pt-3">
          @for (cat of quickCategories; track cat) {
            <button
              (click)="selectCategory(cat)"
              class="px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap tap-bounce transition-all border"
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

        <!-- AI Smart Search Assistant Trigger Banner -->
        <div
          (click)="state.isAiChatOpen.set(true)"
          class="mt-3 p-2.5 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-azure-950 text-white border border-azure-400/30 flex items-center justify-between cursor-pointer tap-bounce shadow-sm"
        >
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-xl bg-azure-500/20 text-azure-300 flex items-center justify-center text-xs border border-azure-400/30">
              🤖
            </div>
            <div>
              <span class="text-[11px] font-bold text-white block">محتار في اختيار الوحدة الأنسب؟</span>
              <span class="text-[9px] text-azure-300 block">دع مستشار Ragab Pay الذكي يحلل طلبك ويقترح لك الخيار الأنسب</span>
            </div>
          </div>
          <span class="text-[9px] font-bold px-2.5 py-1 rounded-xl bg-azure-600 text-white shadow-xs flex-shrink-0">
            تحدث مع AI ✨
          </span>
        </div>
      </div>

      <!-- Result Count & Sort Selector Strip -->
      <div class="px-5 py-3 flex items-center justify-between text-xs font-arabic border-b border-slate-100 bg-white">
        <div class="flex items-center gap-1.5">
          <span class="font-extrabold text-slate-900">{{ state.matchedCount() }}</span>
          <span class="text-slate-500">وحدة متوفرة لطلبك</span>
        </div>

        <!-- Sort Select -->
        <div class="flex items-center gap-1 text-slate-600">
          <span class="text-[11px] text-slate-400">الترتيب:</span>
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
      <div class="px-5 py-4 space-y-4">
        @for (prop of state.filteredProperties(); track prop.id) {
          <div
            (click)="viewDetails(prop)"
            class="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer tap-bounce"
          >
            <!-- Hero Photo with Badges -->
            <div class="relative h-52 w-full">
              <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>

              <!-- Top Left: Category Badge -->
              <div class="absolute top-3.5 start-3.5 flex items-center gap-1.5 z-10 flex-wrap">
                <span class="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-bold">
                  {{ prop.categoryArabic }}
                </span>
                @if (prop.isCorporateReady) {
                  <span class="px-2.5 py-1 rounded-full bg-azure-600/90 backdrop-blur-md text-white text-[10px] font-bold">
                    سكن شركات ووفود
                  </span>
                }
                @if (prop.exclusiveOffer) {
                  <span class="px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold">
                    عرض خاص
                  </span>
                }
              </div>

              <!-- Top Right: Favorite & Compare Buttons -->
              <div class="absolute top-3.5 end-3.5 flex items-center gap-1.5 z-10">
                <button
                  (click)="$event.stopPropagation(); toggleFav(prop.id)"
                  class="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-700 flex items-center justify-center shadow-md tap-bounce"
                >
                  <svg
                    class="w-4 h-4 transition-colors"
                    [class.text-rose-500]="state.isFavorite(prop.id)"
                    [class.fill-rose-500]="state.isFavorite(prop.id)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>

              <!-- Bottom Overlay: Proximity pill -->
              <div class="absolute bottom-3 start-3 z-10">
                <span class="px-3 py-1 rounded-full bg-slate-900/75 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1">
                  🌊 {{ prop.distanceToBeach }}
                </span>
              </div>
            </div>

            <!-- Card Body Content -->
            <div class="p-4">
              <!-- Title and Village -->
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="text-sm font-bold text-slate-900 leading-snug">{{ prop.title }}</h3>
                  <p class="text-[11px] text-azure-700 font-semibold mt-0.5">{{ prop.village }}</p>
                </div>
                <div class="flex items-center gap-1 text-amber-500 text-xs font-extrabold flex-shrink-0">
                  <span>★ {{ prop.rating }}</span>
                  <span class="text-slate-400 font-normal">({{ prop.reviewsCount }})</span>
                </div>
              </div>

              <!-- Specs Pills Grid -->
              <div class="grid grid-cols-3 gap-2 my-3">
                <div class="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                  <span class="block text-[11px] font-bold text-slate-800">{{ prop.bedrooms }} غرف نوم</span>
                  <span class="block text-[9px] text-slate-400">{{ prop.maxGuests }}</span>
                </div>
                <div class="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                  <span class="block text-[11px] font-bold text-slate-800">{{ prop.area }} م²</span>
                  <span class="block text-[9px] text-slate-400">{{ prop.bathrooms }} حمامات</span>
                </div>
                <div class="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                  <span class="block text-[11px] font-bold text-azure-700 truncate">{{ prop.poolType }}</span>
                  <span class="block text-[9px] text-slate-400">مسبح</span>
                </div>
              </div>

              <!-- Card Bottom Strip: Price & Comparison Toggle -->
              <div class="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span class="text-base font-black text-slate-900">{{ prop.pricePerDay | number }} ج.م</span>
                  <span class="text-[10px] text-slate-400"> / ليلة</span>
                  <span class="text-[10px] text-slate-500 block">أو {{ prop.pricePerMonth | number }} ج.م / شهر</span>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    (click)="$event.stopPropagation(); toggleComparison(prop)"
                    class="px-3 py-1.5 rounded-full text-xs font-bold border transition-colors tap-bounce"
                    [class.bg-azure-50]="state.isInComparison(prop.id)"
                    [class.text-azure-700]="state.isInComparison(prop.id)"
                    [class.border-azure-400]="state.isInComparison(prop.id)"
                    [class.bg-white]="!state.isInComparison(prop.id)"
                    [class.text-slate-600]="!state.isInComparison(prop.id)"
                    [class.border-slate-200]="!state.isInComparison(prop.id)"
                  >
                    {{ state.isInComparison(prop.id) ? '✓ تمت الإضافة' : '+ مقارنة' }}
                  </button>

                  <button
                    (click)="$event.stopPropagation(); bookDirect(prop)"
                    class="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full tap-bounce"
                  >
                    احجز
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (state.matchedCount() === 0) {
          <div class="py-16 text-center flex flex-col items-center justify-center">
            <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-sm font-bold text-slate-800">لم نجد وحدات مطابقة تماماً لمعاييرك</h3>
            <p class="text-xs text-slate-400 mt-1 max-w-xs">جرب تقليل الفلاتر أو توسيع النطاق السعري لتظهر لك الوحدات المتاحة.</p>
            <button
              (click)="resetAllFilters()"
              class="mt-4 px-5 py-2.5 bg-azure-600 text-white rounded-full text-xs font-bold tap-bounce shadow-md"
            >
              إعادة تعيين كافة الفلاتر
            </button>
          </div>
        }
      </div>

      <!-- Floating Comparison Bar (if units selected) -->
      @if (state.comparisonList().length > 0) {
        <div class="fixed bottom-24 inset-x-8 z-30">
          <button
            (click)="openComparison()"
            class="w-full py-3.5 px-5 bg-gradient-to-r from-azure-700 to-navy-900 text-white rounded-full shadow-2xl border border-white/20 flex items-center justify-between tap-bounce animate-bounce"
          >
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-white/20 text-white text-xs font-black flex items-center justify-center">
                {{ state.comparisonList().length }}
              </span>
              <span class="text-xs font-bold">مقارنة الوحدات المختارة جنباً إلى جنب</span>
            </div>
            <span class="text-xs font-extrabold text-azure-200">افتح المقارنة ←</span>
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

