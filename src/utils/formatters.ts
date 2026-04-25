export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

export const formatPressure = (hPa: number): string => {
  // Convert hPa to mmHg (1 hPa = 0.75006 mmHg)
  const mmHg = Math.round(hPa * 0.75006);
  return `${mmHg} mmHg`;
};

export const formatWindSpeed = (kmh: number): string => {
  return `${Math.round(kmh)} km/h`;
};

export const formatVisibility = (meters: number): string => {
  if (meters >= 1000) {
    // If >= 1km, show in km with 1 decimal
    const km = (meters / 1000).toFixed(1).replace('.0', '');
    return `${km} km`;
  }
  return `${meters} m`;
};

export const formatPrecipitation = (mm: number): string => {
  if (mm === 0) return '0 mm';
  return `${mm.toFixed(1).replace('.0', '')} mm`;
};

export const formatPercentage = (percent: number): string => {
  return `${Math.round(percent)}%`;
};

export const formatUVIndex = (uv: number): string => {
  const rounded = Math.round(uv);
  if (rounded <= 2) return `${rounded} (Low)`;
  if (rounded <= 5) return `${rounded} (Moderate)`;
  if (rounded <= 7) return `${rounded} (High)`;
  if (rounded <= 10) return `${rounded} (Very High)`;
  return `${rounded} (Extreme)`;
};
