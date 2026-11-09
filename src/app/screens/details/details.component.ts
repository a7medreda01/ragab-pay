import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../../components/property-image/property-image.component';

@Component({
  selector: 'app-details-screen',
  standalone: true,
  imports: [CommonModule, PropertyImageComponent],
  template: `
    @if (state.selectedProperty(); as prop) {
      <div class="relative w-full h-full overflow-y-auto no-scrollbar pb-[max(8.5rem,calc(7.5rem+env(safe-area-inset-bottom,36px)))] font-arabic bg-slate-50 select-none">
        
        <!-- Hero Gallery -->
        <div class="relative h-80 w-full bg-slate-900 overflow-hidden">
          <div
            #galleryScroll
            (scroll)="onGalleryScroll($event)"
            (touchstart)="onGalleryTouchStart($event)"
            (touchend)="onGalleryTouchEnd($event, prop.images.length)"
            class="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth touch-pan-x"
            dir="ltr"
          >
            @for (img of prop.images; track img; let idx = $index) {
              <div class="w-full h-full min-w-full flex-shrink-0 snap-center relative">
                <app-property-image
                  [src]="img"
                  [alt]="prop.title"
                  containerClass="w-full h-full"
                ></app-property-image>
              </div>
            }
          </div>

          <!-- Top Action Bar -->
          <div class="absolute top-4 inset-x-4 flex items-center justify-between z-20 pointer-events-none">
            <button
              (click)="goBack()"
              class="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md text-slate-800 flex items-center justify-center border border-white/80 tap-bounce shadow-lg pointer-events-auto hover:bg-white transition-colors"
              aria-label="الرجوع للقائمة"
            >
              <i class="bi bi-chevron-right text-base"></i>
            </button>

            <!-- Counter Badge -->
            <div class="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-xs font-sans font-bold border border-white/20 pointer-events-auto shadow-sm">
              {{ activeImageIndex() + 1 }} / {{ prop.images.length }}
            </div>

            <button
              (click)="toggleFav(prop.id)"
              class="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md text-slate-800 flex items-center justify-center border border-white/80 tap-bounce shadow-lg pointer-events-auto hover:bg-white transition-colors"
              [attr.aria-label]="state.isFavorite(prop.id) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'"
            >
              <i
                class="bi text-base"
                [class.bi-heart-fill]="state.isFavorite(prop.id)"
                [class.text-rose-500]="state.isFavorite(prop.id)"
                [class.bi-heart]="!state.isFavorite(prop.id)"
              ></i>
            </button>
          </div>

          <!-- Carousel Controls -->
          @if (prop.images.length > 1) {
            <button
              (click)="prevImage(prop.images.length)"
              class="absolute start-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-slate-950/50 backdrop-blur-md text-white flex items-center justify-center border border-white/20 tap-bounce shadow-xs"
              aria-label="السابق"
            >
              <i class="bi bi-chevron-right text-xs"></i>
            </button>

            <button
              (click)="nextImage(prop.images.length)"
              class="absolute end-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-slate-950/50 backdrop-blur-md text-white flex items-center justify-center border border-white/20 tap-bounce shadow-xs"
              aria-label="التالي"
            >
              <i class="bi bi-chevron-left text-xs"></i>
            </button>
          }

          <!-- Dots -->
          <div class="absolute bottom-9 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-auto">
            @for (img of prop.images; track $index) {
              <button
                (click)="goToImage($index)"
                class="h-1 rounded-full transition-all duration-300"
                [class.w-5]="activeImageIndex() === $index"
                [class.bg-white]="activeImageIndex() === $index"
                [class.w-1.5]="activeImageIndex() !== $index"
                [class.bg-white/50]="activeImageIndex() !== $index"
              ></button>
            }
          </div>
        </div>

        <!-- Overlapping Main Sheet -->
        <div class="relative -mt-6 z-10 bg-white rounded-t-[32px] px-5 pt-4 pb-6 shadow-xl border-t border-slate-100">
          <div class="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3"></div>

          <!-- Title & Rating -->
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="inline-block px-2.5 py-0.5 rounded-full bg-azure-50 text-azure-700 text-[10px] font-bold mb-1.5">
                {{ prop.categoryArabic }} • {{ prop.regionArabic }}
              </span>
              <h1 class="text-sm font-black text-slate-900 leading-snug">{{ prop.title }}</h1>
              <p class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                <i class="bi bi-geo-alt text-azure-600"></i>
                <span>{{ prop.village }}</span>
              </p>
            </div>

            <div class="bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/80 text-center flex-shrink-0">
              <span class="text-xs font-black text-amber-600 font-sans flex items-center justify-center gap-0.5">
                <span>{{ prop.rating }}</span>
                <i class="bi bi-star-fill text-[9px]"></i>
              </span>
              <span class="text-[8px] text-amber-700 block">{{ prop.reviewsCount }} تقييم</span>
            </div>
          </div>

          <!-- Host Info Card -->
          <div class="my-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="relative">
                <img [src]="prop.host.avatar" [alt]="prop.host.name" class="w-10 h-10 rounded-full object-cover"/>
                @if (prop.host.verified) {
                  <span class="absolute -bottom-0.5 -end-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] ring-2 ring-white">
                    <i class="bi bi-check"></i>
                  </span>
                }
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-900">{{ prop.host.name }}</h4>
                <p class="text-[9px] text-slate-400">إدارة فندقية معتمدة</p>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <button
                (click)="openWhatsApp(prop.host.phone)"
                class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 tap-bounce"
                title="واتساب"
              >
                <i class="bi bi-whatsapp text-xs"></i>
              </button>

              <a
                [href]="'tel:' + prop.host.phone"
                class="w-8 h-8 rounded-full bg-azure-50 text-azure-600 flex items-center justify-center border border-azure-200 tap-bounce"
                title="اتصال"
              >
                <i class="bi bi-telephone text-xs"></i>
              </a>
            </div>
          </div>

          <!-- Specifications Grid -->
          <div class="mb-4">
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">المواصفات</h3>
            <div class="grid grid-cols-4 gap-1.5">
              <div class="bg-slate-50 p-2 rounded-xl text-center border border-slate-100 flex flex-col items-center">
                <i class="bi bi-door-closed text-azure-600 text-xs mb-0.5"></i>
                <span class="text-[10px] font-bold text-slate-800">{{ prop.bedrooms }} غرف</span>
                <span class="text-[8px] text-slate-400">نوم</span>
              </div>
              <div class="bg-slate-50 p-2 rounded-xl text-center border border-slate-100 flex flex-col items-center">
                <i class="bi bi-droplet text-azure-600 text-xs mb-0.5"></i>
                <span class="text-[10px] font-bold text-slate-800">{{ prop.bathrooms }} حمام</span>
                <span class="text-[8px] text-slate-400">مجهز</span>
              </div>
              <div class="bg-slate-50 p-2 rounded-xl text-center border border-slate-100 flex flex-col items-center">
                <i class="bi bi-arrows-angle-expand text-azure-600 text-xs mb-0.5"></i>
                <span class="text-[10px] font-bold text-slate-800">{{ prop.area }} م²</span>
                <span class="text-[8px] text-slate-400">المساحة</span>
              </div>
              <div class="bg-slate-50 p-2 rounded-xl text-center border border-slate-100 flex flex-col items-center">
                <i class="bi bi-water text-azure-600 text-xs mb-0.5"></i>
                <span class="text-[9px] font-bold text-azure-700 truncate">{{ prop.poolType }}</span>
                <span class="text-[8px] text-slate-400">مسبح</span>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">عن الوحدة</h3>
            <p class="text-xs text-slate-600 leading-relaxed">{{ prop.description }}</p>
          </div>

          <!-- Amenities -->
          <div class="mb-4">
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">المزايا المتاحة</h3>
            <div class="grid grid-cols-2 gap-1.5">
              @for (feat of prop.features; track feat) {
                <div class="flex items-center gap-1.5 p-2 bg-slate-50 rounded-xl text-[11px] text-slate-700">
                  <i class="bi bi-check2 text-emerald-500 font-bold"></i>
                  <span>{{ feat }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Location Map Preview -->
          <div class="mb-4">
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">الموقع الجغرافي</h3>
            <div class="rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs relative bg-slate-100">
              <div class="relative h-36 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                  alt="Location"
                  class="w-full h-full object-cover filter contrast-105"
                />
                <div class="absolute inset-0 bg-azure-950/20"></div>

                <div class="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-lg bg-white/95 shadow-xs flex items-center gap-1 border border-slate-100">
                  <i class="bi bi-geo-alt-fill text-red-500 text-xs"></i>
                  <span class="text-[10px] font-bold text-slate-800">{{ prop.village }}</span>
                </div>

                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="w-8 h-8 rounded-full bg-azure-600 text-white shadow-md flex items-center justify-center ring-4 ring-white">
                    <i class="bi bi-geo-alt-fill text-xs text-white"></i>
                  </div>
                </div>

                <a
                  [href]="'https://www.google.com/maps/search/?api=1&query=' + encodeUri(prop.village + ' ' + prop.regionArabic)"
                  target="_blank"
                  class="absolute bottom-2.5 inset-x-2.5 py-1.5 bg-white/95 text-slate-900 rounded-xl text-center text-xs font-bold shadow flex items-center justify-center gap-1 tap-bounce border border-slate-200"
                >
                  <i class="bi bi-box-arrow-up-right text-azure-600 text-[10px]"></i>
                  <span>فتح في خرائط Google</span>
                </a>
              </div>

              <div class="p-2.5 bg-white space-y-1 text-[10px] border-t border-slate-100">
                <div class="flex items-center justify-between text-slate-600">
                  <span class="flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-azure-500"></span>
                    <span>المسافة للشاطئ:</span>
                  </span>
                  <span class="font-bold text-slate-900">{{ prop.distanceToBeach }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Guarantee Card -->
          <div class="p-3 rounded-2xl bg-gradient-to-r from-azure-900 to-slate-950 text-white mb-4 shadow-sm">
            <div class="flex items-center gap-1.5 mb-1">
              <i class="bi bi-shield-check text-azure-300 text-xs"></i>
              <span class="text-xs font-bold">ضمان فندقي معتمد</span>
            </div>
            <p class="text-[10px] text-white/80 leading-relaxed">
              وحدة مفحوصة ومطابقة لأعلى معايير النظافة والراحة الفندقية.
            </p>
          </div>

          <!-- Reviews Section -->
          <div>
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">تقييمات النزلاء</h3>
            <div class="space-y-2">
              @for (rev of prop.reviews; track rev.userName) {
                <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div class="flex items-center justify-between mb-0.5">
                    <div class="flex items-center gap-1.5">
                      <img [src]="rev.avatar" alt="Reviewer" class="w-5 h-5 rounded-full object-cover"/>
                      <span class="text-xs font-bold text-slate-900">{{ rev.userName }}</span>
                    </div>
                    <span class="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                      <i class="bi bi-star-fill text-[8px]"></i>
                      <span>{{ rev.rating }}.0</span>
                    </span>
                  </div>
                  <p class="text-[10px] text-slate-600 leading-relaxed">{{ rev.comment }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Sticky Bottom Booking Bar -->
        <div class="fixed bottom-0 inset-x-0 z-30 px-5 pt-3 pb-[max(2rem,calc(1.5rem+env(safe-area-inset-bottom,30px)))] bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] flex items-center justify-between">
          <div>
            <span class="text-xs text-slate-600 block font-semibold">السعر / ليلة</span>
            <span class="text-base font-black text-slate-900 font-sans">{{ prop.pricePerDay | number }} <span class="text-xs text-azure-600 font-bold">ج.م</span></span>
          </div>

          <button
            (click)="proceedToBooking(prop)"
            class="px-8 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-full shadow-lg tap-bounce flex items-center gap-2"
          >
            <span>احجز الآن</span>
            <i class="bi bi-arrow-left text-xs"></i>
          </button>
        </div>
      </div>
    }
  `
})
export class UnitDetailsScreenComponent {
  readonly state = inject(AppStateService);
  readonly activeImageIndex = signal<number>(0);

  @ViewChild('galleryScroll') galleryScrollRef?: ElementRef<HTMLDivElement>;

  private touchStartX = 0;
  private touchStartY = 0;

  onGalleryTouchStart(e: TouchEvent) {
    if (e.touches.length > 0) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }
  }

  onGalleryTouchEnd(e: TouchEvent, total: number) {
    if (e.changedTouches.length > 0) {
      const deltaX = e.changedTouches[0].clientX - this.touchStartX;
      const deltaY = e.changedTouches[0].clientY - this.touchStartY;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          this.nextImage(total);
        } else {
          this.prevImage(total);
        }
      }
    }
  }

  onGalleryScroll(e: Event) {
    const el = e.target as HTMLElement;
    if (!el || !el.clientWidth) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== this.activeImageIndex() && idx >= 0) {
      this.activeImageIndex.set(idx);
    }
  }

  goToImage(index: number) {
    this.activeImageIndex.set(index);
    if (this.galleryScrollRef?.nativeElement) {
      const el = this.galleryScrollRef.nativeElement;
      el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
    }
  }

  nextImage(total: number) {
    const next = (this.activeImageIndex() + 1) % total;
    this.goToImage(next);
  }

  prevImage(total: number) {
    const prev = (this.activeImageIndex() - 1 + total) % total;
    this.goToImage(prev);
  }

  goBack() {
    this.state.currentScreen.set('main');
  }

  toggleFav(id: string) {
    this.state.toggleFavorite(id);
  }

  encodeUri(str: string): string {
    return encodeURIComponent(str);
  }

  openWhatsApp(phone: string) {
    const clean = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${clean}?text=مرحباً، أستفسر بخصوص حجز وحدة في منصة Ragab Pay`, '_blank');
  }

  proceedToBooking(prop: any) {
    this.state.startBooking(prop);
  }
}
