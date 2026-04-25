import type {  WeatherResponse  } from '../types/weather';

const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const getWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
  try {
    const url = new URL(FORECAST_BASE_URL);
    
    url.searchParams.append('latitude', lat.toString());
    url.searchParams.append('longitude', lon.toString());
    
    // Request current weather
    url.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m');
    
    // Request hourly forecast
    url.searchParams.append('hourly', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index');
    
    // Request daily forecast
    url.searchParams.append('daily', 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,uv_index_max,precipitation_sum,precipitation_probability_max');
    
    // Set timezone and additional parameters
    url.searchParams.append('timezone', 'auto');
    url.searchParams.append('wind_speed_unit', 'kmh');
    url.searchParams.append('precipitation_unit', 'mm');
    url.searchParams.append('timeformat', 'iso8601');
    url.searchParams.append('past_days', '0');
    url.searchParams.append('forecast_days', '10');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch weather forecast: ${response.status} ${response.statusText}`);
    }

    const data: WeatherResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API Error (getWeather):', error);
    throw error;
  }
};
