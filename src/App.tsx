import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Eye, Sun, Gauge, CloudRain, Cloud, Navigation } from 'lucide-react';

import type {  WeatherResponse  } from './types/weather';
import type {  City  } from './types/city';
import { getWeather } from './api/weatherApi';


import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherMetricCard } from './components/WeatherMetricCard';
import { SavedCities } from './components/SavedCities';
import { ThemeToggle } from './components/ThemeToggle';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { OfflineWarning } from './components/OfflineWarning';
import { WeatherCharts } from './components/WeatherCharts';
import { WeatherAnimation } from './components/WeatherAnimation';

import { getWeatherInfo } from './utils/weatherCodes';
import { 
  formatPressure, 
  formatVisibility, 
  formatPrecipitation, 
  formatPercentage, 
  formatUVIndex,
  formatWindSpeed
} from './utils/formatters';
import { getSavedCities, saveCity, removeCity, getCurrentCity, setCurrentCity } from './utils/storage';


const DEFAULT_CITY: City = {
  id: 524901,
  name: "Moscow",
  latitude: 55.7522,
  longitude: 37.6156,
  country: "Russia",
  country_code: "RU",
  timezone: "Europe/Moscow",
  admin1: "Moscow"
};

function App() {
  const [city, setCity] = useState<City | null>(() => getCurrentCity() || DEFAULT_CITY);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [savedCitiesList, setSavedCitiesList] = useState<City[]>(getSavedCities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);

  // Load weather when city changes
  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getWeather(city.latitude, city.longitude);
        setWeather(data);
        setCurrentCity(city);
      } catch {
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSelectCity = (selectedCity: City) => {
    saveCity(selectedCity);
    setSavedCitiesList(getSavedCities());
    setCity(selectedCity);
  };

  const handleRemoveCity = (cityId: number) => {
    removeCity(cityId);
    setSavedCitiesList(getSavedCities());
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Look for nearest city by coordinates
          await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${position.coords.latitude},${position.coords.longitude}&count=1&language=en&format=json`
          );
          
          // Open-Meteo search does not work directly by coordinates,
          // but we can create a "City" from coordinates, or try reverse geocoding.
          // For simplicity, create a virtual city "Current location".
          const geoCity: City = {
            id: Date.now(), // pseudo-ID
            name: "Current Location",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            country: "",
            country_code: "",
            timezone: "auto"
          };
          
          setCity(geoCity);
        } catch {
          setError('Failed to determine location');
        } finally {
          setIsGeolocating(false);
        }
      },
      () => {
        alert('Please allow geolocation access in your browser settings.');
        setIsGeolocating(false);
      }
    );
  };

  // Dynamic background
  const backgroundGradient = weather 
    ? getWeatherInfo(weather.current.weather_code, weather.current.is_day).backgroundGradient
    : 'from-sky-400 to-blue-500';

  return (
    <div className={`min-h-screen bg-gradient-to-b ${backgroundGradient} transition-colors duration-1000 p-4 md:p-8 font-sans relative`}>
      {weather && <WeatherAnimation weatherCode={weather.current.weather_code} isDay={weather.current.is_day} />}
      
      <OfflineWarning />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left column (Sidebar) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex justify-between items-center z-50 relative">
            <SearchBar onSelectCity={handleSelectCity} />
            <ThemeToggle className="ml-4" />
          </div>

          <div className="glass-panel rounded-3xl p-5 text-white">
            <SavedCities 
              cities={savedCitiesList}
              currentCity={city}
              onSelectCity={setCity}
              onRemoveCity={handleRemoveCity}
              onGeolocate={handleGeolocate}
              isGeolocating={isGeolocating}
            />
          </div>
        </div>

        {/* Right column (Main content) */}
        <div className="lg:col-span-8">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={() => setCity({ ...city! })} />
          ) : weather && city ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col gap-6"
            >
              <CurrentWeatherCard 
                current={weather.current} 
                daily={weather.daily} 
                city={city} 
              />
              
              <HourlyForecast 
                hourly={weather.hourly} 
                timezone={weather.timezone} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DailyForecast 
                  daily={weather.daily} 
                  timezone={weather.timezone} 
                />
                
                <WeatherCharts 
                  hourly={weather.hourly} 
                  timezone={weather.timezone} 
                />
              </div>

              {/* Metrics 2x2 or 2x4 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <WeatherMetricCard 
                  icon={Sun}
                  title="UV Index"
                  value={formatUVIndex(weather.hourly.uv_index[0])}
                  delay={0.1}
                />
                <WeatherMetricCard 
                  icon={Wind}
                  title="Wind"
                  value={formatWindSpeed(weather.current.wind_speed_10m)}
                  description={`Direction: ${weather.current.wind_direction_10m}°`}
                  delay={0.2}
                />
                <WeatherMetricCard 
                  icon={Droplets}
                  title="Humidity"
                  value={formatPercentage(weather.current.relative_humidity_2m)}
                  description="Current humidity"
                  delay={0.3}
                />
                <WeatherMetricCard 
                  icon={Gauge}
                  title="Pressure"
                  value={formatPressure(weather.current.surface_pressure)}
                  delay={0.4}
                />
                <WeatherMetricCard 
                  icon={Eye}
                  title="Visibility"
                  value={formatVisibility(weather.hourly.visibility[0] || 10000)}
                  delay={0.5}
                />
                <WeatherMetricCard 
                  icon={CloudRain}
                  title="Precipitation"
                  value={formatPrecipitation(weather.current.precipitation)}
                  description="In the last hour"
                  delay={0.6}
                />
                <WeatherMetricCard 
                  icon={Cloud}
                  title="Cloud Cover"
                  value={formatPercentage(weather.current.cloud_cover)}
                  delay={0.7}
                />
                <WeatherMetricCard 
                  icon={Navigation}
                  title="Feels Like"
                  value={`${Math.round(weather.current.apparent_temperature)}°`}
                  delay={0.8}
                />
              </div>

            </motion.div>
          ) : null}
        </div>
        
      </div>
    </div>
  );
}

export default App;
