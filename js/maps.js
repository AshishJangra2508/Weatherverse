// ══════════════════════════════════════════════════════════
// WEATHER — Leaflet Maps Integration (with Radar Layers)
// ══════════════════════════════════════════════════════════
import { State, CONFIG } from './config.js';
import { $ } from './utils.js';

export const initMap = (lat, lon) => {
  const mapEl = $('#weatherMap');
  if(!window.L) return; // Leaflet not loaded
  
  const tileUrl = State.theme === 'dark' 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  if (!State.map) {
    State.map = L.map(mapEl, { zoomControl: false, attributionControl: false }).setView([lat, lon], 10);
    State.mapLayers.base = L.tileLayer(tileUrl).addTo(State.map);
    State.mapMarker = L.marker([lat, lon]).addTo(State.map);
  } else {
    State.map.setView([lat, lon], 10);
    State.mapMarker.setLatLng([lat, lon]);
    State.mapLayers.base.setUrl(tileUrl);
  }
};

export const updateRadarLayer = (radarData) => {
  if (!State.map || !radarData || !radarData.radar || !radarData.radar.past) return;
  
  // Get the most recent radar timestamp
  const pastFrames = radarData.radar.past;
  if(pastFrames.length === 0) return;
  const latestFrame = pastFrames[pastFrames.length - 1].path;
  
  const radarUrl = `${radarData.host}${latestFrame}/256/{z}/{x}/{y}/2/1_1.png`;
  
  if (State.mapLayers.radar) {
    State.mapLayers.radar.setUrl(radarUrl);
  } else {
    State.mapLayers.radar = L.tileLayer(radarUrl, { opacity: 0.6, zIndex: 10 }).addTo(State.map);
  }
};

export const setMapLayer = (type) => {
  if (!State.map) return;
  
  const urls = {
    standard: State.theme === 'dark' ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png'
  };
  
  if (urls[type] && State.mapLayers.base) {
    State.mapLayers.base.setUrl(urls[type]);
  }
};
