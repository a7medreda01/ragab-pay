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

        <!-- Auth Sheet Container (Apple iOS Luxury Minimalist) -->
        <div class="relative w-full max-h-[92%] bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.25)] p-6 pt-3 flex flex-col overflow-y-auto no-scrollbar animate-slide-up">
          <!-- Grabber Handle -->
          <div class="w-10 h-1 bg-slate-200 rounded-full mx-auto my-3 cursor-pointer" (click)="close()"></div>

          <!-- Brand Logo Header -->
          <div class="text-center pt-1 pb-4">
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
          <div class="grid grid-cols-2 gap-1 bg-slate-100/90 p-1 rounded-2xl mb-5">
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
          <div class="space-y-3.5">
            @if (activeTab() === 'register') {
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">الاسم بالكامل</label>
                <input
                  type="text"
                  [(ngModel)]="nameInput"
                  placeholder="أحمد محمد"
                  class="w-full px-4 py-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 outline-none focus:border-azure-500 focus:bg-white text-xs font-arabic transition-all"
                />
              </div>

              <!-- Corporate Checkbox -->
              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="text-xs font-bold text-slate-800">حساب شركات ومؤسسات</span>
                <input type="checkbox" [(ngModel)]="isCorporateAccount" class="w-4 h-4 rounded accent-azure-600"/>
              </div>

              @if (isCorporateAccount) {
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 mb-1">اسم المؤسسة أو الشركة</label>
                  <input
                    type="text"
                    [(ngModel)]="companyInput"
                    placeholder="شركة المقاولات الهندسية"
                    class="w-full px-4 py-3 bg-white rounded-2xl border border-azure-300 outline-none text-xs font-arabic"
                  />
                </div>
              }
            }

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">رقم الهاتف</label>
              <div class="flex items-center gap-2" dir="ltr">
                <span class="px-3.5 py-3 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-bold text-slate-700 font-sans">+20</span>
                <input
                  type="tel"
                  [(ngModel)]="phoneInput"
                  placeholder="100 123 4567"
                  class="flex-1 px-4 py-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 outline-none focus:border-azure-500 focus:bg-white text-xs font-sans text-start transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">كلمة المرور</label>
              <input
                type="password"
                [(ngModel)]="passwordInput"
                placeholder="••••••••"
                class="w-full px-4 py-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 outline-none focus:border-azure-500 focus:bg-white text-xs font-sans text-start transition-all"
              />
            </div>

            <!-- Primary Action Button (Apple Black Pill) -->
            <button
              (click)="submitAuth()"
              class="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-full shadow-lg mt-1 tap-bounce"
            >
              {{ activeTab() === 'login' ? 'دخول إلى حسابي' : 'تأكيد التسجيل والمتابعة' }}
            </button>
          </div>

          <!-- Quick Guest Entry Button (Sleek, Uncrowded Azure Frosted Pill) -->
          <div class="mt-4 pt-3 border-t border-slate-100">
            <button
              (click)="quickGuestLogin()"
              class="w-full py-3 px-4 rounded-full bg-azure-50/90 hover:bg-azure-100/80 border border-azure-200/70 text-azure-700 text-xs font-extrabold flex items-center justify-center gap-2 tap-bounce transition-colors"
            >
              <svg class="w-4 h-4 text-azure-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>دخول سريع كزائر (تصفح فوري بدون تسجيل)</span>
            </button>
          </div>

          <!-- Refined Social Login Options (Apple & Google) -->
          <div class="mt-4 grid grid-cols-2 gap-2.5">
            <!-- Google Button with Official Multi-Color Vector SVG -->
            <button
              (click)="quickGuestLogin()"
              class="py-2.5 px-3 rounded-2xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 tap-bounce transition-colors shadow-2xs"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google</span>
            </button>

            <!-- Apple ID Button with Official Apple Vector SVG -->
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
    // Transition to main screen if on welcome
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
    // Transition to main screen if on welcome
    if (this.state.currentScreen() === 'welcome') {
      this.state.currentScreen.set('main');
      this.state.activeTab.set('home');
    }
  }

  close() {
    this.state.isAuthOpen.set(false);
  }
}
