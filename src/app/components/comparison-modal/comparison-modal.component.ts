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

        <!-- Sheet Modal with Drag Down to Dismiss -->
        <div
          (touchstart)="onSheetTouchStart($event)"
          (touchmove)="onSheetTouchMove($event)"
          (touchend)="onSheetTouchEnd($event)"
          [style.transform]="currentTranslateY > 0 ? 'translateY(' + currentTranslateY + 'px)' : ''"
          [style.transition]="isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)'"
          class="relative w-full max-h-[92%] bg-white rounded-t-[36px] shadow-2xl flex flex-col overflow-hidden animate-slide-up"
        >
          <!-- Drag Handle -->
          <div class="w-full flex flex-col items-center justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing">
            <div class="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors"></div>
            <span class="text-[9px] text-slate-400 mt-1 select-none font-sans">اسحب للأسفل للإغلاق ↓</span>
          </div>

          <!-- Header -->
          <div class="px-6 py-3 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="bi bi-arrow-left-right text-azure-600 text-sm"></i>
              <div>
                <h2 class="text-xs font-black text-slate-900 font-arabic">مقارنة الوحدات</h2>
                <span class="text-[10px] text-slate-400 font-arabic">مقارنة الأسعار والمواصفات جنباً إلى جنب</span>
              </div>
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
                <i class="bi bi-x-lg text-xs"></i>
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
                      class="absolute top-4 end-4 z-10 w-6 h-6 rounded-full bg-slate-900/70 text-white flex items-center justify-center text-[10px] tap-bounce"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>

                    <div class="h-28 rounded-xl overflow-hidden mb-2">
                      <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>
                    </div>

                    <span class="text-[10px] text-azure-600 font-bold">{{ prop.categoryArabic }}</span>
                    <h4 class="text-xs font-bold text-slate-900 line-clamp-1">{{ prop.title }}</h4>
                    <span class="text-[10px] text-slate-500 mb-3">{{ prop.village }}</span>

                    <!-- Comparison Rows -->
                    <div class="space-y-2 text-xs border-t border-slate-200 pt-2 flex-1">
                      <div class="flex justify-between">
                        <span class="text-slate-400 text-[11px]">السعر / ليلة:</span>
                        <span class="font-bold text-slate-900">{{ prop.pricePerDay | number }} ج.م</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-slate-400 text-[11px]">الغرف:</span>
                        <span class="font-bold text-slate-900">{{ prop.bedrooms }} نوم</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-slate-400 text-[11px]">الحمامات:</span>
                        <span class="font-bold text-slate-900">{{ prop.bathrooms }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-slate-400 text-[11px]">المساحة:</span>
                        <span class="font-bold text-slate-900">{{ prop.area }} م²</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-slate-400 text-[11px]">المسبح:</span>
                        <span class="font-bold text-slate-900">{{ prop.poolType }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-slate-400 text-[11px]">المسافة للبحر:</span>
                        <span class="font-bold text-slate-900">{{ prop.distanceToBeach }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-slate-400 text-[11px]">سكن شركات:</span>
                        <span class="font-bold" [class.text-emerald-600]="prop.isCorporateReady" [class.text-slate-400]="!prop.isCorporateReady">
                          {{ prop.isCorporateReady ? 'متاح ومجهز' : 'أفراد فقط' }}
                        </span>
                      </div>
                    </div>

                    <!-- Book Action -->
                    <button
                      (click)="book(prop)"
                      class="mt-3 w-full py-2 bg-azure-600 hover:bg-azure-700 text-white rounded-xl text-xs font-bold tap-bounce"
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

  touchStartY = 0;
  currentTranslateY = 0;
  isDragging = false;

  onSheetTouchStart(e: TouchEvent) {
    if (e.touches.length > 0) {
      this.touchStartY = e.touches[0].clientY;
      this.isDragging = true;
    }
  }

  onSheetTouchMove(e: TouchEvent) {
    if (!this.isDragging || e.touches.length === 0) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - this.touchStartY;
    if (deltaY > 0) {
      this.currentTranslateY = deltaY;
    } else {
      this.currentTranslateY = 0;
    }
  }

  onSheetTouchEnd(e: TouchEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.currentTranslateY > 75) {
      this.close();
    }
    this.currentTranslateY = 0;
  }

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
