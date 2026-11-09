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
          class="relative w-full max-h-[94%] bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.25)] p-6 pt-2 flex flex-col overflow-y-auto no-scrollbar animate-slide-up"
        >
          <!-- Grabber Handle with Swipe Down Indicator -->
          <div class="w-full flex items-center justify-between pt-1 pb-2">
            <div class="w-8"></div>
            <div class="flex flex-col items-center cursor-grab active:cursor-grabbing">
              <div class="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors"></div>
              <span class="text-[9px] text-slate-400 mt-1 select-none font-sans">اسحب للأسفل للإغلاق ↓</span>
            </div>
            <button
              (click)="close()"
              aria-label="إغلاق نافذة تسجيل الدخول"
              class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs tap-bounce"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Brand Logo Header -->
          <div class="text-center pt-1 pb-3">
            <div class="w-36 h-10 mx-auto mb-2 flex items-center justify-center">
              <img src="assets/logo.png" alt="Ragab Pay" class="max-h-full max-w-full object-contain" />
            </div>
            <h2 class="text-sm font-black text-slate-900 tracking-tight">
              {{ activeTab() === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد' }}
            </h2>
            <p class="text-[11px] text-slate-400 mt-0.5">
              {{ selectedRole() === 'owner' ? 'لوحة إدارة الشاليهات ومتابعة الأرباح' : 'حجز الشاليهات الفندقية وتصاريح QR' }}
            </p>
          </div>

          <!-- ROLE SELECTOR: Guest (عميل/نزيل) vs Owner (مالك/مضيف) -->
          <div class="mb-4">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">اختر نوع الحساب</span>
            <div class="grid grid-cols-2 gap-2.5">
              <!-- Guest Option -->
              <div
                (click)="selectedRole.set('guest')"
                class="p-3 rounded-2xl border-2 transition-all cursor-pointer tap-bounce flex flex-col items-center text-center relative"
                [class.border-azure-600]="selectedRole() === 'guest'"
                [class.bg-azure-50/60]="selectedRole() === 'guest'"
                [class.border-slate-200]="selectedRole() !== 'guest'"
              >
                @if (selectedRole() === 'guest') {
                  <span class="absolute top-2 end-2 w-2 h-2 rounded-full bg-azure-600 ring-2 ring-white"></span>
                }
                <div class="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-lg mb-1 border border-slate-100 text-azure-600">
                  <i class="bi bi-person-walking"></i>
                </div>
                <span class="text-xs font-black text-slate-900 block">نزيل ومسافر</span>
                <span class="text-[9px] text-slate-500 mt-0.5 leading-tight">حجز الشاليهات والخدمات</span>
              </div>

              <!-- Owner Option -->
              <div
                (click)="selectedRole.set('owner')"
                class="p-3 rounded-2xl border-2 transition-all cursor-pointer tap-bounce flex flex-col items-center text-center relative"
                [class.border-azure-600]="selectedRole() === 'owner'"
                [class.bg-azure-50/60]="selectedRole() === 'owner'"
                [class.border-slate-200]="selectedRole() !== 'owner'"
              >
                @if (selectedRole() === 'owner') {
                  <span class="absolute top-2 end-2 w-2 h-2 rounded-full bg-azure-600 ring-2 ring-white"></span>
                }
                <div class="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-lg mb-1 border border-slate-100 text-azure-600">
                  <i class="bi bi-building"></i>
                </div>
                <span class="text-xs font-black text-slate-900 block">مالك ومضيف عقار</span>
                <span class="text-[9px] text-slate-500 mt-0.5 leading-tight">إدارة الوحدات والأرباح</span>
              </div>
            </div>
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
                <label class="block text-[11px] font-bold text-slate-700 mb-1">
                  {{ selectedRole() === 'owner' ? 'اسم المالك بالكامل' : 'الاسم بالكامل' }}
                </label>
                <input
                  type="text"
                  [(ngModel)]="nameInput"
                  [placeholder]="selectedRole() === 'owner' ? 'م. أحمد عبد المنعم' : 'أحمد محمد'"
                  class="w-full px-4 py-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 outline-none focus:border-azure-500 focus:bg-white text-xs font-arabic transition-all"
                />
              </div>
            }

            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">رقم الهاتف</label>
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
              <label class="block text-[11px] font-bold text-slate-700 mb-1">كلمة المرور</label>
              <input
                type="password"
                [(ngModel)]="passwordInput"
                placeholder="••••••"
                class="w-full px-4 py-2.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 outline-none focus:border-azure-500 focus:bg-white text-xs font-sans transition-all"
              />
            </div>

            @if (selectedRole() === 'owner') {
              <div class="p-3 bg-azure-50/60 rounded-2xl border border-azure-100 flex items-center justify-between text-xs">
                <span class="text-azure-900 font-bold">بوابة إدارة الملاك المعتمدة</span>
                <span class="text-[10px] text-azure-700 font-semibold flex items-center gap-1">
                  <i class="bi bi-shield-check text-azure-600"></i>
                  تحصيل فوري وعقود رسمية
                </span>
              </div>
            }

            <!-- Primary Submit Button -->
            <button
              (click)="submitAuth()"
              class="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-full text-xs font-bold shadow-lg tap-bounce transition-all mt-1 flex items-center justify-center gap-2"
            >
              <span>{{ selectedRole() === 'owner' ? 'دخول لوحة المالك' : (activeTab() === 'login' ? 'دخول' : 'إنشاء الحساب') }}</span>
              <i class="bi bi-arrow-left"></i>
            </button>
          </div>

          <!-- Subtle Divider -->
          <div class="flex items-center gap-3 my-3.5">
            <div class="flex-1 h-px bg-slate-100"></div>
            <span class="text-[10px] text-slate-400 font-bold">أو الدخول التجريبي السريع</span>
            <div class="flex-1 h-px bg-slate-100"></div>
          </div>

          <!-- Quick Access Banners: Guest vs Owner -->
          <div class="space-y-2">
            @if (selectedRole() === 'owner') {
              <button
                (click)="quickOwnerLogin()"
                class="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-azure-700 via-azure-600 to-indigo-600 hover:from-azure-800 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-azure-500/20 tap-bounce transition-all flex items-center justify-center gap-2"
              >
                <i class="bi bi-speedometer2"></i>
                <span>تجربة لوحة تحكم المالك</span>
              </button>
            } @else {
              <button
                (click)="quickGuestLogin()"
                class="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-azure-600 to-sky-500 hover:from-azure-700 hover:to-sky-600 text-white text-xs font-bold shadow-md shadow-azure-500/20 tap-bounce transition-all flex items-center justify-center gap-2"
              >
                <i class="bi bi-lightning-charge-fill"></i>
                <span>دخول سريع كنزيل</span>
              </button>
            }

            <!-- Switch role shortcut button -->
            <button
              (click)="toggleRole()"
              class="w-full py-2 text-[11px] font-bold text-azure-600 hover:text-azure-700 text-center block tap-bounce"
            >
              {{ selectedRole() === 'owner' ? 'تبديل إلى بوابة النزلاء ←' : 'هل أنت مالك عقار؟ بوابة الملاك ←' }}
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
  readonly selectedRole = signal<'guest' | 'owner'>('guest');

  nameInput: string = '';
  phoneInput: string = '1001234567';
  passwordInput: string = '123456';
  isCorporateAccount: boolean = false;
  companyInput: string = '';

  // Touch Drag-Down to Dismiss variables
  touchStartY = 0;
  currentTranslateY = 0;
  isDragging = false;

  toggleRole() {
    this.selectedRole.set(this.selectedRole() === 'owner' ? 'guest' : 'owner');
  }

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
      name: 'ضيف Ragab Pay (نزيل)',
      phone: '+20 100 000 0000',
      email: 'guest@ragabpay.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true,
      memberSince: '2026',
      role: 'guest'
    });
    this.state.isAuthOpen.set(false);
    this.state.switchToGuestMode();
  }

  quickOwnerLogin() {
    this.state.currentUser.set({
      name: 'م. أحمد عبد المنعم (مالك ومضيف)',
      phone: '+20 100 987 6543',
      email: 'owner.ahmed@ragabpay.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      verified: true,
      memberSince: '2024',
      role: 'owner'
    });
    this.state.isAuthOpen.set(false);
    this.state.switchToOwnerMode();
  }

  submitAuth() {
    const isOwner = this.selectedRole() === 'owner';
    const finalName = this.nameInput.trim()
      ? this.nameInput.trim()
      : (isOwner ? 'م. أحمد عبد المنعم' : 'أحمد محمد');

    this.state.currentUser.set({
      name: finalName,
      phone: '+20 ' + (this.phoneInput || '100 123 4567'),
      email: isOwner ? 'owner@ragabpay.com' : 'client@ragabpay.com',
      avatar: isOwner
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true,
      memberSince: '2026',
      role: isOwner ? 'owner' : 'guest'
    });

    this.state.isAuthOpen.set(false);

    if (isOwner) {
      this.state.switchToOwnerMode();
    } else {
      this.state.switchToGuestMode();
    }
  }

  close() {
    this.state.isAuthOpen.set(false);
  }
}
