import { Component, HostListener, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { WelcomeScreenComponent } from '../../screens/welcome/welcome.component';
import { HomeScreenComponent } from '../../screens/home/home.component';
import { SearchScreenComponent } from '../../screens/search/search.component';
import { UnitDetailsScreenComponent } from '../../screens/details/details.component';
import { CheckoutScreenComponent } from '../../screens/checkout/checkout.component';
import { VoucherScreenComponent } from '../../screens/voucher/voucher.component';
import { FavoritesScreenComponent } from '../../screens/favorites/favorites.component';
import { ProfileScreenComponent } from '../../screens/profile/profile.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { FilterSheetComponent } from '../filter-sheet/filter-sheet.component';
import { ComparisonModalComponent } from '../comparison-modal/comparison-modal.component';
import { NotificationsModalComponent } from '../notifications-modal/notifications-modal.component';
import { AuthModalComponent } from '../../screens/auth/auth.component';
import { SideDrawerComponent } from '../side-drawer/side-drawer.component';
import { QrPassModalComponent } from '../qr-pass-modal/qr-pass-modal.component';
import { VipServicesModalComponent } from '../vip-services-modal/vip-services-modal.component';
import { AiChatModalComponent } from '../ai-chat-modal/ai-chat-modal.component';
import { OwnerDashboardComponent } from '../../screens/owner/owner-dashboard.component';

@Component({
  selector: 'app-device-shell',
  standalone: true,
  imports: [
    CommonModule,
    WelcomeScreenComponent,
    HomeScreenComponent,
    SearchScreenComponent,
    UnitDetailsScreenComponent,
    CheckoutScreenComponent,
    VoucherScreenComponent,
    FavoritesScreenComponent,
    ProfileScreenComponent,
    BottomNavComponent,
    FilterSheetComponent,
    ComparisonModalComponent,
    NotificationsModalComponent,
    AuthModalComponent,
    SideDrawerComponent,
    QrPassModalComponent,
    VipServicesModalComponent,
    AiChatModalComponent,
    OwnerDashboardComponent
  ],
  template: `
    <!-- Desktop Ambient Background Container -->
    <div class="relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-950 via-azure-950 to-navy-950 select-none font-arabic">
      <!-- Ambient Decorative Coastal Glow & Wave Orbs (Desktop only) -->
      <div class="hidden lg:block absolute -top-40 -start-40 w-[600px] h-[600px] bg-azure-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="hidden lg:block absolute -bottom-40 -end-40 w-[600px] h-[600px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      <!-- Desktop Side Branding Panel (Desktop only) -->
      <div class="hidden xl:flex flex-col justify-between h-[844px] max-w-sm me-16 text-white py-10 z-10" [style.transform]="'scale(' + scaleFactor() + ')'">
        <div>
          <!-- Official Logo Card -->
          <div class="px-6 py-4 rounded-3xl bg-white shadow-2xl inline-flex items-center justify-center mb-6 border border-white/80">
            <img
              src="assets/logo.png"
              alt="Ragab Pay Logo"
              class="h-12 w-auto object-contain"
            />
          </div>

          <h2 class="text-xl font-black leading-snug text-white">
            منظومة الحجز والإدارة الفندقية وسكن الشركات الذكية - Ragab Pay
          </h2>
          <p class="text-xs text-white/70 mt-3 leading-relaxed">
            واجهة العميل التفاعلية الفاخرة لمنظومة Ragab Pay، تدعم الحجز اليومي والأسبوعي والشهري والسنوي، مع وحدات مخصصة لوفود الشركات والمهندسين والعمال بشتى محافظات مصر.
          </p>

          <div class="mt-6 space-y-3 text-xs text-white/85">
            <div class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>محرك بحث ذكي وفلاتر متقدمة مطابقة للواقع</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full bg-azure-400"></span>
              <span>مقارنة ذكية للوحدات والأسعار جنباً إلى جنب</span>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>حجز مباشر وقسيمة دخول فندقية برمز QR</span>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
          <div class="flex items-center gap-2 text-xs font-bold text-azure-300 mb-1">
            <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            <span>تجربة تفاعلية حية كاملة</span>
          </div>
          <span class="text-[10px] text-white/70 block leading-relaxed">
            يمكنك تجربة جميع شاشات التطبيق والحجز والتصفية داخل مجسم هاتف iPhone أمامك مباشرة.
          </span>
        </div>
      </div>

      <!-- Device Container: Native on Mobile, iPhone Frame on Desktop -->
      <div
        class="transition-transform duration-200 ease-out origin-center"
        [class.w-full]="isMobile()"
        [class.h-full]="isMobile()"
        [class.w-[390px]]="!isMobile()"
        [class.h-[844px]]="!isMobile()"
        [style.transform]="isMobile() ? 'none' : 'scale(' + scaleFactor() + ')'"
      >
        <!-- iPhone Outer Bezel Frame (hidden on real mobile phone screen <=500px) -->
        <div
          class="relative w-full h-full overflow-hidden flex flex-col bg-slate-900"
          [class.rounded-[54px]]="!isMobile()"
          [class.ring-[10px]]="!isMobile()"
          [class.ring-slate-800/90]="!isMobile()"
          [class.shadow-[0_25px_70px_rgba(0,0,0,0.85)]]="!isMobile()"
          style="transform: translateZ(0);"
        >
          <!-- Fake iOS Status Bar & Dynamic Island (Desktop mode) -->
          @if (!isMobile()) {
            <div class="relative z-50 h-11 px-7 flex items-center justify-between text-white text-[12px] font-sans font-semibold bg-transparent pointer-events-none">
              <!-- Time 9:41 -->
              <span>9:41</span>

              <!-- Dynamic Island Pill -->
              <div class="w-28 h-7 bg-black rounded-full flex items-center justify-end px-2.5">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse"></div>
              </div>

              <!-- Icons: Signal, Wifi, Battery -->
              <div class="flex items-center gap-1.5 text-xs">
                <span>5G</span>
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
                <div class="w-5 h-2.5 rounded-sm border border-white flex items-center p-0.5">
                  <div class="h-full w-full bg-white rounded-2xs"></div>
                </div>
              </div>
            </div>
          }

          <!-- Screen Contents Container -->
          <div class="relative flex-1 w-full h-full overflow-hidden bg-slate-50">
            <!-- Screen 1: Welcome -->
            @if (state.currentScreen() === 'welcome') {
              <app-welcome-screen></app-welcome-screen>
            }

            <!-- Screen 2: Main Tab Bar View (Home / Search / Favorites / Profile) -->
            @if (state.currentScreen() === 'main') {
              @if (state.activeTab() === 'home') {
                <app-home-screen></app-home-screen>
              }
              @if (state.activeTab() === 'search') {
                <app-search-screen></app-search-screen>
              }
              @if (state.activeTab() === 'favorites') {
                <app-favorites-screen></app-favorites-screen>
              }
              @if (state.activeTab() === 'profile') {
                <app-profile-screen></app-profile-screen>
              }

              <!-- Floating Bottom Navigation -->
              <app-bottom-nav></app-bottom-nav>
            }

            <!-- Screen 3: Unit Details -->
            @if (state.currentScreen() === 'details') {
              <app-details-screen></app-details-screen>
            }

            <!-- Screen 4: Checkout -->
            @if (state.currentScreen() === 'checkout') {
              <app-checkout-screen></app-checkout-screen>
            }

            <!-- Screen 5: Voucher -->
            @if (state.currentScreen() === 'voucher') {
              <app-voucher-screen></app-voucher-screen>
            }

            <!-- Screen 6: Owner Dashboard Portal -->
            @if (state.currentScreen() === 'owner-dashboard') {
              <app-owner-dashboard></app-owner-dashboard>
            }

            <!-- Overlays (Inside Device Frame) -->
            <app-filter-sheet></app-filter-sheet>
            <app-comparison-modal></app-comparison-modal>
            <app-notifications-modal></app-notifications-modal>
            <app-auth-modal></app-auth-modal>
            <app-side-drawer></app-side-drawer>
            <app-qr-pass-modal></app-qr-pass-modal>
            <app-vip-services-modal></app-vip-services-modal>
            <app-ai-chat-modal></app-ai-chat-modal>
          </div>

          <!-- iPhone Home Indicator Bar (Desktop Mode) -->
          @if (!isMobile()) {
            <div class="relative z-50 h-5 w-full flex items-center justify-center bg-transparent pointer-events-none">
              <div class="w-32 h-1 bg-white/60 rounded-full"></div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class DeviceShellComponent implements OnInit {
  readonly state = inject(AppStateService);

  readonly windowWidth = signal<number>(window.innerWidth);
  readonly windowHeight = signal<number>(window.innerHeight);

  readonly isMobile = computed(() => this.windowWidth() <= 500);

  readonly scaleFactor = computed(() => {
    if (this.isMobile()) return 1;
    const availableH = this.windowHeight() - 48;
    return Math.min(1, Math.max(0.65, availableH / 844));
  });

  @HostListener('window:resize')
  onResize() {
    this.windowWidth.set(window.innerWidth);
    this.windowHeight.set(window.innerHeight);
  }

  ngOnInit() {
    this.onResize();
  }
}
