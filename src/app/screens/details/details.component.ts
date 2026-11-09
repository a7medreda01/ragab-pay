import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../../components/property-image/property-image.component';

@Component({
  selector: 'app-details-screen',
  standalone: true,
  imports: [CommonModule, PropertyImageComponent],
  template: `
    @if (state.selectedProperty(); as prop) {
      <div class="relative w-full h-full overflow-y-auto no-scrollbar pb-32 font-arabic bg-slate-50 select-none">
        <!-- Hero Gallery Carousel -->
        <div class="relative h-80 w-full bg-slate-900">
          <app-property-image
            [src]="prop.images[activeImageIndex()]"
            [alt]="prop.title"
            containerClass="w-full h-full"
          ></app-property-image>

          <!-- Top Action Bar (Back, Fav) -->
          <div class="absolute top-4 inset-x-4 flex items-center justify-between z-20">
            <button
              (click)="goBack()"
              class="w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 tap-bounce shadow-md"
            >
              <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <button
              (click)="toggleFav(prop.id)"
              class="w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20 tap-bounce shadow-md"
            >
              <svg
                class="w-5 h-5 transition-colors"
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

          <!-- Image Carousel Dots -->
          <div class="absolute bottom-10 inset-x-0 flex items-center justify-center gap-1.5 z-20">
            @for (img of prop.images; track $index) {
              <button
                (click)="activeImageIndex.set($index)"
                class="h-1.5 rounded-full transition-all duration-300"
                [class.w-6]="activeImageIndex() === $index"
                [class.bg-white]="activeImageIndex() === $index"
                [class.w-2]="activeImageIndex() !== $index"
                [class.bg-white/50]="activeImageIndex() !== $index"
              ></button>
            }
          </div>
        </div>

        <!-- Overlapping Main Sheet (Apple iOS Style) -->
        <div class="relative -mt-6 z-10 bg-white rounded-t-[36px] px-6 pt-6 pb-6 shadow-2xl border-t border-slate-100">
          <!-- Grabber -->
          <div class="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4"></div>

          <!-- Title & Badges -->
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="inline-block px-3 py-1 rounded-full bg-azure-50 text-azure-700 text-[11px] font-bold mb-2">
                {{ prop.categoryArabic }} • {{ prop.regionArabic }}
              </span>
              <h1 class="text-base font-black text-slate-900 leading-snug">{{ prop.title }}</h1>
              <p class="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <svg class="w-3.5 h-3.5 text-azure-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ prop.village }}
              </p>
            </div>
            <div class="bg-amber-50 rounded-2xl p-2.5 text-center flex-shrink-0 border border-amber-100">
              <span class="text-amber-600 font-black text-xs block">★ {{ prop.rating }}</span>
              <span class="text-[9px] text-slate-400 block">{{ prop.reviewsCount }} تقييم</span>
            </div>
          </div>

          <!-- Verified Host Card with Vector Call / WhatsApp -->
          <div class="my-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img [src]="prop.host.avatar" alt="Host" class="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"/>
                <span class="absolute bottom-0 end-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white flex items-center justify-center text-[8px] text-white">✓</span>
              </div>
              <div>
                <span class="text-xs font-bold text-slate-900 block">{{ prop.host.name }}</span>
                <span class="text-[10px] text-slate-400 block">إدارة فندقية معتمدة • رد {{ prop.host.responseTime }}</span>
              </div>
            </div>

            <!-- Host Actions with SVG -->
            <div class="flex items-center gap-2">
              <a
                [href]="'tel:' + prop.host.phone"
                class="w-9 h-9 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 tap-bounce"
                title="اتصال هاتفي"
              >
                <svg class="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </a>
              <button
                (click)="openWhatsApp(prop.host.phone)"
                class="w-9 h-9 rounded-full bg-emerald-500 text-white shadow-xs flex items-center justify-center tap-bounce"
                title="محادثة واتساب"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
              </button>
            </div>
          </div>

          <!-- Specifications Grid with SVG Icons -->
          <div class="mb-6">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">مواصفات وتجهيزات الإقامة</h3>
            <div class="grid grid-cols-4 gap-2.5">
              <div class="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100 flex flex-col items-center">
                <svg class="w-5 h-5 text-azure-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span class="text-[11px] font-bold text-slate-800 block">{{ prop.bedrooms }} غرف</span>
                <span class="text-[9px] text-slate-400 block">نوم</span>
              </div>
              <div class="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100 flex flex-col items-center">
                <svg class="w-5 h-5 text-azure-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <span class="text-[11px] font-bold text-slate-800 block">{{ prop.bathrooms }} حمام</span>
                <span class="text-[9px] text-slate-400 block">مجهز</span>
              </div>
              <div class="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100 flex flex-col items-center">
                <svg class="w-5 h-5 text-azure-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                <span class="text-[11px] font-bold text-slate-800 block">{{ prop.area }} م²</span>
                <span class="text-[9px] text-slate-400 block">المساحة</span>
              </div>
              <div class="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100 flex flex-col items-center">
                <svg class="w-5 h-5 text-azure-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M3 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/></svg>
                <span class="text-[10px] font-bold text-azure-700 block truncate">{{ prop.poolType }}</span>
                <span class="text-[9px] text-slate-400 block">مسبح</span>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="mb-6">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">عن هذه الوحدة</h3>
            <p class="text-xs text-slate-600 leading-relaxed">{{ prop.description }}</p>
          </div>

          <!-- Amenities List -->
          <div class="mb-6">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">المزايا المتاحة</h3>
            <div class="grid grid-cols-2 gap-2">
              @for (feat of prop.features; track feat) {
                <div class="flex items-center gap-2 p-2 bg-slate-50 rounded-xl text-xs text-slate-700">
                  <span class="text-emerald-500 font-bold">✓</span>
                  <span>{{ feat }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Ragab Pay Guarantee Card with Vector Shield -->
          <div class="p-4 rounded-2xl bg-gradient-to-r from-azure-900 to-navy-950 text-white mb-6 shadow-lg">
            <div class="flex items-center gap-2 mb-1.5">
              <svg class="w-5 h-5 text-azure-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <span class="text-xs font-bold">ضمان راغب باي الفندقي المعتمد - Ragab Pay</span>
            </div>
            <p class="text-[11px] text-white/80 leading-relaxed">
              هذه الوحدة مفحوصة ومُدارة بالكامل من فريق منظومة Ragab Pay. نضمن لك نظافة فندقية معقمة، ومطابقة تامة للعقود الفردية والمؤسسية، ودعم كونسيرج على مدار الساعة.
            </p>
          </div>

          <!-- Reviews Section -->
          <div>
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">تقييمات النزلاء السابقين</h3>
            <div class="space-y-3">
              @for (rev of prop.reviews; track rev.userName) {
                <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div class="flex items-center justify-between mb-1.5">
                    <div class="flex items-center gap-2">
                      <img [src]="rev.avatar" alt="Reviewer" class="w-7 h-7 rounded-full object-cover"/>
                      <span class="text-xs font-bold text-slate-900">{{ rev.userName }}</span>
                    </div>
                    <span class="text-xs text-amber-500 font-bold">★ {{ rev.rating }}.0</span>
                  </div>
                  <p class="text-[11px] text-slate-600 leading-relaxed">{{ rev.comment }}</p>
                  <span class="text-[10px] text-slate-400 block mt-1">{{ rev.date }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Sticky Bottom Frosted Booking Bar -->
        <div class="fixed bottom-0 inset-x-0 z-30 p-4 bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <div>
            <span class="text-xs text-slate-400 block">السعر الإجمالي</span>
            <span class="text-sm font-black text-slate-900">{{ prop.pricePerDay | number }} ج.م</span>
            <span class="text-[10px] text-slate-500"> / ليلة</span>
          </div>

          <button
            (click)="proceedToBooking(prop)"
            class="px-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-full shadow-xl tap-bounce flex items-center gap-2"
          >
            <span>احجز الآن</span>
            <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
        </div>
      </div>
    }
  `
})
export class UnitDetailsScreenComponent {
  readonly state = inject(AppStateService);
  readonly activeImageIndex = signal<number>(0);

  goBack() {
    this.state.currentScreen.set('main');
  }

  toggleFav(id: string) {
    this.state.toggleFavorite(id);
  }

  openWhatsApp(phone: string) {
    const clean = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${clean}?text=مرحباً، أستفسر بخصوص حجز وحدة في منصة راغب باي`, '_blank');
  }

  proceedToBooking(prop: any) {
    this.state.startBooking(prop);
  }
}
