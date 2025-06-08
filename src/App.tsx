import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calculator from './components/Calculator';
import Admin from './components/Admin';
import About from './components/About';
import CodecData from './components/CodecData';
import PrivacyPolicy from './components/PrivacyPolicy';
import { CodecProvider } from './context/CodecContext';
import { AuthProvider } from './context/AuthContext';
import { PresetProvider } from './context/PresetContext';
import { usePageTracking } from './hooks/usePageTracking';
import './App.css';

// Component to handle page tracking
const AppWithTracking: React.FC = () => {
  usePageTracking();
  
  return (
    <div className="min-h-screen bg-dark-primary text-white">
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/codec-data" element={<CodecData />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CodecProvider>
        <PresetProvider>
          <Router>
            <AppWithTracking />
          </Router>
        </PresetProvider>
      </CodecProvider>
    </AuthProvider>
  );
}

export default App;