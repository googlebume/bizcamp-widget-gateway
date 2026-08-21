import { useMemo, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { DashboardStats } from '@/features/dashboard/overview-panel'
import { LiquidGlass } from '@/components/liquid-glass'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { useErrorCopy } from '@/lib/use-error-copy'
import { toUserFacingError } from '@/lib/user-facing-error'
import { getWidgetEmbedSnippet } from '@/lib/widget-embed'

type WidgetPanelProps = {
  domain: string
  stats: DashboardStats | null | undefined
}

export function WidgetPanel({ domain, stats }: WidgetPanelProps) {
  const { t } = useI18n()
  const errorCopy = useErrorCopy()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)

  const embedSnippet = useMemo(() => getWidgetEmbedSnippet(), [])

  const eventRows = useMemo(() => {
    if (!stats) return []
    return [
      { label: t('widget.sessions'), value: stats.sessions },
      { label: t('widget.opens'), value: stats.widgetOpens },
      { label: t('widget.closes'), value: stats.widgetCloses },
      { label: t('widget.quizAnswers'), value: stats.quizAnswers },
      { label: t('widget.quizCompletions'), value: stats.quizCompletions },
      { label: t('widget.quizRestarts'), value: stats.quizRestarts },
      {
        label: t('widget.personalizationSuccess'),
        value: stats.personalizationSuccesses,
      },
      {
        label: t('widget.personalizationErrors'),
        value: stats.personalizationErrors,
      },
    ]
  }, [stats, t])

  const copySnippet = async (): Promise<void> => {
    setCopyError(null)
    try {
      await navigator.clipboard.writeText(embedSnippet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      setCopied(false)
      setCopyError(
        toUserFacingError(error, errorCopy('common.copyFailed')),
      )
    }
  }

  const embedParts = t('widget.embedBody', { domain }).split(domain)

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <LiquidGlass className="p-6 md:p-7">
        <h2 className="text-xl font-semibold tracking-tight">
          {t('widget.embed')}
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground text-pretty">
          {embedParts[0]}
          <code className="rounded-md bg-[color:var(--glass-recess)] px-1.5 py-0.5 text-xs">
            {domain}
          </code>
          {embedParts[1] ?? ''}
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl border border-[color:var(--glass-stroke-outer)] bg-[color:var(--glass-recess)] p-4 text-xs leading-relaxed">
          {embedSnippet}
        </pre>
        <Button
          type="button"
          variant="glass"
          className="mt-4"
          onClick={() => void copySnippet()}
        >
          {copied ? <Check /> : <Copy />}
          {copied ? t('common.copied') : t('common.copySnippet')}
        </Button>
        {copyError ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {copyError}
          </p>
        ) : null}
      </LiquidGlass>

      <LiquidGlass className="p-6 md:p-7">
        <h2 className="text-xl font-semibold tracking-tight">
          {t('widget.usageMix')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('widget.usageSubtitle')}
          {stats
            ? t('widget.lastDaysSuffix', { days: stats.rangeDays })
            : ''}
        </p>
        {!stats ? (
          <p className="mt-6 text-sm text-muted-foreground">
            {t('common.loading')}
          </p>
        ) : (
          <dl className="mt-6 grid grid-cols-12 gap-3 text-sm">
            {eventRows.map((row) => (
              <div
                key={row.label}
                className="col-span-12 flex items-center justify-between rounded-xl border border-[color:var(--glass-stroke-outer)] bg-[color:var(--glass-recess)] px-4 py-3 sm:col-span-6 lg:col-span-4"
              >
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-medium tabular-nums">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </LiquidGlass>

      {stats ? (
        <div className="grid grid-cols-12 gap-5 md:gap-6">
          <LiquidGlass className="col-span-12 p-6 md:col-span-6">
            <p className="text-[13px] font-medium text-muted-foreground">
              {t('widget.modeAdoption')}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {(
                [
                  ['soft', stats.modeBreakdown.soft],
                  ['optimal', stats.modeBreakdown.optimal],
                  ['deep', stats.modeBreakdown.deep],
                ] as const
              ).map(([label, value]) => (
                <li key={label} className="flex justify-between gap-3">
                  <span className="capitalize text-muted-foreground">{label}</span>
                  <span className="font-medium tabular-nums">{value}</span>
                </li>
              ))}
            </ul>
          </LiquidGlass>
          <LiquidGlass className="col-span-12 p-6 md:col-span-6">
            <p className="text-[13px] font-medium text-muted-foreground">
              {t('widget.localeSwitches')}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {(
                [
                  ['en', stats.localeBreakdown.en],
                  ['uk', stats.localeBreakdown.uk],
                ] as const
              ).map(([label, value]) => (
                <li key={label} className="flex justify-between gap-3">
                  <span className="uppercase text-muted-foreground">{label}</span>
                  <span className="font-medium tabular-nums">{value}</span>
                </li>
              ))}
            </ul>
          </LiquidGlass>
        </div>
      ) : null}
    </div>
  )
}
