import React from 'react';
import { Clock } from 'lucide-react';
import type {  HourlyForecast as HourlyType  } from '../types/weather';
import { formatHour } from '../utils/date';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemperature, formatPercentage } from '../utils/formatters';

interface HourlyForecastProps {
  hourly: HourlyType;
  timezone: string;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, timezone }) => {
  // Find current hour
  const now = new Date();
  
  // Open-Meteo time is ISO 8601, find the closest index to current time
  // Or just take the first 24 hours starting from current or nearest future
  
  const currentHourIndex = hourly.time.findIndex(timeStr => {
    const time = new Date(timeStr);
    return time.getTime() > now.getTime() - 60 * 60 * 1000; // An hour ago and later
  });
  
  const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0;
  const next24Hours = hourly.time.slice(startIndex, startIndex + 24);

  return (
    <div className="glass-panel rounded-3xl p-5 md:p-6 text-white w-full overflow-hidden">
      <div className="flex items-center gap-2 text-white/70 font-medium text-sm mb-4 border-b border-white/10 pb-4">
        <Clock size={16} />
        <span className="uppercase tracking-wider text-xs">Hourly Forecast</span>
      </div>

      <div className="relative w-full">
        <div 
          className="flex overflow-x-auto pb-4 gap-6 custom-scrollbar snap-x"
          style={{ 
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
          }}
        >
          {next24Hours.map((time, idx) => {
          const dataIndex = startIndex + idx;
          const temp = hourly.temperature_2m[dataIndex];
          const weatherCode = hourly.weather_code[dataIndex];
          const precipProb = hourly.precipitation_probability[dataIndex];
          // Open-Meteo hourly doesn't return is_day directly, can be determined by time
          // For simplicity, pass 1 (day), can be improved in the future
          const weatherInfo = getWeatherInfo(weatherCode, 1); 
          const Icon = weatherInfo.icon;
          
          // First element is "Now"
          const displayTime = idx === 0 ? 'Now' : formatHour(time, timezone);

          return (
            <div key={time} className="flex flex-col items-center gap-3 min-w-[60px] snap-center">
              <span className="text-sm font-medium text-white/90">
                {displayTime}
              </span>
              
              <div className="flex flex-col items-center justify-center h-12">
                <Icon size={26} className="drop-shadow-md text-white" />
                {precipProb >= 10 && (
                  <span className="text-[10px] text-blue-300 font-bold mt-1">
                    {formatPercentage(precipProb)}
                  </span>
                )}
              </div>
              
              <span className="text-lg font-semibold">
                {formatTemperature(temp)}
              </span>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};
