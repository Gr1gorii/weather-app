import React from 'react';
import type {  CurrentWeather, DailyForecast  } from '../types/weather';
import type {  City  } from '../types/city';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemperature } from '../utils/formatters';
import { motion } from 'framer-motion';

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  daily: DailyForecast;
  city: City;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ 
  current, 
  daily, 
  city 
}) => {
  const weatherInfo = getWeatherInfo(current.weather_code, current.is_day);
  const Icon = weatherInfo.icon;
  
  // Get min and max temperature for today (first element in daily array)
  const todayMin = daily.temperature_2m_min[0];
  const todayMax = daily.temperature_2m_max[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-10 text-white text-center"
    >
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2 drop-shadow-md">
        {city.name}
      </h1>
      
      <div className="flex items-center justify-center gap-4 mb-2">
        <Icon size={48} className="drop-shadow-lg" />
        <span className="text-7xl md:text-8xl font-thin tracking-tighter drop-shadow-lg ml-[-10px]">
          {formatTemperature(current.temperature_2m)}
        </span>
      </div>
      
      <p className="text-xl md:text-2xl font-medium mb-1 drop-shadow-md text-white/90">
        {weatherInfo.description}
      </p>
      
      <div className="flex items-center gap-3 text-lg drop-shadow-md text-white/80">
        <span>H: {formatTemperature(todayMax)}</span>
        <span>L: {formatTemperature(todayMin)}</span>
      </div>
    </motion.div>
  );
};
