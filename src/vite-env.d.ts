/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string | undefined
  readonly VITE_CONVEX_SITE_URL: string | undefined
  readonly VITE_WIDGET_CONVEX_URL: string | undefined
  readonly VITE_WIDGET_CONVEX_SITE_URL: string | undefined
  readonly VITE_WIDGET_SCRIPT_URL: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css?inline' {
  const css: string
  export default css
}
