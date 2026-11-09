import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../../components/property-image/property-image.component';
import { Property } from '../../data/properties.data';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [CommonModule, PropertyImageComponent],
  template: `
    <div class="w-full h-full overflow-y-auto no-scrollbar pb-[max(7rem,calc(6rem+env(safe-area-inset-bottom,24px)))] font-arabic bg-slate-50 select-none">
      
      <!-- Top Sticky App Bar -->
      <div class="sticky top-0 z-20 px-5 pt-3 pb-2.5 bg-white/85 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between shadow-2xs">
        <div class="flex items-center gap-2">
          <button
            (click)="state.isSideDrawerOpen.set(true)"
            class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 tap-bounce border border-slate-200/60 hover:bg-slate-200 transition-colors"
            title="الخدمات"
          >
            <i class="bi bi-list text-lg"></i>
          </button>
          <img
            src="assets/logo.png"
            alt="Ragab Pay"
            class="h-7 w-auto object-contain"
          />
        </div>

        <div class="flex items-center gap-1.5">
          <!-- User Greeting Badge -->
          <div
            (click)="state.isAuthOpen.set(true)"
            class="flex items-center gap-1.5 ps-2 pe-1 py-0.5 rounded-full bg-slate-100/90 border border-slate-200/60 cursor-pointer tap-bounce"
            title="الحساب"
          >
            <span class="text-[10px] font-bold text-slate-800 max-w-[100px] truncate">{{ state.currentUser().name }}</span>
            <img [src]="state.currentUser().avatar" alt="Avatar" class="w-5 h-5 rounded-full object-cover flex-shrink-0"/>
          </div>

          <!-- Notification Bell -->
          <button
            (click)="openNotifications()"
            class="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 tap-bounce border border-slate-200/60"
            title="الإشعارات"
          >
            <i class="bi bi-bell text-sm"></i>
            <span class="absolute top-1.5 start-1.5 w-1.5 h-1.5 bg-azure-600 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </div>

      <!-- Quick Search Bar -->
      <div class="px-5 mt-3">
        <div
          (click)="openSearch()"
          class="glass-panel p-3 rounded-2xl flex items-center justify-between cursor-pointer shadow-xs hover:shadow-sm transition-shadow tap-bounce border border-white/60"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-azure-600 text-white flex items-center justify-center shadow-xs">
              <i class="bi bi-search text-xs"></i>
            </div>
            <div>
              <span class="text-xs font-bold text-slate-900 block">ابحث عن وجهتك...</span>
              <span class="text-[10px] text-slate-400 block font-sans">الساحل • التجمع • زايد</span>
            </div>
          </div>
          <button class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <i class="bi bi-sliders text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Featured Carousel -->
      <div class="mt-4 px-5">
        <div class="flex items-center justify-between mb-2.5">
          <div>
            <h2 class="text-xs font-black text-slate-900">وحدات مميزة</h2>
            <span class="text-[11px] text-slate-600">إطلالات مباشرة وخدمة فندقية</span>
          </div>
          <button (click)="openSearch()" class="text-xs font-bold text-azure-600 hover:text-azure-700">عرض الكل</button>
        </div>

        <div class="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-0.5 pb-2">
          @for (prop of featuredUnits(); track prop.id) {
            <div
              (click)="viewDetails(prop)"
              class="relative min-w-[270px] h-[340px] rounded-3xl overflow-hidden shadow-sm snap-center cursor-pointer tap-bounce"
            >
              <app-property-image
                [src]="prop.images[0]"
                [alt]="prop.title"
                containerClass="w-full h-full"
              ></app-property-image>

              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

              <div class="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <span class="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                  {{ prop.categoryArabic }}
                </span>
                <button
                  (click)="$event.stopPropagation(); toggleFav(prop.id)"
                  [attr.aria-label]="state.isFavorite(prop.id) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'"
                  class="w-9 h-9 rounded-full bg-slate-950/70 backdrop-blur-md text-white flex items-center justify-center border border-white/30 tap-bounce shadow-md"
                >
                  <i
                    class="bi text-sm"
                    [class.bi-heart-fill]="state.isFavorite(prop.id)"
                    [class.text-rose-500]="state.isFavorite(prop.id)"
                    [class.bi-heart]="!state.isFavorite(prop.id)"
                  ></i>
                </button>
              </div>

              <div class="absolute bottom-3 inset-x-3 z-10">
                <div class="glass-panel p-3.5 rounded-2xl border border-white/60">
                  <div class="flex items-center gap-1 text-amber-500 text-xs font-bold mb-0.5">
                    <i class="bi bi-star-fill text-[10px]"></i>
                    <span>{{ prop.rating }}</span>
                    <span class="text-slate-500 font-normal">({{ prop.reviewsCount }})</span>
                  </div>
                  <h3 class="text-xs font-bold text-slate-900 line-clamp-1">{{ prop.title }}</h3>
                  <p class="text-[11px] text-azure-700 font-semibold mt-0.5 truncate">{{ prop.village }}</p>

                  <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <div>
                      <span class="text-xs font-black text-slate-900 font-sans">{{ prop.pricePerDay | number }} ج.م</span>
                      <span class="text-[10px] text-slate-600"> / ليلة</span>
                    </div>
                    <span class="text-[10px] font-bold text-azure-700 bg-azure-50 px-2 py-0.5 rounded-md">
                      {{ prop.poolType }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Category Chips -->
      <div class="mt-3.5 px-5">
        <h3 class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">التصنيفات</h3>
        <div class="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          @for (cat of categories; track cat.name) {
            <button
              (click)="selectCategory(cat.name)"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold whitespace-nowrap tap-bounce transition-all shadow-2xs"
              [class.bg-slate-900]="state.selectedCategory() === cat.name"
              [class.text-white]="state.selectedCategory() === cat.name"
              [class.border-slate-900]="state.selectedCategory() === cat.name"
              [class.bg-white]="state.selectedCategory() !== cat.name"
              [class.text-slate-700]="state.selectedCategory() !== cat.name"
              [class.border-slate-200]="state.selectedCategory() !== cat.name"
            >
              <i [class]="cat.icon + ' text-xs'"></i>
              <span>{{ cat.name }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Recommended List -->
      <div class="mt-5 px-5">
        <div class="flex items-center justify-between mb-2.5">
          <div>
            <h2 class="text-xs font-black text-slate-900">أماكن إقامة مختارة</h2>
            <span class="text-[10px] text-slate-400">جاهزة للحجز المباشر</span>
          </div>
          <button (click)="openSearch()" class="text-[11px] font-bold text-azure-600">المزيد</button>
        </div>

        <div class="space-y-2.5">
          @for (prop of state.properties().slice(2, 6); track prop.id) {
            <div
              (click)="viewDetails(prop)"
              class="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-2xs flex gap-2.5 cursor-pointer tap-bounce"
            >
              <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 relative">
                <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>
                <span class="absolute top-1 start-1 px-1 py-0.2 rounded bg-slate-900/70 text-white text-[8px] font-bold flex items-center gap-0.5">
                  <i class="bi bi-star-fill text-[7px] text-amber-400"></i>
                  <span>{{ prop.rating }}</span>
                </span>
              </div>
              <div class="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                <div>
                  <h4 class="text-xs font-bold text-slate-900 line-clamp-1">{{ prop.title }}</h4>
                  <p class="text-[10px] text-azure-600 truncate mt-0.5">{{ prop.village }}</p>
                  <p class="text-[9px] text-slate-400 mt-0.5">{{ prop.bedrooms }} غرف • {{ prop.bathrooms }} حمام • {{ prop.distanceToBeach }}</p>
                </div>
                <div class="flex items-center justify-between pt-1 border-t border-slate-50">
                  <span class="text-xs font-black text-slate-900">{{ prop.pricePerDay | number }} ج.م <span class="text-[9px] font-normal text-slate-400">/ ليلة</span></span>
                  <span class="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded flex items-center gap-1">
                    <i class="bi bi-patch-check-fill text-[9px]"></i>
                    <span>معتمد</span>
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Banner -->
      <div class="mt-5 px-5">
        <div class="bg-gradient-to-r from-azure-800 to-slate-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
          <div class="relative z-10">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold mb-1.5">
              <i class="bi bi-percent text-amber-300"></i>
              <span>عروض الإقامات الطويلة</span>
            </span>
            <h3 class="text-xs font-black leading-snug">خصومات خاصة لعقود الشركات والإقامات الشهرية</h3>
            <p class="text-[10px] text-white/80 mt-1">خيارات متنوعة في الساحل والعاصمة والتجمع وأكتوبر.</p>
            <button
              (click)="openMonthlyStays()"
              class="mt-2.5 px-3 py-1.5 bg-white text-slate-950 font-bold text-[11px] rounded-lg shadow-sm tap-bounce"
            >
              استعراض العروض
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeScreenComponent {
  readonly state = inject(AppStateService);

  readonly categories = [
    { name: 'الكل', icon: 'bi bi-grid-fill' },
    { name: 'سكن شركات وعمال', icon: 'bi bi-building' },
    { name: 'شاليهات بحرية', icon: 'bi bi-water' },
    { name: 'فيلات مستقلة', icon: 'bi bi-house-door' },
    { name: 'إقامات شهرية', icon: 'bi bi-calendar-event' },
    { name: 'عقود سنوية', icon: 'bi bi-file-earmark-text' },
    { name: 'صف أول عالبحر', icon: 'bi bi-umbrella' }
  ];

  readonly featuredUnits = signal<Property[]>(
    this.state.properties().filter(p => p.featured)
  );

  selectCategory(cat: string) {
    this.state.setCategory(cat);
    this.state.navigateToTab('search');
  }

  viewDetails(prop: Property) {
    this.state.openDetails(prop);
  }

  toggleFav(id: string) {
    this.state.toggleFavorite(id);
  }

  openSearch() {
    this.state.navigateToTab('search');
  }

  openMonthlyStays() {
    this.state.setCategory('إقامات شهرية');
    this.state.navigateToTab('search');
  }

  openNotifications() {
    this.state.isNotificationOpen.set(true);
  }
}
