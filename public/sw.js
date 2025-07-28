// Basic service worker for future use
// Currently not in use as reminder functionality has been removed

self.addEventListener('install', (event) => {
  // console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// This service worker is ready for future enhancements
