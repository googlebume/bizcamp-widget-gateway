import { useQuery } from 'convex/react'
import { api } from '@bizcamp-backend/_generated/api'
import type { Id } from '@bizcamp-backend/_generated/dataModel'
import { LiquidGlass } from '@/components/liquid-glass'
import { useI18n } from '@/i18n/provider'

type LearnersPanelProps = {
  domain: string
  organizationId: Id<'organizations'>
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatAvg(value: number): string {
  return value.toFixed(value >= 10 ? 0 : 1)
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
    <LiquidGlass className="col-span-6 p-5 md:col-span-4 lg:col-span-3">
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

function ShareBar({
  title,
  items,
}: {
  title: string
  items: Array<{ label: string; value: number }>
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  const max = Math.max(1, ...items.map((item) => item.value))

  return (
    <LiquidGlass className="p-6">
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
                {total > 0 ? ` · ${formatPercent(item.value / total)}` : ''}
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
    </LiquidGlass>
  )
}

export function LearnersPanel({ domain, organizationId }: LearnersPanelProps) {
  const { t } = useI18n()
  const data = useQuery(api.analytics.getLearnersSummary, {
    domain,
    organizationId,
    rangeDays: 30,
  })

  if (data === undefined) {
    return (
      <LiquidGlass className="p-6">
        <p className="text-sm text-muted-foreground">{t('learners.loading')}</p>
      </LiquidGlass>
    )
  }

  if (data === null) {
    return (
      <LiquidGlass className="p-6">
        <p className="text-sm text-muted-foreground">
          {t('learners.claimDomain')}
        </p>
      </LiquidGlass>
    )
  }

  const modeItems = [
    { label: 'soft', value: data.modePreference.soft },
    { label: 'optimal', value: data.modePreference.optimal },
    { label: 'deep', value: data.modePreference.deep },
    { label: t('learners.modeNone'), value: data.modePreference.none },
  ]

  const calibrationItems = [
    {
      label: t('learners.calibratedLabel'),
      value: data.calibratedLearners,
    },
    {
      label: t('learners.uncalibratedLabel'),
      value: data.uncalibratedLearners,
    },
  ]

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <LiquidGlass className="p-6 md:p-7">
        <h2 className="text-xl font-semibold tracking-tight">
          {t('learners.title')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('learners.subtitle', {
            domain: data.domain,
            days: data.rangeDays,
          })}
        </p>
      </LiquidGlass>

      {data.totalLearners === 0 ? (
        <LiquidGlass className="p-6">
          <p className="text-sm text-muted-foreground">{t('learners.empty')}</p>
        </LiquidGlass>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-4 md:gap-5">
            <StatCard
              label={t('learners.total')}
              value={data.totalLearners}
              hint={t('learners.totalHint')}
            />
            <StatCard
              label={t('learners.active7d')}
              value={data.engagedLast7Days}
              hint={t('learners.active7dHint', {
                rate: formatPercent(data.engagedLast7Days / data.totalLearners),
              })}
            />
            <StatCard
              label={t('learners.calibrated')}
              value={data.calibratedLearners}
              hint={t('overview.rate', {
                rate: formatPercent(data.calibrationRate),
              })}
            />
            <StatCard
              label={t('learners.notCalibrated')}
              value={data.uncalibratedLearners}
            />
            <StatCard
              label={t('learners.avgSessions')}
              value={formatAvg(data.avgSessions)}
              hint={t('learners.perLearner')}
            />
            <StatCard
              label={t('learners.avgOpens')}
              value={formatAvg(data.avgWidgetOpens)}
              hint={t('learners.perLearner')}
            />
            <StatCard
              label={t('learners.avgPersonalizations')}
              value={formatAvg(data.avgPersonalizations)}
              hint={t('learners.perLearner')}
            />
          </div>

          <div className="grid grid-cols-12 gap-5 md:gap-6">
            <div className="col-span-12 md:col-span-6">
              <ShareBar
                title={t('learners.calibrationStatus')}
                items={calibrationItems}
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <ShareBar title={t('learners.lastMode')} items={modeItems} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
