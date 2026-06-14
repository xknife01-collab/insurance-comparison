import { useEffect } from 'react';

export default function PwaMetaSwitcher() {
  useEffect(() => {
    const updatePwaMetadata = () => {
      const isConfiguringAdmin = window.location.pathname.startsWith('/admin');
      
      // 1. Dynamic Manifest Swapping
      let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
      
      if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        document.head.appendChild(manifestLink);
      }
      
      const targetManifest = isConfiguringAdmin ? '/manifest-admin.json' : '/manifest-user.json';
      
      if (manifestLink.getAttribute('href') !== targetManifest) {
        manifestLink.setAttribute('href', targetManifest);
        console.log(`PWA Manifest dynamically switched to: ${targetManifest}`);
      }

      // 2. Dynamic Theme Color Swapping
      let themeMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
      
      if (!themeMeta) {
        themeMeta = document.createElement('meta');
        themeMeta.name = 'theme-color';
        document.head.appendChild(themeMeta);
      }
      
      const targetColor = isConfiguringAdmin ? '#ea580c' : '#f97316';
      
      if (themeMeta.getAttribute('content') !== targetColor) {
        themeMeta.setAttribute('content', targetColor);
      }
    };

    // Run on mount
    updatePwaMetadata();

    // Listen to route changes (if any SPA history push happens)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      updatePwaMetadata();
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      updatePwaMetadata();
    };

    window.addEventListener('popstate', updatePwaMetadata);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', updatePwaMetadata);
    };
  }, []);

  return null; // Side effect component
}
