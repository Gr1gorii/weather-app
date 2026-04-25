import type {  City  } from '../types/city';

const CITIES_KEY = 'apple_weather_cities';
const CURRENT_CITY_KEY = 'apple_weather_current_city';
const THEME_KEY = 'apple_weather_theme';

export type ThemeType = 'light' | 'dark' | 'auto';

export const getSavedCities = (): City[] => {
  try {
    const data = localStorage.getItem(CITIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading cities from localStorage:', error);
    return [];
  }
};

export const saveCity = (city: City): void => {
  try {
    const cities = getSavedCities();
    // Check if city already exists by id
    if (!cities.some(c => c.id === city.id)) {
      cities.push(city);
      localStorage.setItem(CITIES_KEY, JSON.stringify(cities));
    }
  } catch (error) {
    console.error('Error saving city to localStorage:', error);
  }
};

export const removeCity = (cityId: number): void => {
  try {
    const cities = getSavedCities();
    const filtered = cities.filter(c => c.id !== cityId);
    localStorage.setItem(CITIES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing city from localStorage:', error);
  }
};

export const getCurrentCity = (): City | null => {
  try {
    const data = localStorage.getItem(CURRENT_CITY_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading current city from localStorage:', error);
    return null;
  }
};

export const setCurrentCity = (city: City): void => {
  try {
    localStorage.setItem(CURRENT_CITY_KEY, JSON.stringify(city));
  } catch (error) {
    console.error('Error saving current city to localStorage:', error);
  }
};

export const getTheme = (): ThemeType => {
  try {
    const data = localStorage.getItem(THEME_KEY);
    return (data as ThemeType) || 'auto';
  } catch {
    return 'auto';
  }
};

export const setTheme = (theme: ThemeType): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
  }
};
