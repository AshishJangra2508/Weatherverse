// ══════════════════════════════════════════════════════════
// WEATHER — Search, Favorites & Recents
// ══════════════════════════════════════════════════════════
import { State, CONFIG } from './config.js';
import { $, $$, convertTemp } from './utils.js';
import { loadCityData } from './app.js';
import { searchCities } from './api.js';

export const handleSearchInput = async (query) => {
  if (query.length < 2) {
    $('#searchDropdown').classList.remove('open');
    return;
  }
  
  const results = await searchCities(query);
  renderSearchDropdown(results);
};

export const renderSearchDropdown = (results) => {
  const dd = $('#searchDropdown');
  if (!results || results.length === 0) {
    dd.innerHTML = '<div class="search-no-results">No cities found</div>';
  } else {
    dd.innerHTML = results.map(r => {
      // Nominatim results
      const name = r.name || '';
      const state = r.address?.state || r.address?.county || '';
      const country = r.address?.country || '';
      const cc = r.address?.country_code || '';
      const flag = getCountryFlag(cc);
      
      return `
      <div class="search-result" onclick="window.selectCity(${r.lat}, ${r.lon}, '${name.replace(/'/g,"\\'")}', '${state.replace(/'/g,"\\'")}', '${country.replace(/'/g,"\\'")}')">
        <div class="search-result-icon">${flag}</div>
        <div class="search-result-text">
          <span class="search-result-city">${name}</span>
          <span class="search-result-region">${[state, country].filter(Boolean).join(', ')}</span>
        </div>
      </div>
    `}).join('');
  }
  dd.classList.add('open');
};

const getCountryFlag = (cc) => {
  if (!cc) return '🌍';
  return cc.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

export const addToRecents = (city) => {
  State.recentSearches = State.recentSearches.filter(c => c.name !== city.name);
  State.recentSearches.unshift(city);
  if(State.recentSearches.length > 20) State.recentSearches.pop(); // Keep 20 as requested
  localStorage.setItem(CONFIG.STORAGE.recents, JSON.stringify(State.recentSearches));
  renderRecents();
};

export const removeRecent = (name, e) => {
  e.stopPropagation();
  State.recentSearches = State.recentSearches.filter(c => c.name !== name);
  localStorage.setItem(CONFIG.STORAGE.recents, JSON.stringify(State.recentSearches));
  renderRecents();
};

export const renderRecents = () => {
  const c = $('#sidebarRecents');
  if (State.recentSearches.length === 0) {
    c.innerHTML = '<p class="sidebar-empty">No recent searches</p>';
    return;
  }
  c.innerHTML = State.recentSearches.map(r => `
    <div class="recent-item" onclick="window.selectCity(${r.latitude}, ${r.longitude}, '${r.name.replace(/'/g,"\\'")}', '${(r.admin1||'').replace(/'/g,"\\'")}', '${(r.country||'').replace(/'/g,"\\'")}')">
      <div class="recent-item-left">
        <div class="recent-icon"><svg viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.6"/><path d="M13 13l4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></div>
        <div class="recent-info">
          <span class="recent-city">${r.name}</span>
          <span class="recent-country">${r.country || ''}</span>
        </div>
      </div>
      <button class="recent-remove" onclick="window.removeRecent('${r.name.replace(/'/g,"\\'")}', event)" title="Remove">✕</button>
    </div>
  `).join('');
};

export const toggleFavorite = () => {
  const c = State.currentCity;
  if(!c) return;
  const idx = State.favorites.findIndex(f => f.name === c.name);
  if (idx >= 0) {
    State.favorites.splice(idx, 1);
    window.showToast('Removed from favorites');
  } else {
    State.favorites.push(c);
    window.showToast('Added to favorites');
  }
  localStorage.setItem(CONFIG.STORAGE.favorites, JSON.stringify(State.favorites));
  updateFavButtonState();
  renderFavorites();
};

export const updateFavButtonState = () => {
  const btn = $('#cityFavBtn');
  if(!State.currentCity) return;
  const isFav = State.favorites.some(f => f.name === State.currentCity.name);
  if(isFav) btn.classList.add('active');
  else btn.classList.remove('active');
};

export const renderFavorites = async () => {
  const c = $('#sidebarFavorites');
  if (State.favorites.length === 0) {
    c.innerHTML = '<p class="sidebar-empty">No favorites yet</p>';
    return;
  }
  
  let html = '';
  for(let f of State.favorites) {
    let temp = '--', wmo = CONFIG.WMO_CODES[3], isDay = true;
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${f.latitude}&longitude=${f.longitude}&current=temperature_2m,weather_code,is_day`);
      if(res.ok) {
        const data = await res.json();
        temp = convertTemp(data.current.temperature_2m) + '°';
        wmo = CONFIG.WMO_CODES[data.current.weather_code] || CONFIG.WMO_CODES[3];
        isDay = data.current.is_day === 1;
      }
    } catch(e) {}
    
    html += `
      <div class="fav-item" onclick="window.selectCity(${f.latitude}, ${f.longitude}, '${f.name.replace(/'/g,"\\'")}', '${(f.admin1||'').replace(/'/g,"\\'")}', '${(f.country||'').replace(/'/g,"\\'")}')">
        <div class="fav-item-left">
          <div class="fav-icon">${getIconSVG(wmo.icon, isDay)}</div>
          <div class="fav-info">
            <span class="fav-city">${f.name}</span>
            <span class="fav-country">${wmo.label}</span>
          </div>
        </div>
        <span class="fav-temp">${temp}</span>
      </div>
    `;
  }
  c.innerHTML = html;
};

export const getIconSVG = (type, isDay = true) => {
  const sunColor = "#FBBF24";
  const cloudColor = "#CBD5E1";
  
  if (!isDay && type === 'clear') {
    return `<svg viewBox="0 0 32 32" fill="none"><path d="M21 19a7 7 0 11-10.7-8.3 8 8 0 1010.7 8.3z" fill="${cloudColor}"/></svg>`;
  }
  if (!isDay && type === 'partly-cloudy') {
    return `<svg viewBox="0 0 32 32" fill="none"><path d="M18 18a6 6 0 11-9.2-7.1 7 7 0 109.2 7.1z" fill="${cloudColor}"/><path d="M12 22a5 5 0 0110 0h-10z" fill="${cloudColor}" opacity="0.8"/></svg>`;
  }

  const icons = {
    'clear': `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="6" fill="${sunColor}"/><g stroke="${sunColor}" stroke-width="2" stroke-linecap="round"><line x1="16" y1="4" x2="16" y2="7"/><line x1="16" y1="25" x2="16" y2="28"/><line x1="4" y1="16" x2="7" y2="16"/><line x1="25" y1="16" x2="28" y2="16"/><line x1="7.5" y1="7.5" x2="9.6" y2="9.6"/><line x1="22.4" y1="22.4" x2="24.5" y2="24.5"/><line x1="24.5" y1="7.5" x2="22.4" y2="9.6"/><line x1="9.6" y1="22.4" x2="7.5" y2="24.5"/></g></svg>`,
    'partly-cloudy': `<svg viewBox="0 0 32 32" fill="none"><circle cx="11" cy="11" r="4" fill="${sunColor}"/><path d="M17 21a6 6 0 01-5.7-4A4 4 0 0115 11h.5a7 7 0 011.5 13.8V21h-1z" fill="${cloudColor}"/></svg>`,
    'cloudy': `<svg viewBox="0 0 32 32" fill="none"><path d="M10 22a6 6 0 010-12 7 7 0 0113.4-2 5 5 0 01-1.4 9.8H10z" fill="${cloudColor}"/></svg>`,
    'rain': `<svg viewBox="0 0 32 32" fill="none"><path d="M8 17a5 5 0 010-10 6 6 0 0111.5-1.7A4 4 0 0118.5 13H8z" fill="${cloudColor}"/><path d="M10 20l-1.5 4M15 19l-1.5 5M20 20l-1.5 4" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/></svg>`,
    'snow': `<svg viewBox="0 0 32 32" fill="none"><path d="M8 17a5 5 0 010-10 6 6 0 0111.5-1.7A4 4 0 0118.5 13H8z" fill="${cloudColor}"/><circle cx="10" cy="22" r="1.5" fill="#93C5FD"/><circle cx="15" cy="24" r="1.5" fill="#93C5FD"/><circle cx="20" cy="22" r="1.5" fill="#93C5FD"/></svg>`,
    'thunder': `<svg viewBox="0 0 32 32" fill="none"><path d="M8 17a5 5 0 010-10 6 6 0 0111.5-1.7A4 4 0 0118.5 13H8z" fill="#94A3B8"/><path d="M16 15l-3 6h4l-2 5" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  return icons[type] || icons['cloudy'];
};
