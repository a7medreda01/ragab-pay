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
      <!-- Top Sticky App Bar with Brand Logo -->
      <div class="sticky top-0 z-20 px-5 pt-3.5 pb-3 bg-white/85 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between shadow-xs">
        <!-- Logo Branding & Side Drawer Menu Button -->
        <div class="flex items-center gap-2">
          <button
            (click)="state.isSideDrawerOpen.set(true)"
            class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 tap-bounce border border-slate-200/60 hover:bg-slate-200 transition-colors"
            title="شريط الأدوات والخدمات الحصرية"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10m-10 6h16"/>
            </svg>
          </button>
          <img
            src="assets/logo.png"
            alt="Ragab Pay"
            class="h-8 w-auto object-contain"
          />
        </div>

        <div class="flex items-center gap-2">
          <!-- User Greeting Badge (Click to open Auth / Switch Account) -->
          <div
            (click)="state.isAuthOpen.set(true)"
            class="flex items-center gap-2 ps-2 pe-1 py-1 rounded-full bg-slate-100 border border-slate-200/60 cursor-pointer tap-bounce"
            title="تسجيل الدخول أو تبديل الحساب"
          >
            <span class="text-[11px] font-bold text-slate-800">{{ state.currentUser().name }}</span>
            <img [src]="state.currentUser().avatar" alt="Avatar" class="w-6 h-6 rounded-full object-cover"/>
          </div>

          <!-- Notification Bell with SVG -->
          <button
            (click)="openNotifications()"
            class="relative w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 tap-bounce border border-slate-200/60"
            title="الإشعارات"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="absolute top-1.5 start-1.5 w-2 h-2 bg-azure-600 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </div>

      <!-- Quick Search Bar Banner -->
      <div class="px-5 mt-4">
        <div
          (click)="openSearch()"
          class="glass-panel p-3.5 rounded-2xl flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-shadow tap-bounce border border-white/60"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-azure-600 text-white flex items-center justify-center shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <div>
              <span class="text-xs font-bold text-slate-900 block">إلى أين ترغب بالسفر؟</span>
              <span class="text-[10px] text-slate-400 block font-sans">الساحل الشمالي • التجمع • الزمالك</span>
            </div>
          </div>
          <button class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Elite Quick Services Row (AI Search Assistant, Tourism QR, VIP Concierge, All Services) -->
      <div class="px-5 mt-3">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <!-- AI Search Assistant Quick Button -->
          <button
            (click)="state.isAiChatOpen.set(true)"
            class="flex items-center gap-1.5 py-2 px-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-azure-600 to-sky-500 text-white text-xs font-bold shadow-md shadow-azure-500/20 tap-bounce flex-shrink-0"
          >
            <span class="text-sm">🤖</span>
            <span>مساعد السيرش الذكي AI</span>
            <span class="px-1.5 py-0.2 bg-white/25 text-[9px] rounded-md font-sans">جديد</span>
          </button>

          <!-- QR Pass Quick Button -->
          <button
            (click)="state.isQrPassModalOpen.set(true)"
            class="flex items-center gap-2 py-2 px-3 rounded-2xl bg-gradient-to-r from-azure-600 to-sky-500 text-white text-xs font-bold shadow-sm tap-bounce flex-shrink-0"
          >
            <span class="text-sm">🎫</span>
            <span>شراء الـ QR السياحي</span>
            <span class="px-1.5 py-0.5 bg-white/20 text-[9px] rounded-md font-sans">فوري</span>
          </button>

          <!-- VIP Services Quick Button -->
          <button
            (click)="state.isVipServicesModalOpen.set(true)"
            class="flex items-center gap-2 py-2 px-3 rounded-2xl bg-slate-900 text-amber-300 border border-amber-500/30 text-xs font-bold shadow-sm tap-bounce flex-shrink-0"
          >
            <span class="text-sm">👑</span>
            <span>خدمات VIP والكونسيرج</span>
          </button>

          <!-- Toolbar / Services Drawer Button -->
          <button
            (click)="state.isSideDrawerOpen.set(true)"
            class="flex items-center gap-1.5 py-2 px-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs tap-bounce flex-shrink-0"
          >
            <span>✨</span>
            <span>كل الخدمات</span>
          </button>
        </div>
      </div>

      <!-- Featured Stacked-Card Carousel -->
      <div class="mt-6 px-5">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="text-sm font-extrabold text-slate-900">وحدات استثنائية مميزة</h2>
            <span class="text-[10px] text-slate-400">إطلالات صف أول وخدمات فندقية كاملة</span>
          </div>
          <button (click)="openSearch()" class="text-xs font-bold text-azure-600 hover:text-azure-700">عرض الكل</button>
        </div>

        <!-- Featured Carousel (Horizontal Snap) -->
        <div class="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-1 pb-4">
          @for (prop of featuredUnits(); track prop.id) {
            <div
              (click)="viewDetails(prop)"
              class="relative min-w-[290px] h-[380px] rounded-[32px] overflow-hidden shadow-luxury snap-center cursor-pointer group tap-bounce"
            >
              <!-- Background Image -->
              <app-property-image
                [src]="prop.images[0]"
                [alt]="prop.title"
                containerClass="w-full h-full"
              ></app-property-image>

              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

              <!-- Top Tags & Favorite -->
              <div class="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <span class="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                  {{ prop.categoryArabic }}
                </span>
                <button
                  (click)="$event.stopPropagation(); toggleFav(prop.id)"
                  class="w-9 h-9 rounded-full bg-slate-950/50 backdrop-blur-md text-white flex items-center justify-center border border-white/20 tap-bounce"
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

              <!-- Bottom Info Card Over Photo -->
              <div class="absolute bottom-4 inset-x-4 z-10">
                <div class="glass-panel p-4 rounded-2xl border border-white/60">
                  <div class="flex items-center gap-1.5 text-amber-500 text-xs font-bold mb-1">
                    <span>★ {{ prop.rating }}</span>
                    <span class="text-slate-400 font-normal">({{ prop.reviewsCount }} تقييم)</span>
                  </div>
                  <h3 class="text-xs font-bold text-slate-900 line-clamp-1">{{ prop.title }}</h3>
                  <p class="text-[11px] text-azure-700 font-semibold mt-0.5 truncate">{{ prop.village }}</p>

                  <div class="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                    <div>
                      <span class="text-xs font-black text-slate-900">{{ prop.pricePerDay | number }} ج.م</span>
                      <span class="text-[10px] text-slate-400"> / ليلة</span>
                    </div>
                    <span class="text-[10px] font-bold text-azure-700 bg-azure-50 px-2.5 py-1 rounded-lg">
                      {{ prop.poolType }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Quick Category Chips with Clean SVGs -->
      <div class="mt-4 px-5">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">التصنيفات الشائعة</h3>
        <div class="flex gap-2 overflow-x-auto no-scrollbar py-1">
          @for (cat of categories; track cat.name) {
            <button
              (click)="selectCategory(cat.name)"
              class="flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold whitespace-nowrap tap-bounce transition-all shadow-2xs"
              [class.bg-slate-900]="state.selectedCategory() === cat.name"
              [class.text-white]="state.selectedCategory() === cat.name"
              [class.border-slate-900]="state.selectedCategory() === cat.name"
              [class.bg-white]="state.selectedCategory() !== cat.name"
              [class.text-slate-700]="state.selectedCategory() !== cat.name"
              [class.border-slate-200]="state.selectedCategory() !== cat.name"
            >
              <!-- SVG Icon -->
              <span [innerHTML]="cat.svg" class="w-3.5 h-3.5 flex items-center justify-center"></span>
              <span>{{ cat.name }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Recommended List -->
      <div class="mt-7 px-5">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="text-sm font-extrabold text-slate-900">أماكن إقامة مختارة بعناية</h2>
            <span class="text-[10px] text-slate-400">مفحوصة فندقياً بمستوى 5 نجوم</span>
          </div>
          <button (click)="openSearch()" class="text-xs font-bold text-azure-600">المزيد</button>
        </div>

        <div class="space-y-3">
          @for (prop of state.properties().slice(2, 6); track prop.id) {
            <div
              (click)="viewDetails(prop)"
              class="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex gap-3 cursor-pointer tap-bounce"
            >
              <div class="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>
                <span class="absolute top-1 start-1 px-1.5 py-0.5 rounded-md bg-slate-900/70 text-white text-[9px] font-bold">
                  ★ {{ prop.rating }}
                </span>
              </div>
              <div class="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                <div>
                  <h4 class="text-xs font-bold text-slate-900 line-clamp-1">{{ prop.title }}</h4>
                  <p class="text-[11px] text-azure-600 truncate mt-0.5">{{ prop.village }}</p>
                  <p class="text-[10px] text-slate-400 mt-1">{{ prop.bedrooms }} غرف • {{ prop.bathrooms }} حمام • {{ prop.distanceToBeach }}</p>
                </div>
                <div class="flex items-center justify-between pt-1 border-t border-slate-50">
                  <span class="text-xs font-black text-slate-900">{{ prop.pricePerDay | number }} ج.م <span class="text-[10px] font-normal text-slate-400">/ ليلة</span></span>
                  <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                    معتمد فندقياً
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Exclusive Long Stay Banner with Wave Accent -->
      <div class="mt-6 px-5">
        <div class="bg-gradient-to-r from-azure-800 to-navy-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
          <div class="relative z-10">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold mb-2">
              <svg class="w-3 h-3 text-amber-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              عروض الإقامات الشهرية والسنوية
            </span>
            <h3 class="text-sm font-extrabold leading-snug">خصومات حصرية تصل إلى 35% لرجال الأعمال والشركات</h3>
            <p class="text-xs text-white/80 mt-1">شقق فندقية وبنتهاوس وسكن مهندسين مجهز في العاصمة الإدارية والتجمع وأكتوبر بإدارة Ragab Pay.</p>
            <button
              (click)="openMonthlyStays()"
              class="mt-3.5 px-4 py-2 bg-white text-slate-950 font-bold text-xs rounded-full shadow-md tap-bounce"
            >
              استعرض عقود الشركات والإقامات الطويلة
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
    {
      name: 'الكل',
      svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`
    },
    {
      name: 'سكن شركات وعمال',
      svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`
    },
    {
      name: 'شاليهات بحرية',
      svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`
    },
    {
      name: 'فيلات مستقلة',
      svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
    },
    {
      name: 'إقامات شهرية',
      svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`
    },
    {
      name: 'عقود سنوية',
      svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`
    },
    {
      name: 'صف أول عالبحر',
      svg: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M3 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/></svg>`
    }
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
