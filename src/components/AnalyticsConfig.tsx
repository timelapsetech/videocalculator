import React, { useState, useEffect } from 'react';
import { BarChart3, Save, Eye, EyeOff, AlertCircle, CheckCircle, Settings } from 'lucide-react';
import { googleAnalytics } from '../utils/analytics';

const AnalyticsConfig: React.FC = () => {
  const [measurementId, setMeasurementId] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showId, setShowId] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    // Load saved configuration
    const savedId = localStorage.getItem('ga_measurement_id');
    const savedEnabled = localStorage.getItem('ga_enabled') === 'true';
    
    if (savedId) {
      setMeasurementId(savedId);
      setIsEnabled(savedEnabled);
      
      // Initialize Google Analytics if enabled
      if (savedEnabled) {
        googleAnalytics.initialize(savedId);
      }
    }
  }, []);

  const handleSave = () => {
    setSaveStatus('saving');
    
    try {
      if (isEnabled && measurementId) {
        // Validate measurement ID format
        if (!measurementId.match(/^G-[A-Z0-9]+$/)) {
          setSaveStatus('error');
          setTimeout(() => setSaveStatus('idle'), 3000);
          return;
        }
        
        // Save configuration
        localStorage.setItem('ga_measurement_id', measurementId);
        localStorage.setItem('ga_enabled', 'true');
        
        // Initialize Google Analytics
        googleAnalytics.initialize(measurementId);
      } else {
        // Disable analytics
        localStorage.setItem('ga_enabled', 'false');
        localStorage.removeItem('ga_measurement_id');
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving analytics configuration:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to disable Google Analytics and remove the configuration?')) {
      setMeasurementId('');
      setIsEnabled(false);
      localStorage.removeItem('ga_measurement_id');
      localStorage.removeItem('ga_enabled');
      setSaveStatus('idle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-dark-secondary rounded-xl p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-blue-400 mr-3" />
          <div>
            <h2 className="text-xl font-bold text-white">Google Analytics Configuration</h2>
            <p className="text-gray-400 text-sm mt-1">
              Configure Google Analytics to track usage and improve the application
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 bg-dark-primary rounded-lg">
            <div>
              <h3 className="text-white font-medium">Enable Google Analytics</h3>
              <p className="text-gray-400 text-sm">Track user interactions and usage patterns</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Measurement ID Input */}
          {isEnabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Google Analytics Measurement ID
                </label>
                <div className="relative">
                  <input
                    type={showId ? 'text' : 'password'}
                    value={measurementId}
                    onChange={(e) => setMeasurementId(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-4 py-3 bg-dark-primary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowId(!showId)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showId ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Format: G-XXXXXXXXXX (found in your Google Analytics property settings)
                </p>
              </div>

              {/* Setup Instructions */}
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-3 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Setup Instructions
                </h4>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Google Analytics</a></li>
                  <li>Create a new property or select an existing one</li>
                  <li>Go to Admin → Property Settings → Property Details</li>
                  <li>Copy your Measurement ID (starts with "G-")</li>
                  <li>Paste it above and click Save Configuration</li>
                </ol>
              </div>

              {/* Privacy Notice */}
              <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-400 font-medium mb-2">Privacy Notice</h4>
                    <p className="text-sm text-gray-300">
                      Google Analytics will track user interactions, page views, and usage patterns. 
                      No personally identifiable information is collected. Users can opt out using 
                      browser settings or ad blockers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Events Tracked */}
              <div className="bg-dark-primary rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Events Tracked</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>File size calculations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Preset usage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Share link generation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>Page navigation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>Admin panel access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>Data exports</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              {googleAnalytics.isEnabled() && (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Analytics Active</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {measurementId && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  Reset Configuration
                </button>
              )}
              
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving' || (isEnabled && !measurementId)}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
              >
                {saveStatus === 'saving' ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : saveStatus === 'saved' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>
                  {saveStatus === 'saving' ? 'Saving...' : 
                   saveStatus === 'saved' ? 'Saved!' : 
                   saveStatus === 'error' ? 'Error - Try Again' : 
                   'Save Configuration'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-dark-secondary rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Current Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-primary rounded-lg p-4">
            <div className="text-sm text-gray-400">Status</div>
            <div className={`text-lg font-semibold ${googleAnalytics.isEnabled() ? 'text-green-400' : 'text-gray-400'}`}>
              {googleAnalytics.isEnabled() ? 'Active' : 'Disabled'}
            </div>
          </div>
          <div className="bg-dark-primary rounded-lg p-4">
            <div className="text-sm text-gray-400">Measurement ID</div>
            <div className="text-lg font-mono text-white">
              {googleAnalytics.getMeasurementId() || 'Not configured'}
            </div>
          </div>
          <div className="bg-dark-primary rounded-lg p-4">
            <div className="text-sm text-gray-400">Privacy Compliant</div>
            <div className="text-lg font-semibold text-green-400">Yes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsConfig;