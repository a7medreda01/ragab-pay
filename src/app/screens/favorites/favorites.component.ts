import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../../components/property-image/property-image.component';
import { Property } from '../../data/properties.data';

@Component({
  selector: 'app-favorites-screen',
  standalone: true,
  imports: [CommonModule, PropertyImageComponent],
  template: `
    <div class="w-full h-full overflow-y-auto no-scrollbar pb-[max(7.5rem,calc(6.5rem+env(safe-area-inset-bottom,24px)))] font-arabic bg-slate-50 select-none">
      <!-- Header -->
      <div class="sticky top-0 z-20 px-5 pt-4 pb-3 bg-white/85 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between">
        <div>
          <h1 class="text-base font-extrabold text-slate-900">المفضلة</h1>
          <span class="text-[11px] text-slate-400">الوحدات المحفوظة للرجوع إليها لاحقاً</span>
        </div>
        <span class="text-xs font-bold text-azure-600 bg-azure-50 px-2.5 py-1 rounded-full">
          {{ favProperties().length }} وحدات
        </span>
      </div>

      <div class="p-5 space-y-4">
        @for (prop of favProperties(); track prop.id) {
          <div
            (click)="viewDetails(prop)"
            class="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm flex flex-col cursor-pointer tap-bounce"
          >
            <div class="relative h-44 w-full">
              <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>

              <button
                (click)="$event.stopPropagation(); removeFav(prop.id)"
                class="absolute top-3 end-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-rose-500 flex items-center justify-center shadow-md tap-bounce text-sm"
              >
                <i class="bi bi-heart-fill"></i>
              </button>

              <span class="absolute bottom-3 start-3 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold">
                {{ prop.categoryArabic }}
              </span>
            </div>

            <div class="p-4 flex items-center justify-between">
              <div>
                <h3 class="text-xs font-bold text-slate-900 line-clamp-1">{{ prop.title }}</h3>
                <p class="text-[11px] text-azure-600 mt-0.5">{{ prop.village }}</p>
                <span class="text-xs font-black text-slate-900 block mt-1">{{ prop.pricePerDay | number }} ج.م <span class="text-[10px] text-slate-400 font-normal">/ ليلة</span></span>
              </div>

              <button
                (click)="$event.stopPropagation(); bookDirect(prop)"
                class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full tap-bounce"
              >
                احجز الآن
              </button>
            </div>
          </div>
        }

        @if (favProperties().length === 0) {
          <div class="py-20 text-center flex flex-col items-center justify-center">
            <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 text-2xl">
              <i class="bi bi-heart"></i>
            </div>
            <h3 class="text-sm font-bold text-slate-800">قائمة المفضلة فارغة حالياً</h3>
            <p class="text-xs text-slate-400 mt-1 max-w-xs">اضغط على أيقونة القلب لحفظ أي شاليه أو فيلا هنا.</p>
            <button
              (click)="goToSearch()"
              class="mt-4 px-5 py-2.5 bg-azure-600 text-white rounded-full text-xs font-bold tap-bounce"
            >
              استكشف الوحدات الآن
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class FavoritesScreenComponent {
  readonly state = inject(AppStateService);

  readonly favProperties = computed(() => {
    const favIds = this.state.favorites();
    return this.state.properties().filter(p => favIds.includes(p.id));
  });

  viewDetails(prop: Property) {
    this.state.openDetails(prop);
  }

  removeFav(id: string) {
    this.state.toggleFavorite(id);
  }

  bookDirect(prop: Property) {
    this.state.startBooking(prop);
  }

  goToSearch() {
    this.state.navigateToTab('search');
  }
}

