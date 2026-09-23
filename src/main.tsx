import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { PreferencesProvider } from '@/contexts/PreferencesContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { initBridge } from '@/lib/bridge'
import './index.css'
import App from './App'

// Start Firestore listeners → populate bridge cache
initBridge()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <PreferencesProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </PreferencesProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
