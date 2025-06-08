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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate dropdown position when opening
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap
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
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      updateDropdownPosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      // Use setTimeout to prevent immediate focus from affecting scroll
      setTimeout(() => {
        if (searchRef.current) {
          searchRef.current.focus({ preventScroll: true });
        }
      }, 0);
    }
  }, [isOpen]);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    e.stopPropagation(); // Stop event bubbling
    
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Dropdown content to be rendered in portal
  const dropdownContent = isOpen && !disabled && (
    <div
      id="dropdown-portal"
      style={{
        position: 'absolute',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 10000,
        maxHeight: '256px'
      }}
      className="bg-dark-secondary border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
      onMouseDown={(e) => e.preventDefault()} // Prevent focus-related scrolling
    >
      {/* Search Input */}
      <div className="p-3 border-b border-gray-700 bg-dark-secondary">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-dark-primary border border-gray-700 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.target.setSelectionRange(0, 0)} // Prevent text selection scroll
          />
        </div>
      </div>

      {/* Options List */}
      <div className="max-h-48 overflow-y-auto bg-dark-secondary">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`
                w-full px-4 py-3 text-left hover:bg-dark-primary transition-colors
                ${value === option.value ? 'bg-blue-600/20 border-r-2 border-blue-500' : ''}
              `}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOptionClick(option.value);
              }}
              onMouseDown={(e) => e.preventDefault()} // Prevent focus-related scrolling
            >
              <div className="font-medium text-white">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-400 mt-1">{option.description}</div>
              )}
            </button>
          ))
        ) : (
          <div className="px-4 py-3 text-gray-400 text-center">
            No options found
          </div>
        )}
      </div>
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
              : 'hover:border-blue-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            } ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : ''}
          `}
          onClick={handleButtonClick}
          disabled={disabled}
          onFocus={(e) => e.preventDefault()} // Prevent focus scroll
        >
          <div className="flex-1 min-w-0">
            {selectedOption ? (
              <div>
                <div className="text-white font-medium">{selectedOption.label}</div>
                {selectedOption.description && (
                  <div className="text-sm text-gray-400 truncate">{selectedOption.description}</div>
                )}
              </div>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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