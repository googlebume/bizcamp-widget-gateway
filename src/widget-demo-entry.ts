/**
 * Standalone host page for the live widget demo iframe.
 * Mounts the real Reading Profile runtime (auth + quiz + personalization)
 * against the widget Convex backend — identical to production embed behavior.
 */
import { AnonymousSessionRuntime } from '@bizcamp-widget/auth/AnonymousSessionRuntime'
import { PersonalizationRuntime } from '@bizcamp-widget/personalization/PersonalizationRuntime'
import { WidgetRuntime } from '@bizcamp-widget/widget/runtime/WidgetRuntime'

type DemoRuntime = {
  destroy: () => void
}

function requiredOrigin(name: string, value: string | undefined): string {
  const candidate = value?.trim()
  if (!candidate) {
    throw new Error(
      `Missing ${name}. Set it in .env.local to the react-widget-bizcamp Convex deployment.`,
    )
  }
  const url = new URL(candidate)
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`${name} must use HTTP or HTTPS`)
  }
  return url.origin
}

function mountLiveWidget(): DemoRuntime {
  const convexUrl = requiredOrigin(
    'VITE_WIDGET_CONVEX_URL',
    import.meta.env.VITE_WIDGET_CONVEX_URL,
  )
  const convexSiteUrl = requiredOrigin(
    'VITE_WIDGET_CONVEX_SITE_URL',
    import.meta.env.VITE_WIDGET_CONVEX_SITE_URL,
  )

  const authSession = new AnonymousSessionRuntime({ convexUrl })
  let widget: WidgetRuntime

  try {
    widget = new WidgetRuntime({
      remember: false,
      renderRoot: (children) => authSession.render(children),
    })
  } catch (error) {
    authSession.destroy()
    throw error
  }

  let personalization: PersonalizationRuntime
  try {
    personalization = new PersonalizationRuntime(
      { endpoint: `${convexSiteUrl}/api/style-html` },
      (signal) => authSession.getAccessToken(signal),
    )
    personalization.start(widget.getMode())
  } catch (error) {
    widget.destroy()
    authSession.destroy()
    throw error
  }

  return {
    destroy: () => {
      personalization.destroy()
      widget.destroy()
      authSession.destroy()
    },
  }
}

function showBootError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  const node = document.createElement('div')
  node.className = 'boot-error'
  node.setAttribute('role', 'alert')
  node.textContent = `Widget demo failed to start: ${message}`
  document.body.prepend(node)
}

let runtime: DemoRuntime | undefined

try {
  runtime = mountLiveWidget()
} catch (error) {
  console.error('[Bizcamp widget demo]', error)
  showBootError(error)
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    runtime?.destroy()
  })
}
