/**
 * Absolute script URL for LMS embeds.
 * Prefer VITE_WIDGET_SCRIPT_URL in production if the CDN differs from the admin origin.
 * Otherwise serve /widget.js from this app (see public/widget.js).
 */
export function getWidgetScriptUrl(): string {
  const configured = import.meta.env.VITE_WIDGET_SCRIPT_URL?.trim()
  if (configured) {
    try {
      return new URL(configured).href
    } catch {
      console.warn(
        '[Bizcamp] VITE_WIDGET_SCRIPT_URL is invalid; falling back to /widget.js',
      )
    }
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return new URL('/widget.js', window.location.origin).href
  }

  return '/widget.js'
}

/** Drop-in snippet shown in the admin Widget panel. */
export function getWidgetEmbedSnippet(): string {
  const src = getWidgetScriptUrl()
  return `<script src="${src}" defer></script>`
}
