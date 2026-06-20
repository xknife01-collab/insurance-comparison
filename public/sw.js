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
  // Bypass API requests to let the browser handle them directly
  if (event.request.url.includes('/api/')) {
    return;
  }
  event.respondWith(fetch(event.request));
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
