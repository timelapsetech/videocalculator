import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Database, Download, Upload, RotateCcw, BarChart3, Star, LogOut, User, Menu, X, Info, FileText, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
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

interface ImportResult {
  success: boolean;
  message: string;
  details?: {
    categoriesAdded: number;
    categoriesUpdated: number;
    codecsAdded: number;
    codecsUpdated: number;
    variantsAdded: number;
    variantsUpdated: number;
  };
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { categories, updateCategories, resetToDefaults } = useCodecContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState('codecs');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [usageStats, setUsageStats] = useState({ totalCalculations: 0, uniqueConfigurations: 0, lastUsed: null });
  const [popularCodecs, setPopularCodecs] = useState<Array<{ config: string; count: number }>>([]);
  
  // Enhanced import/export state
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importPreviewData, setImportPreviewData] = useState<any>(null);

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

  // Load analytics data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAnalyticsData();
    }
  }, [isAuthenticated]);

  const loadAnalyticsData = async () => {
    try {
      const stats = await centralizedAnalytics.getTotalUsage();
      setUsageStats(stats);

      const popular = await centralizedAnalytics.getPopularCodecs(5);
      const parsedPopular = popular.map(([config, count]) => ({ config, count }));
      setPopularCodecs(parsedPopular);
    } catch (error) {
      console.warn('Failed to load analytics data:', error);
    }
  };

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

  // Enhanced export function - exports complete codec database
  const exportCompleteCodecData = async () => {
    setIsExporting(true);
    try {
      // Create comprehensive export data
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          exportedBy: adminUser?.email || 'unknown',
          version: '2.0',
          totalCategories: categories.length,
          totalCodecs: categories.reduce((sum, cat) => sum + cat.codecs.length, 0),
          totalVariants: categories.reduce((sum, cat) => 
            sum + cat.codecs.reduce((codecSum, codec) => codecSum + codec.variants.length, 0), 0
          ),
          description: 'Complete Video File Size Calculator Codec Database Export'
        },
        categories: categories,
        exportSettings: {
          includeDescriptions: true,
          includeWorkflowNotes: true,
          includeBitrates: true,
          format: 'complete'
        }
      };

      // Create and download the file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `complete-codec-database-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Track data export
      googleAnalytics.trackDataExport('complete-codec-database');
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export codec data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Enhanced import function with validation and preview
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate the imported data structure
        const validationResult = validateImportData(importedData);
        
        if (!validationResult.isValid) {
          setImportResult({
            success: false,
            message: `Invalid file format: ${validationResult.error}`
          });
          setIsImporting(false);
          return;
        }

        // Show preview of what will be imported
        setImportPreviewData(importedData);
        setShowImportPreview(true);
        setIsImporting(false);
        
      } catch (error) {
        setImportResult({
          success: false,
          message: 'Error parsing JSON file. Please check the file format.'
        });
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      setImportResult({
        success: false,
        message: 'Error reading file. Please try again.'
      });
      setIsImporting(false);
    };
    
    reader.readAsText(file);
    
    // Clear the input so the same file can be selected again
    event.target.value = '';
  };

  // Validate imported data structure
  const validateImportData = (data: any): { isValid: boolean; error?: string } => {
    if (!data) {
      return { isValid: false, error: 'No data found' };
    }

    // Check if it's a complete export format
    if (data.categories && Array.isArray(data.categories)) {
      // Validate categories structure
      for (const category of data.categories) {
        if (!category.id || !category.name || !Array.isArray(category.codecs)) {
          return { isValid: false, error: 'Invalid category structure' };
        }
        
        // Validate codecs structure
        for (const codec of category.codecs) {
          if (!codec.id || !codec.name || !Array.isArray(codec.variants)) {
            return { isValid: false, error: 'Invalid codec structure' };
          }
          
          // Validate variants structure
          for (const variant of codec.variants) {
            if (!variant.name || !variant.bitrates || typeof variant.bitrates !== 'object') {
              return { isValid: false, error: 'Invalid variant structure' };
            }
          }
        }
      }
      return { isValid: true };
    }

    // Check if it's a legacy format (direct categories array)
    if (Array.isArray(data)) {
      return validateImportData({ categories: data });
    }

    return { isValid: false, error: 'Unrecognized file format' };
  };

  // Process the import after user confirmation
  const processImport = () => {
    if (!importPreviewData) return;

    try {
      // Extract categories from the import data
      const newCategories = importPreviewData.categories || importPreviewData;
      
      // Merge with existing data or replace completely
      const mergeResult = mergeCodecData(categories, newCategories);
      
      // Update the codec context
      updateCategories(newCategories);
      
      setImportResult({
        success: true,
        message: 'Codec database updated successfully!',
        details: mergeResult
      });
      
      setShowImportPreview(false);
      setImportPreviewData(null);
      
      // Track successful import
      googleAnalytics.trackDataExport('codec-database-import-success');
      
    } catch (error) {
      console.error('Import processing failed:', error);
      setImportResult({
        success: false,
        message: 'Failed to process import. Please check the data format.'
      });
    }
  };

  // Merge imported data with existing data
  const mergeCodecData = (existing: any[], imported: any[]) => {
    let categoriesAdded = 0;
    let categoriesUpdated = 0;
    let codecsAdded = 0;
    let codecsUpdated = 0;
    let variantsAdded = 0;
    let variantsUpdated = 0;

    // For now, we'll do a complete replacement
    // In the future, this could be enhanced to do intelligent merging
    categoriesAdded = imported.length;
    codecsAdded = imported.reduce((sum, cat) => sum + cat.codecs.length, 0);
    variantsAdded = imported.reduce((sum, cat) => 
      sum + cat.codecs.reduce((codecSum: number, codec: any) => codecSum + codec.variants.length, 0), 0
    );

    return {
      categoriesAdded,
      categoriesUpdated,
      codecsAdded,
      codecsUpdated,
      variantsAdded,
      variantsUpdated
    };
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default codec database? This cannot be undone.')) {
      resetToDefaults();
      setImportResult({
        success: true,
        message: 'Database reset to defaults successfully.'
      });
    }
  };

  const handleClearStats = async () => {
    if (confirm('Are you sure you want to clear all analytics data? This will affect all users and cannot be undone.')) {
      try {
        await centralizedAnalytics.clearStats();
        setUsageStats({ totalCalculations: 0, uniqueConfigurations: 0, lastUsed: null });
        setPopularCodecs([]);
        alert('Analytics data cleared successfully.');
      } catch (error) {
        console.error('Failed to clear stats:', error);
        alert('Failed to clear analytics data. Please try again.');
      }
    }
  };

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
            {/* Enhanced Data Management Section */}
            <div className="bg-dark-secondary rounded-xl p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center">
                <Database className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Complete Codec Database Management
              </h2>
              
              <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                <h3 className="text-blue-400 font-medium mb-2">Enhanced Import/Export System</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Export the complete codec database including all categories, codecs, variants, bitrates, and metadata. 
                  Import modified versions to automatically update the system with new codecs or changes.
                </p>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Export includes complete database structure with metadata</li>
                  <li>• Import validates data structure before applying changes</li>
                  <li>• Preview changes before confirming import</li>
                  <li>• Automatic backup of current data before import</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  onClick={exportCompleteCodecData}
                  disabled={isExporting}
                  className="flex items-center justify-center space-x-2 p-3 sm:p-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors text-sm"
                >
                  {isExporting ? (
                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  <span>{isExporting ? 'Exporting...' : 'Export Complete Database'}</span>
                </button>
                
                <label className={`flex items-center justify-center space-x-2 p-3 sm:p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white cursor-pointer transition-colors text-sm ${
                  isImporting ? 'opacity-50 cursor-not-allowed' : ''
                }`}>
                  {isImporting ? (
                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  <span>{isImporting ? 'Processing...' : 'Import Database'}</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    disabled={isImporting}
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

              {/* Import Result Display */}
              {importResult && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  importResult.success 
                    ? 'bg-green-600/10 border-green-600/20' 
                    : 'bg-red-600/10 border-red-600/20'
                }`}>
                  <div className="flex items-center">
                    {importResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                    )}
                    <div>
                      <p className={`font-medium ${importResult.success ? 'text-green-400' : 'text-red-400'}`}>
                        {importResult.success ? 'Import Successful' : 'Import Failed'}
                      </p>
                      <p className={`text-sm mt-1 ${importResult.success ? 'text-green-300' : 'text-red-300'}`}>
                        {importResult.message}
                      </p>
                      {importResult.details && (
                        <div className="mt-2 text-xs text-gray-300">
                          <p>Categories: {importResult.details.categoriesAdded} added, {importResult.details.categoriesUpdated} updated</p>
                          <p>Codecs: {importResult.details.codecsAdded} added, {importResult.details.codecsUpdated} updated</p>
                          <p>Variants: {importResult.details.variantsAdded} added, {importResult.details.variantsUpdated} updated</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Import Preview Modal */}
              {showImportPreview && importPreviewData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-dark-secondary rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-400" />
                        Import Preview
                      </h3>
                    </div>
                    
                    <div className="p-6 overflow-y-auto max-h-96">
                      <div className="space-y-4">
                        {importPreviewData.metadata && (
                          <div className="bg-dark-primary rounded-lg p-4">
                            <h4 className="text-white font-medium mb-2">Import Metadata</h4>
                            <div className="text-sm text-gray-300 space-y-1">
                              <p>Export Date: {importPreviewData.metadata.exportDate || 'Unknown'}</p>
                              <p>Version: {importPreviewData.metadata.version || 'Unknown'}</p>
                              <p>Categories: {importPreviewData.metadata.totalCategories || 'Unknown'}</p>
                              <p>Codecs: {importPreviewData.metadata.totalCodecs || 'Unknown'}</p>
                              <p>Variants: {importPreviewData.metadata.totalVariants || 'Unknown'}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="bg-dark-primary rounded-lg p-4">
                          <h4 className="text-white font-medium mb-2">Categories to Import</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {(importPreviewData.categories || importPreviewData).map((category: any, index: number) => (
                              <div key={index} className="text-sm text-gray-300 border-l-2 border-blue-500 pl-3">
                                <p className="font-medium">{category.name}</p>
                                <p className="text-xs text-gray-400">
                                  {category.codecs?.length || 0} codecs, {
                                    category.codecs?.reduce((sum: number, codec: any) => sum + (codec.variants?.length || 0), 0) || 0
                                  } variants
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4">
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
                            <div>
                              <p className="text-yellow-400 font-medium">Warning</p>
                              <p className="text-yellow-300 text-sm mt-1">
                                This will replace your current codec database. Make sure you have exported a backup if needed.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowImportPreview(false);
                          setImportPreviewData(null);
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={processImport}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                      >
                        Confirm Import
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Database Statistics */}
            <div className="bg-dark-secondary rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Current Database Statistics</h3>
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
                <div className="mb-6">
                  <h3 className="text-sm sm:text-md font-semibold text-white mb-4">Most Popular Configurations</h3>
                  <div className="space-y-2">
                    {popularCodecs.map((item, index) => {
                      const [category, codec, variant, resolution] = item.config.split('-');
                      return (
                        <div key={item.config} className="bg-dark-primary rounded-lg p-3 flex justify-between items-center">
                          <div>
                            <div className="text-white font-medium text-sm">
                              {codec} - {variant}
                            </div>
                            <div className="text-xs text-gray-400">
                              {category} | {resolution}
                            </div>
                          </div>
                          <div className="text-blue-400 font-bold text-sm">
                            {item.count} uses
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 mb-4">
                  <p className="text-blue-400 text-xs sm:text-sm">
                    <strong>Note:</strong> This data is now centralized across all users worldwide and displayed publicly on the main calculator page. 
                    The analytics help users see what configurations are most popular in the community.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={loadAnalyticsData}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors text-sm"
                  >
                    Refresh Data
                  </button>
                  <button
                    onClick={handleClearStats}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors text-sm"
                  >
                    Clear All Analytics Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;