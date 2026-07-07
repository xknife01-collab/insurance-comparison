// Service Worker for 보험리모델링 관리자 PWA
const CACHE_NAME = 'admin-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Bypass non-http(s) requests like chrome-extension, websockets, and Vite HMR
  if (!event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // 1. Bypass external/third-party domains (e.g. Supabase, Aligo, fonts)
  // to avoid service worker network errors on external calls.
  if (url.hostname !== self.location.hostname) {
    return;
  }

  // 2. Bypass local API requests to let the browser handle them directly
  if (url.pathname.includes('/api/')) {
    return;
  }

  // 3. For local requests, catch fetch errors gracefully (e.g. offline status)
  // to prevent unhandled service worker fetch exceptions in the console.
  event.respondWith(
    fetch(event.request).catch((err) => {
      console.warn('[Service Worker] Local fetch failed:', event.request.url, err);
      return new Response('Offline / Network connection lost', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

// Push notification event listener
self.addEventListener('push', (event) => {
  let data = { title: '보험리모델링 관리자', body: '새로운 알림이 도착했습니다.' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: '보험리모델링 관리자', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/admin-icon-192.png',
    badge: '/admin-icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/admin'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a dashboard window is already open, focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
