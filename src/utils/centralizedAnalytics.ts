// Centralized Analytics API Client
class CentralizedAnalyticsAPI {
  private static instance: CentralizedAnalyticsAPI;
  private baseUrl: string;
  private fallbackAnalytics: LocalAnalytics;

  private constructor() {
    // Use Netlify function URL in production, localhost in development
    this.baseUrl = import.meta.env.DEV 
      ? 'http://localhost:8888/.netlify/functions'
      : '/.netlify/functions';
    
    this.fallbackAnalytics = new LocalAnalytics();
  }

  static getInstance(): CentralizedAnalyticsAPI {
    if (!CentralizedAnalyticsAPI.instance) {
      CentralizedAnalyticsAPI.instance = new CentralizedAnalyticsAPI();
    }
    return CentralizedAnalyticsAPI.instance;
  }

  // Track a calculation
  async trackCalculation(category: string, codec: string, variant: string, resolution: string, frameRate: string = '30'): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'track_calculation',
          data: { category, codec, variant, resolution, frameRate }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('Calculation tracked:', result);
      
      // Also track locally as backup
      this.fallbackAnalytics.trackCalculation(category, codec, variant, resolution);
      
    } catch (error) {
      console.warn('Failed to track calculation centrally, using local fallback:', error);
      // Fall back to local analytics
      this.fallbackAnalytics.trackCalculation(category, codec, variant, resolution);
    }
  }

  // Get analytics data
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        totalCalculations: data.totalCalculations || 0,
        lastUsed: data.lastUsed,
        uniqueConfigurations: data.uniqueConfigurations || 0,
        popularConfigurations: data.popularConfigurations || [],
        dailyStats: data.dailyStats || {},
        metadata: data.metadata
      };
      
    } catch (error) {
      console.warn('Failed to fetch centralized analytics, using local fallback:', error);
      // Fall back to local analytics
      return this.fallbackAnalytics.getAnalytics();
    }
  }

  // Get popular codecs in the legacy format for compatibility
  async getPopularCodecs(limit = 10): Promise<[string, number][]> {
    try {
      const analytics = await this.getAnalytics();
      return analytics.popularConfigurations
        .slice(0, limit)
        .map(item => [item.config, item.count]);
    } catch (error) {
      console.warn('Failed to get popular codecs, using local fallback:', error);
      return this.fallbackAnalytics.getPopularCodecs(limit);
    }
  }

  // Get total usage in legacy format for compatibility
  async getTotalUsage(): Promise<{ totalCalculations: number; lastUsed: number | null; uniqueConfigurations: number }> {
    try {
      const analytics = await this.getAnalytics();
      return {
        totalCalculations: analytics.totalCalculations,
        lastUsed: analytics.lastUsed,
        uniqueConfigurations: analytics.uniqueConfigurations
      };
    } catch (error) {
      console.warn('Failed to get total usage, using local fallback:', error);
      return this.fallbackAnalytics.getTotalUsage();
    }
  }

  // Clear all stats (admin function)
  async clearStats(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'clear_stats'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      // Also clear local stats
      this.fallbackAnalytics.clearStats();
      
      return result.success;
      
    } catch (error) {
      console.error('Failed to clear centralized stats:', error);
      // Clear local stats as fallback
      this.fallbackAnalytics.clearStats();
      return false;
    }
  }
}

// Local analytics fallback (existing implementation)
class LocalAnalytics {
  private storageKey = 'globalCalculatorStats';

  trackCalculation(category: string, codec: string, variant: string, resolution: string): void {
    try {
      const stats = this.getStats();
      const key = `${category}-${codec}-${variant}-${resolution}`;
      
      stats[key] = (stats[key] || 0) + 1;
      stats.totalCalculations = (stats.totalCalculations || 0) + 1;
      stats.lastUsed = Date.now();
      
      localStorage.setItem(this.storageKey, JSON.stringify(stats));
    } catch (error) {
      console.error('Error tracking calculation locally:', error);
    }
  }

  getPopularCodecs(limit = 10): [string, number][] {
    try {
      const stats = this.getStats();
      return Object.entries(stats)
        .filter(([key]) => key !== 'totalCalculations' && key !== 'lastUsed')
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, limit) as [string, number][];
    } catch (error) {
      console.error('Error getting popular codecs locally:', error);
      return [];
    }
  }

  getTotalUsage(): { totalCalculations: number; lastUsed: number | null; uniqueConfigurations: number } {
    try {
      const stats = this.getStats();
      return {
        totalCalculations: stats.totalCalculations || 0,
        lastUsed: stats.lastUsed || null,
        uniqueConfigurations: Math.max(0, Object.keys(stats).length - 2)
      };
    } catch (error) {
      console.error('Error getting total usage locally:', error);
      return { totalCalculations: 0, lastUsed: null, uniqueConfigurations: 0 };
    }
  }

  clearStats(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing local stats:', error);
    }
  }

  getAnalytics(): AnalyticsData {
    const usage = this.getTotalUsage();
    const popular = this.getPopularCodecs(10);
    
    return {
      totalCalculations: usage.totalCalculations,
      lastUsed: usage.lastUsed,
      uniqueConfigurations: usage.uniqueConfigurations,
      popularConfigurations: popular.map(([config, count]) => ({ config, count })),
      dailyStats: {},
      metadata: {
        created: Date.now(),
        lastUpdated: Date.now()
      }
    };
  }

  private getStats(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error parsing local stats:', error);
      return {};
    }
  }
}

// Type definitions
interface AnalyticsData {
  totalCalculations: number;
  lastUsed: number | null;
  uniqueConfigurations: number;
  popularConfigurations: Array<{ config: string; count: number }>;
  dailyStats: Record<string, number>;
  metadata: {
    created: number;
    lastUpdated: number;
  };
}

// Export singleton instance
export const centralizedAnalytics = CentralizedAnalyticsAPI.getInstance();