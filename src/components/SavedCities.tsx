import React from 'react';
import type {  City  } from '../types/city';
import { MapPin, X, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface SavedCitiesProps {
  cities: City[];
  currentCity: City | null;
  onSelectCity: (city: City) => void;
  onRemoveCity: (cityId: number) => void;
  onGeolocate?: () => void;
  isGeolocating?: boolean;
}

export const SavedCities: React.FC<SavedCitiesProps> = ({
  cities,
  currentCity,
  onSelectCity,
  onRemoveCity,
  onGeolocate,
  isGeolocating = false
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-white/70 font-medium text-sm mb-2 px-2">
        <MapPin size={16} />
        <span className="uppercase tracking-wider text-xs">My Cities</span>
      </div>

      {onGeolocate && (
        <button
          onClick={onGeolocate}
          disabled={isGeolocating}
          className="flex items-center gap-3 w-full p-4 rounded-2xl glass-panel hover:bg-white/40 transition-colors text-left group disabled:opacity-50"
        >
          <div className="bg-blue-500/30 p-2 rounded-full group-hover:bg-blue-500/50 transition-colors">
            <Navigation size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-white text-lg">Current Location</div>
            <div className="text-sm text-white/70">
              {isGeolocating ? 'Determining coordinates...' : 'Weather near you'}
            </div>
          </div>
        </button>
      )}

      {cities.length === 0 ? (
        <div className="text-white/50 text-sm italic px-2">
          No saved cities. Use search.
        </div>
      ) : (
        cities.map((city) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`group relative flex items-center w-full p-4 rounded-2xl cursor-pointer transition-all ${
              currentCity?.id === city.id 
                ? 'bg-white/30 backdrop-blur-md border border-white/40 shadow-lg' 
                : 'glass hover:bg-white/20'
            }`}
            onClick={() => onSelectCity(city)}
          >
            <div className="flex-1 overflow-hidden pr-8">
              <div className="font-medium text-white text-lg truncate">
                {city.name}
              </div>
              <div className="text-sm text-white/70 truncate">
                {city.country} {city.admin1 ? `• ${city.admin1}` : ''}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveCity(city.id);
              }}
              className="absolute right-4 p-2 rounded-full hover:bg-red-500/80 transition-colors opacity-0 group-hover:opacity-100 text-white"
              title="Remove city"
              aria-label={`Remove city ${city.name}`}
            >
              <X size={16} />
            </button>
          </motion.div>
        ))
      )}
    </div>
  );
};
