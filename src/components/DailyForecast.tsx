import React from 'react';
import { Calendar } from 'lucide-react';
import type {  DailyForecast as DailyType  } from '../types/weather';
import { getRelativeDayName } from '../utils/date';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemperature, formatPercentage } from '../utils/formatters';

interface DailyForecastProps {
  daily: DailyType;
  timezone: string;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ daily, timezone }) => {
  // We need to show 10 days, Open-Meteo might return more or less, 
  // but we take up to 10 days
  const days = daily.time.slice(0, 10);
  
  // For rendering the temperature progress bar
  const allMin = Math.min(...daily.temperature_2m_min.slice(0, 10));
  const allMax = Math.max(...daily.temperature_2m_max.slice(0, 10));
  const tempRange = allMax - allMin;

  return (
    <div className="glass-panel rounded-3xl p-5 md:p-6 text-white w-full">
      <div className="flex items-center gap-2 text-white/70 font-medium text-sm mb-6 border-b border-white/10 pb-4">
        <Calendar size={16} />
        <span className="uppercase tracking-wider text-xs">10-Day Forecast</span>
      </div>

      <div className="flex flex-col gap-4">
        {days.map((time, index) => {
          const minTemp = daily.temperature_2m_min[index];
          const maxTemp = daily.temperature_2m_max[index];
          const weatherCode = daily.weather_code[index];
          const precipProb = daily.precipitation_probability_max[index];
          const weatherInfo = getWeatherInfo(weatherCode, 1); // Day icon for general forecast
          const Icon = weatherInfo.icon;
          
          // Calculate positions for temperature bar
          const leftPercent = ((minTemp - allMin) / tempRange) * 100;
          const widthPercent = ((maxTemp - minTemp) / tempRange) * 100;

          return (
            <div key={time} className="flex items-center justify-between group">
              <div className="w-24 text-lg font-medium text-white/90">
                {getRelativeDayName(time, timezone)}
              </div>
              
              <div className="flex flex-col items-center justify-center w-16">
                <Icon size={24} className="mb-1 drop-shadow-md" />
                {precipProb >= 20 && (
                  <span className="text-[10px] text-blue-300 font-bold">
                    {formatPercentage(precipProb)}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 flex-1 ml-4">
                <span className="text-white/60 font-medium w-8 text-right">
                  {formatTemperature(minTemp)}
                </span>
                
                <div className="flex-1 max-w-[100px] h-1.5 bg-black/20 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400 opacity-80"
                    style={{ 
                      left: `${leftPercent}%`, 
                      width: `${widthPercent}%` 
                    }}
                  />
                </div>
                
                <span className="text-white font-medium w-8 text-right">
                  {formatTemperature(maxTemp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
