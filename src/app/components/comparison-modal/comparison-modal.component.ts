import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../property-image/property-image.component';
import { Property } from '../../data/properties.data';

@Component({
  selector: 'app-comparison-modal',
  standalone: true,
  imports: [CommonModule, PropertyImageComponent],
  template: `
    @if (state.isComparisonOpen()) {
      <div class="absolute inset-0 z-50 flex flex-col justify-end">
        <!-- Backdrop -->
        <div (click)="close()" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md"></div>

        <!-- Sheet Modal -->
        <div class="relative w-full max-h-[92%] bg-white rounded-t-[36px] shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900 font-arabic">مقارنة الوحدات الذكية</h2>
              <span class="text-xs text-slate-500 font-arabic">مقارنة المواصفات والأسعار جنباً إلى جنب</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                (click)="clear()"
                class="text-xs text-rose-500 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 font-arabic tap-bounce"
              >
                مسح الكل
              </button>
              <button
                (click)="close()"
                class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 tap-bounce"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Comparison Table Content -->
          @if (state.comparisonList().length < 2) {
            <div class="p-12 text-center flex flex-col items-center justify-center font-arabic">
              <div class="w-16 h-16 rounded-full bg-azure-50 flex items-center justify-center text-azure-600 mb-3">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                </svg>
              </div>
              <p class="text-base font-bold text-slate-800">اختر وحدتين على الأقل للمقارنة</p>
              <p class="text-xs text-slate-500 mt-1 max-w-xs">
                انقر على زر "مقارنة" الموجود في بطاقات البحث لعرض الفوارق الدقيقة في الأسعار والمواصفات.
              </p>
            </div>
          } @else {
            <div class="flex-1 overflow-x-auto overflow-y-auto no-scrollbar p-4 font-arabic">
              <div class="grid" [style.gridTemplateColumns]="'repeat(' + state.comparisonList().length + ', minmax(220px, 1fr))'" style="gap: 12px;">
                @for (prop of state.comparisonList(); track prop.id) {
                  <div class="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col relative">
                    <!-- Remove Button -->
                    <button
                      (click)="remove(prop.id)"
                      class="absolute top-4 start-4 z-10 w-6 h-6 rounded-full bg-slate-900/60 backdrop-blur-md text-white text-xs flex items-center justify-center hover:bg-rose-600 tap-bounce"
                    >
                      ✕
                    </button>

                    <!-- Image & Title -->
                    <div class="h-32 rounded-xl overflow-hidden mb-2.5">
                      <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>
                    </div>

                    <h3 class="text-xs font-bold text-slate-900 line-clamp-2 h-8">{{ prop.title }}</h3>
                    <p class="text-[11px] text-azure-600 font-medium mt-0.5 truncate">{{ prop.village }}</p>

                    <!-- Price Card -->
                    <div class="bg-white rounded-xl p-2.5 mt-2 border border-slate-100 shadow-sm text-center">
                      <span class="text-xs text-slate-400 block">السعر اليومي</span>
                      <span class="text-sm font-bold text-slate-900">{{ prop.pricePerDay | number }} ج.م</span>
                    </div>

                    <!-- Comparison Rows -->
                    <div class="mt-3 space-y-2 text-xs">
                      <div class="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span class="text-slate-500">المسافة للبحر:</span>
                        <span class="font-bold text-slate-800">{{ prop.distanceToBeach }}</span>
                      </div>
                      <div class="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span class="text-slate-500">المساحة:</span>
                        <span class="font-bold text-slate-800">{{ prop.area }} م²</span>
                      </div>
                      <div class="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span class="text-slate-500">الغرف / الحمامات:</span>
                        <span class="font-bold text-slate-800">{{ prop.bedrooms }} غرف • {{ prop.bathrooms }} حمام</span>
                      </div>
                      <div class="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span class="text-slate-500">المسبح:</span>
                        <span class="font-bold text-azure-700">{{ prop.poolType }}</span>
                      </div>
                      <div class="flex justify-between py-1.5 border-b border-slate-200/60">
                        <span class="text-slate-500">التقييم:</span>
                        <span class="font-bold text-amber-500">★ {{ prop.rating }} ({{ prop.reviewsCount }})</span>
                      </div>
                    </div>

                    <!-- Action Button -->
                    <button
                      (click)="book(prop)"
                      class="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold tap-bounce hover:bg-azure-600 transition-colors"
                    >
                      احجز هذه الوحدة
                    </button>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class ComparisonModalComponent {
  readonly state = inject(AppStateService);

  remove(id: string) {
    this.state.removeFromComparison(id);
  }

  clear() {
    this.state.clearComparison();
  }

  book(prop: Property) {
    this.state.isComparisonOpen.set(false);
    this.state.startBooking(prop);
  }

  close() {
    this.state.isComparisonOpen.set(false);
  }
}

