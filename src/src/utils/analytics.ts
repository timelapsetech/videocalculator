// Google Analytics Integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class GoogleAnalytics {
  private static instance: GoogleAnalytics;
  private isInitialized = false;
  private measurementId: string | null = null;

  private constructor() {
    // Auto-initialize from environment variable if available
    this.autoInitialize();
  }

  static getInstance(): GoogleAnalytics {
    if (!GoogleAnalytics.instance) {
      GoogleAnalytics.instance = new GoogleAnalytics();
    }
    return GoogleAnalytics.instance;
  }

  // Auto-initialize from environment variables
  private autoInitialize(): void {
    // Check for Google Analytics measurement ID in environment variables
    const envMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (envMeasurementId && envMeasurementId.match(/^G-[A-Z0-9]+$/)) {
      console.log('Auto-initializing Google Analytics from environment variable');
      this.initialize(envMeasurementId);
    } else {
      // Fallback to admin-configured analytics
      const savedId = localStorage.getItem('ga_measurement_id');
      const savedEnabled = localStorage.getItem('ga_enabled') === 'true';
      
      if (savedId && savedEnabled && savedId.match(/^G-[A-Z0-9]+$/)) {
        console.log('Initializing Google Analytics from admin configuration');
        this.initialize(savedId);
      }
    }
  }

  // Initialize Google Analytics with measurement ID
  initialize(measurementId: string): void {
    if (this.isInitialized || !measurementId) {
      return;
    }

    this.measurementId = measurementId;

    // Create gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    this.isInitialized = true;
    console.log('Google Analytics initialized with ID:', measurementId);
  }

  // Track page views
  trackPageView(path: string, title?: string): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    window.gtag('config', this.measurementId!, {
      page_path: path,
      page_title: title || document.title,
    });
  }

  // Track custom events
  trackEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    window.gtag('event', eventName, {
      event_category: 'engagement',
      ...parameters,
    });
  }

  // Track calculator usage
  trackCalculation(category: string, codec: string, variant: string, resolution: string, frameRate: string): void {
    this.trackEvent('calculate_file_size', {
      event_category: 'calculator',
      codec_category: category,
      codec_name: codec,
      codec_variant: variant,
      resolution: resolution,
      frame_rate: frameRate,
    });
  }

  // Track preset usage
  trackPresetUsage(presetName: string): void {
    this.trackEvent('use_preset', {
      event_category: 'presets',
      preset_name: presetName,
    });
  }

  // Track share link generation
  trackShareLink(): void {
    this.trackEvent('share_calculation', {
      event_category: 'sharing',
    });
  }

  // Track admin panel access
  trackAdminAccess(): void {
    this.trackEvent('admin_access', {
      event_category: 'admin',
    });
  }

  // Track codec database browsing
  trackCodecDatabaseView(): void {
    this.trackEvent('view_codec_database', {
      event_category: 'database',
    });
  }

  // Track data export
  trackDataExport(exportType: string): void {
    this.trackEvent('export_data', {
      event_category: 'data',
      export_type: exportType,
    });
  }

  // Check if analytics is enabled
  isEnabled(): boolean {
    return this.isInitialized && !!this.measurementId;
  }

  // Get current measurement ID
  getMeasurementId(): string | null {
    return this.measurementId;
  }

  // Get the source of the measurement ID
  getSource(): 'environment' | 'admin' | 'none' {
    if (!this.measurementId) return 'none';
    
    const envId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (envId === this.measurementId) return 'environment';
    
    return 'admin';
  }
}

// Export singleton instance
export const googleAnalytics = GoogleAnalytics.getInstance();

// Import centralized analytics
import { centralizedAnalytics } from './centralizedAnalytics';

// Legacy analytics interface for backward compatibility
export const analytics = {
  trackCalculation: async (category: string, codec: string, variant: string, resolution: string) => {
    // Use centralized analytics (with automatic fallback to local)
    await centralizedAnalytics.trackCalculation(category, codec, variant, resolution);
    
    // Google Analytics tracking
    googleAnalytics.trackCalculation(category, codec, variant, resolution, '30'); // Default frame rate
  },
  
  getPopularCodecs: async (limit = 10) => {
    return await centralizedAnalytics.getPopularCodecs(limit);
  },
  
  getTotalUsage: async () => {
    return await centralizedAnalytics.getTotalUsage();
  },

  clearStats: async () => {
    return await centralizedAnalytics.clearStats();
  }
};

// Export centralized analytics for direct use
export { centralizedAnalytics };