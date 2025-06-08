import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Database, Download, Upload, RotateCcw, BarChart3, Star, LogOut, User, Menu, X, Info } from 'lucide-react';
import { useCodecContext } from '../context/CodecContext';
import { centralizedAnalytics, googleAnalytics } from '../utils/analytics';
import AdminAuth from './AdminAuth';
import CodecManager from './CodecManager';
import PresetManager from './PresetManager';
import AnalyticsConfig from './AnalyticsConfig';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { categories, updateCategories, resetToDefaults } = useCodecContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState('codecs');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const authData = sessionStorage.getItem('adminAuth');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setAdminUser(userData);
        setIsAuthenticated(true);
        // Track admin access
        googleAnalytics.trackAdminAccess();
      } catch {
        // Invalid auth data, clear it
        sessionStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const handleAuthSuccess = () => {
    const authData = sessionStorage.getItem('adminAuth');
    if (authData) {
      try {
        const userData = JSON.parse(authData);
        setAdminUser(userData);
        setIsAuthenticated(true);
        // Track admin access
        googleAnalytics.trackAdminAccess();
      } catch {
        console.error('Failed to parse admin auth data');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    sessionStorage.removeItem('adminAuth');
    
    // Sign out from Google
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    navigate('/');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(categories, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codec-database-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    // Track data export
    googleAnalytics.trackDataExport('codec-database');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        updateCategories(importedData);
        alert('Data imported successfully!');
        // Track data import
        googleAnalytics.trackDataExport('codec-database-import');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default codec database? This cannot be undone.')) {
      resetToDefaults();
      alert('Database reset to defaults.');
    }
  };

  const usageStats = centralizedAnalytics.getTotalUsage();
  const popularCodecs = centralizedAnalytics.getPopularCodecs(5);

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-dark-primary relative">
      {/* Header */}
      <header className="border-b border-gray-800 bg-dark-secondary/50 backdrop-blur-sm relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Back to Calculator</span>
              </Link>
              <div className="hidden sm:flex items-center space-x-3">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                <h1 className="text-lg sm:text-xl font-semibold text-white">Admin Panel</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Admin User Info - Desktop */}
              {adminUser && (
                <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-lg bg-dark-secondary">
                  <img
                    src={adminUser.picture}
                    alt={adminUser.name}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full"
                  />
                  <div className="hidden md:block">
                    <div className="text-xs sm:text-sm text-white font-medium">{adminUser.name}</div>
                    <div className="text-xs text-gray-400">{adminUser.email}</div>
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg bg-dark-secondary hover:bg-gray-700 transition-colors"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Menu className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/about"
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-secondary hover:bg-gray-700 transition-colors"
                >
                  <Info className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">About</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors text-sm"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden absolute top-full left-0 right-0 bg-dark-secondary border-b border-gray-800 shadow-lg z-40">
              <div className="px-4 py-3 space-y-2">
                {adminUser && (
                  <div className="flex items-center space-x-3 px-3 py-3 border-b border-gray-700">
                    <img
                      src={adminUser.picture}
                      alt={adminUser.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div>
                      <div className="text-sm text-white font-medium">{adminUser.name}</div>
                      <div className="text-xs text-gray-400">{adminUser.email}</div>
                    </div>
                  </div>
                )}
                
                <Link
                  to="/about"
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-dark-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">About</span>
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-red-600/20 transition-colors text-left"
                >
                  <LogOut className="h-5 w-5 text-red-400" />
                  <span className="text-red-400">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="border-b border-gray-800">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('codecs')}
              className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'codecs'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Codec Management
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'presets'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Default Presets
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'data'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Data Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Usage Analytics
            </button>
            <button
              onClick={() => setActiveTab('google-analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'google-analytics'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Google Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {activeTab === 'codecs' && <CodecManager />}
        
        {activeTab === 'presets' && <PresetManager />}
        
        {activeTab === 'google-analytics' && <AnalyticsConfig />}
        
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="bg-dark-secondary rounded-xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center">
                <Database className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Database Operations
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={exportData}
                  className="flex items-center justify-center space-x-2 p-3 sm:p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors text-sm"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Export Data</span>
                </button>
                
                <label className="flex items-center justify-center space-x-2 p-3 sm:p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white cursor-pointer transition-colors text-sm">
                  <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Import Data</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center space-x-2 p-3 sm:p-4 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors text-sm"
                >
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>

            <div className="bg-dark-secondary rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Database Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-primary rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">{categories.length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Categories</div>
                </div>
                <div className="bg-dark-primary rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">
                    {categories.reduce((sum, cat) => sum + cat.codecs.length, 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Codecs</div>
                </div>
                <div className="bg-dark-primary rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">
                    {categories.reduce((sum, cat) => 
                      sum + cat.codecs.reduce((codecSum, codec) => codecSum + codec.variants.length, 0), 0
                    )}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Variants</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-dark-secondary rounded-xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Centralized Usage Analytics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-dark-primary rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">{usageStats.totalCalculations}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Total Calculations</div>
                </div>
                <div className="bg-dark-primary rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">{usageStats.uniqueConfigurations}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Unique Configurations</div>
                </div>
                <div className="bg-dark-primary rounded-lg p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">
                    {usageStats.lastUsed ? new Date(usageStats.lastUsed).toLocaleDateString() : 'Never'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Last Used</div>
                </div>
              </div>

              {popularCodecs.length > 0 && (
                <div>
                  <h3 className="text-sm sm:text-md font-semibold text-white mb-4">Most Popular Configurations</h3>
                  <div className="space-y-2">
                    {popularCodecs.map(([config, count], index) => {
                      const [category, codec, variant, resolution] = config.split('-');
                      return (
                        <div key={config} className="bg-dark-primary rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <div className="text-white font-medium text-sm">
                              {codec} - {variant}
                            </div>
                            <div className="text-xs text-gray-400">
                              {category} | {resolution}
                            </div>
                          </div>
                          <div className="text-blue-400 font-bold text-sm">
                            {count} uses
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4 mb-4">
                  <p className="text-yellow-400 text-xs sm:text-sm">
                    <strong>Note:</strong> This data is now shared across all users and displayed publicly on the main calculator page. 
                    The analytics help users see what configurations are most popular in the community.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all analytics data? This will affect all users.')) {
                      centralizedAnalytics.clearStats();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors text-sm"
                >
                  Clear All Analytics Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;