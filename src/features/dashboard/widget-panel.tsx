import { useMemo, useState } from 'react'
import { Check, ChevronDown, CircleCheck, Copy, Globe2 } from 'lucide-react'
import type { DashboardStats } from '@/features/dashboard/overview-panel'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { useErrorCopy } from '@/lib/use-error-copy'
import { toUserFacingError } from '@/lib/user-facing-error'
import { getWidgetEmbedSnippet, getWidgetScriptUrl } from '@/lib/widget-embed'

type WidgetPanelProps = {
  domain: string
  stats: DashboardStats | null | undefined
}

export function WidgetPanel({ domain, stats }: WidgetPanelProps) {
  const { t } = useI18n()
  const errorCopy = useErrorCopy()
  const [copyError, setCopyError] = useState<string | null>(null)
  const [copiedTarget, setCopiedTarget] = useState<'url' | 'snippet' | null>(null)
  const scriptUrl = useMemo(() => getWidgetScriptUrl(), [])
  const embedSnippet = useMemo(() => getWidgetEmbedSnippet(), [])

  const copyText = async (
    value: string,
    target: 'url' | 'snippet',
  ): Promise<void> => {
    setCopyError(null)
    try {
      await navigator.clipboard.writeText(value)
      setCopiedTarget(target)
      window.setTimeout(() => setCopiedTarget(null), 2000)
    } catch (error) {
      setCopiedTarget(null)
      setCopyError(toUserFacingError(error, errorCopy('common.copyFailed')))
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.65fr)] xl:items-start">
      <section className="dashboard-panel dashboard-panel-primary overflow-hidden">
        <div className="border-b border-border/60 p-6 md:p-8">
          <p className="dashboard-section-index">01 · {t('widget.installStep')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance">
            {t('widget.embed')}
          </h2>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{t('widget.installCode')}</p>
            </div>
            <Button
              type="button"
              onClick={() => void copyText(embedSnippet, 'snippet')}
            >
              {copiedTarget === 'snippet' ? <Check /> : <Copy />}
              {copiedTarget === 'snippet' ? t('common.copied') : t('common.copySnippet')}
            </Button>
          </div>
          <pre className="dashboard-code-block">{embedSnippet}</pre>
          {copyError ? (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {copyError}
            </p>
          ) : null}
        </div>

        <details className="border-t border-border/60">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-sm font-medium md:px-8 [&::-webkit-details-marker]:hidden">
            <span>{t('widget.advanced')}</span>
            <ChevronDown className="size-4 text-muted-foreground transition-transform [[open]>&]:rotate-180" aria-hidden />
          </summary>
          <div className="border-t border-border/60 px-6 py-5 md:px-8">
            <p className="text-xs font-medium text-muted-foreground">
              {t('widget.scriptUrl')}
            </p>
            <code className="mt-2 block break-all rounded-xl bg-[color:var(--glass-recess)] p-4 text-xs">
              {scriptUrl}
            </code>
            <Button
              type="button"
              variant="outline"
              className="mt-3"
              onClick={() => void copyText(scriptUrl, 'url')}
            >
              {copiedTarget === 'url' ? <Check /> : <Copy />}
              {copiedTarget === 'url' ? t('common.copied') : t('common.copyUrl')}
            </Button>
          </div>
        </details>
      </section>

      <aside className="dashboard-panel p-6 md:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
            <CircleCheck className="size-5" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold">{t('widget.liveStatus')}</p>
            <p className="text-xs text-muted-foreground">{t('widget.connected')}</p>
          </div>
        </div>

        <div className="mt-7 flex items-center gap-2 border-y border-border/60 py-4 text-sm">
          <Globe2 className="size-4 text-primary" aria-hidden />
          <span className="min-w-0 truncate font-medium">{domain}</span>
        </div>

        <dl className="mt-3 divide-y divide-border/60">
          {[
            [t('widget.sessions'), stats?.sessions ?? '—'],
            [t('widget.opens'), stats?.widgetOpens ?? '—'],
            [t('widget.personalizationErrors'), stats?.personalizationErrors ?? '—'],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex items-center justify-between gap-3 py-3.5 text-sm">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  )
}
