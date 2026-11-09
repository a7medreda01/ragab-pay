import { Injectable, signal, computed, effect } from '@angular/core';
import { Property, Booking, MOCK_PROPERTIES, INITIAL_BOOKINGS, TRENDING_SEARCHES, MOCK_NOTIFICATIONS } from '../data/properties.data';

export interface FilterCriteria {
  rentalType: 'daily' | 'weekly' | 'monthly' | 'yearly';
  minPrice: number;
  maxPrice: number;
  region: string;
  beachDistanceMax: number;
  bedrooms: number | null;
  hasPrivatePool: boolean | null;
  corporateOnly: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Properties
  readonly properties = signal<Property[]>(MOCK_PROPERTIES);

  // User
  readonly currentUser = signal({
    name: 'أحمد محمد',
    phone: '+20 100 123 4567',
    email: 'ahmed.m@ragabpay.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verified: true,
    memberSince: '2025'
  });

  // Navigation
  readonly currentScreen = signal<'welcome' | 'main' | 'details' | 'checkout' | 'voucher'>('welcome');
  readonly activeTab = signal<'home' | 'search' | 'quick-book' | 'favorites' | 'profile'>('home');

  // Selected State
  readonly selectedProperty = signal<Property | null>(MOCK_PROPERTIES[0]);
  readonly lastCompletedBooking = signal<Booking | null>(INITIAL_BOOKINGS[0]);

  // Search & Filters
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('الكل');
  readonly sortBy = signal<'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'beach'>('recommended');

  readonly filterCriteria = signal<FilterCriteria>({
    rentalType: 'daily',
    minPrice: 1500,
    maxPrice: 30000,
    region: 'all',
    beachDistanceMax: 5000,
    bedrooms: null,
    hasPrivatePool: null,
    corporateOnly: null
  });

  readonly recentSearches = signal<string[]>(TRENDING_SEARCHES.slice(0, 4));

  // Modals
  readonly isFilterOpen = signal<boolean>(false);
  readonly isComparisonOpen = signal<boolean>(false);
  readonly isAuthOpen = signal<boolean>(false);
  readonly isNotificationOpen = signal<boolean>(false);

  // Favorites & Bookings
  readonly favorites = signal<string[]>(this.loadFavorites());
  readonly bookings = signal<Booking[]>(this.loadBookings());
  readonly comparisonList = signal<Property[]>([]);
  readonly notifications = signal(MOCK_NOTIFICATIONS);

  // Computed Filtered Properties
  readonly filteredProperties = computed(() => {
    const list = this.properties();
    const query = this.searchQuery().trim().toLowerCase();
    const cat = this.selectedCategory();
    const filters = this.filterCriteria();
    const sort = this.sortBy();

    let result = list.filter(prop => {
      // Query filter
      if (query) {
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesVillage = prop.village.toLowerCase().includes(query);
        const matchesRegion = prop.regionArabic.toLowerCase().includes(query);
        const matchesCategory = prop.categoryArabic.toLowerCase().includes(query);
        const matchesFeatures = prop.features.some(f => f.toLowerCase().includes(query));
        const matchesAudience = prop.targetAudience.toLowerCase().includes(query);
        if (!matchesTitle && !matchesVillage && !matchesRegion && !matchesCategory && !matchesFeatures && !matchesAudience) {
          return false;
        }
      }

      // Category chip filter
      if (cat !== 'الكل') {
        if (cat === 'شاليهات بحرية' && prop.category !== 'chalet') return false;
        if (cat === 'سكن شركات وعمال' && !prop.isCorporateReady) return false;
        if (cat === 'فيلات مستقلة' && prop.category !== 'villa') return false;
        if (cat === 'إقامات شهرية' && !prop.supportedRentalTypes.includes('monthly')) return false;
        if (cat === 'عقود سنوية' && !prop.supportedRentalTypes.includes('yearly')) return false;
        if (cat === 'صف أول عالبحر' && prop.distanceToBeachValue > 100) return false;
        if (cat === 'شقق فندقية فاخرة' && prop.category !== 'apartment' && prop.category !== 'penthouse') return false;
      }

      // Region filter
      if (filters.region !== 'all' && prop.region !== filters.region) {
        return false;
      }

      // Rental type filter
      if (filters.rentalType && !prop.supportedRentalTypes.includes(filters.rentalType)) {
        return false;
      }

      // Corporate only
      if (filters.corporateOnly === true && !prop.isCorporateReady) {
        return false;
      }

      // Price filter based on chosen rental type
      let currentPrice = prop.pricePerDay;
      if (filters.rentalType === 'weekly') currentPrice = prop.pricePerWeek;
      if (filters.rentalType === 'monthly') currentPrice = prop.pricePerMonth;
      if (filters.rentalType === 'yearly') currentPrice = prop.pricePerYear;

      if (filters.rentalType === 'daily') {
        if (currentPrice < filters.minPrice || currentPrice > filters.maxPrice) {
          return false;
        }
      }

      // Proximity to beach
      if (filters.beachDistanceMax < 5000 && prop.distanceToBeachValue > filters.beachDistanceMax) {
        return false;
      }

      // Bedrooms
      if (filters.bedrooms !== null && prop.bedrooms < filters.bedrooms) {
        return false;
      }

      // Private Pool
      if (filters.hasPrivatePool === true && !prop.hasPrivatePool) {
        return false;
      }

      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      let pA = a.pricePerDay;
      let pB = b.pricePerDay;
      if (filters.rentalType === 'weekly') { pA = a.pricePerWeek; pB = b.pricePerWeek; }
      if (filters.rentalType === 'monthly') { pA = a.pricePerMonth; pB = b.pricePerMonth; }
      if (filters.rentalType === 'yearly') { pA = a.pricePerYear; pB = b.pricePerYear; }

      if (sort === 'price-asc') return pA - pB;
      if (sort === 'price-desc') return pB - pA;
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'beach') return a.distanceToBeachValue - b.distanceToBeachValue;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

    return result;
  });

  readonly matchedCount = computed(() => this.filteredProperties().length);

  constructor() {
    effect(() => {
      try {
        localStorage.setItem('ragab_pay_favorites', JSON.stringify(this.favorites()));
      } catch (e) {}
    });

    effect(() => {
      try {
        localStorage.setItem('ragab_pay_bookings', JSON.stringify(this.bookings()));
      } catch (e) {}
    });
  }

  private loadFavorites(): string[] {
    try {
      const saved = localStorage.getItem('ragab_pay_favorites');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['rp-01', 'rp-corp-01'];
  }

  private loadBookings(): Booking[] {
    try {
      const saved = localStorage.getItem('ragab_pay_bookings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BOOKINGS;
  }

  toggleFavorite(propertyId: string) {
    const current = this.favorites();
    if (current.includes(propertyId)) {
      this.favorites.set(current.filter(id => id !== propertyId));
    } else {
      this.favorites.set([...current, propertyId]);
    }
  }

  isFavorite(propertyId: string): boolean {
    return this.favorites().includes(propertyId);
  }

  addToComparison(prop: Property) {
    const list = this.comparisonList();
    if (list.some(p => p.id === prop.id)) return;
    if (list.length >= 3) {
      alert('يمكنك مقارنة 3 وحدات كحد أقصى في نفس الوقت');
      return;
    }
    this.comparisonList.set([...list, prop]);
  }

  removeFromComparison(propertyId: string) {
    this.comparisonList.set(this.comparisonList().filter(p => p.id !== propertyId));
  }

  isInComparison(propertyId: string): boolean {
    return this.comparisonList().some(p => p.id === propertyId);
  }

  clearComparison() {
    this.comparisonList.set([]);
  }

  setSearchQuery(q: string) {
    this.searchQuery.set(q);
    if (q && !this.recentSearches().includes(q)) {
      this.recentSearches.set([q, ...this.recentSearches().slice(0, 4)]);
    }
  }

  setCategory(cat: string) {
    this.selectedCategory.set(cat);
  }

  setSortBy(sort: 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'beach') {
    this.sortBy.set(sort);
  }

  updateFilters(criteria: Partial<FilterCriteria>) {
    this.filterCriteria.set({
      ...this.filterCriteria(),
      ...criteria
    });
  }

  resetFilters() {
    this.filterCriteria.set({
      rentalType: 'daily',
      minPrice: 1500,
      maxPrice: 30000,
      region: 'all',
      beachDistanceMax: 5000,
      bedrooms: null,
      hasPrivatePool: null,
      corporateOnly: null
    });
    this.selectedCategory.set('الكل');
    this.searchQuery.set('');
    this.sortBy.set('recommended');
  }

  openDetails(prop: Property) {
    this.selectedProperty.set(prop);
    this.currentScreen.set('details');
  }

  startBooking(prop: Property) {
    this.selectedProperty.set(prop);
    this.currentScreen.set('checkout');
  }

  confirmBooking(booking: Booking) {
    this.bookings.set([booking, ...this.bookings()]);
    this.lastCompletedBooking.set(booking);
    this.currentScreen.set('voucher');
  }

  cancelBooking(bookingId: string) {
    this.bookings.set(
      this.bookings().map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
    );
  }

  navigateToTab(tab: 'home' | 'search' | 'quick-book' | 'favorites' | 'profile') {
    this.activeTab.set(tab);
    this.currentScreen.set('main');
  }
}
