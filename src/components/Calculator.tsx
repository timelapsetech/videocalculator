import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Settings, Share2, Check, Film, HardDrive, Star, RotateCcw, Plus, Info, Database, BarChart3, Menu, X, ExternalLink } from 'lucide-react';
import { useCodecContext } from '../context/CodecContext';
import { usePresetContext } from '../context/PresetContext';
import { resolutions, frameRates } from '../data/resolutions';
import { analytics, googleAnalytics, centralizedAnalytics } from '../utils/analytics';
import { generateShareableLink } from '../utils/urlSharing';
import CustomSelect from './CustomSelect';
import ResultsPanel from './ResultsPanel';
import EditablePresetCard from './EditablePresetCard';
import UsageAnalytics from './UsageAnalytics';

const Calculator: React.FC = () => {
  const { categories } = useCodecContext();
  const { customPresets, updatePreset, addPreset, resetToDefaults } = usePresetContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State from URL parameters or defaults
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCodec, setSelectedCodec] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedResolution, setSelectedResolution] = useState('1080p');
  const [selectedFrameRate, setSelectedFrameRate] = useState('30');
  const [duration, setDuration] = useState({
    hours: 1,
    minutes: 0,
    seconds: 0
  });
  const [copied, setCopied] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Track the last calculation that was tracked to prevent duplicate tracking
  const [lastTrackedCalculation, setLastTrackedCalculation] = useState<string | null>(null);

  // Initialize from URL parameters when component mounts or categories load
  useEffect(() => {
    if (categories.length === 0) return; // Wait for categories to load

    const urlCategory = searchParams.get('category') || '';
    const urlCodec = searchParams.get('codec') || '';
    const urlVariant = searchParams.get('variant') || '';
    const urlResolution = searchParams.get('resolution') || '1080p';
    const urlFrameRate = searchParams.get('framerate') || '30';
    const urlHours = parseInt(searchParams.get('hours') || '1');
    const urlMinutes = parseInt(searchParams.get('minutes') || '0');
    const urlSeconds = parseInt(searchParams.get('seconds') || '0');

    console.log('URL Parameters:', {
      category: urlCategory,
      codec: urlCodec,
      variant: urlVariant,
      resolution: urlResolution,
      frameRate: urlFrameRate
    });

    // Validate that the URL parameters correspond to actual data
    let validCategory = '';
    let validCodec = '';
    let validVariant = '';

    if (urlCategory) {
      const category = categories.find(cat => cat.id === urlCategory);
      if (category) {
        validCategory = urlCategory;
        console.log('Found valid category:', category.name);
        
        if (urlCodec) {
          const codec = category.codecs.find(c => c.id === urlCodec);
          if (codec) {
            validCodec = urlCodec;
            console.log('Found valid codec:', codec.name);
            
            if (urlVariant) {
              const variant = codec.variants.find(v => v.name === urlVariant);
              if (variant) {
                validVariant = urlVariant;
                console.log('Found valid variant:', variant.name);
              } else {
                console.log('Variant not found:', urlVariant, 'Available variants:', codec.variants.map(v => v.name));
              }
            }
          } else {
            console.log('Codec not found:', urlCodec, 'Available codecs:', category.codecs.map(c => c.id));
          }
        }
      } else {
        console.log('Category not found:', urlCategory, 'Available categories:', categories.map(c => c.id));
      }
    }

    // Validate resolution and frame rate
    const validResolution = resolutions.find(r => r.id === urlResolution) ? urlResolution : '1080p';
    const validFrameRate = frameRates.find(fr => fr.id === urlFrameRate) ? urlFrameRate : '30';

    console.log('Setting validated values:', {
      category: validCategory,
      codec: validCodec,
      variant: validVariant,
      resolution: validResolution,
      frameRate: validFrameRate
    });

    // Set the validated values
    setSelectedCategory(validCategory);
    setSelectedCodec(validCodec);
    setSelectedVariant(validVariant);
    setSelectedResolution(validResolution);
    setSelectedFrameRate(validFrameRate);
    setDuration({
      hours: Math.max(0, urlHours),
      minutes: Math.max(0, Math.min(59, urlMinutes)),
      seconds: Math.max(0, Math.min(59, urlSeconds))
    });

    setIsInitialized(true);
  }, [categories, searchParams]);

  // Update URL when parameters change (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCodec) params.set('codec', selectedCodec);
    if (selectedVariant) params.set('variant', selectedVariant);
    if (selectedResolution) params.set('resolution', selectedResolution);
    if (selectedFrameRate) params.set('framerate', selectedFrameRate);
    params.set('hours', duration.hours.toString());
    params.set('minutes', duration.minutes.toString());
    params.set('seconds', duration.seconds.toString());
    
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedCodec, selectedVariant, selectedResolution, selectedFrameRate, duration, setSearchParams, isInitialized]);

  // Get available codecs for selected category
  const availableCodecs = selectedCategory 
    ? categories.find(cat => cat.id === selectedCategory)?.codecs || []
    : [];

  // Get available variants for selected codec
  const availableVariants = selectedCodec
    ? availableCodecs.find(codec => codec.id === selectedCodec)?.variants || []
    : [];

  // Reset dependent selections when parent changes
  useEffect(() => {
    if (!isInitialized) return;
    
    if (selectedCategory && !availableCodecs.find(codec => codec.id === selectedCodec)) {
      setSelectedCodec('');
      setSelectedVariant('');
    }
  }, [selectedCategory, availableCodecs, selectedCodec, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (selectedCodec && !availableVariants.find(variant => variant.name === selectedVariant)) {
      setSelectedVariant('');
    }
  }, [selectedCodec, availableVariants, selectedVariant, isInitialized]);

  const copyShareLink = async () => {
    try {
      const shareUrl = generateShareableLink(
        selectedCategory,
        selectedCodec,
        selectedVariant,
        selectedResolution,
        selectedFrameRate,
        duration
      );
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Track share link generation
      googleAnalytics.trackShareLink();
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const applyPreset = (preset: any) => {
    setSelectedCategory(preset.category);
    setSelectedCodec(preset.codec);
    setSelectedVariant(preset.variant);
    setSelectedResolution(preset.resolution);
    setSelectedFrameRate(preset.frameRate);
    
    // Track preset usage
    googleAnalytics.trackPresetUsage(preset.name);
  };

  const handlePresetUpdate = (index: number, preset: any) => {
    updatePreset(index, preset);
  };

  const handleAddPreset = () => {
    if (!selectedCategory || !selectedCodec || !selectedVariant) {
      alert('Please configure a complete codec setup first');
      return;
    }

    const newPreset = {
      id: `preset-${Date.now()}`,
      name: 'New Preset',
      category: selectedCategory,
      codec: selectedCodec,
      variant: selectedVariant,
      resolution: selectedResolution,
      frameRate: selectedFrameRate
    };

    addPreset(newPreset);
  };

  const handleResetPresets = () => {
    if (confirm('Reset all presets to defaults? This cannot be undone.')) {
      resetToDefaults();
    }
  };

  // Calculate results with frame rate support
  const calculateResults = () => {
    if (!selectedCategory || !selectedCodec || !selectedVariant || !selectedResolution) {
      return null;
    }

    const category = categories.find(cat => cat.id === selectedCategory);
    const codec = category?.codecs.find(c => c.id === selectedCodec);
    const variant = codec?.variants.find(v => v.name === selectedVariant);
    const frameRate = frameRates.find(fr => fr.id === selectedFrameRate);
    const resolution = resolutions.find(res => res.id === selectedResolution);

    if (!variant || !frameRate || !resolution) {
      return null;
    }

    // Get bitrate for this resolution and frame rate
    let bitrateMbps: number;
    const resolutionBitrates = variant.bitrates[selectedResolution];
    
    if (!resolutionBitrates) {
      return null;
    }

    if (typeof resolutionBitrates === 'number') {
      // Simple number format (legacy support)
      bitrateMbps = resolutionBitrates;
    } else {
      // Frame rate specific bitrates
      bitrateMbps = resolutionBitrates[selectedFrameRate];
      if (!bitrateMbps) {
        // Try to find closest frame rate or use a default
        const availableFrameRates = Object.keys(resolutionBitrates);
        if (availableFrameRates.length > 0) {
          bitrateMbps = resolutionBitrates[availableFrameRates[0]];
        } else {
          return null;
        }
      }
    }

    const totalSeconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
    const fileSizeMB = (bitrateMbps * totalSeconds) / 8; // Convert bits to bytes
    const fileSizeGB = fileSizeMB / 1024;
    const fileSizeTB = fileSizeGB / 1024;

    return {
      bitrateMbps,
      fileSizeMB,
      fileSizeGB,
      fileSizeTB,
      totalSeconds,
      codec: codec!,
      variant: variant,
      resolution: resolution,
      frameRate: frameRate!,
      category: selectedCategory // Include category in results
    };
  };

  const results = calculateResults();

  // Track analytics only when a complete, valid result is displayed
  useEffect(() => {
    if (!results || !isInitialized) return;

    // Create a unique identifier for this calculation
    const calculationId = `${selectedCategory}-${selectedCodec}-${selectedVariant}-${selectedResolution}-${selectedFrameRate}-${duration.hours}-${duration.minutes}-${duration.seconds}`;
    
    // Only track if this is a new calculation (different from the last one tracked)
    if (calculationId !== lastTrackedCalculation) {
      console.log('Tracking new calculation:', calculationId);
      
      // Track this calculation for analytics (both local and centralized)
      centralizedAnalytics.trackCalculation(selectedCategory, selectedCodec, selectedVariant, selectedResolution, selectedFrameRate);
      googleAnalytics.trackCalculation(selectedCategory, selectedCodec, selectedVariant, selectedResolution, selectedFrameRate);
      
      // Update the last tracked calculation
      setLastTrackedCalculation(calculationId);
    }
  }, [results, selectedCategory, selectedCodec, selectedVariant, selectedResolution, selectedFrameRate, duration, isInitialized, lastTrackedCalculation]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  // Don't render the main interface until we've processed URL parameters
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary relative">
      {/* Header */}
      <header className="border-b border-gray-800 bg-dark-secondary/50 backdrop-blur-sm relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Film className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              <h1 className="text-lg sm:text-xl font-semibold text-white">
                <span className="hidden sm:inline">Video File Size Calculator</span>
                <span className="sm:hidden">VideoCalc</span>
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={copyShareLink}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-secondary hover:bg-gray-700 transition-colors"
                title="Copy share link"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Share2 className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-300">{copied ? 'Copied!' : 'Share'}</span>
              </button>
              <Link
                to="/codec-data"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-secondary hover:bg-gray-700 transition-colors"
                title="Browse Codec Database"
                onClick={() => googleAnalytics.trackCodecDatabaseView()}
              >
                <Database className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Database</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-secondary hover:bg-gray-700 transition-colors"
                title="About"
              >
                <Info className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">About</span>
              </Link>
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-secondary hover:bg-gray-700 transition-colors"
                title="Admin Panel"
              >
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Admin</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="p-2 rounded-lg bg-dark-secondary hover:bg-gray-700 transition-colors"
                title="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-400" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div 
              className="md:hidden absolute top-full left-0 right-0 bg-dark-secondary border-b border-gray-800 shadow-lg z-40"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 space-y-2">
                <button
                  onClick={() => {
                    copyShareLink();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-dark-primary transition-colors text-left"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <Share2 className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-gray-300">{copied ? 'Link Copied!' : 'Share Calculation'}</span>
                </button>
                
                <Link
                  to="/codec-data"
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-dark-primary transition-colors"
                  onClick={() => {
                    googleAnalytics.trackCodecDatabaseView();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Database className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">Codec Database</span>
                </Link>
                
                <Link
                  to="/about"
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-dark-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">About</span>
                </Link>
                
                <Link
                  to="/admin"
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-dark-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">Admin Panel</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 border-b border-gray-800">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              <span className="block sm:inline">Video File Size</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
                Calculator
              </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Professional-grade file size estimation for video production workflows. 
              Calculate storage requirements for any codec, resolution, and duration.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Professional Codecs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>RAW & Cinema Formats</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span>Broadcast Standards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        {/* Workflow Presets - Prominent Section */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mr-2 sm:mr-3" />
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Quick Start Presets</h2>
                  <p className="text-gray-300 text-xs sm:text-sm mt-1">
                    Customize your favorite workflow configurations
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {customPresets.length < 8 && (
                  <button
                    onClick={handleAddPreset}
                    disabled={!selectedCategory || !selectedCodec || !selectedVariant}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-xs sm:text-sm transition-colors"
                    title="Add current configuration as preset"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Add Preset</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                )}
                <button
                  onClick={handleResetPresets}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-xs sm:text-sm transition-colors"
                  title="Reset to defaults"
                >
                  <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {customPresets.map((preset, index) => {
                const isActive = selectedCategory === preset.category && 
                                selectedCodec === preset.codec && 
                                selectedVariant === preset.variant && 
                                selectedResolution === preset.resolution &&
                                selectedFrameRate === preset.frameRate;
                
                return (
                  <EditablePresetCard
                    key={preset.id}
                    preset={preset}
                    isActive={isActive}
                    onApply={() => applyPreset(preset)}
                    onUpdate={(updatedPreset) => handlePresetUpdate(index, updatedPreset)}
                    canDelete={customPresets.length > 4}
                    onDelete={() => {
                      if (confirm('Delete this preset?')) {
                        const { deletePreset } = require('../context/PresetContext');
                        // This would be handled by the context
                      }
                    }}
                  />
                );
              })}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Your presets are saved locally in your browser
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Input Panel */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-dark-secondary rounded-xl p-4 sm:p-6 shadow-lg hover-lift">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center">
                <Film className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-400" />
                Codec Settings
              </h2>
              
              <div className="space-y-4">
                <CustomSelect
                  label="Codec Category"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories.map(cat => ({ value: cat.id, label: cat.name, description: cat.description }))}
                  placeholder="Select category..."
                />

                <CustomSelect
                  label="Video Codec"
                  value={selectedCodec}
                  onChange={setSelectedCodec}
                  options={availableCodecs.map(codec => ({ 
                    value: codec.id, 
                    label: codec.name, 
                    description: codec.description 
                  }))}
                  placeholder="Select codec..."
                  disabled={!selectedCategory}
                />

                <CustomSelect
                  label="Codec Variant"
                  value={selectedVariant}
                  onChange={setSelectedVariant}
                  options={availableVariants.map(variant => ({ 
                    value: variant.name, 
                    label: variant.name, 
                    description: variant.description 
                  }))}
                  placeholder="Select variant..."
                  disabled={!selectedCodec}
                />
              </div>
            </div>

            <div className="bg-dark-secondary rounded-xl p-4 sm:p-6 shadow-lg hover-lift">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center">
                <HardDrive className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-400" />
                Video Specifications
              </h2>
              
              <div className="space-y-4">
                <CustomSelect
                  label="Resolution"
                  value={selectedResolution}
                  onChange={setSelectedResolution}
                  options={resolutions.map(res => ({ 
                    value: res.id, 
                    label: res.name, 
                    description: `${res.category} - ${res.width}×${res.height}` 
                  }))}
                  placeholder="Select resolution..."
                />

                <CustomSelect
                  label="Frame Rate"
                  value={selectedFrameRate}
                  onChange={setSelectedFrameRate}
                  options={frameRates.map(fr => ({ 
                    value: fr.id, 
                    label: fr.name, 
                    description: fr.category 
                  }))}
                  placeholder="Select frame rate..."
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:sticky lg:top-8">
            <ResultsPanel 
              results={results} 
              duration={duration}
              onDurationChange={setDuration}
            />
          </div>
        </div>

        {/* Usage Analytics Section */}
        <div className="mt-8 sm:mt-12">
          <UsageAnalytics />
        </div>
      </main>

      {/* Built with Bolt Badge - Footer */}
      <footer className="border-t border-gray-800 bg-dark-secondary/30 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-gray-400 text-sm">
                © 2025 Time Lapse Technologies LLC. Supported by{' '}
                <a 
                  href="https://mediasupplychain.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  mediasupplychain.org
                </a>
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Free forever for the media industry
              </p>
            </div>
            
            {/* Built with Bolt Badge */}
            <div className="flex items-center space-x-4">
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg hover:from-purple-600/30 hover:to-blue-600/30 hover:border-purple-400/50 transition-all duration-200 hover:scale-105"
                title="Built with Bolt - AI-powered web development"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-blue-400 rounded flex items-center justify-center">
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-3 h-3 text-white fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13 0L0 13l7 7 13-13L13 0zm-1 6l4 4-4 4-4-4 4-4z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    Built with Bolt
                  </span>
                </div>
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-gray-300 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Calculator;