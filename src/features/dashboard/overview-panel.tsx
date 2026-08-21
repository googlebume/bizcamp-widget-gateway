import { useMemo } from 'react'
import { Activity } from 'lucide-react'
import { LiquidGlass } from '@/components/liquid-glass'
import { useI18n } from '@/i18n/provider'

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
  widgetCloses: number
  widgetOpens: number
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatEventLabel(eventType: string): string {
  return eventType.replaceAll('_', ' ')
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <LiquidGlass className="col-span-6 p-5 md:col-span-3 lg:col-span-2">
      <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground text-pretty">{hint}</p>
      ) : null}
    </LiquidGlass>
  )
}

function BarChart({
  points,
  valueKey,
  label,
}: {
  points: DashboardStats['daily']
  valueKey: 'sessions' | 'widgetOpens' | 'quizCompletions' | 'personalizations'
  label: string
}) {
  const max = Math.max(1, ...points.map((point) => point[valueKey]))
  return (
    <div>
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      <div className="mt-4 flex h-36 items-end gap-1">
        {points.map((point) => {
          const value = point[valueKey]
          const height = `${Math.max(4, (value / max) * 100)}%`
          return (
            <div
              key={`${valueKey}-${point.date}`}
              className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
              title={`${point.date}: ${value}`}
            >
              <div
                className="w-full rounded-t-md bg-primary/75 transition-[height] duration-300"
                style={{ height }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
        <span>{points[0]?.date.slice(5)}</span>
        <span>{points.at(-1)?.date.slice(5)}</span>
      </div>
    </div>
  )
}

function BreakdownBars({
  title,
  items,
}: {
  title: string
  items: Array<{ label: string; value: number }>
}) {
  const max = Math.max(1, ...items.map((item) => item.value))
  return (
    <div>
      <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium tracking-tight capitalize">
                {item.label}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {item.value}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[color:var(--glass-recess)]">
              <div
                className="h-full rounded-full bg-primary/80 transition-[width] duration-300"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
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
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-5">
        <StatCard
          label={t('overview.activeLearners')}
          value={stats.activeLearners}
          hint={t('overview.activeLearnersHint')}
        />
        <StatCard
          label={t('overview.sessions')}
          value={stats.sessions}
          hint={t('overview.lastDays', { days: stats.rangeDays })}
        />
        <StatCard
          label={t('overview.widgetOpens')}
          value={stats.widgetOpens}
        />
        <StatCard
          label={t('overview.quizCompletions')}
          value={stats.quizCompletions}
          hint={t('overview.rate', {
            rate: formatPercent(stats.completionRate),
          })}
        />
        <StatCard
          label={t('overview.personalizations')}
          value={stats.personalizationSuccesses}
          hint={t('overview.errors', {
            count: stats.personalizationErrors,
          })}
        />
        <StatCard
          label={t('overview.totalEvents')}
          value={stats.totalEvents}
        />
      </div>

      <div className="grid grid-cols-12 gap-5 md:gap-6">
        <LiquidGlass className="col-span-12 p-6 md:col-span-8">
          <div className="mb-2 flex items-center gap-2">
            <Activity className="size-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold tracking-tight">
              {t('overview.activity', { days: stats.rangeDays })}
            </h2>
          </div>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <BarChart
              points={stats.daily}
              valueKey="sessions"
              label={t('overview.sessions')}
            />
            <BarChart
              points={stats.daily}
              valueKey="widgetOpens"
              label={t('overview.widgetOpens')}
            />
            <BarChart
              points={stats.daily}
              valueKey="quizCompletions"
              label={t('overview.quizCompletions')}
            />
            <BarChart
              points={stats.daily}
              valueKey="personalizations"
              label={t('overview.personalizations')}
            />
          </div>
        </LiquidGlass>

        <div className="col-span-12 flex flex-col gap-5 md:col-span-4 md:gap-6">
          <LiquidGlass className="p-6">
            <BreakdownBars
              title={t('overview.modeAdoption')}
              items={modeItems}
            />
          </LiquidGlass>
          <LiquidGlass className="p-6">
            <BreakdownBars
              title={t('overview.localeSwitches')}
              items={localeItems}
            />
          </LiquidGlass>
          <LiquidGlass className="p-6">
            <p className="text-[13px] font-medium text-muted-foreground">
              {t('overview.quizFunnel')}
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{t('overview.answers')}</dt>
                <dd className="font-medium tabular-nums">{stats.quizAnswers}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">
                  {t('overview.completions')}
                </dt>
                <dd className="font-medium tabular-nums">
                  {stats.quizCompletions}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">
                  {t('overview.restarts')}
                </dt>
                <dd className="font-medium tabular-nums">{stats.quizRestarts}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{t('overview.closes')}</dt>
                <dd className="font-medium tabular-nums">{stats.widgetCloses}</dd>
              </div>
            </dl>
          </LiquidGlass>
        </div>
      </div>

      <LiquidGlass className="p-6 md:p-7">
        <h2 className="text-xl font-semibold tracking-tight">
          {t('overview.recentActivity')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('overview.latestOn', { domain: stats.domain })}
        </p>
        <ul className="mt-5 divide-y divide-[color:var(--glass-stroke-outer)]">
          {stats.recentEvents.length === 0 ? (
            <li className="py-4 text-sm text-muted-foreground">
              {t('overview.noEvents')}
            </li>
          ) : (
            stats.recentEvents.map((event) => (
              <li
                key={event._id}
                className="flex flex-wrap items-baseline justify-between gap-2 py-3 text-sm"
              >
                <div>
                  <p className="font-medium capitalize tracking-tight">
                    {formatEventLabel(event.eventType)}
                  </p>
                  <p className="text-xs text-muted-foreground">
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
      </LiquidGlass>
    </>
  )
}
