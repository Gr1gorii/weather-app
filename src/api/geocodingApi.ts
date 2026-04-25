import type {  City, GeocodingResponse  } from '../types/city';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export const searchCities = async (query: string): Promise<City[]> => {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    const url = new URL(GEOCODING_BASE_URL);
    url.searchParams.append('name', query);
    url.searchParams.append('count', '10');
    url.searchParams.append('language', 'en');
    url.searchParams.append('format', 'json');

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status} ${response.statusText}`);
    }

    const data: GeocodingResponse = await response.json();
    
    return data.results || [];
  } catch (error) {
    console.error('API Error (searchCities):', error);
    throw error;
  }
};
