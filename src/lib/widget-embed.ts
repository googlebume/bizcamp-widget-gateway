const PRODUCTION_WIDGET_SCRIPT_URL =
  'https://adaptive-widget.kostapenko.com/widget.js'

/** Absolute production script URL shown in the admin Widget panel. */
export function getWidgetScriptUrl(): string {
  return PRODUCTION_WIDGET_SCRIPT_URL
}

/** Drop-in snippet shown in the admin Widget panel. */
export function getWidgetEmbedSnippet(): string {
  const src = getWidgetScriptUrl()
  return `<script src="${src}" defer></script>`
}
