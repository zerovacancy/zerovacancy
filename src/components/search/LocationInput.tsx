
import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationSuggestions } from './LocationSuggestions';
import { filterLocations } from '@/utils/locationData';
import { useIsMobile } from '@/hooks/use-mobile';

interface LocationInputProps {
  value: string;
  onLocationSelect: (location: string) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({ value, onLocationSelect }) => {
  const [suggestions, setSuggestions] = useState({ cities: [], zipCodes: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout>();
  const isMobile = useIsMobile();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setActiveIndex(-1);
    setIsLoading(true);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      if (newValue.length >= 2) {
        const filtered = filterLocations(newValue);
        setSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setSuggestions({ cities: [], zipCodes: [] });
        setShowSuggestions(false);
      }
      setIsLoading(false);
    }, 200); // Reduced debounce time for faster response
  };

  const handleSuggestionClick = (suggestion: { city: string; state: string }) => {
    const newValue = `${suggestion.city}, ${suggestion.state}`;
    setInputValue(newValue);
    onLocationSelect(newValue);
    setSuggestions({ cities: [], zipCodes: [] });
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalSuggestions = [...suggestions.cities, ...suggestions.zipCodes];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < totalSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && totalSuggestions[activeIndex]) {
          handleSuggestionClick(totalSuggestions[activeIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const clearLocation = () => {
    setInputValue('');
    onLocationSelect('');
    setSuggestions({ cities: [], zipCodes: [] });
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't hide suggestions if clicking within the input field itself
      const inputElement = document.querySelector('input[aria-label="Location search"]');
      if (inputElement && inputElement.contains(event.target as Node)) {
        return;
      }
      
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  return (
    <div className={cn(
      "w-full sm:w-[40%] relative group", 
      "z-50"
    )} style={{ position: 'relative', zIndex: 50 }}>
      <MapPin className={cn(
        "w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2",
        "transition-all duration-200",
        "group-hover:text-indigo-500"
      )} />
      <input
        ref={inputRef}
        type="text"
        placeholder={isMobile ? "Enter location or creator specialty" : "Enter city or zip code"}
        value={inputValue}
        onChange={handleLocationChange}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (inputValue.length >= 2) {
            setShowSuggestions(true);
          }
        }}
        onFocus={() => {
          if (inputValue.length >= 2) {
            // Show suggestions when input is focused if text is already entered
            const filtered = filterLocations(inputValue);
            setSuggestions(filtered);
            setShowSuggestions(true);
          }
        }}
        className={cn(
          "w-full h-12 sm:h-12 pl-11 pr-10", 
          "bg-white text-sm text-gray-700",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 group-hover:bg-gray-50/80",
          "border-0",
          isMobile && "rounded-none", // No rounded corners on mobile (middle element)
          "placeholder:text-gray-400",
          "font-medium"
        )}
        aria-label="Location search"
        aria-expanded={showSuggestions}
        role="combobox"
        aria-controls="location-suggestions"
        aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
      />
      {inputValue && (
        <button
          onClick={clearLocation}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600",
            "transition-all duration-200",
            "rounded-full p-1.5 hover:bg-gray-100" // Increased padding for touch
          )}
          aria-label="Clear location"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {showSuggestions && (
        <LocationSuggestions
          suggestions={suggestions}
          searchTerm={inputValue}
          activeIndex={activeIndex}
          onSelect={handleSuggestionClick}
          suggestionsRef={suggestionsRef}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
