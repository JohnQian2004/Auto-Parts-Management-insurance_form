import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // API Configuration
  private readonly API_BASE_URL = `${environment.apiUrl}/api`;
  private readonly API_TIMEOUT = 30000; // 30 seconds
  private readonly DEFAULT_LANGUAGE = 'en';

  // Available languages
  readonly SUPPORTED_LANGUAGES = ['en', 'ar', 'fr', 'ur', 'zh'];

  // Industry configurations
  readonly INDUSTRY_ICONS: { [key: string]: string } = {
    'general': '🛒',
    'automotive': '🚗',
    'fashion': '👕',
    'electronics': '📱',
    'food': '🍎',
    'healthcare': '🏥',
    'home': '🏠',
    'sports': '⚽',
    'books': '📚',
    'health': '💊',
    'toys': '🎮'
  };

  // Language icons
  readonly LANGUAGE_ICONS: { [key: string]: string } = {
    'en': '🇺🇸',
    'ar': '🇸🇦',
    'fr': '🇫🇷',
    'ur': '🇵🇰',
    'zh': '🇨🇳'
  };

  // Category settings
  readonly DEFAULT_MAX_CATEGORY_LEVELS = 3;
  readonly DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop';

  constructor() { }

  // API Configuration getters
  get apiBaseUrl(): string {
    return this.API_BASE_URL;
  }

  getApiBaseUrl(): string {
    return this.API_BASE_URL;
  }

  get apiTimeout(): number {
    return this.API_TIMEOUT;
  }

  get defaultLanguage(): string {
    return this.DEFAULT_LANGUAGE;
  }

  // Helper methods
  getIndustryIcon(industry: string): string {
    return this.INDUSTRY_ICONS[industry] || '🏢';
  }

  getLanguageIcon(lang: string): string {
    return this.LANGUAGE_ICONS[lang] || '🌐';
  }

  isSupportedLanguage(lang: string): boolean {
    return this.SUPPORTED_LANGUAGES.includes(lang);
  }

  // Build full API URLs
  buildApiUrl(endpoint: string): string {
    return `${this.apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }

  // Get authentication token from localStorage
  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Data source configuration
  private useMockData: boolean = true;

  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
    // Store in localStorage for persistence
    localStorage.setItem('useMockData', useMock.toString());
  }

  getUseMockData(): boolean {
    // Check localStorage first, then fallback to default
    const stored = localStorage.getItem('useMockData');
    if (stored !== null) {
      this.useMockData = stored === 'true';
    }
    return this.useMockData;
  }

  // Initialize data source from localStorage
  initializeDataSource(): void {
    this.getUseMockData(); // This will load from localStorage
  }

  // New constant
  static readonly DEFAULT_RANDOM_IMAGE_URL = 'http://50.76.0.83:5003/image?random=true';

  static readonly DEFAULT_GENERATED_IMAGE = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop';
} 