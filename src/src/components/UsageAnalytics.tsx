import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Clock, ChevronDown, ChevronUp, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { centralizedAnalytics } from '../utils/centralizedAnalytics';

interface UsageStats {
  totalCalculations: number;
  uniqueConfigurations: number;
  lastUsed: number | null;
}

interface PopularCodec {
  config: string;
  count: number;
  category: string;
  codec: string;
  variant: string;
  resolution: string;
}

interface AnalyticsData {
  totalCalculations: number;
  lastUsed: number | null;
  uniqueConfigurations: number;
  popularConfigurations: Array<{ config: string; count: number }>;
  dailyStats: Record<string, number>;
  metadata?: {
    created: number;
    lastUpdated: number;
  };
}

const UsageAnalytics: React.FC = () => {
  const [usageStats, setUsageStats] = useState<UsageStats>({ totalCalculations: 0, uniqueConfigurations: 0, lastUsed: null });
  const [popularCodecs, setPopularCodecs] = useState<PopularCodec[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Load usage statistics
      const stats = await centralizedAnalytics.getTotalUsage();
      setUsageStats(stats);

      // Load popular codecs and parse them
      const popular = await centralizedAnalytics.getPopularCodecs(10);
      const parsedPopular = popular.map(([config, count]) => {
        const parts = config.split('-');
        return {
          config,
          count: count as number,
          category: parts[0] || 'Unknown',
          codec: parts[1] || 'Unknown',
          variant: parts[2] || 'Unknown',
          resolution: parts[3] || 'Unknown'
        };
      });
      setPopularCodecs(parsedPopular);
      setLastUpdated(Date.now());
      setIsOnline(true);
      
    } catch (error) {
      console.warn('Failed to load analytics:', error);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Load analytics on mount
  useEffect(() => {
    loadAnalytics();
  }, []);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        loadAnalytics();
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isLoading]);

  // Manual refresh
  const handleRefresh = () => {
    loadAnalytics();
  };

  const formatLastUsed = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatLastUpdated = (timestamp: number | null) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getUsageIntensity = (count: number, maxCount: number) => {
    const intensity = count / maxCount;
    if (intensity > 0.8) return 'bg-green-500';
    if (intensity > 0.6) return 'bg-green-400';
    if (intensity > 0.4) return 'bg-yellow-400';
    if (intensity > 0.2) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const maxCount = popularCodecs.length > 0 ? popularCodecs[0].count : 1;

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl shadow-lg">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 text-purple-400 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                Community Usage Analytics
                {isLoading && <RefreshCw className="h-4 w-4 ml-2 animate-spin text-blue-400" />}
                {!isOnline && <WifiOff className="h-4 w-4 ml-2 text-red-400\" title="Offline - showing cached data" />}
                {isOnline && !isLoading && <Wifi className="h-4 w-4 ml-2 text-green-400\" title="Live data" />}
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                {isOnline 
                  ? "Real-time stats from all users worldwide"
                  : "Offline - showing local cached data"
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh();
              }}
              disabled={isLoading}
              className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`h-4 w-4 text-purple-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                {usageStats.totalCalculations.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Total Calculations</div>
              {lastUpdated && (
                <div className="text-xs text-gray-500">
                  Updated {formatLastUpdated(lastUpdated)}
                </div>
              )}
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-purple-500/20">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-6">
            <div className="bg-dark-secondary rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-green-400">{usageStats.totalCalculations.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Total Calculations</div>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-secondary rounded-lg p-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-400 mr-2" />
                <div>
                  <div className="text-2xl font-bold text-blue-400">{usageStats.uniqueConfigurations.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Unique Configurations</div>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-secondary rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-purple-400 mr-2" />
                <div>
                  <div className="text-lg font-bold text-purple-400">{formatLastUsed(usageStats.lastUsed)}</div>
                  <div className="text-sm text-gray-400">Last Activity</div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Configurations */}
          {popularCodecs.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
                Most Popular Configurations
              </h3>
              
              <div className="space-y-3">
                {popularCodecs.slice(0, 8).map((item, index) => (
                  <div 
                    key={item.config} 
                    className="bg-dark-secondary rounded-lg p-4 hover:bg-dark-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {item.codec.charAt(0).toUpperCase() + item.codec.slice(1)} - {item.variant}
                          </div>
                          <div className="text-sm text-gray-400">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)} | {item.resolution}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">{item.count}</div>
                          <div className="text-xs text-gray-400">calculations</div>
                        </div>
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getUsageIntensity(item.count, maxCount)} transition-all duration-300`}
                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {popularCodecs.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No Usage Data Available</h3>
              <p className="text-gray-500 text-sm">
                {isOnline 
                  ? "Start calculating to see popular configurations"
                  : "Connect to the internet to see community statistics"
                }
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-purple-500/20">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {isOnline 
                  ? "Data is aggregated from all users worldwide and updated in real-time"
                  : "Showing cached data - connect to internet for latest stats"
                }
              </p>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className={`text-xs ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                  {isOnline ? 'Live Data' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageAnalytics;