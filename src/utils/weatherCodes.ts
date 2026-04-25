import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  type LucideIcon,
  Snowflake
} from 'lucide-react';

export interface WeatherInfo {
  description: string;
  icon: LucideIcon;
  backgroundGradient: string;
}

export const getWeatherInfo = (code: number, isDay: number = 1): WeatherInfo => {
  const isNight = isDay === 0;

  // Basic Apple Weather style gradients
  const gradients = {
    clearDay: 'from-sky-400 to-blue-500',
    clearNight: 'from-slate-900 to-indigo-950',
    partlyCloudyDay: 'from-sky-300 to-blue-600',
    partlyCloudyNight: 'from-slate-800 to-indigo-900',
    cloudyDay: 'from-gray-400 to-slate-500',
    cloudyNight: 'from-gray-700 to-slate-900',
    fogDay: 'from-gray-300 to-gray-500',
    fogNight: 'from-gray-600 to-gray-900',
    rainDay: 'from-slate-500 to-blue-800',
    rainNight: 'from-slate-800 to-blue-950',
    snowDay: 'from-sky-200 to-slate-400',
    snowNight: 'from-slate-700 to-slate-900',
    storm: 'from-slate-800 to-zinc-950',
  };

  switch (code) {
    case 0:
      return {
        description: 'Clear',
        icon: isNight ? Moon : Sun,
        backgroundGradient: isNight ? gradients.clearNight : gradients.clearDay,
      };
    case 1:
      return {
        description: 'Mostly Clear',
        icon: isNight ? CloudMoon : CloudSun,
        backgroundGradient: isNight ? gradients.partlyCloudyNight : gradients.partlyCloudyDay,
      };
    case 2:
      return {
        description: 'Partly Cloudy',
        icon: isNight ? CloudMoon : CloudSun,
        backgroundGradient: isNight ? gradients.partlyCloudyNight : gradients.partlyCloudyDay,
      };
    case 3:
      return {
        description: 'Overcast',
        icon: Cloud,
        backgroundGradient: isNight ? gradients.cloudyNight : gradients.cloudyDay,
      };
    case 45:
      return {
        description: 'Fog',
        icon: CloudFog,
        backgroundGradient: isNight ? gradients.fogNight : gradients.fogDay,
      };
    case 48:
      return {
        description: 'Depositing rime fog',
        icon: CloudFog,
        backgroundGradient: isNight ? gradients.fogNight : gradients.fogDay,
      };
    case 51:
      return {
        description: 'Light Drizzle',
        icon: CloudDrizzle,
        backgroundGradient: isNight ? gradients.rainNight : gradients.rainDay,
      };
    case 53:
      return {
        description: 'Moderate Drizzle',
        icon: CloudDrizzle,
        backgroundGradient: isNight ? gradients.rainNight : gradients.rainDay,
      };
    case 55:
      return {
        description: 'Dense Drizzle',
        icon: CloudDrizzle,
        backgroundGradient: isNight ? gradients.rainNight : gradients.rainDay,
      };
    case 61:
      return {
        description: 'Light Rain',
        icon: CloudRain,
        backgroundGradient: isNight ? gradients.rainNight : gradients.rainDay,
      };
    case 63:
      return {
        description: 'Moderate Rain',
        icon: CloudRain,
        backgroundGradient: isNight ? gradients.rainNight : gradients.rainDay,
      };
    case 65:
      return {
        description: 'Heavy Rain',
        icon: CloudRain,
        backgroundGradient: isNight ? gradients.rainNight : gradients.rainDay,
      };
    case 71:
      return {
        description: 'Light Snow',
        icon: CloudSnow,
        backgroundGradient: isNight ? gradients.snowNight : gradients.snowDay,
      };
    case 73:
      return {
        description: 'Moderate Snow',
        icon: Snowflake,
        backgroundGradient: isNight ? gradients.snowNight : gradients.snowDay,
      };
    case 75:
      return {
        description: 'Heavy Snow',
        icon: Snowflake,
        backgroundGradient: isNight ? gradients.snowNight : gradients.snowDay,
      };
    case 80:
      return {
        description: 'Light Rain Showers',
        icon: CloudRain,
        backgroundGradient: isNight ? gradients.rainNight : gradients.rainDay,
      };
    case 81:
      return {
        description: 'Moderate Rain Showers',
        icon: CloudRain,
        backgroundGradient: isNight ? gradients.rainNight : gradients.rainDay,
      };
    case 82:
      return {
        description: 'Violent Rain Showers',
        icon: CloudRain,
        backgroundGradient: isNight ? gradients.rainNight : gradients.rainDay,
      };
    case 95:
      return {
        description: 'Thunderstorm',
        icon: CloudLightning,
        backgroundGradient: gradients.storm,
      };
    case 96:
      return {
        description: 'Thunderstorm with slight hail',
        icon: CloudLightning,
        backgroundGradient: gradients.storm,
      };
    case 99:
      return {
        description: 'Thunderstorm with heavy hail',
        icon: CloudLightning,
        backgroundGradient: gradients.storm,
      };
    default:
      return {
        description: 'Unknown',
        icon: Cloud,
        backgroundGradient: isNight ? gradients.clearNight : gradients.clearDay,
      };
  }
};
