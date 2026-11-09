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
        <div (click)="close()" class="absolute inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"></div>

        <!-- Auth Sheet Container -->
        <div class="relative w-full max-h-[90%] bg-white/95 backdrop-blur-2xl rounded-t-[36px] shadow-2xl border-t border-white/60 p-6 flex flex-col overflow-y-auto no-scrollbar animate-slide-up">
          <!-- Grabber Handle -->
          <div class="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-pointer" (click)="close()"></div>

          <!-- Brand Logo Header -->
          <div class="text-center mb-5">
            <div class="w-40 h-12 mx-auto mb-2 flex items-center justify-center">
              <img src="assets/logo.png" alt="Ragab Pay" class="max-h-full max-w-full object-contain" />
            </div>
            <h2 class="text-sm font-black text-slate-900">
              {{ activeTab() === 'login' ? 'مرحباً بك مجدداً في Ragab Pay' : 'انضم إلى مجتمع الإقامة الفندقية وسكن الشركات' }}
            </h2>
            <p class="text-[11px] text-slate-500 mt-0.5">
              {{ activeTab() === 'login' ? 'سجل دخولك لمتابعة حجوزاتك وإدارتها بسهولة' : 'أنشئ حسابك للاستفادة من أسعار الشركات والعروض الحصرية' }}
            </p>
          </div>

          <!-- Quick Guest Entry Button (دخول سريع كزائر) -->
          <button
            (click)="quickGuestLogin()"
            class="w-full py-3.5 mb-4 bg-gradient-to-r from-azure-600 to-sky-500 hover:from-azure-700 hover:to-sky-600 text-white font-extrabold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 tap-bounce"
          >
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span>دخول سريع كزائر (تصفح فوري وتجربة الحجز بنقرة واحدة)</span>
          </button>

          <!-- Divider -->
          <div class="relative flex py-2 items-center mb-4">
            <div class="flex-grow border-t border-slate-200"></div>
            <span class="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">أو عبر الحساب الرسمي</span>
            <div class="flex-grow border-t border-slate-200"></div>
          </div>

          <!-- Tabs Switcher: Login / Register -->
          <div class="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-2xl mb-5">
            <button
              (click)="activeTab.set('login')"
              class="py-2 text-xs font-bold rounded-xl transition-all tap-bounce"
              [class.bg-white]="activeTab() === 'login'"
              [class.text-slate-900]="activeTab() === 'login'"
              [class.shadow-xs]="activeTab() === 'login'"
              [class.text-slate-500]="activeTab() !== 'login'"
            >
              تسجيل الدخول
            </button>
            <button
              (click)="activeTab.set('register')"
              class="py-2 text-xs font-bold rounded-xl transition-all tap-bounce"
              [class.bg-white]="activeTab() === 'register'"
              [class.text-slate-900]="activeTab() === 'register'"
              [class.shadow-xs]="activeTab() === 'register'"
              [class.text-slate-500]="activeTab() !== 'register'"
            >
              إنشاء حساب جديد
            </button>
          </div>

          <!-- Form Fields -->
          <div class="space-y-3.5 text-xs">
            @if (activeTab() === 'register') {
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1">الاسم بالكامل</label>
                <input
                  type="text"
                  [(ngModel)]="nameInput"
                  placeholder="مثال: أحمد محمد الشناوي"
                  class="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-500 font-arabic text-xs"
                />
              </div>

              <!-- Corporate Account Toggle -->
              <div class="p-3 bg-azure-50/70 border border-azure-200/70 rounded-xl flex items-center justify-between">
                <div>
                  <span class="block text-xs font-bold text-azure-950">حساب شركات ومؤسسات (Corporate Account)</span>
                  <span class="block text-[10px] text-azure-700">للحصول على فواتير ضريبية وخصومات سكن الموظفين</span>
                </div>
                <input type="checkbox" [(ngModel)]="isCorporateAccount" class="w-4 h-4 rounded accent-azure-600"/>
              </div>

              @if (isCorporateAccount) {
                <div>
                  <label class="block text-[11px] font-bold text-azure-800 mb-1">اسم الشركة أو المؤسسة</label>
                  <input
                    type="text"
                    [(ngModel)]="companyInput"
                    placeholder="مثال: شركة المقاولات والإنشاءات الهندسية"
                    class="w-full p-3 bg-white rounded-xl border border-azure-300 outline-none font-arabic text-xs"
                  />
                </div>
              }
            }

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">رقم الهاتف المحمول</label>
              <div class="flex items-center gap-2" dir="ltr">
                <span class="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 font-sans">+20</span>
                <input
                  type="tel"
                  [(ngModel)]="phoneInput"
                  placeholder="100 123 4567"
                  class="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-500 font-sans text-xs text-start"
                />
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">كلمة المرور أو الرمز السري</label>
              <input
                type="password"
                [(ngModel)]="passwordInput"
                placeholder="••••••••"
                class="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-azure-500 text-xs font-sans text-start"
              />
            </div>

            <!-- Submit Button -->
            <button
              (click)="submitAuth()"
              class="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-lg mt-2 tap-bounce"
            >
              {{ activeTab() === 'login' ? 'دخول إلى حسابي' : 'تأكيد التسجيل في Ragab Pay' }}
            </button>
          </div>

          <!-- Social Login Alternatives -->
          <div class="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5">
            <button
              (click)="quickGuestLogin()"
              class="py-2.5 px-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:bg-slate-50 tap-bounce"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.58.67-1.09 1.74-0.95 2.77.99.08 2.05-.52 2.67-1.27z"/></svg>
              <span>Apple ID</span>
            </button>

            <button
              (click)="quickGuestLogin()"
              class="py-2.5 px-3 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:bg-slate-50 tap-bounce"
            >
              <svg class="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.067 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
              <span>Google</span>
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
      name: 'ضيف راغب باي (زائر)',
      phone: '+20 100 000 0000',
      email: 'guest@ragabpay.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true,
      memberSince: '2026'
    });
    this.state.isAuthOpen.set(false);
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
  }

  close() {
    this.state.isAuthOpen.set(false);
  }
}
