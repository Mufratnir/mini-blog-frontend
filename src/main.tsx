import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './css/globals.css'
import App from './App.tsx'
import { UIProvider } from './axios/UIContext.tsx'



createRoot(document.getElementById('root')!).render(
  <UIProvider>
    <App />
  </UIProvider>,
);
