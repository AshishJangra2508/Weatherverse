/**
 * Vercel Speed Insights Integration
 * Initializes performance tracking for the application
 */

import { injectSpeedInsights } from '../node_modules/@vercel/speed-insights/dist/index.mjs';

// Initialize Speed Insights
// The script automatically tracks Web Vitals and other performance metrics
// It only tracks data in production environments (not in development)
injectSpeedInsights({
  debug: false, // Set to true for debugging in development
  // Optional: sampleRate can be set to reduce the number of events sent (e.g., 0.5 for 50%)
  // sampleRate: 1,
});
