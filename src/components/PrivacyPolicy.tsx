import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database, Globe, Mail, Calendar, Users, Menu, X } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-dark-primary relative">
      {/* Header */}
      <header className="border-b border-gray-800 bg-dark-secondary/50 backdrop-blur-sm relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/about"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Back to About</span>
              </Link>
            </div>
            
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
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-secondary hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm text-gray-300">Calculator</span>
              </Link>
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-secondary hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm text-gray-300">Admin</span>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden absolute top-full left-0 right-0 bg-dark-secondary border-b border-gray-800 shadow-lg z-40">
              <div className="px-4 py-3 space-y-2">
                <Link
                  to="/"
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-dark-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-gray-300">Calculator</span>
                </Link>
                <Link
                  to="/admin"
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-dark-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
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
              Privacy
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
                Policy
              </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your privacy matters to us. Learn how we protect your data and respect your privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Last Updated */}
          <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4 sm:p-6">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-400 font-medium">Last Updated</span>
            </div>
            <p className="text-gray-300">July 2025</p>
          </div>

          {/* Overview */}
          <div className="bg-dark-secondary rounded-xl p-6 sm:p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-green-400 mr-3" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Our Commitment to Privacy</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Time Lapse Technologies LLC ("we," "our," or "us") operates the Video File Size Calculator. 
                This privacy policy explains how we collect, use, and protect information when you use our service.
              </p>
              <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-green-400 font-semibold">No Personal Information Required</span>
                </div>
                <p className="text-green-300 mt-2">
                  You can use our calculator completely anonymously. We do not require registration, 
                  login, or any personal information to access our services.
                </p>
              </div>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="bg-dark-secondary rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
              <Database className="h-6 w-6 text-blue-400 mr-3" />
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Anonymous Usage Analytics</h3>
                <p className="text-gray-300 mb-3">
                  We collect anonymous information about how our calculator is used to improve the service:
                </p>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Which codec configurations are calculated (e.g., "H.264 High Profile at 1080p")</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Frequency of different calculations to show popular configurations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>General usage patterns to improve the user interface</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Page views and navigation patterns</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Google Analytics</h3>
                <p className="text-gray-300 mb-3">
                  We use Google Analytics to understand how our site is used. Google Analytics may collect:
                </p>
                <ul className="text-gray-300 space-y-2 ml-6">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Browser type and version</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Operating system</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Screen resolution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>General geographic location (country/region level)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Pages visited and time spent on site</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Local Storage</h3>
                <p className="text-gray-300">
                  We store your custom presets and preferences locally in your browser. This data never leaves your device 
                  and is only used to enhance your experience by remembering your preferred settings.
                </p>
              </div>
            </div>
          </div>

          {/* What We Don't Collect */}
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
              <Eye className="h-6 w-6 text-red-400 mr-3" />
              What We Don't Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white">Names or email addresses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white">IP addresses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white">Personal identifiers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white">Account information</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white">Financial information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white">Specific file details</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white">Project information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-white">Cookies for tracking</span>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Information */}
          <div className="bg-dark-secondary rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">How We Use Information</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Improve Our Service</h3>
                  <p className="text-gray-400 text-sm">
                    Understanding which codecs are most popular helps us prioritize database updates and feature development.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Display Community Statistics</h3>
                  <p className="text-gray-400 text-sm">
                    We show aggregated usage statistics to help users see what configurations are popular in the community.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-medium">Technical Improvements</h3>
                  <p className="text-gray-400 text-sm">
                    Analytics help us identify performance issues and optimize the user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="bg-dark-secondary rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Data Sharing and Third Parties</h2>
            <div className="space-y-4">
              <p className="text-gray-300">
                We do not sell, trade, or otherwise transfer your information to third parties, except as described below:
              </p>
              <div className="bg-dark-primary rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Google Analytics</h3>
                <p className="text-gray-400 text-sm">
                  Anonymous usage data is processed by Google Analytics according to their privacy policy. 
                  You can opt out of Google Analytics tracking using browser extensions or settings.
                </p>
              </div>
              <div className="bg-dark-primary rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Hosting Provider</h3>
                <p className="text-gray-400 text-sm">
                  Our website is hosted on Netlify, which may have access to standard web server logs 
                  as part of providing hosting services.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-dark-secondary rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
              <Globe className="h-6 w-6 text-green-400 mr-3" />
              Your Rights and Choices
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Browser Settings</h3>
                <p className="text-gray-300 text-sm">
                  You can disable JavaScript or use private browsing mode to prevent analytics collection, 
                  though this may limit some functionality.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Google Analytics Opt-Out</h3>
                <p className="text-gray-300 text-sm">
                  You can install the{' '}
                  <a 
                    href="https://tools.google.com/dlpage/gaoptout" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>{' '}
                  to prevent your data from being used by Google Analytics.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Local Data</h3>
                <p className="text-gray-300 text-sm">
                  You can clear your browser's local storage at any time to remove any saved preferences or presets.
                </p>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-dark-secondary rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate security measures to protect the limited data we collect:
            </p>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>All data transmission is encrypted using HTTPS</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Analytics data is anonymized and aggregated</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>No sensitive personal information is collected or stored</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Regular security updates and monitoring</span>
              </li>
            </ul>
          </div>

          {/* Changes to Policy */}
          <div className="bg-dark-secondary rounded-xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Changes to This Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update this privacy policy from time to time. When we do, we will:
            </p>
            <ul className="text-gray-300 space-y-2 mb-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Update the "Last Updated" date at the top of this policy</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Post the updated policy on this page</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Continue to protect your privacy according to these principles</span>
              </li>
            </ul>
            <p className="text-gray-300">
              Your continued use of the service after any changes constitutes acceptance of the updated policy.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 sm:p-8 shadow-lg">
            <div className="flex items-center mb-4 sm:mb-6">
              <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mr-3 sm:mr-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Us</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4 sm:mb-6">
              If you have any questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="space-y-4">
              <div className="bg-dark-primary rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Time Lapse Technologies LLC</h3>
                <p className="text-gray-300 text-sm">
                  Email: <a href="mailto:privacy@mediasupplychain.org" className="text-blue-400 hover:text-blue-300 underline">privacy@mediasupplychain.org</a>
                </p>
                <p className="text-gray-300 text-sm">
                  Website: <a href="https://mediasupplychain.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">mediasupplychain.org</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;