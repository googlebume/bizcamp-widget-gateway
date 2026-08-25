import { useMemo } from 'react'
import { Activity, ChevronDown } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { formatDuration } from '@/lib/format-duration'

export type DashboardStats = {
  activeLearners: number
  completionRate: number
  daily: Array<{
    date: string
    personalizations: number
    quizCompletions: number
    sessions: number
    widgetOpens: number
  }>
  domain: string
  localeBreakdown: { en: number; uk: number }
  modeBreakdown: { soft: number; optimal: number; deep: number }
  personalizationErrors: number
  personalizationSuccesses: number
  quizAnswers: number
  quizCompletions: number
  quizRestarts: number
  rangeDays: number
  recentEvents: Array<{
    _id: string
    createdAt: number
    eventType: string
    locale?: string
    modeId?: string
    path?: string
    questionId?: string
  }>
  sessions: number
  totalEvents: number
  avgPageTimeMs: number
  totalPageTimeMs: number
  widgetCloses: number
  widgetOpens: number
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatEventLabel(eventType: string): string {
  return eventType.replaceAll('_', ' ')
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="dashboard-metric">
      <dt>{label}</dt>
      <dd>{value}</dd>
      {hint ? <p>{hint}</p> : null}
    </div>
  )
}

function ActivityChart({ points }: { points: DashboardStats['daily'] }) {
  const { t } = useI18n()
  const max = Math.max(1, ...points.map((point) => point.sessions))

  return (
    <div className="mt-8">
      <div className="flex h-52 items-end gap-1.5 sm:gap-2">
        {points.map((point) => {
          const height = `${Math.max(3, (point.sessions / max) * 100)}%`
          return (
            <div
              key={point.date}
              className="group flex min-w-0 flex-1 items-end self-stretch"
              role="img"
              aria-label={`${point.date}: ${point.sessions} ${t('overview.sessions').toLowerCase()}`}
            >
              <div className="relative flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-[4px] bg-primary/75 transition-[height,background-color] duration-300 group-hover:bg-primary"
                  style={{ height }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex justify-between text-[11px] font-medium tabular-nums text-muted-foreground">
        <span>{points[0]?.date.slice(5)}</span>
        <span>{points.at(-1)?.date.slice(5)}</span>
      </div>
    </div>
  )
}

function Breakdown({
  title,
  items,
}: {
  title: string
  items: Array<{ label: string; value: number }>
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <div>
      <h3 className="dashboard-subheading">{title}</h3>
      <ul className="mt-5 space-y-4">
        {items.map((item) => {
          const share = total > 0 ? item.value / total : 0
          return (
            <li key={item.label}>
              <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium capitalize">{item.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {item.value}{total > 0 ? ` · ${formatPercent(share)}` : ''}
                </span>
              </div>
              <div className="dashboard-progress-track">
                <div
                  className="dashboard-progress-fill"
                  style={{ width: `${share * 100}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

type OverviewPanelProps = {
  stats: DashboardStats
}

export function OverviewPanel({ stats }: OverviewPanelProps) {
  const { t, dateLocale } = useI18n()

  const modeItems = useMemo(
    () => [
      { label: 'soft', value: stats.modeBreakdown.soft },
      { label: 'optimal', value: stats.modeBreakdown.optimal },
      { label: 'deep', value: stats.modeBreakdown.deep },
    ],
    [stats.modeBreakdown],
  )

  const localeItems = useMemo(
    () => [
      { label: 'en', value: stats.localeBreakdown.en },
      { label: 'uk', value: stats.localeBreakdown.uk },
    ],
    [stats.localeBreakdown],
  )

  return (
    <div className="dashboard-content-stack">
      <section className="dashboard-panel dashboard-panel-primary overflow-hidden">
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)]">
          <div className="border-b border-border/60 p-6 md:p-8 lg:border-b-0 lg:border-r">
            <p className="dashboard-section-index">
              01 · {t('overview.lastDays', { days: stats.rangeDays })}
            </p>
            <p className="mt-8 text-sm font-medium text-muted-foreground">
              {t('overview.activeLearners')}
            </p>
            <p className="mt-2 text-6xl font-semibold tracking-[-0.06em] tabular-nums md:text-7xl">
              {stats.activeLearners}
            </p>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-3">
            <Metric
              label={t('overview.sessions')}
              value={stats.sessions}
            />
            <Metric label={t('overview.widgetOpens')} value={stats.widgetOpens} />
            <Metric
              label={t('overview.quizCompletions')}
              value={stats.quizCompletions}
              hint={t('overview.rate', { rate: formatPercent(stats.completionRate) })}
            />
          </dl>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.75fr)]">
        <section className="dashboard-panel p-6 md:p-8">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-section-index">02 · {t('overview.activity', { days: stats.rangeDays })}</p>
              <h2>{t('overview.sessions')}</h2>
            </div>
            <Activity className="size-5 text-primary" aria-hidden />
          </div>
          <ActivityChart points={stats.daily} />
        </section>

        <section className="dashboard-panel p-6 md:p-8">
          <p className="dashboard-section-index">03 · {t('overview.signals')}</p>
          <dl className="mt-5 divide-y divide-border/60">
            {[
              [t('overview.personalizations'), stats.personalizationSuccesses],
              [t('widget.personalizationErrors'), stats.personalizationErrors],
              [t('overview.pageTime'), formatDuration(stats.totalPageTimeMs)],
              [t('overview.avgPageTime'), formatDuration(stats.avgPageTimeMs)],
              [t('overview.totalEvents'), stats.totalEvents],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="dashboard-panel p-6 md:p-8">
        <div className="dashboard-section-heading">
          <div>
            <p className="dashboard-section-index">04 · {t('overview.audience')}</p>
            <h2>{t('overview.behaviorMix')}</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-8 border-t border-border/60 pt-8 md:grid-cols-3 md:divide-x md:divide-border/60">
          <Breakdown title={t('overview.modeAdoption')} items={modeItems} />
          <div className="md:pl-8">
            <Breakdown title={t('overview.localeSwitches')} items={localeItems} />
          </div>
          <div className="md:pl-8">
            <h3 className="dashboard-subheading">{t('overview.quizFunnel')}</h3>
            <dl className="mt-5 space-y-4">
              {[
                [t('overview.answers'), stats.quizAnswers],
                [t('overview.completions'), stats.quizCompletions],
                [t('overview.restarts'), stats.quizRestarts],
                [t('overview.closes'), stats.widgetCloses],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between gap-3 text-sm">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <details className="dashboard-disclosure">
        <summary>
          <strong>{t('overview.recentActivity')}</strong>
          <ChevronDown aria-hidden />
        </summary>
        <div className="border-t border-border/60 px-6 pb-3 md:px-8">
          <ul className="divide-y divide-border/60">
            {stats.recentEvents.length === 0 ? (
              <li className="py-5 text-sm text-muted-foreground">
                {t('overview.noEvents')}
              </li>
            ) : (
              stats.recentEvents.slice(0, 6).map((event) => (
                <li
                  key={event._id}
                  className="flex flex-wrap items-baseline justify-between gap-3 py-4 text-sm"
                >
                  <div>
                    <p className="font-medium capitalize tracking-tight">
                      {formatEventLabel(event.eventType)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[event.modeId, event.locale, event.questionId, event.path]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </p>
                  </div>
                  <time
                    className="text-xs tabular-nums text-muted-foreground"
                    dateTime={new Date(event.createdAt).toISOString()}
                  >
                    {new Date(event.createdAt).toLocaleString(dateLocale)}
                  </time>
                </li>
              ))
            )}
          </ul>
        </div>
      </details>
    </div>
  )
}
