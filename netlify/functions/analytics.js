const fs = require('fs').promises;
const path = require('path');

// Path to store analytics data
const ANALYTICS_FILE = '/tmp/analytics.json';

// Initialize analytics data structure
const initAnalytics = () => ({
  totalCalculations: 0,
  lastUsed: null,
  configurations: {},
  dailyStats: {},
  metadata: {
    created: Date.now(),
    lastUpdated: Date.now()
  }
});

// Read analytics data
const readAnalytics = async () => {
  try {
    const data = await fs.readFile(ANALYTICS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is corrupted, return initial data
    return initAnalytics();
  }
};

// Write analytics data
const writeAnalytics = async (data) => {
  try {
    data.metadata.lastUpdated = Date.now();
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing analytics:', error);
    return false;
  }
};

// Get today's date key for daily stats
const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

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
    const analytics = await readAnalytics();

    if (event.httpMethod === 'GET') {
      // Return analytics data
      const response = {
        totalCalculations: analytics.totalCalculations || 0,
        lastUsed: analytics.lastUsed,
        uniqueConfigurations: Object.keys(analytics.configurations || {}).length,
        popularConfigurations: Object.entries(analytics.configurations || {})
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([config, count]) => ({ config, count })),
        dailyStats: analytics.dailyStats || {},
        metadata: analytics.metadata
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
        const configKey = `${category}-${codec}-${variant}-${resolution}-${frameRate}`;
        const today = getTodayKey();

        // Update analytics
        analytics.totalCalculations = (analytics.totalCalculations || 0) + 1;
        analytics.lastUsed = Date.now();
        analytics.configurations = analytics.configurations || {};
        analytics.configurations[configKey] = (analytics.configurations[configKey] || 0) + 1;
        
        // Update daily stats
        analytics.dailyStats = analytics.dailyStats || {};
        analytics.dailyStats[today] = (analytics.dailyStats[today] || 0) + 1;

        // Clean up old daily stats (keep last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        Object.keys(analytics.dailyStats).forEach(date => {
          if (date < cutoffDate) {
            delete analytics.dailyStats[date];
          }
        });

        const success = await writeAnalytics(analytics);

        return {
          statusCode: success ? 200 : 500,
          headers,
          body: JSON.stringify({ 
            success, 
            totalCalculations: analytics.totalCalculations,
            message: success ? 'Calculation tracked successfully' : 'Failed to track calculation'
          })
        };
      }

      if (action === 'clear_stats') {
        // Admin function to clear all stats
        const clearedAnalytics = initAnalytics();
        const success = await writeAnalytics(clearedAnalytics);

        return {
          statusCode: success ? 200 : 500,
          headers,
          body: JSON.stringify({ 
            success, 
            message: success ? 'Stats cleared successfully' : 'Failed to clear stats'
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
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};