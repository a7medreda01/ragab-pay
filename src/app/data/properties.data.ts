export interface Property {
  id: string;
  title: string;
  village: string;
  region: 'north-coast' | 'new-cairo' | 'zayed-october' | 'zamalek' | 'maadi' | 'new-capital' | 'red-sea';
  regionArabic: string;
  category: 'chalet' | 'villa' | 'apartment' | 'penthouse' | 'corporate-housing' | 'staff-residence';
  categoryArabic: string;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  pricePerYear: number;
  supportedRentalTypes: ('daily' | 'weekly' | 'monthly' | 'yearly')[];
  rating: number;
  reviewsCount: number;
  distanceToBeach: string;
  distanceToBeachValue: number; // meters
  area: number; // m²
  bedrooms: number;
  bathrooms: number;
  singleBedsCount?: number; // for staff/workers
  poolType: 'خاص إنفينيتي' | 'خاص مع جاكوزي' | 'مشترك فاخر' | 'بدون مسبح';
  hasPrivatePool: boolean;
  maxGuests: number;
  isCorporateReady: boolean;
  targetAudience: 'عائلات وفنادق' | 'سياحة شاطئية' | 'رجال أعمال وشركات' | 'سكن مهندسين وعمال ومشاريع';
  features: string[];
  host: {
    name: string;
    avatar: string;
    verified: boolean;
    responseTime: string;
    rating: number;
    phone: string;
  };
  images: string[];
  featured: boolean;
  exclusiveOffer?: string;
  blockedDates: string[];
  description: string;
  reviews: {
    userName: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  village: string;
  rentalType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  rentalTypeArabic: string;
  checkIn: string;
  checkOut: string;
  durationUnits: number;
  nightsCount?: number;
  guestsCount: number;
  unitPrice: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  paymentMethod: string;
  bookingRef: string;
  createdAt: string;
  guestName: string;
  guestPhone: string;
  companyName?: string;
}

export const MOCK_PROPERTIES: Property[] = [
  // 1. الساحل الشمالي - رأس الحكمة
  {
    id: 'rp-01',
    title: 'شاليه ملكي بفيو بانورامي على الشاطئ مباشرة',
    village: 'قرية Sea View - الساحل الشمالي (الكيلو 120)',
    region: 'north-coast',
    regionArabic: 'الساحل الشمالي',
    category: 'chalet',
    categoryArabic: 'شاليه فاخر',
    pricePerDay: 4000,
    pricePerWeek: 24000,
    pricePerMonth: 68000,
    pricePerYear: 320000,
    supportedRentalTypes: ['daily', 'weekly', 'monthly', 'yearly'],
    rating: 4.96,
    reviewsCount: 42,
    distanceToBeach: 'صف أول على البحر مباشرة',
    distanceToBeachValue: 30,
    area: 175,
    bedrooms: 3,
    bathrooms: 2,
    poolType: 'خاص إنفينيتي',
    hasPrivatePool: true,
    maxGuests: 6,
    isCorporateReady: false,
    targetAudience: 'سياحة شاطئية',
    featured: true,
    exclusiveOffer: 'خصم 15% للإقامات أكثر من أسبوع',
    features: ['مسبح إنفينيتي خاص', 'شاطئ رملي خاص', 'واي فاي فايبر', 'مطبخ إيطالي', 'تكييف مركزي', 'تراس باربيكيو', 'تنظيف فندقي يومي'],
    host: {
      name: 'م. أحمد الشناوي',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      verified: true,
      responseTime: 'خلال 10 دقائق',
      rating: 4.9,
      phone: '+20 100 234 5678'
    },
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
    ],
    blockedDates: ['2026-11-12', '2026-11-13'],
    description: 'شاليه أيقوني على البحر مباشرة في رأس الحكمة مع إشراف فندقي مدار على مدار الساعة من فريق Ragab Pay.',
    reviews: [
      {
        userName: 'كريم عبد العزيز',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'منذ أسبوعين',
        comment: 'الإقامة كانت استثنائية! النظافة بمستوى 5 نجوم والمسبح الإنفينيتي خيالي.'
      }
    ]
  },

  // 2. سكن شركات وموظفين ومهندسين - العاصمة الإدارية الجديدة
  {
    id: 'rp-corp-01',
    title: 'مجمع سكني تنفيذي متكامل للمهندسين وفرق الشركات',
    village: 'العاصمة الإدارية الجديدة - بالقرب من الحي المالي والبرج الأيقوني',
    region: 'new-capital',
    regionArabic: 'العاصمة الإدارية',
    category: 'corporate-housing',
    categoryArabic: 'سكن شركات وخبراء',
    pricePerDay: 4500,
    pricePerWeek: 26000,
    pricePerMonth: 75000,
    pricePerYear: 780000,
    supportedRentalTypes: ['weekly', 'monthly', 'yearly'],
    rating: 4.92,
    reviewsCount: 36,
    distanceToBeach: 'قرب مقار كبرى شركات الإنشاءات والوزارات',
    distanceToBeachValue: 9999,
    area: 450,
    bedrooms: 8,
    bathrooms: 6,
    singleBedsCount: 16,
    poolType: 'بدون مسبح',
    hasPrivatePool: false,
    maxGuests: 16,
    isCorporateReady: true,
    targetAudience: 'سكن مهندسين وعمال ومشاريع',
    featured: true,
    exclusiveOffer: 'عقود سنوية مخفضة للمؤسسات تشمل خدمات الإعاشة والغسيل',
    features: ['8 غرف مجهزة بسراير فردية وخزائن', 'قاعة اجتماعات مصغرة وشاشة عرض', 'إنترنت ألياف ضوئية فائق ومولد طوارئ', 'خدمة غسيل وكي ملابس أسبوعية', 'مطبخ صناعي كبير مجهز بالكامل', 'حراسة وأمن على مدار الساعة', 'خدمات تمريض وطوارئ متعاقدة'],
    host: {
      name: 'Ragab Pay Corporate Housing',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      verified: true,
      responseTime: 'فوري (دقيقة)',
      rating: 4.95,
      phone: '+20 100 999 1122'
    },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80'
    ],
    blockedDates: [],
    description: 'مبنى سكني مخصص للشركات الهندسية والإنشائية والاستشارية العاملة في العاصمة الإدارية. يضمن استقرار الفرق والخبراء مع إدارة متكاملة للصيانة والإعاشة الفندقية.',
    reviews: [
      {
        userName: 'م. خالد الصاوي (شركة بتروجت)',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'منذ أسبوع',
        comment: 'وفر علينا أزمة تسكين المهندسين، المبنى نظيف جداً والإنترنت سريع والخدمات منتظمة.'
      }
    ]
  },

  // 3. سكن عمال ومشرفين - 6 أكتوبر والمنطقة الصناعية
  {
    id: 'rp-corp-02',
    title: 'مجمع سكن كوادر وعمالة فنية مجهز بالكامل',
    village: 'مدينة 6 أكتوبر - بالقرب من المنطقة الصناعية والمحور',
    region: 'zayed-october',
    regionArabic: 'الشيخ زايد و6 أكتوبر',
    category: 'staff-residence',
    categoryArabic: 'سكن عمال وكوادر',
    pricePerDay: 2800,
    pricePerWeek: 16000,
    pricePerMonth: 48000,
    pricePerYear: 500000,
    supportedRentalTypes: ['monthly', 'yearly'],
    rating: 4.85,
    reviewsCount: 24,
    distanceToBeach: 'قرب مصانع أكتوبر والمجمعات اللوجستية',
    distanceToBeachValue: 9999,
    area: 380,
    bedrooms: 6,
    bathrooms: 5,
    singleBedsCount: 20,
    poolType: 'بدون مسبح',
    hasPrivatePool: false,
    maxGuests: 20,
    isCorporateReady: true,
    targetAudience: 'سكن مهندسين وعمال ومشاريع',
    featured: false,
    exclusiveOffer: 'خصم خاص للعقود السنوية للشركات والمصانع',
    features: ['سراير دورين عالية الجودة مع مراتب طبية', 'غرف طعام واستراحة مكيفة', 'صيانة دورية وكهرباء 3 فاز', 'نظام إطفاء وإنذار حريق معتمد', 'مغسلة مركزية وثلاجات كبيرة'],
    host: {
      name: 'إدارة المنشآت الصناعية - Ragab Pay',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      verified: true,
      responseTime: 'خلال 15 دقيقة',
      rating: 4.8,
      phone: '+20 102 444 8899'
    },
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80'
    ],
    blockedDates: [],
    description: 'وحدات مجهزة مطابقة لمعايير السلامة المهنية ومخصصة للشركات الراغبة في تسكين العمالة الفنية والمشرفين بالقرب من مواقع العمل.',
    reviews: [
      {
        userName: 'المهندس مصطفى كامل',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'منذ شهر',
        comment: 'مطابق للمواصفات ونظيف جداً وساعدنا في تنظيم مناوبات العمال بسلاسة.'
      }
    ]
  },

  // 4. فيلا عائلية ووفود كبرى - سيدي عبد الرحمن مراسي
  {
    id: 'rp-02',
    title: 'فيلا قصر البحر الملكي لوفود العائلات وكبار الشخصيات',
    village: 'قرية Marassi - سيدي عبد الرحمن',
    region: 'north-coast',
    regionArabic: 'الساحل الشمالي',
    category: 'villa',
    categoryArabic: 'فيلا شاطئية كبرى',
    pricePerDay: 12000,
    pricePerWeek: 72000,
    pricePerMonth: 210000,
    pricePerYear: 950000,
    supportedRentalTypes: ['daily', 'weekly', 'monthly', 'yearly'],
    rating: 4.99,
    reviewsCount: 58,
    distanceToBeach: 'صف أول على اللاجون والشاطئ الرئيسي',
    distanceToBeachValue: 35,
    area: 480,
    bedrooms: 6,
    bathrooms: 6,
    poolType: 'خاص إنفينيتي',
    hasPrivatePool: true,
    maxGuests: 14,
    isCorporateReady: true,
    targetAudience: 'عائلات وفنادق',
    featured: true,
    exclusiveOffer: 'شامل عربتي جولف خاصتين ومساعد فندقي مقيم',
    features: ['مسبح إنفينيتي ضخم مطل على اللاجون', 'عربات جولف خاصة للتنقل', 'شاطئ خاص بالفيلا', 'مطبخين رئيسي وخدمة', 'أجنحة ماستر واسعة', 'استقبال VIP بمطار العلمين'],
    host: {
      name: 'Ragab Pay Elite Hospitality',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      verified: true,
      responseTime: 'فوري',
      rating: 5.0,
      phone: '+20 100 000 9999'
    },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80'
    ],
    blockedDates: ['2026-11-20', '2026-11-21'],
    description: 'تحفة معمارية استثنائية لوفود العائلات الكبيرة والاجتماعات القيادية للشركات، مع أقصى درجات الفخامة والخصوصية المطلقة.',
    reviews: [
      {
        userName: 'الشيخ منصور القاسمي',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'منذ شهر',
        comment: 'مستوى استثنائي لا يقل عن أرقى منتجعات كان وموناكو. خدمة راغب باي فوق الممتازة.'
      }
    ]
  },

  // 5. بنتهاوس تنفيذي - التجمع الخامس (شارع التسعين)
  {
    id: 'rp-03',
    title: 'بنتهاوس فندقي ملكي بإطلالة التسعين الشمالي',
    village: 'التجمع الخامس - شارع التسعين الشمالي',
    region: 'new-cairo',
    regionArabic: 'القاهرة الجديدة',
    category: 'penthouse',
    categoryArabic: 'بنتهاوس تنفيذي',
    pricePerDay: 3500,
    pricePerWeek: 21000,
    pricePerMonth: 54000,
    pricePerYear: 580000,
    supportedRentalTypes: ['daily', 'weekly', 'monthly', 'yearly'],
    rating: 4.93,
    reviewsCount: 47,
    distanceToBeach: 'قلب التجمع قرب مراكز الأعمال والمقرات الرئيسية',
    distanceToBeachValue: 9999,
    area: 220,
    bedrooms: 3,
    bathrooms: 3,
    poolType: 'خاص مع جاكوزي',
    hasPrivatePool: true,
    maxGuests: 6,
    isCorporateReady: true,
    targetAudience: 'رجال أعمال وشركات',
    featured: true,
    exclusiveOffer: 'عقد شهري وسنوي مع فواتير ضريبية معتمدة للشركات',
    features: ['جاكوزي خارجي بتراس الرووف', 'مكتب عمل مجهز بإنترنت 300 ميجا', 'نظام تحكم ذكي Smart Home', 'حراسة 24/7 ومصعد ذكي', 'مطبخ مفتوح مع ماكينة قهوة احترافية'],
    host: {
      name: 'Ragab Pay Business Suites',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      verified: true,
      responseTime: 'فوري',
      rating: 4.95,
      phone: '+20 100 000 1234'
    },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
    ],
    blockedDates: [],
    description: 'بنتهاوس صُمم خصيصاً للمدراء التنفيذيين ورجال الأعمال، مع تجهيزات عمل متطورة وإطلالة كاشفة للتجمع الخامس.',
    reviews: [
      {
        userName: 'م. حسام غالي',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'منذ 5 أيام',
        comment: 'أفضل اختيار لإقامة العمل في التجمع. الهدوء والسرعة والتراس رائع جداً.'
      }
    ]
  },

  // 6. فيلا الشيخ زايد - بالم هيلز
  {
    id: 'rp-04',
    title: 'فيلا مودرن فاخرة بحمام سباحة وحديقة شاسعة',
    village: 'الشيخ زايد - كمبوند بالم هيلز',
    region: 'zayed-october',
    regionArabic: 'الشيخ زايد و6 أكتوبر',
    category: 'villa',
    categoryArabic: 'فيلا مستقلة',
    pricePerDay: 8000,
    pricePerWeek: 48000,
    pricePerMonth: 135000,
    pricePerYear: 1400000,
    supportedRentalTypes: ['weekly', 'monthly', 'yearly'],
    rating: 4.97,
    reviewsCount: 31,
    distanceToBeach: 'قرب أركان بلازا ونادي الجزيرة بالشيخ زايد',
    distanceToBeachValue: 9999,
    area: 360,
    bedrooms: 5,
    bathrooms: 5,
    poolType: 'خاص مع جاكوزي',
    hasPrivatePool: true,
    maxGuests: 10,
    isCorporateReady: true,
    targetAudience: 'عائلات وفنادق',
    featured: true,
    features: ['مسبح خاص مع نظام تدفئة شتوي', 'حديقة خاصة 300 م²', 'أجنحة ماستر مع غرف ملابس', 'موقف يتسع لـ 3 سيارات', 'شواية باربيكيو وجلسة نار خارجية'],
    host: {
      name: 'د. طارق الحصري',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      verified: true,
      responseTime: 'خلال 5 دقائق',
      rating: 5.0,
      phone: '+20 101 888 9900'
    },
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
    ],
    blockedDates: [],
    description: 'فيلا راقية جداً في أرقى كمبوندات زايد، تناسب العائلات الدبلوماسية ورجال الأعمال بعقود مرنة شهرية وسنوية.',
    reviews: [
      {
        userName: 'م. سامي عنان',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'منذ أسبوعين',
        comment: 'الموقع في بالم هيلز ممتاز والفيلا مجهزة بأحدث المفروشات.'
      }
    ]
  },

  // 7. شقة فندقية على نيل الزمالك
  {
    id: 'rp-05',
    title: 'شقة رويال الفندقية بإطلالة نيلية مباشرة',
    village: 'حي الزمالك - شارع أبو الفدا والنيل',
    region: 'zamalek',
    regionArabic: 'الزمالك',
    category: 'apartment',
    categoryArabic: 'شقة فندقية نيلية',
    pricePerDay: 4300,
    pricePerWeek: 26000,
    pricePerMonth: 75000,
    pricePerYear: 820000,
    supportedRentalTypes: ['daily', 'weekly', 'monthly', 'yearly'],
    rating: 4.91,
    reviewsCount: 38,
    distanceToBeach: 'إطلالة مباشرة على كورنيش النيل بالزمالك',
    distanceToBeachValue: 10,
    area: 170,
    bedrooms: 2,
    bathrooms: 2,
    poolType: 'بدون مسبح',
    hasPrivatePool: false,
    maxGuests: 4,
    isCorporateReady: true,
    targetAudience: 'رجال أعمال وشركات',
    featured: false,
    features: ['تراس واسع بإطلالة نيلية ساحرة', 'مبنى تراثي محدث بأمن خاص', 'أثاث أوروبي كلاسيكي فاخر', 'ماكينة قهوة ومطبخ كامل', 'خدمة تنظيف فندقية مرتين أسبوعياً'],
    host: {
      name: 'السيدة فريال رستم',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      verified: true,
      responseTime: 'خلال 20 دقيقة',
      rating: 4.9,
      phone: '+20 109 777 6655'
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80'
    ],
    blockedDates: [],
    description: 'استمتع بإقامة هادئة على ضفاف نيل الزمالك، مثالية للمسافرين والوفود الأجنبية الراغبين في جو مصري أصيل وفاخر.',
    reviews: [
      {
        userName: 'د. يوسف الشريف',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'منذ 10 أيام',
        comment: 'الفيو على نيل الزمالك في الغروب لا يُنسى. الشقة نظيفة وراقية.'
      }
    ]
  },

  // 8. شاليه الجونة - البحر الأحمر (مارينا الجونة)
  {
    id: 'rp-06',
    title: 'شاليه لاجون فيو في قلب مارينا الجونة',
    village: 'الجونة - مارينا أبو تيج',
    region: 'red-sea',
    regionArabic: 'البحر الأحمر والجونة',
    category: 'chalet',
    categoryArabic: 'شاليه لاجون',
    pricePerDay: 4800,
    pricePerWeek: 29000,
    pricePerMonth: 82000,
    pricePerYear: 390000,
    supportedRentalTypes: ['daily', 'weekly', 'monthly', 'yearly'],
    rating: 4.94,
    reviewsCount: 51,
    distanceToBeach: 'خطوات من مارينا الجونة واللاجون',
    distanceToBeachValue: 80,
    area: 145,
    bedrooms: 2,
    bathrooms: 2,
    poolType: 'مشترك فاخر',
    hasPrivatePool: false,
    maxGuests: 4,
    isCorporateReady: false,
    targetAudience: 'سياحة شاطئية',
    featured: true,
    features: ['مسبح لاجون متصل بالبحر', 'قريب من كافيهات ومطاعم المارينا', 'تراس مطل على اليخوت', 'دراجات هوائية للتنقل في الجونة', 'إنترنت سريع وتكييف في كل الغرف'],
    host: {
      name: 'Ragab Pay Red Sea Collection',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      verified: true,
      responseTime: 'فوري',
      rating: 4.95,
      phone: '+20 102 555 7711'
    },
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80'
    ],
    blockedDates: [],
    description: 'تجربة الجونة الحقيقية بجوار اليخوت والمطاعم مع إمكانية السباحة في أصفى مياه لاجون بالبحر الأحمر.',
    reviews: [
      {
        userName: 'م. لؤي الديب',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'منذ أسبوعين',
        comment: 'الموقع في مارينا أبو تيج ممتاز وكل شيء على بُعد خطوات.'
      }
    ]
  },

  // 9. شقة المعادي دجلة - إقامات طويلة وسفارات
  {
    id: 'rp-07',
    title: 'شقة فندقية راقية بحي المعادي دجلة الدبلوماسي',
    village: 'المعادي - دجلة قرب المدارس الدولية',
    region: 'maadi',
    regionArabic: 'المعادي',
    category: 'apartment',
    categoryArabic: 'شقة سكنية فندقية',
    pricePerDay: 2600,
    pricePerWeek: 15500,
    pricePerMonth: 42000,
    pricePerYear: 460000,
    supportedRentalTypes: ['weekly', 'monthly', 'yearly'],
    rating: 4.88,
    reviewsCount: 29,
    distanceToBeach: 'حي دبلوماسي مشجر هادئ قرب محطة المترو',
    distanceToBeachValue: 9999,
    area: 150,
    bedrooms: 3,
    bathrooms: 2,
    poolType: 'بدون مسبح',
    hasPrivatePool: false,
    maxGuests: 5,
    isCorporateReady: true,
    targetAudience: 'عائلات وفنادق',
    featured: false,
    features: ['شرفة مشجرة بإطلالة هادئة', 'أرضيات خشبية طبيعية', 'إنترنت سريع ومستقر للعمل', 'مطبخ كامل مع غسالة أطباق', 'قريب من كافيهات شارع 233'],
    host: {
      name: 'أ. سامح النجار',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      verified: true,
      responseTime: 'خلال نصف ساعة',
      rating: 4.85,
      phone: '+20 101 222 7788'
    },
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80'
    ],
    blockedDates: [],
    description: 'شقة مريحة للإقامات الشهرية والسنوية في المعادي، مرغوبة لدى أعضاء البعثات والشركات متعددة الجنسيات.',
    reviews: [
      {
        userName: 'سارة وليامز',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'منذ 3 أسابيع',
        comment: 'Very quiet, well maintained, and perfect for families or long stays in Cairo.'
      }
    ]
  },

  // 10. شاليه هاسيندا باي - الساحل الشمالي
  {
    id: 'rp-08',
    title: 'شاليه هاسيندا باي مع إطلالة ملاعب الجولف والبحيرة',
    village: 'قرية Hacienda Bay - سيدي عبد الرحمن',
    region: 'north-coast',
    regionArabic: 'الساحل الشمالي',
    category: 'chalet',
    categoryArabic: 'شاليه جولف ولاجون',
    pricePerDay: 5500,
    pricePerWeek: 34000,
    pricePerMonth: 88000,
    pricePerYear: 420000,
    supportedRentalTypes: ['daily', 'weekly', 'monthly', 'yearly'],
    rating: 4.93,
    reviewsCount: 41,
    distanceToBeach: '200 متر من شاطئ هاسيندا الرئيسي',
    distanceToBeachValue: 200,
    area: 195,
    bedrooms: 3,
    bathrooms: 3,
    poolType: 'مشترك فاخر',
    hasPrivatePool: false,
    maxGuests: 7,
    isCorporateReady: false,
    targetAudience: 'سياحة شاطئية',
    featured: true,
    features: ['إطلالة بانورامية على ملعب الجولف', 'مسابح أولمبية ونادي صحي', 'غرفة للمساعد المنزلي بحمام', 'تكييفات هادئة', 'سيارة جولف للتوصيل للشاطئ مجاناً'],
    host: {
      name: 'مها الصاوي',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      verified: true,
      responseTime: 'خلال 10 دقائق',
      rating: 4.95,
      phone: '+20 102 999 8811'
    },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80'
    ],
    blockedDates: [],
    description: 'شاليه فخم في هاسيندا باي يجمع بين خصوصية الجولف وحيوية شواطئ سيدي عبد الرحمن.',
    reviews: [
      {
        userName: 'هشام بركات',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'منذ شهر',
        comment: 'هاسيندا باي رائعة والشاليه على أعلى مستوى.'
      }
    ]
  }
];

export const TRENDING_SEARCHES = [
  'شاليهات الساحل الشمالي بفيو بحر',
  'سكن شركات ومهندسين بالعاصمة الإدارية',
  'سكن عمال وكوادر بـ 6 أكتوبر',
  'فيلات خاصة بمسبح في بالم هيلز الشيخ زايد',
  'شقق فندقية بالتجمع شارع التسعين إقامة شهرية',
  'شاليهات مارينا الجونة البحر الأحمر',
  'أجنحة نيلية فاخرة في الزمالك'
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'تأكيد الحجز بنجاح عبر Ragab Pay',
    body: 'تم استلام وتأكيد حجزك في شاليه Sea View بنجاح. كود الدخول الرقمي جاهز.',
    time: 'منذ ساعتين',
    read: false,
    icon: 'check-circle'
  },
  {
    id: 'notif-2',
    title: 'عرض عقود الشركات السنوية',
    body: 'خصومات تصل إلى 30% لعقود سكن الشركات والمهندسين في العاصمة الإدارية وأكتوبر.',
    time: 'منذ يوم',
    read: true,
    icon: 'sparkles'
  },
  {
    id: 'notif-3',
    title: 'تذكير موعد تسجيل الدخول',
    body: 'موعد تسجيل الدخول غداً الساعة 2:00 ظهراً. كونسيرج راغب باي في انتظارك.',
    time: 'منذ يومين',
    read: true,
    icon: 'calendar'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    propertyId: 'rp-01',
    propertyTitle: 'شاليه ملكي بفيو بانورامي على الشاطئ مباشرة',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    village: 'قرية Sea View - الساحل الشمالي',
    rentalType: 'daily',
    rentalTypeArabic: 'حجز يومي (3 ليالٍ)',
    checkIn: '2026-11-20',
    checkOut: '2026-11-23',
    durationUnits: 3,
    nightsCount: 3,
    guestsCount: 4,
    unitPrice: 4000,
    cleaningFee: 800,
    serviceFee: 600,
    totalPrice: 13400,
    status: 'upcoming',
    paymentMethod: 'Ragab Pay الإلكتروني (Visa)',
    bookingRef: '#RP-2026-8942',
    createdAt: '2026-11-05',
    guestName: 'أحمد محمد',
    guestPhone: '+20 100 123 4567'
  },
  {
    id: 'bk-102',
    propertyId: 'rp-corp-01',
    propertyTitle: 'مجمع سكني تنفيذي متكامل للمهندسين وفرق الشركات',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    village: 'العاصمة الإدارية الجديدة - الحي المالي',
    rentalType: 'monthly',
    rentalTypeArabic: 'عقد شهري للشركات (شهر واحد)',
    checkIn: '2026-10-01',
    checkOut: '2026-11-01',
    durationUnits: 1,
    guestsCount: 16,
    unitPrice: 75000,
    cleaningFee: 2500,
    serviceFee: 3500,
    totalPrice: 81000,
    status: 'completed',
    paymentMethod: 'تحويل بنكي للشركات (Ragab Pay Corporate)',
    bookingRef: '#RP-CORP-4410',
    createdAt: '2026-09-25',
    guestName: 'شركة الإعمار الهندسية (المهندس سامي)',
    guestPhone: '+20 100 999 1122',
    companyName: 'شركة الإعمار والإنشاءات الكبرى'
  }
];
