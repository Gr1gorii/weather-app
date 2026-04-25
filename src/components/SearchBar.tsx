import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MapPin } from 'lucide-react';
import { searchCities } from '../api/geocodingApi';
import type {  City  } from '../types/city';

interface SearchBarProps {
  onSelectCity: (city: City) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close on click outside component
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const data = await searchCities(query);
        setResults(data);
        setIsOpen(true);
      } catch {
        setError('Failed to perform search');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCities();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSelect = (city: City) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md z-50" ref={containerRef}>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 size={18} className="text-white/60 animate-spin" />
          ) : (
            <Search size={18} className="text-white/60" />
          )}
        </div>
        
        <input
          type="text"
          aria-label="Search city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="block w-full pl-11 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all shadow-lg"
          placeholder="Search city..."
        />
        
        {query && (
          <button 
            aria-label="Clear search"
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown list */}
      {isOpen && (query.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto">
          {error ? (
            <div className="p-4 text-center text-red-300 text-sm">{error}</div>
          ) : results.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-white/70 text-sm">No results found</div>
          ) : (
            <ul className="py-2">
              {results.map((city) => (
                <li key={city.id}>
                  <button
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 text-white"
                  >
                    <MapPin size={18} className="text-white/50 flex-shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium truncate">{city.name}</div>
                      <div className="text-xs text-white/60 truncate">
                        {city.country} {city.admin1 ? `• ${city.admin1}` : ''}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
