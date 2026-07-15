// ══════════════════════════════════════════════════════════
// WEATHER — API & Data Fetching
// ══════════════════════════════════════════════════════════
import { CONFIG, State } from './config.js';
import { generateLocalAlerts } from './utils.js';

export const fetchCityData = async (lat, lon) => {
  try {
    const [wRes, aRes] = await Promise.all([
      fetch(CONFIG.API.weather(lat, lon)),
      fetch(CONFIG.API.aqi(lat, lon))
    ]);
    
    if (!wRes.ok) throw new Error('Weather data failed');
    
    const wData = await wRes.json();
    let aData = null;
    if(aRes.ok) aData = await aRes.json();
    
    State.weatherData = wData;
    State.aqiData = aData;
    
    // Generate local alerts based on thresholds
    State.alertsData = generateLocalAlerts(wData);
    
    return { weather: wData, aqi: aData, alerts: State.alertsData };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const searchCities = async (query) => {
  try {
    const res = await fetch(CONFIG.API.geocoding(query));
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const reverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10`);
    if (!res.ok) throw new Error('Reverse geocoding failed');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Fetch RainViewer radar timestamps to get the latest radar tile path
export const fetchRadarData = async () => {
  try {
    const res = await fetch(CONFIG.API.rainViewer);
    if (!res.ok) throw new Error('Radar data failed');
    const data = await res.json();
    State.radarData = data;
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
