// ══════════════════════════════════════════════════════════
// WEATHER — Utility Functions
// ══════════════════════════════════════════════════════════
import { State } from './config.js';

export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => document.querySelectorAll(sel);

export const convertTemp = (c) => State.unit === 'fahrenheit' ? Math.round((c * 9/5) + 32) : Math.round(c);
export const debounce = (fn, d) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), d); }; };

export const getWindDir = (deg) => ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(deg / 22.5) % 16];

export const formatTime = (iso, tz, opts={hour:'numeric',minute:'2-digit'}) => { 
  try { return new Date(iso).toLocaleTimeString('en-US', {...opts, timeZone: tz}); } 
  catch { return '--:--'; }
};

export const formatDay = (iso, tz) => { 
  try { return new Date(iso).toLocaleDateString('en-US', {weekday:'short', timeZone:tz}); } 
  catch { return ''; }
};

export const formatDate = (iso, tz) => { 
  try { return new Date(iso).toLocaleDateString('en-US', {month:'short', day:'numeric', timeZone:tz}); } 
  catch { return ''; }
};

export const getHourlyIndex = (times) => {
  const now = new Date().getTime();
  let min = Infinity, idx = 0;
  for(let i=0; i<times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - now);
    if(diff < min) { min = diff; idx = i; }
  }
  return Math.max(0, idx);
};

// ─── ALERTS GENERATOR (Local Keyless) ───
export const generateLocalAlerts = (weather) => {
  const alerts = [];
  const cur = weather.current;
  const dly = weather.daily;
  
  if (cur.wind_speed_10m > 40) {
    alerts.push({ type: 'High Wind Warning', desc: `Sustained winds of ${cur.wind_speed_10m} km/h detected. Secure loose objects.`, severity: 'warning' });
  }
  if (dly.temperature_2m_max[0] > 35) {
    alerts.push({ type: 'Heat Advisory', desc: `Extreme heat expected with highs around ${dly.temperature_2m_max[0]}°C. Stay hydrated.`, severity: 'danger' });
  }
  if (dly.temperature_2m_min[0] < 0) {
    alerts.push({ type: 'Freeze Warning', desc: `Temperatures dropping below freezing (${dly.temperature_2m_min[0]}°C). Protect plants and pipes.`, severity: 'warning' });
  }
  if (cur.precipitation > 10) {
    alerts.push({ type: 'Heavy Rain Alert', desc: `Heavy rainfall detected. Potential for localized flooding.`, severity: 'danger' });
  }
  if (cur.weather_code === 95 || cur.weather_code === 96 || cur.weather_code === 99) {
    alerts.push({ type: 'Thunderstorm Warning', desc: `Active thunderstorms in the vicinity. Seek shelter indoors.`, severity: 'danger' });
  }
  
  return alerts;
};

// ─── COMFORT INDEX ───
// Very basic calculation combining temp and humidity
export const getComfortIndex = (temp, hum) => {
  const heatIndex = temp + (0.5555 * (hum/100) * 6.11 * Math.exp(5417.7530 * (1/273.16 - 1/(273.15 + temp))) - 10);
  
  if (temp < 15) return { label: 'Chilly', msg: 'Dress warmly. Good for vigorous activity.' };
  if (heatIndex < 25) return { label: 'Excellent', msg: 'Perfect weather for outdoor activities.' };
  if (heatIndex < 30) return { label: 'Good', msg: 'Comfortable, but getting warm.' };
  if (heatIndex < 35) return { label: 'Moderate', msg: 'Feeling warm. Drink plenty of water.' };
  return { label: 'Poor', msg: 'Uncomfortably hot. Avoid strenuous outdoor activity.' };
};

// ─── MOON PHASE ───
export const getMoonPhase = (date = new Date()) => {
  // Simple approximation of moon phase based on known new moon
  const lp = 2551443; 
  const new_moon = new Date(1970, 0, 7, 20, 35, 0).getTime();
  const phase = ((date.getTime() - new_moon) / 1000) % lp;
  const frac = phase / lp;
  
  let label = "New Moon", icon = "🌑";
  if (frac < 0.03) { label = "New Moon"; icon = "🌑"; }
  else if (frac < 0.22) { label = "Waxing Crescent"; icon = "🌒"; }
  else if (frac < 0.28) { label = "First Quarter"; icon = "🌓"; }
  else if (frac < 0.47) { label = "Waxing Gibbous"; icon = "🌔"; }
  else if (frac < 0.53) { label = "Full Moon"; icon = "🌕"; }
  else if (frac < 0.72) { label = "Waning Gibbous"; icon = "🌖"; }
  else if (frac < 0.78) { label = "Last Quarter"; icon = "🌗"; }
  else if (frac < 0.97) { label = "Waning Crescent"; icon = "🌘"; }
  
  return { label, icon, illumination: Math.round((0.5 * (1 - Math.cos(2 * Math.PI * frac))) * 100) };
};

export const getCountryFlag = (cc) => {
  if (!cc) return '🌍';
  return cc.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
};
