<div align="center">
  
# ⛅ Weather – Premium Global Weather Dashboard

**A modern weather experience with real-time forecasts, air quality insights, radar maps, and worldwide weather support.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](#)

</div>

---

## 📸 Project Preview

<div align="center">
  <!-- Placeholders for project screenshots -->
  <img src="/assets/placeholder-desktop.png" alt="Desktop View" width="800"/>
  <br/>
  <em>Desktop Dashboard View</em>
  <br/><br/>
  
  <p align="center">
    <img src="/assets/placeholder-mobile.png" alt="Mobile View" width="250"/>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="/assets/placeholder-darkmode.png" alt="Dark Mode" width="250"/>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="/assets/placeholder-radar.png" alt="Weather Radar" width="250"/>
  </p>
  <em>Mobile View | Dark Mode | Radar Maps</em>
</div>

---

## ✨ Features

- 🌍 **Worldwide City Search:** Precise location search with OpenStreetMap's geocoding.
- 📍 **Current Location Detection:** Instantly fetch weather for your exact coordinates.
- ⏱️ **Real-Time Weather Information:** Up-to-the-minute atmospheric conditions.
- 📅 **Hourly & 7-Day Forecasts:** Plan ahead with detailed short-term and long-term forecasts.
- 🍃 **Air Quality Index (AQI):** Comprehensive insights including PM2.5, PM10, CO, NO₂, and O₃.
- 🌅 **Sunrise & Sunset Tracking:** Dynamic daylight arcs and astronomical calculations.
- 🎨 **Dynamic Weather Backgrounds:** Stunning CSS animations that react to live weather conditions.
- 🌓 **Dark & Light Mode:** Beautifully crafted themes for day and night viewing.
- ⭐ **Favorites Management:** Save and quickly access your most important locations.
- 🕒 **Recent Searches:** Instantly pull up history with a fast command-palette style dropdown.
- 🗺️ **Live Weather Radar Support:** Interactive Leaflet maps with satellite, terrain, and radar overlays.
- 📱 **Progressive Web App (PWA):** Fully installable application for Desktop, iOS, and Android.
- 📶 **Offline Support:** Robust Service Worker caching strategies for network-independent access.
- 💻 **Responsive Design:** A flawless experience across mobile, tablet, and ultra-wide screens.
- ⏳ **Skeleton Loading:** Premium perceived performance during data fetching.
- ⚠️ **Weather Alerts:** Intelligent, locally generated warnings for severe conditions (heat, wind, rain).
- 🛋️ **Comfort Index:** Actionable health and clothing insights based on heat and humidity.
- 🌡️ **Celsius & Fahrenheit:** Seamlessly toggle between temperature units.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
- **Mapping & Radar:** Leaflet.js, OpenStreetMap, RainViewer
- **APIs:** Open-Meteo (Weather & AQI), Nominatim (Geocoding)
- **Web Technologies:** Service Workers, Web App Manifest (PWA)
- **Version Control & Deployment:** Git, GitHub, Vercel

---

## 📂 Project Architecture

The application is built using a highly modular ES6 architecture to ensure maintainability, scalability, and separation of concerns.

```text
Weather/
│
├── index.html            # Main HTML layout
├── style.css             # Global styles and dynamic themes
├── manifest.json         # PWA Manifest configuration
├── sw.js                 # Service Worker for caching and offline support
│
├── js/                   # ES6 Modules
│   ├── app.js            # Main controller and event orchestration
│   ├── api.js            # Network fetch wrappers (Open-Meteo, Nominatim)
│   ├── search.js         # Geocoding search logic and history management
│   ├── maps.js           # Leaflet map initialization and radar layers
│   ├── ui.js             # DOM updates, animations, and skeleton loaders
│   └── utils.js          # Helper functions (math, formatting, comfort index)
│
├── assets/               # Static assets
│   ├── icons/            # Weather and UI SVG icons
│   ├── weather/          # Background images/graphics
│   └── animations/       # CSS/Lottie animations
│
└── README.md             # Project documentation
```

---

## 🌤️ Weather Features Deep Dive

- **Real-Time Updates:** Data is fetched directly from WMO-standard weather models via Open-Meteo to ensure pinpoint accuracy.
- **Hourly & Weekly Forecasts:** Provides detailed metrics including precipitation probability, wind direction, UV index, and dew point.
- **AQI Monitoring:** An interactive air quality ring provides immediate health advice based on EPA-standard thresholds.
- **Weather Insights & Comfort:** Calculates a real-time "Feels Like" and "Comfort Index" to offer actionable advice (e.g., "High UV: Wear sunscreen", "Carry an umbrella").
- **Dynamic Themes:** The dashboard injects CSS-based particle animations (snow, rain drops, stars) dynamically matching current conditions.
- **Radar Layers:** Features a live interactive map centered on the searched location with real-time precipitation overlays.

---

## 🚀 Progressive Web App (PWA) Features

Built to blur the lines between web and native applications:
- **Installable Application:** Can be installed directly to the home screen or desktop via browser prompts.
- **Offline Support:** Utilizes `sw.js` to aggressively cache core HTML, CSS, and JS assets.
- **Fast Loading:** Achieves near-instant subsequent load times regardless of network conditions.
- **Mobile App Experience:** Features a custom standalone display mode, theme colors, and a native app-like sidebar navigation system.

---

## 🎨 UI/UX Highlights

- **Premium SaaS-Inspired Design:** Moves away from generic card layouts in favor of a sleek, 3-panel dashboard design found in enterprise software.
- **Smooth Animations:** Every interaction features curated cubic-bezier transitions.
- **Modern Typography:** Utilizes the crisp and highly readable *Inter* font family.
- **Responsive Layouts:** An adaptive grid system that elegantly collapses into a mobile-friendly drawer interface on smaller screens.
- **Skeleton Loading:** Eliminates layout shift and provides a premium feel while external APIs are resolving.

---

## 💻 Installation Guide

Follow these steps to run the project locally on your machine.

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

**2. Serve the application locally**
Because the project uses ES6 Modules and Service Workers, it must be run over a local HTTP server (the `file://` protocol will block these features).

*Using VS Code Live Server:*
- Open the project folder in VS Code.
- Right-click `index.html` and select **Open with Live Server**.

*Using Node.js (npx):*
```bash
npx serve .
```

*Using Python:*
```bash
python -m http.server 3000
```

**3. Open in Browser**
Navigate to `http://localhost:3000` (or the port provided by your server) to view the application.

---

## 🌐 Deployment Guide

This project is entirely static and does not require a backend Node.js server. It can be hosted on any modern static hosting provider.

- **Vercel / Netlify:** Simply connect your GitHub repository, set the build command to empty, and set the publish directory to the root `/`.
- **GitHub Pages:** Go to repository settings > Pages > Deploy from branch (`main`).

---

## 🔮 Future Improvements

While this dashboard is highly feature-rich, the following roadmap outlines planned enhancements:
- [ ] **Moon Phase UI Integration:** Visual components rendering the exact lunar cycle.
- [ ] **Advanced Radar Controls:** Timeline scrubber to play historical/future precipitation loops.
- [ ] **Push Notifications:** Web Push API integration for severe weather warnings.
- [ ] **AI-Powered Insights:** Integration with LLMs for personalized daily travel and clothing recommendations.
- [ ] **Historical Data View:** Charts displaying last week's or last year's weather patterns.

---

## 💼 Resume Highlights

*Why is this project portfolio-worthy?*

- **Complex Architecture Management:** Demonstrates the ability to refactor a monolithic script into a clean, modular ES6 architecture, proving readiness for large-scale enterprise codebases.
- **Keyless Hybrid API Integration:** Showcases advanced problem-solving by combining multiple free APIs (Open-Meteo, Nominatim, RainViewer) and localized math calculations to achieve premium features (Alerts, Comfort Index, Maps) without relying on expensive paid API keys.
- **Web App Performance:** Highlights a strong understanding of core web vitals through the implementation of Service Workers, caching strategies, and DOM-injected skeleton loaders.
- **Production-Level UI/UX:** Proves a deep understanding of modern CSS (Grid/Flexbox, Custom Properties, Media Queries) and design principles necessary to build a visually stunning, responsive, SaaS-like dashboard.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

Developed by **Ashish Jangra**

- **GitHub:** [@yourusername](https://github.com/yourusername)
- **LinkedIn:** [Ashish Jangra](https://linkedin.com/in/yourprofile)
- **Portfolio:** [yourwebsite.com](https://yourwebsite.com)
- **Email:** [your.email@example.com](mailto:your.email@example.com)

---
<div align="center">
  <i>If you found this project helpful, please consider giving it a ⭐ on GitHub!</i>
</div>
