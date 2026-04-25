import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { HourlyForecast as HourlyType } from '../types/weather';
import { formatHour } from '../utils/date';
import { formatTemperature, formatWindSpeed, formatPercentage } from '../utils/formatters';
import { LineChart, Wind, Droplets } from 'lucide-react';

interface WeatherChartsProps {
  hourly: HourlyType;
  timezone: string;
}

type ChartType = 'temp' | 'wind' | 'precip';

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ hourly, timezone }) => {
  const [activeChart, setActiveChart] = useState<ChartType>('temp');

  // Take data for next 24 hours
  const now = new Date();
  const startIndex = Math.max(0, hourly.time.findIndex(timeStr => {
    return new Date(timeStr).getTime() > now.getTime() - 60 * 60 * 1000;
  }));
  
  const data = hourly.time.slice(startIndex, startIndex + 24).map((time, idx) => {
    const dataIndex = startIndex + idx;
    return {
      time: formatHour(time, timezone),
      temp: hourly.temperature_2m[dataIndex],
      wind: hourly.wind_speed_10m[dataIndex],
      precip: hourly.precipitation_probability[dataIndex],
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-xl border border-white/20 text-sm shadow-xl">
          <p className="font-medium mb-1">{label}</p>
          {activeChart === 'temp' && (
            <p className="text-sky-300 font-semibold">{formatTemperature(payload[0].value)}</p>
          )}
          {activeChart === 'wind' && (
            <p className="text-teal-300 font-semibold">{formatWindSpeed(payload[0].value)}</p>
          )}
          {activeChart === 'precip' && (
            <p className="text-blue-300 font-semibold">{formatPercentage(payload[0].value)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-3xl p-3 sm:p-5 md:p-6 text-white w-full max-w-full overflow-hidden flex flex-col">
      <div className="flex flex-row items-center justify-between gap-2 mb-6 border-b border-white/10 pb-4 min-w-0 w-full">
        
        {/* Header */}
        <div className="flex items-center gap-1 sm:gap-2 text-white/90 font-medium shrink-0 whitespace-nowrap text-[10px] sm:text-xs">
          <LineChart size={14} className="sm:w-4 sm:h-4" />
          <span className="uppercase tracking-wider">
            Charts <span className="hidden sm:inline text-white/50 ml-1">(24 hours)</span>
          </span>
        </div>
        
        {/* Tabs */}
        <div className="flex shrink min-w-0 max-w-full bg-black/30 rounded-xl p-0.5 sm:p-1 overflow-hidden">
          <button
            onClick={() => setActiveChart('temp')}
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1 whitespace-nowrap shrink min-w-0 ${
              activeChart === 'temp' ? 'bg-white/20 shadow-sm text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="sm:hidden truncate">Temp</span>
            <span className="hidden sm:inline truncate">Temperature</span>
          </button>
          <button
            onClick={() => setActiveChart('wind')}
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1 whitespace-nowrap shrink min-w-0 ${
              activeChart === 'wind' ? 'bg-white/20 shadow-sm text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Wind size={12} className="sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">Wind</span>
          </button>
          <button
            onClick={() => setActiveChart('precip')}
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1 whitespace-nowrap shrink min-w-0 ${
              activeChart === 'precip' ? 'bg-white/20 shadow-sm text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Droplets size={12} className="sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="truncate">Precipitation</span>
          </button>
        </div>
        
      </div>

      {/* Chart */}
      <div className="h-[250px] sm:h-[300px] w-full mt-2 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'temp' ? (
            <AreaChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}°`} />
              <Tooltip content={renderTooltip} />
              <Area type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          ) : activeChart === 'wind' ? (
            <AreaChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={renderTooltip} />
              <Area type="monotone" dataKey="wind" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#colorWind)" />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={renderTooltip} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
              <Bar dataKey="precip" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
