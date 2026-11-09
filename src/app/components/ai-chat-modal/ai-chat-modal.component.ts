import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService } from '../../services/app-state.service';
import { PropertyImageComponent } from '../property-image/property-image.component';
import { Property } from '../../data/properties.data';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  suggestedProperties?: Property[];
  actionLabel?: string;
}

@Component({
  selector: 'app-ai-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyImageComponent],
  template: `
    @if (state.isAiChatOpen()) {
      <div class="absolute inset-0 z-50 flex flex-col justify-end font-arabic">
        <!-- Backdrop Blur -->
        <div (click)="close()" class="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"></div>

        <!-- Sheet Modal with Drag Down to Dismiss -->
        <div
          (touchstart)="onSheetTouchStart($event)"
          (touchmove)="onSheetTouchMove($event)"
          (touchend)="onSheetTouchEnd($event)"
          [style.transform]="currentTranslateY > 0 ? 'translateY(' + currentTranslateY + 'px)' : ''"
          [style.transition]="isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)'"
          class="relative w-full h-[90%] max-h-[92%] bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-slide-up"
        >
          <!-- Grabber Handle with Swipe Down Affordance -->
          <div class="w-full flex flex-col items-center justify-center pt-2.5 pb-1 cursor-grab active:cursor-grabbing border-b border-slate-100/60 bg-white">
            <div class="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full transition-colors"></div>
            <span class="text-[9px] text-slate-400 mt-1 select-none font-sans">اسحب للأسفل للإغلاق ↓</span>
          </div>

          <!-- Header -->
          <div class="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md">
            <div class="flex items-center gap-2.5">
              <div class="relative">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-azure-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-azure-500/25">
                  <i class="bi bi-robot text-lg"></i>
                </div>
                <span class="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h2 class="text-xs font-black text-slate-900">المساعد الذكي</h2>
                  <span class="px-1.5 py-0.2 rounded-md bg-azure-50 text-azure-700 text-[9px] font-bold border border-azure-200">AI</span>
                </div>
                <span class="text-[10px] text-slate-400">ترشيحات فورية تناسب متطلباتك وميزانيتك</span>
              </div>
            </div>

            <button
              (click)="close()"
              aria-label="إغلاق المساعد الذكي"
              class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 text-xs tap-bounce"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Quick Suggestion Chips Carousel -->
          <div class="px-4 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-2 flex-shrink-0">
            @for (prompt of quickPrompts; track prompt) {
              <button
                (click)="sendQuickPrompt(prompt)"
                class="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-medium shadow-2xs hover:border-azure-500 hover:text-azure-600 whitespace-nowrap tap-bounce flex-shrink-0 transition-colors"
              >
                {{ prompt }}
              </button>
            }
          </div>

          <!-- Chat Messages Area -->
          <div #chatContainer class="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar bg-slate-50/60 font-arabic">
            @for (msg of messages(); track msg.id) {
              @if (msg.sender === 'ai') {
                <!-- AI Message Bubble -->
                <div class="flex items-start gap-2.5 max-w-[92%] animate-fade-in">
                  <div class="w-8 h-8 rounded-xl bg-azure-600 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-xs mt-1">
                    <i class="bi bi-robot"></i>
                  </div>
                  <div class="space-y-2 flex-1 min-w-0">
                    <div class="p-3.5 rounded-3xl rounded-tr-xs bg-white border border-slate-200/80 shadow-xs text-xs text-slate-800 leading-relaxed">
                      {{ msg.text }}
                    </div>

                    <!-- Suggested Property Cards (If AI Found Matches) -->
                    @if (msg.suggestedProperties && msg.suggestedProperties.length > 0) {
                      <div class="space-y-2 pt-1">
                        <span class="text-[10px] font-bold text-azure-600 flex items-center gap-1">
                          <i class="bi bi-stars"></i>
                          أنسب الوحدات المقترحة:
                        </span>
                        @for (prop of msg.suggestedProperties; track prop.id) {
                          <div
                            (click)="viewProperty(prop)"
                            class="p-2.5 rounded-2xl bg-white border border-azure-200 hover:border-azure-500 shadow-sm transition-all cursor-pointer tap-bounce flex gap-3 group"
                          >
                            <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                              <app-property-image [src]="prop.images[0]" [alt]="prop.title"></app-property-image>
                            </div>
                            <div class="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div class="flex items-center justify-between">
                                  <span class="text-[9px] font-bold text-azure-600">{{ prop.categoryArabic }}</span>
                                  <span class="text-[9px] text-amber-500 font-bold flex items-center gap-0.5">
                                    <i class="bi bi-star-fill text-[8px]"></i>
                                    {{ prop.rating }}
                                  </span>
                                </div>
                                <h4 class="text-[11px] font-bold text-slate-900 truncate group-hover:text-azure-600 transition-colors">
                                  {{ prop.title }}
                                </h4>
                                <span class="text-[9px] text-slate-400 block truncate">{{ prop.village }}</span>
                              </div>
                              <div class="flex items-center justify-between mt-1">
                                <span class="text-[11px] font-black text-slate-900 font-sans">{{ prop.pricePerDay | number }} ج.م <span class="text-[8px] font-normal text-slate-400">/ ليلة</span></span>
                                <span class="text-[10px] font-bold text-azure-600 flex items-center gap-1">
                                  <span>تفاصيل</span>
                                  <i class="bi bi-arrow-left text-[9px]"></i>
                                </span>
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                    }
                    <span class="text-[9px] text-slate-400 block px-1">{{ msg.time }}</span>
                  </div>
                </div>
              } @else {
                <!-- User Message Bubble -->
                <div class="flex items-start justify-end gap-2.5 animate-fade-in">
                  <div class="max-w-[85%] space-y-1">
                    <div class="p-3.5 rounded-3xl rounded-tl-xs bg-slate-900 text-white text-xs leading-relaxed shadow-sm">
                      {{ msg.text }}
                    </div>
                    <span class="text-[9px] text-slate-400 block text-end px-1">{{ msg.time }}</span>
                  </div>
                  <img [src]="state.currentUser().avatar" alt="You" class="w-8 h-8 rounded-xl object-cover flex-shrink-0 mt-1 shadow-xs"/>
                </div>
              }
            }

            <!-- Typing Indicator -->
            @if (isTyping()) {
              <div class="flex items-center gap-2 max-w-[80%] animate-fade-in">
                <div class="w-8 h-8 rounded-xl bg-azure-600 text-white flex items-center justify-center text-sm flex-shrink-0">
                  <i class="bi bi-robot"></i>
                </div>
                <div class="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                  <div class="w-2 h-2 rounded-full bg-azure-600 animate-bounce"></div>
                  <div class="w-2 h-2 rounded-full bg-azure-400 animate-bounce" style="animation-delay: 0.15s"></div>
                  <div class="w-2 h-2 rounded-full bg-sky-300 animate-bounce" style="animation-delay: 0.3s"></div>
                  <span class="text-[10px] text-slate-400 ms-1 font-medium">جاري فحص وتخصيص أفضل خيار...</span>
                </div>
              </div>
            }
          </div>

          <!-- Input Bar -->
          <div class="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <div class="flex-1 relative flex items-center bg-slate-100/90 rounded-full px-4 py-2 border border-slate-200 focus-within:border-azure-500 focus-within:bg-white transition-all">
              <input
                type="text"
                [(ngModel)]="userInput"
                (keydown.enter)="sendMessage()"
                placeholder="اسأل عن شاليه، فيلا، ميزانية، أو سكن شركات..."
                class="w-full text-xs bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <!-- Send Button -->
            <button
              (click)="sendMessage()"
              [disabled]="!userInput.trim()"
              class="w-10 h-10 rounded-full bg-slate-950 hover:bg-slate-900 disabled:bg-slate-300 text-white flex items-center justify-center tap-bounce shadow-md transition-colors flex-shrink-0"
              title="إرسال"
            >
              <i class="bi bi-send text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class AiChatModalComponent {
  readonly state = inject(AppStateService);

  @ViewChild('chatContainer') chatContainerRef?: ElementRef<HTMLDivElement>;

  userInput: string = '';
  readonly isTyping = signal<boolean>(false);

  // Quick suggestion prompts
  readonly quickPrompts = [
    'شاليه صف أول عالبحر بالساحل',
    'سكن شركات ومشاريع بالعاصمة',
    'فيلا خاصة بمسبح في الجونة',
    'شقة فندقية بالتجمع الخامس',
    'أفضل العروض والأسعار المتاحة'
  ];

  readonly messages = signal<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'مرحباً بك في منصة Ragab Pay! أنا مستشارك العقاري الذكي للإقامة الفندقية وسكن الأعمال. أخبرني بما تبحث عنه وسأرشح لك أفضل الخيارات فوراً.',
      time: 'الآن'
    }
  ]);

  // Drag down to dismiss variables
  touchStartY = 0;
  currentTranslateY = 0;
  isDragging = false;

  sendQuickPrompt(promptText: string) {
    this.userInput = promptText;
    this.sendMessage();
  }

  sendMessage() {
    const text = this.userInput.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text,
      time: this.getCurrentTime()
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.userInput = '';
    this.scrollToBottom();

    // Trigger AI thinking & recommendation
    this.isTyping.set(true);

    setTimeout(() => {
      this.processAiResponse(text);
      this.isTyping.set(false);
      this.scrollToBottom();
    }, 1200);
  }

  private processAiResponse(query: string) {
    const q = query.toLowerCase();
    const allProps = this.state.properties();

    let matched: Property[] = [];
    let responseText = '';

    if (q.includes('ساحل') || q.includes('شمالي') || q.includes('بحر') || q.includes('شاطئ')) {
      matched = allProps.filter(p => p.region === 'north-coast' || p.distanceToBeach.includes('مباشر'));
      responseText = 'وجدت لك أفضل خيارات الساحل الشمالي المطلة مباشرة على البحر مع خدمات فندقية متكاملة وشواطئ خاصة معتمدة من Ragab Pay:';
    } else if (q.includes('عمال') || q.includes('شركات') || q.includes('مهندس') || q.includes('عاصمة') || q.includes('مشروع')) {
      matched = allProps.filter(p => p.isCorporateReady);
      responseText = 'تمت تصفية وحدات سكن الشركات والمشاريع الهندسية المجهزة طبقاً لاشتراطات السلامة المهنية، ومتاحة بعقود إيجار شهرية وسنوية مع فواتير ضريبية:';
    } else if (q.includes('جونة') || q.includes('مسبح') || q.includes('فيلا') || q.includes('بحر أحمر')) {
      matched = allProps.filter(p => p.region === 'red-sea' || p.poolType.includes('خاص'));
      responseText = 'اخترت لك أفخم الفيلات المزودة بمسبح خاص كامل الخصوصية وإطلالات بحرية استثنائية تناسب العائلات وكبار الشخصيات:';
    } else if (q.includes('تجمع') || q.includes('تسعين') || q.includes('قاهرة جديدة')) {
      matched = allProps.filter(p => p.region === 'new-cairo');
      responseText = 'هذه أرقى الشقق الفندقية والبنتهاوس في التجمع الخامس بالقرب من شارع التسعين ومراكز الأعمال:';
    } else if (q.includes('أرخص') || q.includes('اقتصادي') || q.includes('سعر')) {
      matched = [...allProps].sort((a, b) => a.pricePerDay - b.pricePerDay).slice(0, 3);
      responseText = 'إليك الوحدات الأفضل قيمة مقابل السعر والمطابقة للميزانية الاقتصادية مع الحفاظ على الجودة الفندقية:';
    } else {
      matched = allProps.slice(0, 2);
      responseText = `بناءً على طلبك، قمت بمسح جميع الوحدات المتاحة في قاعدة بيانات Ragab Pay، وأنصحك بشدة بهذه الخيارات المتميزة:`;
    }

    // Limit to top 2-3 matches
    matched = matched.slice(0, 2);

    const aiMsg: ChatMessage = {
      id: 'ai-' + Date.now(),
      sender: 'ai',
      text: responseText,
      time: this.getCurrentTime(),
      suggestedProperties: matched
    };

    this.messages.update(msgs => [...msgs, aiMsg]);
  }

  viewProperty(prop: Property) {
    this.close();
    this.state.startBooking(prop);
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainerRef?.nativeElement) {
        const el = this.chatContainerRef.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
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

  close() {
    this.state.isAiChatOpen.set(false);
  }
}

