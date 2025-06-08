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

  private constructor() {}

  static getInstance(): GoogleAnalytics {
    if (!GoogleAnalytics.instance) {
      GoogleAnalytics.instance = new GoogleAnalytics();
    }
    return GoogleAnalytics.instance;
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
}

// Export singleton instance
export const googleAnalytics = GoogleAnalytics.getInstance();

// Centralized analytics for shared usage data
class CentralizedAnalytics {
  private static instance: CentralizedAnalytics;
  private storageKey = 'globalCalculatorStats';

  private constructor() {}

  static getInstance(): CentralizedAnalytics {
    if (!CentralizedAnalytics.instance) {
      CentralizedAnalytics.instance = new CentralizedAnalytics();
    }
    return CentralizedAnalytics.instance;
  }

  // Track calculation with centralized storage
  trackCalculation(category: string, codec: string, variant: string, resolution: string): void {
    try {
      // Get existing stats
      const stats = this.getStats();
      const key = `${category}-${codec}-${variant}-${resolution}`;
      
      // Update stats
      stats[key] = (stats[key] || 0) + 1;
      stats.totalCalculations = (stats.totalCalculations || 0) + 1;
      stats.lastUsed = Date.now();
      
      // Save updated stats
      localStorage.setItem(this.storageKey, JSON.stringify(stats));
      
      // Also broadcast to other tabs/windows
      this.broadcastUpdate(stats);
    } catch (error) {
      console.error('Error tracking calculation:', error);
    }
  }

  // Get popular codecs
  getPopularCodecs(limit = 10): [string, number][] {
    try {
      const stats = this.getStats();
      return Object.entries(stats)
        .filter(([key]) => key !== 'totalCalculations' && key !== 'lastUsed')
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, limit) as [string, number][];
    } catch (error) {
      console.error('Error getting popular codecs:', error);
      return [];
    }
  }

  // Get total usage statistics
  getTotalUsage(): { totalCalculations: number; lastUsed: number | null; uniqueConfigurations: number } {
    try {
      const stats = this.getStats();
      return {
        totalCalculations: stats.totalCalculations || 0,
        lastUsed: stats.lastUsed || null,
        uniqueConfigurations: Math.max(0, Object.keys(stats).length - 2) // Exclude totalCalculations and lastUsed
      };
    } catch (error) {
      console.error('Error getting total usage:', error);
      return { totalCalculations: 0, lastUsed: null, uniqueConfigurations: 0 };
    }
  }

  // Clear all statistics
  clearStats(): void {
    try {
      localStorage.removeItem(this.storageKey);
      this.broadcastUpdate({});
    } catch (error) {
      console.error('Error clearing stats:', error);
    }
  }

  // Get raw stats object
  private getStats(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error parsing stats:', error);
      return {};
    }
  }

  // Broadcast updates to other tabs/windows
  private broadcastUpdate(stats: Record<string, any>): void {
    try {
      // Use storage event to notify other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.storageKey,
        newValue: JSON.stringify(stats),
        storageArea: localStorage
      }));
    } catch (error) {
      console.error('Error broadcasting update:', error);
    }
  }

  // Listen for updates from other tabs
  onStatsUpdate(callback: () => void): () => void {
    const handler = (event: StorageEvent) => {
      if (event.key === this.storageKey) {
        callback();
      }
    };

    window.addEventListener('storage', handler);
    
    // Return cleanup function
    return () => window.removeEventListener('storage', handler);
  }
}

// Export centralized analytics instance
export const centralizedAnalytics = CentralizedAnalytics.getInstance();

// Legacy analytics for backward compatibility (now uses centralized storage)
export const analytics = {
  trackCalculation: (category: string, codec: string, variant: string, resolution: string) => {
    // Use centralized analytics
    centralizedAnalytics.trackCalculation(category, codec, variant, resolution);
    
    // Google Analytics tracking
    googleAnalytics.trackCalculation(category, codec, variant, resolution, '30'); // Default frame rate
  },
  
  getPopularCodecs: (limit = 10) => {
    return centralizedAnalytics.getPopularCodecs(limit);
  },
  
  getTotalUsage: () => {
    return centralizedAnalytics.getTotalUsage();
  },

  clearStats: () => {
    centralizedAnalytics.clearStats();
  }
};