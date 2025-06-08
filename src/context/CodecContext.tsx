import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultCodecData } from '../data/codecData';

export interface CodecVariant {
  name: string;
  bitrates: {
    [resolution: string]: {
      [frameRate: string]: number; // Mbps for specific frame rate
    } | number; // Fallback for simple number format
  };
  description?: string;
}

export interface Codec {
  id: string;
  name: string;
  variants: CodecVariant[];
  description?: string;
  workflowNotes?: string;
}

export interface CodecCategory {
  id: string;
  name: string;
  codecs: Codec[];
  description?: string;
}

interface CodecContextType {
  categories: CodecCategory[];
  updateCategories: (categories: CodecCategory[]) => void;
  resetToDefaults: () => void;
}

const CodecContext = createContext<CodecContextType | undefined>(undefined);

export const CodecProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<CodecCategory[]>([]);

  useEffect(() => {
    // Load codec data from localStorage or use defaults
    const savedData = localStorage.getItem('codecData');
    if (savedData) {
      try {
        setCategories(JSON.parse(savedData));
      } catch {
        setCategories(defaultCodecData);
      }
    } else {
      setCategories(defaultCodecData);
    }
  }, []);

  const updateCategories = (newCategories: CodecCategory[]) => {
    setCategories(newCategories);
    localStorage.setItem('codecData', JSON.stringify(newCategories));
  };

  const resetToDefaults = () => {
    setCategories(defaultCodecData);
    localStorage.setItem('codecData', JSON.stringify(defaultCodecData));
  };

  return (
    <CodecContext.Provider value={{ categories, updateCategories, resetToDefaults }}>
      {children}
    </CodecContext.Provider>
  );
};

export const useCodecContext = () => {
  const context = useContext(CodecContext);
  if (!context) {
    throw new Error('useCodecContext must be used within CodecProvider');
  }
  return context;
};