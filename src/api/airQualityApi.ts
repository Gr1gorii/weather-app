import type {  AirQualityResponse  } from '../types/weather';

const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export const getAirQuality = async (lat: number, lon: number): Promise<AirQualityResponse> => {
  try {
    const url = new URL(AIR_QUALITY_BASE_URL);
    
    url.searchParams.append('latitude', lat.toString());
    url.searchParams.append('longitude', lon.toString());
    
    // Request hourly data
    url.searchParams.append('hourly', 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi');
    
    // Set timezone
    url.searchParams.append('timezone', 'auto');
    url.searchParams.append('past_days', '0');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch air quality data: ${response.status} ${response.statusText}`);
    }

    const data: AirQualityResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API Error (getAirQuality):', error);
    throw error;
  }
};
