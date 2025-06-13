const fs = require('fs').promises;
const path = require('path');

// Enhanced persistent storage using multiple strategies
class PersistentAnalytics {
  constructor() {
    this.cache = null;
    this.lastCacheTime = 0;
    this.CACHE_DURATION = 30000; // 30 seconds
    this.storageKey = 'video_calculator_analytics_v2';
    this.backupKey = 'video_calculator_backup_v2';
  }

  // Initialize analytics data structure
  initAnalytics() {
    return {
      totalCalculations: 0,
      lastUsed: null,
      configurations: {},
      dailyStats: {},
      metadata: {
        created: Date.now(),
        lastUpdated: Date.now(),
        version: 2
      }
    };
  }

  // Strategy 1: Use Netlify environment variables for persistence
  async readFromEnv() {
    try {
      // Try to read from a custom environment variable
      const envData = process.env.ANALYTICS_DATA;
      if (envData) {
        const parsed = JSON.parse(envData);
        console.log('Loaded analytics from environment variable');
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to read from environment variable:', error.message);
    }
    return null;
  }

  async writeToEnv(data) {
    // Note: This would require manual updating of environment variables
    // We'll log the data for manual backup purposes
    console.log('Analytics data for backup:', JSON.stringify(data));
    return true;
  }

  // Strategy 2: Use a more persistent file location
  async readFromPersistentFile() {
    try {
      // Try multiple locations for persistence
      const locations = [
        '/opt/buildhome/analytics.json',
        '/var/task/analytics.json',
        '/tmp/persistent_analytics.json'
      ];

      for (const location of locations) {
        try {
          const data = await fs.readFile(location, 'utf8');
          const parsed = JSON.parse(data);
          console.log(`Loaded analytics from ${location}`);
          return parsed;
        } catch (err) {
          // Try next location
          continue;
        }
      }
    } catch (error) {
      console.warn('Failed to read from persistent file:', error.message);
    }
    return null;
  }

  async writeToPersistentFile(data) {
    const locations = [
      '/opt/buildhome/analytics.json',
      '/var/task/analytics.json',
      '/tmp/persistent_analytics.json'
    ];

    let success = false;
    for (const location of locations) {
      try {
        // Ensure directory exists
        const dir = path.dirname(location);
        await fs.mkdir(dir, { recursive: true });
        
        await fs.writeFile(location, JSON.stringify(data, null, 2));
        console.log(`Saved analytics to ${location}`);
        success = true;
        break;
      } catch (error) {
        console.warn(`Failed to write to ${location}:`, error.message);
        continue;
      }
    }
    return success;
  }

  // Strategy 3: Use a distributed approach with multiple fallbacks
  async readAnalytics() {
    const now = Date.now();
    
    // Return cached data if it's fresh
    if (this.cache && (now - this.lastCacheTime) < this.CACHE_DURATION) {
      return this.cache;
    }

    // Try multiple sources in order of preference
    const sources = [
      () => this.readFromEnv(),
      () => this.readFromPersistentFile(),
      () => this.readFromTempFile()
    ];

    for (const source of sources) {
      try {
        const data = await source();
        if (data && data.metadata && data.metadata.version >= 2) {
          // Update cache
          this.cache = data;
          this.lastCacheTime = now;
          
          // Replicate to other storage methods for redundancy
          this.replicateData(data);
          
          return data;
        }
      } catch (error) {
        console.warn('Source failed:', error.message);
        continue;
      }
    }

    // If all sources fail, initialize new data
    const newData = this.initAnalytics();
    this.cache = newData;
    this.lastCacheTime = now;
    
    return newData;
  }

  async readFromTempFile() {
    try {
      const data = await fs.readFile('/tmp/analytics.json', 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  // Replicate data to multiple storage locations for redundancy
  async replicateData(data) {
    // Don't await these - fire and forget for performance
    Promise.all([
      this.writeToPersistentFile(data),
      this.writeToTempFile(data),
      this.writeToEnv(data)
    ]).catch(error => {
      console.warn('Replication failed:', error.message);
    });
  }

  async writeToTempFile(data) {
    try {
      await fs.writeFile('/tmp/analytics.json', JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.warn('Failed to write temp file:', error.message);
      return false;
    }
  }

  // Enhanced write with atomic operations and redundancy
  async writeAnalytics(data) {
    try {
      data.metadata.lastUpdated = Date.now();
      data.metadata.version = 2;
      
      // Update cache first
      this.cache = { ...data };
      this.lastCacheTime = Date.now();
      
      // Write to multiple locations simultaneously
      const writePromises = [
        this.writeToPersistentFile(data),
        this.writeToTempFile(data)
      ];

      // Wait for at least one write to succeed
      const results = await Promise.allSettled(writePromises);
      const successes = results.filter(result => result.status === 'fulfilled' && result.value === true);
      
      if (successes.length > 0) {
        console.log(`Successfully wrote to ${successes.length} locations`);
        return true;
      } else {
        console.error('All write operations failed');
        return false;
      }
    } catch (error) {
      console.error('Error writing analytics:', error);
      return false;
    }
  }

  // Get today's date key for daily stats
  getTodayKey() {
    return new Date().toISOString().split('T')[0];
  }

  // Enhanced merge with conflict resolution
  mergeAnalytics(existing, incoming) {
    const merged = { ...existing };
    
    // Merge configurations with conflict resolution
    merged.configurations = { ...existing.configurations };
    if (incoming.configurations) {
      Object.keys(incoming.configurations).forEach(key => {
        merged.configurations[key] = (merged.configurations[key] || 0) + (incoming.configurations[key] || 0);
      });
    }
    
    // Merge daily stats
    merged.dailyStats = { ...existing.dailyStats };
    if (incoming.dailyStats) {
      Object.keys(incoming.dailyStats).forEach(key => {
        merged.dailyStats[key] = (merged.dailyStats[key] || 0) + (incoming.dailyStats[key] || 0);
      });
    }
    
    // Update totals and metadata
    merged.totalCalculations = (existing.totalCalculations || 0) + (incoming.totalCalculations || 0);
    merged.lastUsed = Math.max(existing.lastUsed || 0, incoming.lastUsed || 0);
    merged.metadata = {
      created: existing.metadata?.created || incoming.metadata?.created || Date.now(),
      lastUpdated: Date.now(),
      version: 2
    };
    
    return merged;
  }

  // Cleanup old data to prevent unbounded growth
  cleanupOldData(data) {
    // Keep only last 90 days of daily stats
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const cutoffDate = ninetyDaysAgo.toISOString().split('T')[0];
    
    Object.keys(data.dailyStats).forEach(date => {
      if (date < cutoffDate) {
        delete data.dailyStats[date];
      }
    });

    // Limit configurations to top 1000 to prevent memory issues
    if (Object.keys(data.configurations).length > 1000) {
      const sortedConfigs = Object.entries(data.configurations)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 1000);
      
      data.configurations = Object.fromEntries(sortedConfigs);
    }

    return data;
  }
}

// Create singleton instance
const analytics = new PersistentAnalytics();

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Return analytics data
      const data = await analytics.readAnalytics();
      
      const response = {
        totalCalculations: data.totalCalculations || 0,
        lastUsed: data.lastUsed,
        uniqueConfigurations: Object.keys(data.configurations || {}).length,
        popularConfigurations: Object.entries(data.configurations || {})
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([config, count]) => ({ config, count })),
        dailyStats: data.dailyStats || {},
        metadata: {
          ...data.metadata,
          storageStrategy: 'multi-location-persistent',
          lastRead: Date.now()
        }
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { action, data } = body;

      if (action === 'track_calculation') {
        const { category, codec, variant, resolution, frameRate } = data;
        
        // Validate required fields
        if (!category || !codec || !variant || !resolution) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing required fields' })
          };
        }
        
        const configKey = `${category}-${codec}-${variant}-${resolution}-${frameRate || '30'}`;
        const today = analytics.getTodayKey();

        // Read current analytics with retry logic
        let currentData;
        let retries = 3;
        
        while (retries > 0) {
          try {
            currentData = await analytics.readAnalytics();
            break;
          } catch (error) {
            retries--;
            if (retries === 0) {
              throw error;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        // Create incremental update
        const increment = {
          totalCalculations: 1,
          lastUsed: Date.now(),
          configurations: { [configKey]: 1 },
          dailyStats: { [today]: 1 },
          metadata: {
            created: currentData.metadata?.created || Date.now(),
            lastUpdated: Date.now(),
            version: 2
          }
        };
        
        // Merge with existing data
        const updatedData = analytics.mergeAnalytics(currentData, increment);
        
        // Clean up old data
        const cleanedData = analytics.cleanupOldData(updatedData);
        
        // Write with retry logic
        let writeSuccess = false;
        retries = 3;
        
        while (retries > 0 && !writeSuccess) {
          try {
            writeSuccess = await analytics.writeAnalytics(cleanedData);
            if (writeSuccess) break;
          } catch (error) {
            console.warn(`Write attempt failed (${retries} retries left):`, error.message);
          }
          
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        return {
          statusCode: writeSuccess ? 200 : 500,
          headers,
          body: JSON.stringify({ 
            success: writeSuccess, 
            totalCalculations: cleanedData.totalCalculations,
            message: writeSuccess ? 'Calculation tracked successfully' : 'Failed to track calculation',
            metadata: {
              storageStrategy: 'multi-location-persistent',
              retries: 3 - retries
            }
          })
        };
      }

      if (action === 'clear_stats') {
        // Admin function to clear all stats
        const clearedData = analytics.initAnalytics();
        const success = await analytics.writeAnalytics(clearedData);

        return {
          statusCode: success ? 200 : 500,
          headers,
          body: JSON.stringify({ 
            success, 
            message: success ? 'Stats cleared successfully' : 'Failed to clear stats'
          })
        };
      }

      if (action === 'backup_data') {
        // New endpoint to get full data for manual backup
        const data = await analytics.readAnalytics();
        
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'Content-Disposition': 'attachment; filename="analytics-backup.json"'
          },
          body: JSON.stringify(data, null, 2)
        };
      }

      if (action === 'restore_data') {
        // New endpoint to restore from backup
        const { backupData } = data;
        
        if (!backupData || !backupData.metadata) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid backup data' })
          };
        }

        const success = await analytics.writeAnalytics(backupData);

        return {
          statusCode: success ? 200 : 500,
          headers,
          body: JSON.stringify({ 
            success, 
            message: success ? 'Data restored successfully' : 'Failed to restore data'
          })
        };
      }

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action' })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Analytics function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        timestamp: Date.now()
      })
    };
  }
};