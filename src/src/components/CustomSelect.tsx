import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate dropdown position when opening
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = Math.min(300, filteredOptions.length * 60 + 80); // Estimate dropdown height
      
      let top = rect.bottom + window.scrollY + 8;
      
      // On mobile, check if dropdown would go below viewport
      if (isMobile && rect.bottom + dropdownHeight > viewportHeight) {
        // Position above the button instead
        top = rect.top + window.scrollY - dropdownHeight - 8;
        
        // If still not enough space above, center it in viewport
        if (top < window.scrollY + 20) {
          top = window.scrollY + (viewportHeight - dropdownHeight) / 2;
        }
      }
      
      setDropdownPosition({
        top,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        // Check if click is inside the portal dropdown
        const dropdownElement = document.getElementById('dropdown-portal');
        if (!dropdownElement || !dropdownElement.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      }
    };

    const handleScroll = () => {
      if (isOpen && !isMobile) {
        // Only update position on scroll for desktop
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    // Prevent body scroll on mobile when dropdown is open
    const handleTouchMove = (e: TouchEvent) => {
      if (isOpen && isMobile) {
        // Allow scrolling within the dropdown
        const dropdownElement = document.getElementById('dropdown-portal');
        if (dropdownElement && dropdownElement.contains(e.target as Node)) {
          return; // Allow scrolling within dropdown
        }
        e.preventDefault(); // Prevent body scroll
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize);
      
      if (isMobile) {
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        // Prevent zoom on double tap
        document.addEventListener('touchstart', (e) => {
          if (e.touches.length > 1) {
            e.preventDefault();
          }
        }, { passive: false });
      }
      
      updateDropdownPosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (isOpen && searchRef.current && !isMobile) {
      // Only auto-focus search on desktop to prevent mobile keyboard issues
      setTimeout(() => {
        if (searchRef.current) {
          searchRef.current.focus({ preventScroll: true });
        }
      }, 100);
    }
  }, [isOpen, isMobile]);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled) {
      // On mobile, add a small delay to prevent scroll jumping
      if (isMobile) {
        setTimeout(() => {
          setIsOpen(!isOpen);
        }, 50);
      } else {
        setIsOpen(!isOpen);
      }
    }
  };

  // Mobile-optimized dropdown content
  const dropdownContent = isOpen && !disabled && (
    <div
      id="dropdown-portal"
      ref={dropdownRef}
      style={{
        position: 'fixed', // Use fixed positioning on mobile for better control
        top: isMobile ? '50%' : dropdownPosition.top,
        left: isMobile ? '50%' : dropdownPosition.left,
        width: isMobile ? '90vw' : dropdownPosition.width,
        maxWidth: isMobile ? '400px' : 'none',
        transform: isMobile ? 'translate(-50%, -50%)' : 'none',
        zIndex: 10000,
        maxHeight: isMobile ? '70vh' : '300px'
      }}
      className={`bg-dark-secondary border border-gray-700 rounded-lg shadow-2xl overflow-hidden ${
        isMobile ? 'mx-4' : ''
      }`}
      onTouchMove={(e) => e.stopPropagation()} // Prevent touch events from bubbling
    >
      {/* Mobile overlay background */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 -z-10"
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        />
      )}
      
      {/* Search Input */}
      <div className={`p-3 border-b border-gray-700 bg-dark-secondary ${isMobile ? 'sticky top-0' : ''}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-2 bg-dark-primary border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              isMobile ? 'text-base' : 'text-sm'
            }`}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => {
              e.target.setSelectionRange(0, 0);
              // Prevent scroll on mobile
              if (isMobile) {
                e.preventDefault();
              }
            }}
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Options List */}
      <div 
        className={`overflow-y-auto bg-dark-secondary ${
          isMobile ? 'max-h-[50vh]' : 'max-h-48'
        }`}
        style={{
          // Smooth scrolling on mobile
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`
                w-full px-4 py-3 text-left hover:bg-dark-primary transition-colors
                ${value === option.value ? 'bg-blue-600/20 border-r-2 border-blue-500' : ''}
                ${isMobile ? 'py-4 text-base' : 'py-3 text-sm'}
              `}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOptionClick(option.value);
              }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className={`font-medium text-white ${isMobile ? 'text-base' : 'text-sm'}`}>
                {option.label}
              </div>
              {option.description && (
                <div className={`text-gray-400 mt-1 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                  {option.description}
                </div>
              )}
            </button>
          ))
        ) : (
          <div className={`px-4 py-3 text-gray-400 text-center ${isMobile ? 'py-6 text-base' : 'py-3 text-sm'}`}>
            No options found
          </div>
        )}
      </div>
      
      {/* Mobile close button */}
      {isMobile && (
        <div className="p-3 border-t border-gray-700 bg-dark-secondary">
          <button
            onClick={() => {
              setIsOpen(false);
              setSearchTerm('');
            }}
            className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        <button
          ref={buttonRef}
          type="button"
          className={`
            w-full flex items-center justify-between px-4 py-3 text-left bg-dark-primary border border-gray-700 rounded-lg
            transition-all duration-200 ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 active:scale-[0.99]'
            } ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}
            ${isMobile ? 'min-h-[48px]' : ''}
          `}
          onClick={handleButtonClick}
          disabled={disabled}
          onFocus={(e) => {
            if (isMobile) {
              e.preventDefault();
            }
          }}
        >
          <div className="flex-1 min-w-0">
            {selectedOption ? (
              <div>
                <div className={`text-white font-medium ${isMobile ? 'text-base' : 'text-sm'}`}>
                  {selectedOption.label}
                </div>
                {selectedOption.description && (
                  <div className={`text-gray-400 truncate ${isMobile ? 'text-sm' : 'text-xs'}`}>
                    {selectedOption.description}
                  </div>
                )}
              </div>
            ) : (
              <span className={`text-gray-400 ${isMobile ? 'text-base' : 'text-sm'}`}>
                {placeholder}
              </span>
            )}
          </div>
          <ChevronDown 
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} ${
              isMobile ? 'ml-2' : 'ml-1'
            }`} 
          />
        </button>

        {/* Render dropdown in portal to document.body */}
        {typeof document !== 'undefined' && createPortal(
          dropdownContent,
          document.body
        )}
      </div>
    </div>
  );
};

export default CustomSelect;