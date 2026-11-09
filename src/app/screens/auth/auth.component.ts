import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (state.isAuthOpen()) {
      <div class="absolute inset-0 z-50 flex flex-col justify-end font-arabic">
        <!-- Backdrop Blur -->
        <div (click)="close()" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"></div>

        <!-- Auth Sheet Container with Drag-Down to Dismiss -->
        <div
          (touchstart)="onSheetTouchStart($event)"
          (touchmove)="onSheetTouchMove($event)"
          (touchend)="onSheetTouchEnd($event)"
          [style.transform]="currentTranslateY > 0 ? 'translateY(' + currentTranslateY + 'px)' : ''"
          [style.transition]="isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)'"
          class="relative w-full max-h-[92%] bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.25)] p-6 pt-2 flex flex-col overflow-y-auto no-scrollbar animate-slide-up"
        >
          <!-- Grabber Handle with Swipe Down Indicator -->
          <div class="w-full flex flex-col items-center justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing">
            <div class="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors"></div>
            <span class="text-[9px] text-slate-400 mt-1 select-none font-sans">اسحب للأسفل للإغلاق ↓</span>
          </div>

          <!-- Brand Logo Header -->
          <div class="text-center pt-1 pb-3">
            <div class="w-36 h-10 mx-auto mb-2 flex items-center justify-center">
              <img src="assets/logo.png" alt="Ragab Pay" class="max-h-full max-w-full object-contain" />
            </div>
            <h2 class="text-sm font-black text-slate-900 tracking-tight">
              {{ activeTab() === 'login' ? 'تسجيل الدخول إلى Ragab Pay' : 'إنشاء حساب جديد' }}
            </h2>
            <p class="text-[11px] text-slate-400 mt-0.5">
              {{ activeTab() === 'login' ? 'أهلاً بك! تابع حجوزاتك أو ادخل كزائر فوراً' : 'انضم الآن للاستفادة من أسعار الشركات والعروض الحصرية' }}
            </p>
          </div>

          <!-- Segmented Tab Switcher (Apple Style) -->
          <div class="grid grid-cols-2 gap-1 bg-slate-100/90 p-1 rounded-2xl mb-4">
            <button
              (click)="activeTab.set('login')"
              class="py-2 text-xs font-bold rounded-xl transition-all duration-200 tap-bounce"
              [class.bg-white]="activeTab() === 'login'"
              [class.text-slate-900]="activeTab() === 'login'"
              [class.shadow-xs]="activeTab() === 'login'"
              [class.text-slate-400]="activeTab() !== 'login'"
            >
              تسجيل الدخول
            </button>
            <button
              (click)="activeTab.set('register')"
              class="py-2 text-xs font-bold rounded-xl transition-all duration-200 tap-bounce"
              [class.bg-white]="activeTab() === 'register'"
              [class.text-slate-900]="activeTab() === 'register'"
              [class.shadow-xs]="activeTab() === 'register'"
              [class.text-slate-400]="activeTab() !== 'register'"
            >
              حساب جديد
            </button>
          </div>

          <!-- Clean Form Fields with Generous Breathing Room -->
          <div class="space-y-3">
            @if (activeTab() === 'register') {
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">الاسم بالكامل</label>
                <input
                  type="text"
                  [(ngModel)]="nameInput"
                  placeholder="أحمد محمد"
                  class="w-full px-4 py-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 outline-none focus:border-azure-500 focus:bg-white text-xs font-arabic transition-all"
                />
              </div>
            }

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">رقم الهاتف المحمول</label>
              <div class="flex gap-2">
                <span class="px-3.5 py-2.5 bg-slate-100 rounded-2xl border border-slate-200/80 text-xs font-sans font-bold text-slate-700 flex items-center">
                  +20
                </span>
                <input
                  type="tel"
                  [(ngModel)]="phoneInput"
                  placeholder="1001234567"
                  dir="ltr"
                  class="flex-1 px-4 py-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 outline-none focus:border-azure-500 focus:bg-white text-xs font-sans font-bold transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">كلمة المرور أو الرمز السري</label>
              <input
                type="password"
                [(ngModel)]="passwordInput"
                placeholder="••••••"
                class="w-full px-4 py-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 outline-none focus:border-azure-500 focus:bg-white text-xs font-sans transition-all"
              />
            </div>

            <!-- Corporate Account Checkbox (Clean Apple Toggle) -->
            <div class="flex items-center justify-between p-3 bg-azure-50/60 rounded-2xl border border-azure-100">
              <div class="flex items-center gap-2">
                <span class="text-sm">🏢</span>
                <span class="text-[11px] font-bold text-azure-900">حساب تعاقد شركات وفنادق</span>
              </div>
              <input
                type="checkbox"
                [(ngModel)]="isCorporateAccount"
                class="w-4 h-4 accent-azure-600 rounded cursor-pointer"
              />
            </div>

            @if (isCorporateAccount) {
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">اسم الشركة / المؤسسة</label>
                <input
                  type="text"
                  [(ngModel)]="companyInput"
                  placeholder="شركة التطوير العقاري للمشاريع"
                  class="w-full px-4 py-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 outline-none focus:border-azure-500 focus:bg-white text-xs font-arabic transition-all"
                />
              </div>
            }

            <!-- Primary Submit Button -->
            <button
              (click)="submitAuth()"
              class="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-full text-xs font-bold shadow-lg tap-bounce transition-all mt-1 flex items-center justify-center gap-2"
            >
              <span>{{ activeTab() === 'login' ? 'دخول إلى حسابي' : 'إنشاء الحساب ومتابعة الاستكشاف' }}</span>
              <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>

          <!-- Subtle Divider -->
          <div class="flex items-center gap-3 my-4">
            <div class="flex-1 h-px bg-slate-100"></div>
            <span class="text-[10px] text-slate-400 font-bold">أو الدخول المباشر</span>
            <div class="flex-1 h-px bg-slate-100"></div>
          </div>

          <!-- Quick Guest Access Banner -->
          <button
            (click)="quickGuestLogin()"
            class="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-azure-600 to-sky-500 hover:from-azure-700 hover:to-sky-600 text-white text-xs font-bold shadow-md shadow-azure-500/20 tap-bounce transition-all flex items-center justify-center gap-2"
          >
            <span>⚡ دخول سريع كزائر (تصفح فوري وحجز مباشر)</span>
          </button>

          <!-- Social Login: Clean Minimal Grid -->
          <div class="grid grid-cols-2 gap-2 mt-3">
            <!-- Google Button -->
            <button
              (click)="quickGuestLogin()"
              class="py-2.5 px-3 rounded-2xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 tap-bounce transition-colors shadow-2xs"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>

            <!-- Apple ID Button -->
            <button
              (click)="quickGuestLogin()"
              class="py-2.5 px-3 rounded-2xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 tap-bounce transition-colors shadow-2xs"
            >
              <svg class="w-4 h-4 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.58.67-1.09 1.74-0.95 2.77.99.08 2.05-.52 2.67-1.27z"/>
              </svg>
              <span>Apple ID</span>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class AuthModalComponent {
  readonly state = inject(AppStateService);

  readonly activeTab = signal<'login' | 'register'>('login');

  nameInput: string = '';
  phoneInput: string = '1001234567';
  passwordInput: string = '123456';
  isCorporateAccount: boolean = false;
  companyInput: string = '';

  // Touch Drag-Down to Dismiss variables
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

  quickGuestLogin() {
    this.state.currentUser.set({
      name: 'ضيف Ragab Pay (زائر)',
      phone: '+20 100 000 0000',
      email: 'guest@ragabpay.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true,
      memberSince: '2026'
    });
    this.state.isAuthOpen.set(false);
    if (this.state.currentScreen() === 'welcome') {
      this.state.currentScreen.set('main');
      this.state.activeTab.set('home');
    }
  }

  submitAuth() {
    const finalName = this.activeTab() === 'register' && this.nameInput.trim()
      ? this.nameInput.trim()
      : (this.companyInput || 'أحمد محمد');

    this.state.currentUser.set({
      name: finalName,
      phone: '+20 ' + (this.phoneInput || '100 123 4567'),
      email: this.isCorporateAccount ? 'corporate@ragabpay.com' : 'ahmed.m@ragabpay.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true,
      memberSince: '2026'
    });
    this.state.isAuthOpen.set(false);
    if (this.state.currentScreen() === 'welcome') {
      this.state.currentScreen.set('main');
      this.state.activeTab.set('home');
    }
  }

  close() {
    this.state.isAuthOpen.set(false);
  }
}
