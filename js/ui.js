// ══════════════════════════════════════════════════════════
// WEATHER — User Interface & DOM Updates
// ══════════════════════════════════════════════════════════
import { State, CONFIG } from './config.js';
import { $, $$, convertTemp, getWindDir, formatTime, formatDay, formatDate, getHourlyIndex, getComfortIndex, getMoonPhase, getCountryFlag } from './utils.js';
import { getIconSVG } from './search.js';

export const updateUI = (w, a, alerts) => {
  // Hide skeletons
  $$('.skeleton').forEach(el => el.style.display = 'none');
  
  const c = State.currentCity;
  const tz = w.timezone;
  const curr = w.current;
  const isDay = curr.is_day === 1;
  const code = curr.weather_code;
  const wmo = CONFIG.WMO_CODES[code] || CONFIG.WMO_CODES[3];

  // Header & Info Pills
  const flag = getCountryFlag(c.country_code);
  $('#cityName').innerHTML = `${c.name} ${flag}`;
  $('#cityMeta').textContent = `${c.admin1 ? c.admin1+', ' : ''}${c.country || ''} • Local time: ${formatTime(curr.time, tz)}`;
  $('#pillDate').textContent = formatDate(curr.time, tz);
  $('#pillTime').textContent = formatTime(curr.time, tz);
  $('#pillTimezone').textContent = tz.replace('_', ' ');

  // Hero Section
  $('#heroTemp').textContent = convertTemp(curr.temperature_2m);
  $('#heroTempUnit').textContent = State.unit === 'celsius' ? '°C' : '°F';
  $('#heroCondition').textContent = wmo.label;
  
  const comfort = getComfortIndex(curr.temperature_2m, curr.relative_humidity_2m);
  $('#heroFeels').textContent = `Feels like ${convertTemp(curr.apparent_temperature)}° • Comfort: ${comfort.label}`;
  
  // Sunrise/Sunset Countdown
  const sr = new Date(w.daily.sunrise[0]).getTime();
  const ss = new Date(w.daily.sunset[0]).getTime();
  const now = new Date().getTime();
  let cdText = '';
  if(now < sr) {
    const diff = Math.floor((sr - now)/60000);
    cdText = `Sunrise in ${Math.floor(diff/60)}h ${diff%60}m`;
  } else if (now < ss) {
    const diff = Math.floor((ss - now)/60000);
    cdText = `Sunset in ${Math.floor(diff/60)}h ${diff%60}m`;
  } else {
    cdText = `Night time`;
  }
  
  $('#heroHiLo').innerHTML = `H: ${convertTemp(w.daily.temperature_2m_max[0])}° L: ${convertTemp(w.daily.temperature_2m_min[0])}° • <span style="opacity:0.8">${cdText}</span>`;
  $('#heroIllustration').innerHTML = getIconSVG(wmo.icon, isDay);
  
  // Dynamic Backgrounds & Animations
  const hero = $('#heroSection');
  hero.className = 'hero'; // Reset
  hero.classList.add(`bg-${isDay ? wmo.heroBg : 'night'}`);
  
  // Optional: inject animated divs based on weather
  injectWeatherAnimations(hero, wmo.heroBg, isDay);

  // Detail Chips
  const hourlyIdx = getHourlyIndex(w.hourly.time);
  $('#valHumidity').textContent = `${curr.relative_humidity_2m}%`;
  $('#valWind').textContent = `${Math.round(curr.wind_speed_10m)} km/h`;
  $('#valWindDir').textContent = getWindDir(curr.wind_direction_10m);
  $('#valPressure').textContent = `${Math.round(curr.pressure_msl)} hPa`;
  
  const vis = w.hourly.visibility[hourlyIdx];
  $('#valVisibility').textContent = vis ? `${(vis/1000).toFixed(1)} km` : '--';
  
  const uv = w.hourly.uv_index[hourlyIdx];
  $('#valUV').textContent = uv ? uv.toFixed(1) : '--';
  
  $('#valClouds').textContent = `${curr.cloud_cover}%`;
  
  const dew = w.hourly.dew_point_2m[hourlyIdx];
  $('#valDewpoint').textContent = dew ? `${convertTemp(dew)}°` : '--';
  
  const rainP = w.hourly.precipitation_probability[hourlyIdx];
  $('#valRain').textContent = rainP != null ? `${rainP}%` : '--';

  // Recommendations based on Comfort / Weather
  let suggestion = comfort.msg;
  if(rainP > 40) suggestion = "Carry an umbrella. High chance of rain.";
  else if(uv > 7) suggestion = "UV Index is High. Wear sunscreen.";
  else if(curr.wind_speed_10m > 25) suggestion = "It's quite windy outside.";
  
  $('#todaysHighlight').innerHTML = `<strong>Today's Advice:</strong> ${suggestion}`;

  renderHourlyForecast(w, tz, hourlyIdx);
  renderWeeklyForecast(w, tz);
  renderSunArcAndMoon(w, tz);
  renderAQI(a);
  renderAlerts(alerts);
};

const renderHourlyForecast = (w, tz, hourlyIdx) => {
  let hHtml = '';
  for(let i = hourlyIdx; i < hourlyIdx + 24; i++) {
    if(!w.hourly.time[i]) break;
    const timeL = i === hourlyIdx ? 'Now' : formatTime(w.hourly.time[i], tz, {hour:'numeric', hour12:true});
    const hCode = w.hourly.weather_code[i];
    const hIcon = getIconSVG((CONFIG.WMO_CODES[hCode] || CONFIG.WMO_CODES[3]).icon, true);
    
    hHtml += `
      <div class="hourly-item ${i === hourlyIdx ? 'active' : ''}">
        <span class="hourly-time">${timeL}</span>
        <div class="hourly-icon">${hIcon}</div>
        <span class="hourly-temp">${convertTemp(w.hourly.temperature_2m[i])}°</span>
        <div class="hourly-extra">
          <span class="hourly-precip"><svg viewBox="0 0 10 10" fill="none"><path d="M5 1l3 4a3.5 3.5 0 11-6 0l3-4z" fill="currentColor"/></svg> ${w.hourly.precipitation_probability[i]}%</span>
          <span class="hourly-wind"><svg viewBox="0 0 10 10" fill="none"><path d="M1 5h8M7 3l2 2-2 2" stroke="currentColor"/></svg> ${Math.round(w.hourly.wind_speed_10m[i])}km/h</span>
        </div>
      </div>
    `;
  }
  $('#hourlyScroll').innerHTML = hHtml;
};

const renderWeeklyForecast = (w, tz) => {
  let wHtml = '';
  for(let i=0; i<w.daily.time.length; i++) {
    const dayName = i === 0 ? 'Today' : formatDay(w.daily.time[i], tz);
    const dateStr = formatDate(w.daily.time[i], tz);
    const dIcon = getIconSVG((CONFIG.WMO_CODES[w.daily.weather_code[i]] || CONFIG.WMO_CODES[3]).icon, true);
    
    wHtml += `
      <div class="weekly-item">
        <span class="weekly-day">${dayName}</span>
        <span class="weekly-date">${dateStr}</span>
        <div class="weekly-icon">${dIcon}</div>
        <div class="weekly-temp-row">
          <span class="weekly-tmax">${convertTemp(w.daily.temperature_2m_max[i])}°</span>
          <span class="weekly-tmin">${convertTemp(w.daily.temperature_2m_min[i])}°</span>
        </div>
        <div class="weekly-details">
          <span class="weekly-precip"><svg viewBox="0 0 10 10" fill="none"><path d="M5 1l3 4a3.5 3.5 0 11-6 0l3-4z" fill="currentColor"/></svg> ${w.daily.precipitation_probability_max[i]}%</span>
          <span class="weekly-uv">UV: ${w.daily.uv_index_max[i]||'--'}</span>
        </div>
      </div>
    `;
  }
  $('#weeklyScroll').innerHTML = wHtml;
};

const renderSunArcAndMoon = (w, tz) => {
  const sunrise = w.daily.sunrise[0];
  const sunset = w.daily.sunset[0];
  $('#sunriseTime').textContent = formatTime(sunrise, tz);
  $('#sunsetTime').textContent = formatTime(sunset, tz);
  
  const dl = w.daily.daylight_duration[0];
  $('#daylightDuration').textContent = `${Math.floor(dl/3600)}h ${Math.round((dl%3600)/60)}m`;
  
  // Sun Arc Math
  try {
    const now = new Date().getTime();
    const start = new Date(sunrise).getTime();
    const end = new Date(sunset).getTime();
    let p = 0;
    if(now > start && now < end) p = (now - start) / (end - start);
    else if (now >= end) p = 1;
    
    const arcL = Math.PI * 100;
    $('#sunArcProgress').style.strokeDasharray = `${arcL} ${arcL}`;
    $('#sunArcProgress').style.strokeDashoffset = arcL * (1 - p);
    
    const angle = Math.PI * (1 - p);
    const cx = 120 + 100 * Math.cos(angle);
    const cy = 110 - 100 * Math.sin(angle);
    const dot = $('#sunDot');
    dot.setAttribute('cx', cx);
    dot.setAttribute('cy', cy);
    dot.style.display = (p > 0 && p < 1) ? 'block' : 'none';
    $('#daylightBar').style.width = `${p * 100}%`;
  } catch(e) {}
  
  // Moon Phase
  const moon = getMoonPhase();
  $('#moonIcon').textContent = moon.icon;
  $('#moonLabel').textContent = moon.label;
  $('#moonIllum').textContent = `${moon.illumination}% Illumination`;
};

const renderAQI = (a) => {
  if(a && a.current) {
    const aqi = a.current.us_aqi;
    $('#aqiValue').textContent = aqi;
    $('#valAQIChip').textContent = aqi;
    
    let label = 'Good', color = '#22C55E', msg = 'Enjoy outdoor activities.';
    if(aqi>50){ label='Moderate'; color='#F59E0B'; msg = 'Sensitive people should reduce outdoor exposure.'; }
    if(aqi>100){ label='Unhealthy'; color='#EF4444'; msg = 'Avoid prolonged outdoor activities.'; }
    
    $('#aqiLabel').textContent = label;
    $('#aqiLabel').style.color = color;
    $('#valAQIChip').style.color = color;
    $('#aqiMessage').textContent = msg;
    
    const circle = $('#aqiCircle');
    const frac = Math.min(aqi/200, 1);
    circle.style.strokeDashoffset = 264 * (1 - frac);
    circle.style.stroke = color;
    
    $('#aqiPM25').textContent = a.current.pm2_5;
    $('#aqiPM10').textContent = a.current.pm10;
    $('#aqiCO').textContent = a.current.carbon_monoxide;
    $('#aqiNO2').textContent = a.current.nitrogen_dioxide;
    $('#aqiO3').textContent = a.current.ozone;
  }
};

const renderAlerts = (alerts) => {
  const c = $('#rpAlerts');
  if(!alerts || alerts.length === 0) {
    c.innerHTML = `<p class="rp-empty">No active alerts for this location.</p>`;
    return;
  }
  
  c.innerHTML = alerts.map(a => `
    <div class="alert-item ${a.severity}">
      <div class="alert-icon">⚠️</div>
      <div class="alert-content">
        <span class="alert-title">${a.type}</span>
        <span class="alert-desc">${a.desc}</span>
      </div>
    </div>
  `).join('');
};

const injectWeatherAnimations = (hero, bgType, isDay) => {
  // Clear previous animations
  const existing = hero.querySelectorAll('.bg-animation');
  existing.forEach(e => e.remove());
  
  const animContainer = document.createElement('div');
  animContainer.className = 'bg-animation';
  
  if (bgType === 'rain' || bgType === 'thunder') {
    for(let i=0; i<20; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';
      drop.style.left = `${Math.random()*100}%`;
      drop.style.animationDelay = `${Math.random()*2}s`;
      animContainer.appendChild(drop);
    }
  } else if (bgType === 'snow') {
    for(let i=0; i<20; i++) {
      const flake = document.createElement('div');
      flake.className = 'snow-flake';
      flake.style.left = `${Math.random()*100}%`;
      flake.style.animationDelay = `${Math.random()*5}s`;
      animContainer.appendChild(flake);
    }
  } else if (!isDay) {
    for(let i=0; i<30; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random()*100}%`;
      star.style.top = `${Math.random()*100}%`;
      star.style.animationDelay = `${Math.random()*3}s`;
      animContainer.appendChild(star);
    }
  }
  
  hero.appendChild(animContainer);
};

export const showSkeletons = () => {
  $$('.skeleton').forEach(el => el.style.display = 'inline-block');
};

window.showToast = (msg) => {
  const c = $('#toastContainer');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('toast-exit'); setTimeout(() => t.remove(), 300); }, 3000);
};
