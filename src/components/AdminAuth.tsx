import React, { useState, useEffect } from 'react';
import { Shield, LogIn, AlertCircle } from 'lucide-react';

interface AdminAuthProps {
  onAuthSuccess: () => void;
}

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Google OAuth configuration - prioritize Netlify env vars
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(email => email.trim()).filter(Boolean);

  // Debug environment variables (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Environment check:', {
        hasGoogleClientId: !!GOOGLE_CLIENT_ID,
        adminEmailsCount: ADMIN_EMAILS.length,
        mode: import.meta.env.MODE,
        // Don't log actual values for security
      });
    }
  }, [GOOGLE_CLIENT_ID, ADMIN_EMAILS]);

  useEffect(() => {
    // Initialize Google Sign-In when component mounts
    const initializeGoogle = () => {
      if (window.google && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setIsGoogleLoaded(true);
      }
    };

    // Check if Google is already loaded
    if (window.google) {
      initializeGoogle();
    } else {
      // Wait for Google to load
      const checkGoogle = setInterval(() => {
        if (window.google) {
          initializeGoogle();
          clearInterval(checkGoogle);
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogle), 10000);
    }
  }, [GOOGLE_CLIENT_ID]);

  const handleCredentialResponse = async (response: any) => {
    setIsLoading(true);
    setError('');

    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData: GoogleUser = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };

      // Check if user email is in the admin list
      if (ADMIN_EMAILS.length === 0) {
        setError('Admin emails not configured. Please contact the system administrator.');
        setIsLoading(false);
        return;
      }

      if (!ADMIN_EMAILS.includes(userData.email)) {
        setError(`Access denied. Your email (${userData.email}) is not authorized for admin access.`);
        setIsLoading(false);
        return;
      }

      // Store admin session
      sessionStorage.setItem('adminAuth', JSON.stringify(userData));
      onAuthSuccess();
      
    } catch (error) {
      console.error('Error handling credential response:', error);
      setError('Authentication error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!isGoogleLoaded || !GOOGLE_CLIENT_ID) {
      setError('Google Sign-In not properly configured. Please check your environment variables.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Prompt for Google Sign-In
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to popup if prompt is not displayed
          window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'openid email profile',
            callback: (response: any) => {
              if (response.access_token) {
                // Fetch user info using the access token
                fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`)
                  .then(res => res.json())
                  .then(userInfo => {
                    const userData: GoogleUser = {
                      id: userInfo.id,
                      name: userInfo.name,
                      email: userInfo.email,
                      picture: userInfo.picture,
                    };

                    // Check admin authorization
                    if (ADMIN_EMAILS.length === 0) {
                      setError('Admin emails not configured. Please contact the system administrator.');
                      setIsLoading(false);
                      return;
                    }

                    if (!ADMIN_EMAILS.includes(userData.email)) {
                      setError(`Access denied. Your email (${userData.email}) is not authorized for admin access.`);
                      setIsLoading(false);
                      return;
                    }

                    // Store admin session
                    sessionStorage.setItem('adminAuth', JSON.stringify(userData));
                    onAuthSuccess();
                  })
                  .catch(err => {
                    console.error('Error fetching user info:', err);
                    setError('Failed to get user information. Please try again.');
                    setIsLoading(false);
                  });
              } else {
                setError('Failed to get access token. Please try again.');
                setIsLoading(false);
              }
            },
          }).requestAccessToken();
        } else {
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Sign in failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-dark-secondary rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Configuration Error</h1>
              <p className="text-gray-400">Google OAuth is not properly configured</p>
            </div>
            <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <div>
                  <p className="text-red-400 font-medium">Missing Configuration</p>
                  <div className="text-red-300 text-sm mt-1">
                    <p>Environment variables needed:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li><code>VITE_GOOGLE_CLIENT_ID</code> - Your Google OAuth Client ID</li>
                      <li><code>VITE_ADMIN_EMAILS</code> - Comma-separated admin emails</li>
                    </ul>
                    <p className="mt-2">
                      <strong>For Netlify:</strong> Set these in your site's Environment Variables section.
                    </p>
                    <p className="mt-1">
                      <strong>For local development:</strong> Add them to your .env file.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-dark-secondary rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400">Sign in with your authorized Google account</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-600/10 border border-red-600/20 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium">Authentication Error</p>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={isLoading || !isGoogleLoaded}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full spin"></div>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <h3 className="text-blue-400 font-medium mb-2">Admin Access Requirements</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Must use an authorized Google account</li>
              <li>• Contact system administrator to add your email</li>
              <li>• Access is logged and monitored</li>
            </ul>
          </div>

          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
              <p className="text-yellow-400 text-xs">
                <strong>Development Mode:</strong> Environment variables are loaded from .env file
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
}