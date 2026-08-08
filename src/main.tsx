import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrandingProvider } from './hooks/useB2BBranding.tsx';
import PwaMetaSwitcher from './components/PwaMetaSwitcher.tsx';
// [보장분석 리포트 v2] 기존 App.tsx 건드리지 않고 독립 라우트 추가
import { ReportV2Page } from './components/report/v2/ReportV2Page.tsx';

const isReportV2 = window.location.pathname.startsWith('/report-v2');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isReportV2 ? (
      <ReportV2Page />
    ) : (
      <BrandingProvider>
        <PwaMetaSwitcher />
        <App />
      </BrandingProvider>
    )}
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service worker registered successfully', reg.scope))
      .catch((err) => console.error('Service worker registration failed', err));
  });
}

