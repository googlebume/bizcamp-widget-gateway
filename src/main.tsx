import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { App } from '@/App'
import { LocalizedErrorBoundary } from '@/components/localized-error-boundary'
import { ThemeProvider } from '@/components/theme-provider'
import { LocaleProvider } from '@/i18n/provider'
import './index.css'

const convexUrl = import.meta.env.VITE_CONVEX_URL

if (!convexUrl) {
  console.warn(
    '[Bizcamp Gateway] VITE_CONVEX_URL is not set. Run `bun run dev:with-backend` or copy URLs from the widget .env.local.',
  )
}

const convex = new ConvexReactClient(convexUrl ?? 'https://placeholder.convex.cloud')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <LocaleProvider>
          <LocalizedErrorBoundary>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </LocalizedErrorBoundary>
        </LocaleProvider>
      </ThemeProvider>
    </ConvexProvider>
  </StrictMode>,
)
