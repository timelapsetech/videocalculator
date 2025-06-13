// Centralized Analytics API Client with Enhanced Persistence
class CentralizedAnalyticsAPI {
  private static instance: CentralizedAnalyticsAPI;
  private baseUrl: string;
  private fallbackAnalytics: LocalAnalytics;
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;
  private retryAttempts = 3;
  private retryDelay = 1000;

  private constructor() {
    // Use Netlify function URL in production, localhost in development
    this.baseUrl = import.meta.env.DEV 
      ? 'http://localhost:8888/.netlify/functions'
      : '/.netlify/functions';
    
    this.fallbackAnalytics = new LocalAnalytics();
    
    // Initialize periodic backup
    this.initPeriodicBackup();
  }

  static getInstance(): CentralizedAnalyticsAPI {
    if (!CentralizedAnalyticsAPI.instance) {
      CentralizedAnalyticsAPI.instance = new CentralizedAnalyticsAPI();
    }
    return CentralizedAnalyticsAPI.instance;
  }

  // Initialize periodic backup to local storage
  private initPeriodicBackup(): void {
    // Backup data every 5 minutes
    setInterval(async () => {
      try {
        const data = await this.getAnalytics();
        localStorage.setItem('analytics_backup', JSON.stringify({
          data,
          timestamp: Date.now()
        }));
        console.log('Analytics data backed up locally');
      } catch (error) {
        console.warn('Failed to backup analytics data:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Enhanced request with retry logic
  private async makeRequest<T>(
    url: string, 
    options: RequestInit, 
    retries = this.retryAttempts
  ): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        // Log successful request after retries
        if (attempt > 1) {
          console.log(`Request succeeded on attempt ${attempt}`);
        }
        
        return result;
        
      } catch (error) {
        console.warn(`Request attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          throw error; // Final attempt failed
        }
        
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('All retry attempts exhausted');
  }

  // Queue requests to prevent race conditions
  private async queueRequest<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        try {
          await request();
        } catch (error) {
          console.error('Error processing queued request:', error);
        }
      }
    }
    
    this.isProcessingQueue = false;
  }

  // Track a calculation with enhanced deduplication and persistence
  async trackCalculation(category: string, codec: string, variant: string, resolution: string, frameRate: string = '30'): Promise<void> {
    // Create a unique key for this calculation
    const calculationKey = `${category}-${codec}-${variant}-${resolution}-${frameRate}`;
    
    // Enhanced deduplication with session storage
    const recentKey = `recent_calc_${calculationKey}`;
    const lastTracked = sessionStorage.getItem(recentKey);
    const now = Date.now();
    
    if (lastTracked && (now - parseInt(lastTracked)) < 5000) {
      console.log('Skipping duplicate calculation tracking');
      return;
    }
    
    // Mark this calculation as tracked
    sessionStorage.setItem(recentKey, now.toString());

    return this.queueRequest(async () => {
      try {
        const result = await this.makeRequest(`${this.baseUrl}/analytics`, {
          method: 'POST',
          body: JSON.stringify({
            action: 'track_calculation',
            data: { category, codec, variant, resolution, frameRate }
          })
        });

        console.log('Calculation tracked centrally:', result);
        
        // Also track locally as backup
        this.fallbackAnalytics.trackCalculation(category, codec, variant, resolution);
        
      } catch (error) {
        console.warn('Failed to track calculation centrally, using local fallback:', error);
        // Fall back to local analytics
        this.fallbackAnalytics.trackCalculation(category, codec, variant, resolution);
        throw error;
      }
    });
  }

  // Get analytics data with enhanced error handling and caching
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const data = await this.makeRequest<any>(`${this.baseUrl}/analytics`, {
        method: 'GET',
        cache: 'no-cache'
      });
      
      // Validate the response structure
      if (typeof data.totalCalculations !== 'number') {
        throw new Error('Invalid response structure');
      }
      
      const result: AnalyticsData = {
        totalCalculations: data.totalCalculations || 0,
        lastUsed: data.lastUsed,
        uniqueConfigurations: data.uniqueConfigurations || 0,
        popularConfigurations: data.popularConfigurations || [],
        dailyStats: data.dailyStats || {},
        metadata: {
          ...data.metadata,
          source: 'centralized',
          lastFetch: Date.now()
        }
      };
      
      // Cache successful result
      localStorage.setItem('analytics_cache', JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
      
      return result;
      
    } catch (error) {
      console.warn('Failed to fetch centralized analytics, trying fallbacks:', error);
      
      // Try cached data first
      try {
        const cached = localStorage.getItem('analytics_cache');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          // Use cached data if it's less than 10 minutes old
          if (Date.now() - timestamp < 10 * 60 * 1000) {
            console.log('Using cached analytics data');
            return {
              ...data,
              metadata: {
                ...data.metadata,
                source: 'cached',
                cacheAge: Date.now() - timestamp
              }
            };
          }
        }
      } catch (cacheError) {
        console.warn('Failed to use cached data:', cacheError);
      }
      
      // Try backup data
      try {
        const backup = localStorage.getItem('analytics_backup');
        if (backup) {
          const { data, timestamp } = JSON.parse(backup);
          console.log('Using backup analytics data');
          return {
            ...data,
            metadata: {
              ...data.metadata,
              source: 'backup',
              backupAge: Date.now() - timestamp
            }
          };
        }
      } catch (backupError) {
        console.warn('Failed to use backup data:', backupError);
      }
      
      // Final fallback to local analytics
      console.warn('Using local fallback analytics');
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
    return this.queueRequest(async () => {
      try {
        const result = await this.makeRequest(`${this.baseUrl}/analytics`, {
          method: 'POST',
          body: JSON.stringify({
            action: 'clear_stats'
          })
        });
        
        // Also clear local stats and caches
        this.fallbackAnalytics.clearStats();
        localStorage.removeItem('analytics_cache');
        localStorage.removeItem('analytics_backup');
        
        // Clear session storage tracking
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('recent_calc_')) {
            sessionStorage.removeItem(key);
          }
        });
        
        return result.success;
        
      } catch (error) {
        console.error('Failed to clear centralized stats:', error);
        // Clear local stats as fallback
        this.fallbackAnalytics.clearStats();
        localStorage.removeItem('analytics_cache');
        localStorage.removeItem('analytics_backup');
        return false;
      }
    });
  }

  // New method to manually backup data
  async backupData(): Promise<string> {
    try {
      const result = await this.makeRequest(`${this.baseUrl}/analytics`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'backup_data'
        })
      });
      
      return JSON.stringify(result, null, 2);
    } catch (error) {
      console.error('Failed to backup data:', error);
      throw error;
    }
  }

  // New method to restore data from backup
  async restoreData(backupData: any): Promise<boolean> {
    try {
      const result = await this.makeRequest(`${this.baseUrl}/analytics`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'restore_data',
          data: { backupData }
        })
      });
      
      return result.success;
    } catch (error) {
      console.error('Failed to restore data:', error);
      return false;
    }
  }
}

// Enhanced Local analytics fallback
class LocalAnalytics {
  private storageKey = 'globalCalculatorStats_v2';

  trackCalculation(category: string, codec: string, variant: string, resolution: string): void {
    try {
      const stats = this.getStats();
      const key = `${category}-${codec}-${variant}-${resolution}`;
      
      stats[key] = (stats[key] || 0) + 1;
      stats.totalCalculations = (stats.totalCalculations || 0) + 1;
      stats.lastUsed = Date.now();
      stats.version = 2;
      
      localStorage.setItem(this.storageKey, JSON.stringify(stats));
    } catch (error) {
      console.error('Error tracking calculation locally:', error);
    }
  }

  getPopularCodecs(limit = 10): [string, number][] {
    try {
      const stats = this.getStats();
      return Object.entries(stats)
        .filter(([key]) => !['totalCalculations', 'lastUsed', 'version'].includes(key))
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
        uniqueConfigurations: Math.max(0, Object.keys(stats).length - 3) // Exclude totalCalculations, lastUsed, version
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
        lastUpdated: Date.now(),
        source: 'local',
        version: 2
      }
    };
  }

  private getStats(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : { version: 2 };
    } catch (error) {
      console.error('Error parsing local stats:', error);
      return { version: 2 };
    }
  }
}

// Enhanced type definitions
interface AnalyticsData {
  totalCalculations: number;
  lastUsed: number | null;
  uniqueConfigurations: number;
  popularConfigurations: Array<{ config: string; count: number }>;
  dailyStats: Record<string, number>;
  metadata: {
    created?: number;
    lastUpdated?: number;
    source?: string;
    version?: number;
    [key: string]: any;
  };
}

// Export singleton instance
export const centralizedAnalytics = CentralizedAnalyticsAPI.getInstance();