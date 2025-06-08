import React from 'react';
import { Calculator, HardDrive, Clock, Settings, Film, Zap, Share2, Copy, Check } from 'lucide-react';
import { generateShareableLink } from '../utils/urlSharing';

interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

interface ResultsData {
  bitrateMbps: number;
  fileSizeMB: number;
  fileSizeGB: number;
  fileSizeTB: number;
  totalSeconds: number;
  codec: any;
  variant: any;
  resolution: any;
  frameRate: any;
  category: string; // Add category to results data
}

interface ResultsPanelProps {
  results: ResultsData | null;
  duration: Duration;
  onDurationChange: (duration: Duration) => void;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, duration, onDurationChange }) => {
  const [copied, setCopied] = React.useState(false);

  const handleDurationChange = (field: keyof Duration, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    let newDuration = { ...duration, [field]: numValue };
    
    // Handle overflow
    if (field === 'seconds' && numValue >= 60) {
      newDuration.minutes += Math.floor(numValue / 60);
      newDuration.seconds = numValue % 60;
    }
    if (field === 'minutes' && numValue >= 60) {
      newDuration.hours += Math.floor(numValue / 60);
      newDuration.minutes = numValue % 60;
    }
    
    onDurationChange(newDuration);
  };

  const copyShareLink = async () => {
    if (!results) return;
    
    try {
      const shareUrl = generateShareableLink(
        results.category, // Use the category from results
        results.codec.id,
        results.variant.name,
        results.resolution.id,
        results.frameRate.id,
        duration
      );
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  if (!results) {
    return (
      <div className="bg-dark-secondary rounded-xl p-6 shadow-lg">
        <div className="text-center py-12">
          <Calculator className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">Ready to Calculate</h3>
          <p className="text-gray-500">Select your codec settings to see file size estimates</p>
        </div>
      </div>
    );
  }

  const formatFileSize = (sizeGB: number) => {
    if (sizeGB < 1) {
      return `${Math.round(sizeGB * 1024)} MB`;
    } else if (sizeGB < 1024) {
      return `${sizeGB.toFixed(2)} GB`;
    } else {
      return `${(sizeGB / 1024).toFixed(2)} TB`;
    }
  };

  const dataRateMBperMin = (results.bitrateMbps * 60) / 8;
  const dataRateMBperHour = dataRateMBperMin * 60;

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const totalSeconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;

  return (
    <div className="bg-dark-secondary rounded-xl p-6 shadow-lg fade-in-up">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
        <Calculator className="h-5 w-5 mr-2 text-green-400" />
        Calculation Results
      </h2>

      {/* Duration Input - Condensed Single Line */}
      <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <Clock className="h-4 w-4 text-blue-400 mr-2" />
          <span className="text-sm font-medium text-blue-400">Video Duration</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <input
              type="number"
              min="0"
              value={duration.hours}
              onChange={(e) => handleDurationChange('hours', e.target.value)}
              className="w-12 px-2 py-1 bg-dark-primary border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-400">h</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <input
              type="number"
              min="0"
              max="59"
              value={duration.minutes}
              onChange={(e) => handleDurationChange('minutes', e.target.value)}
              className="w-12 px-2 py-1 bg-dark-primary border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-400">m</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <input
              type="number"
              min="0"
              max="59"
              value={duration.seconds}
              onChange={(e) => handleDurationChange('seconds', e.target.value)}
              className="w-12 px-2 py-1 bg-dark-primary border border-gray-700 rounded text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-400">s</span>
          </div>
        </div>
      </div>

      {/* Primary Results - Bitrate and File Size on Same Line */}
      <div className="bg-dark-primary rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Bitrate:</span>
            <span className="text-xl font-bold text-white">{results.bitrateMbps} Mbps</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">File Size:</span>
            <div className="text-right">
              <div className="text-xl font-bold text-green-400">{formatFileSize(results.fileSizeGB)}</div>
              <div className="text-xs text-gray-400">
                ({results.fileSizeMB.toLocaleString()} MB)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Rates */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-primary rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Per Minute</div>
          <div className="text-lg font-semibold text-white">{dataRateMBperMin.toFixed(1)} MB</div>
        </div>
        <div className="bg-dark-primary rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Per Hour</div>
          <div className="text-lg font-semibold text-white">{(dataRateMBperHour / 1024).toFixed(1)} GB</div>
        </div>
      </div>

      {/* User Configuration Display */}
      <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-blue-400 mr-2" />
          <h3 className="text-lg font-medium text-blue-400">Configuration Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Codec Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Film className="h-4 w-4 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Codec</div>
                <div className="text-white font-medium">{results.codec.name}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Zap className="h-4 w-4 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Variant</div>
                <div className="text-white font-medium">{results.variant.name}</div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <HardDrive className="h-4 w-4 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Resolution</div>
                <div className="text-white font-medium">{results.resolution.name}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">Frame Rate</div>
                <div className="text-white font-medium">{results.frameRate.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Link */}
      <div className="text-center">
        <button
          onClick={copyShareLink}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span>Share link to this calculation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultsPanel;