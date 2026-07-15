// ══════════════════════════════════════════════════════════
// WEATHER — Configuration & Constants
// ══════════════════════════════════════════════════════════

export const CONFIG = {
  // Free API Endpoints
  API: {
    geocoding: (q) => `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=jsonv2&addressdetails=1&limit=5&extratags=1`,
    weather: (lat, lon) => `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,weather_code,visibility,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,precipitation_probability_max,precipitation_sum,uv_index_max&timezone=auto&models=best_match`,
    aqi: (lat, lon) => `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto`,
    rainViewer: 'https://api.rainviewer.com/public/weather-maps.json', // Free radar tiles
  },
  
  // Storage Keys
  STORAGE: {
    unit: 'weather_unit',
    theme: 'weather_theme',
    favorites: 'weather_favorites',
    recents: 'weather_recents'
  },
  
  // WMO Code Mappings
  WMO_CODES: {
    0: { label: 'Clear Sky', icon: 'clear', heroBg: 'sunny' },
    1: { label: 'Mainly Clear', icon: 'partly-cloudy', heroBg: 'sunny' },
    2: { label: 'Partly Cloudy', icon: 'partly-cloudy', heroBg: 'cloudy' },
    3: { label: 'Overcast', icon: 'cloudy', heroBg: 'cloudy' },
    45: { label: 'Fog', icon: 'cloudy', heroBg: 'fog' },
    48: { label: 'Rime Fog', icon: 'cloudy', heroBg: 'fog' },
    51: { label: 'Light Drizzle', icon: 'rain', heroBg: 'rain' },
    53: { label: 'Moderate Drizzle', icon: 'rain', heroBg: 'rain' },
    55: { label: 'Dense Drizzle', icon: 'rain', heroBg: 'rain' },
    56: { label: 'Freezing Drizzle', icon: 'rain', heroBg: 'rain' },
    57: { label: 'Dense Freezing Drizzle', icon: 'rain', heroBg: 'rain' },
    61: { label: 'Slight Rain', icon: 'rain', heroBg: 'rain' },
    63: { label: 'Moderate Rain', icon: 'rain', heroBg: 'rain' },
    65: { label: 'Heavy Rain', icon: 'rain', heroBg: 'rain' },
    66: { label: 'Light Freezing Rain', icon: 'rain', heroBg: 'rain' },
    67: { label: 'Heavy Freezing Rain', icon: 'rain', heroBg: 'rain' },
    71: { label: 'Slight Snow', icon: 'snow', heroBg: 'snow' },
    73: { label: 'Moderate Snow', icon: 'snow', heroBg: 'snow' },
    75: { label: 'Heavy Snow', icon: 'snow', heroBg: 'snow' },
    77: { label: 'Snow Grains', icon: 'snow', heroBg: 'snow' },
    80: { label: 'Light Showers', icon: 'rain', heroBg: 'rain' },
    81: { label: 'Moderate Showers', icon: 'rain', heroBg: 'rain' },
    82: { label: 'Violent Showers', icon: 'rain', heroBg: 'rain' },
    85: { label: 'Slight Snow Showers', icon: 'snow', heroBg: 'snow' },
    86: { label: 'Heavy Snow Showers', icon: 'snow', heroBg: 'snow' },
    95: { label: 'Thunderstorm', icon: 'thunder', heroBg: 'thunder' },
    96: { label: 'Thunderstorm Hail', icon: 'thunder', heroBg: 'thunder' },
    99: { label: 'Heavy Thunderstorm Hail', icon: 'thunder', heroBg: 'thunder' },
  }
};

export const State = {
  currentCity: null,
  weatherData: null,
  aqiData: null,
  radarData: null,
  unit: localStorage.getItem(CONFIG.STORAGE.unit) || 'celsius',
  theme: localStorage.getItem(CONFIG.STORAGE.theme) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  favorites: JSON.parse(localStorage.getItem(CONFIG.STORAGE.favorites) || '[]'),
  recentSearches: JSON.parse(localStorage.getItem(CONFIG.STORAGE.recents) || '[]'),
  map: null,
  mapLayers: {}
};
