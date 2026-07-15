// ══════════════════════════════════════════════════════════
// WEATHER — Main Entry Point
// ══════════════════════════════════════════════════════════
import { State, CONFIG } from './config.js';
import { $, $$, formatTime } from './utils.js';
import { fetchCityData, reverseGeocode, fetchRadarData } from './api.js';
import { handleSearchInput, renderRecents, renderFavorites, addToRecents, removeRecent, toggleFavorite } from './search.js';
import { updateUI, showSkeletons } from './ui.js';
import { initMap, updateRadarLayer, setMapLayer } from './maps.js';

export const loadCityData = async (city) => {
  State.currentCity = city;
  
  // Update Fav Button
  const btn = $('#cityFavBtn');
  const isFav = State.favorites.some(f => f.name === city.name);
  if(isFav) btn.classList.add('active'); else btn.classList.remove('active');
  
  showSkeletons();
  
  try {
    const data = await fetchCityData(city.latitude, city.longitude);
    updateUI(data.weather, data.aqi, data.alerts);
    initMap(city.latitude, city.longitude);
    
    // Try to load radar if not loaded
    if (!State.radarData) await fetchRadarData();
    updateRadarLayer(State.radarData);
    
  } catch (err) {
    console.error(err);
    window.showToast('Failed to load data');
  }
};
window.loadCityData = loadCityData; // Expose for onclick handlers in HTML string literals

const getLocation = () => {
  if (navigator.geolocation) {
    window.showToast('Locating...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const data = await reverseGeocode(latitude, longitude);
          const city = {
            latitude, longitude,
            name: data.address?.city || data.address?.town || 'My Location',
            country: data.address?.country || '',
            country_code: data.address?.country_code || '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          };
          loadCityData(city);
        } catch {
          loadCityData({ name: 'My Location', latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        }
      },
      () => window.showToast('Location access denied')
    );
  }
};

const updateClock = () => {
  if(State.weatherData && State.currentCity) {
    const tz = State.weatherData.timezone;
    $('#cityMeta').textContent = `${State.currentCity.admin1 ? State.currentCity.admin1+', ' : ''}${State.currentCity.country || ''} • Local time: ${formatTime(new Date().toISOString(), tz)}`;
    $('#pillTime').textContent = formatTime(new Date().toISOString(), tz);
  }
};

const initEvents = () => {
  // Theme
  $('#themeToggle').addEventListener('click', () => {
    State.theme = State.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', State.theme);
    localStorage.setItem(CONFIG.STORAGE.theme, State.theme);
    if(State.map) initMap(State.currentCity.latitude, State.currentCity.longitude);
  });

  // Unit
  $$('.unit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      $$('.unit-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      State.unit = e.target.dataset.unit;
      localStorage.setItem(CONFIG.STORAGE.unit, State.unit);
      if (State.weatherData) updateUI(State.weatherData, State.aqiData, State.alertsData);
    });
  });
  $(`.unit-btn[data-unit="${State.unit}"]`).classList.add('active');

  // Search
  const searchInput = $('#searchInput');
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => handleSearchInput(e.target.value), 300);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#topbarSearch')) $('#searchDropdown').classList.remove('open');
  });

  // Buttons
  $('#locationBtn').addEventListener('click', getLocation);
  $('#cityFavBtn').addEventListener('click', toggleFavorite);
  $('#sidebarAddFav').addEventListener('click', () => $('#searchInput').focus());
  $('#clearRecentsBtn').addEventListener('click', () => {
    State.recentSearches = [];
    localStorage.setItem(CONFIG.STORAGE.recents, '[]');
    renderRecents();
  });
  
  // Map layers
  $('#layerStandard')?.addEventListener('click', () => setMapLayer('standard'));
  $('#layerSatellite')?.addEventListener('click', () => setMapLayer('satellite'));
  $('#layerTerrain')?.addEventListener('click', () => setMapLayer('terrain'));

  // Mobile / Tablet Menus
  $('#mobileMenuBtn').addEventListener('click', () => {
    $('#sidebar').classList.add('open');
    $('#sidebarOverlay').classList.add('show');
  });
  
  const utilityBtn = $('#utilityMenuBtn');
  if (utilityBtn) {
    utilityBtn.addEventListener('click', () => {
      $('#rightPanel').classList.add('open');
      $('#sidebarOverlay').classList.add('show');
    });
  }

  $('#sidebarOverlay').addEventListener('click', () => {
    $('#sidebar').classList.remove('open');
    $('#rightPanel')?.classList.remove('open');
    $('#sidebarOverlay').classList.remove('show');
  });
  $$('.sidebar-nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const section = el.dataset.section;
      
      $$('.sidebar-nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
      
      if (section === 'search') {
        if (window.innerWidth >= 768 && window.innerWidth <= 1279) {
          $('#sidebar').classList.remove('open');
          $('#sidebarOverlay').classList.remove('show');
        }
        const searchInput = $('#searchInput');
        searchInput.focus();
        // Trigger a fake input event to show recents if empty
        if (!searchInput.value) {
          $('#searchDropdown').classList.add('open');
          if (State.recentSearches.length === 0) {
            $('#searchDropdown').innerHTML = '<div class="search-no-results">Type to search...</div>';
          } else {
            // Show recent searches in the popup
            $('#searchDropdown').innerHTML = '<div class="search-no-results" style="text-align:left; padding:8px 16px; font-size:0.8rem; font-weight:600; text-transform:uppercase;">Recent Searches</div>' + State.recentSearches.map(r => `
              <div class="search-result" onclick="window.selectCity(${r.latitude}, ${r.longitude}, '${r.name.replace(/'/g,"\\'")}', '${(r.admin1||'').replace(/'/g,"\\'")}', '${(r.country||'').replace(/'/g,"\\'")}')">
                <div class="search-result-icon">🕒</div>
                <div class="search-result-text">
                  <span class="search-result-city">${r.name}</span>
                  <span class="search-result-region">${r.country || ''}</span>
                </div>
              </div>
            `).join('');
          }
        }
      } else if (section === 'favorites') {
        // On mobile, keep sidebar open and scroll to favorites
        const favSec = $('#sidebarFavorites').closest('.sidebar-section');
        favSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Temporarily highlight the favorites section
        favSec.style.transition = 'background 0.3s';
        favSec.style.backgroundColor = 'var(--bg-card-hover)';
        setTimeout(() => favSec.style.backgroundColor = 'transparent', 1000);
      } else if (section === 'dashboard') {
        if (window.innerWidth >= 768 && window.innerWidth <= 1279) {
          $('#sidebar').classList.remove('open');
          $('#sidebarOverlay').classList.remove('show');
        }
        $('#mainContent').scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  $('#hourlyRight').addEventListener('click', () => {
    $('#hourlyScroll').scrollBy({ left: 200, behavior: 'smooth' });
  });
};

const init = () => {
  document.documentElement.setAttribute('data-theme', State.theme);
  
  // Expose global methods for inline HTML string event handlers
  window.selectCity = (lat, lon, name, admin1, country) => {
    $('#searchDropdown').classList.remove('open');
    $('#searchInput').value = '';
    const city = { latitude: lat, longitude: lon, name, admin1, country, timezone: 'auto' };
    addToRecents(city);
    loadCityData(city);
  };
  window.removeRecent = removeRecent;

  initEvents();
  renderFavorites();
  renderRecents();
  
  // Load Default
  const last = State.recentSearches[0];
  if (last) {
    loadCityData(last);
  } else {
    loadCityData({ name: 'New York', admin1: 'New York', country: 'United States', latitude: 40.7143, longitude: -74.006 });
  }

  setInterval(updateClock, 30000);
  
  // PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
