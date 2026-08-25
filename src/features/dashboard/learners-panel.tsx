import { useQuery } from 'convex/react'
import { Users } from 'lucide-react'
import { api } from '@bizcamp-backend/_generated/api'
import type { Id } from '@bizcamp-backend/_generated/dataModel'
import { useI18n } from '@/i18n/provider'
import { formatDuration } from '@/lib/format-duration'

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

function ShareBar({
  label,
  value,
  total,
}: {
  label: string
  value: number
  total: number
}) {
  const share = total > 0 ? value / total : 0

  return (
    <li>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium capitalize">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {value}{total > 0 ? ` · ${formatPercent(share)}` : ''}
        </span>
      </div>
      <div className="dashboard-progress-track">
        <div className="dashboard-progress-fill" style={{ width: `${share * 100}%` }} />
      </div>
    </li>
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
    return <section className="dashboard-empty-state">{t('learners.loading')}</section>
  }

  if (data === null) {
    return <section className="dashboard-empty-state">{t('learners.claimDomain')}</section>
  }

  if (data.totalLearners === 0) {
    return (
      <section className="dashboard-empty-state">
        <Users className="size-5 text-primary" aria-hidden />
        <p>{t('learners.empty')}</p>
      </section>
    )
  }

  const modeItems = [
    { label: 'soft', value: data.modePreference.soft },
    { label: 'optimal', value: data.modePreference.optimal },
    { label: 'deep', value: data.modePreference.deep },
    { label: t('learners.modeNone'), value: data.modePreference.none },
  ]
  const modeTotal = modeItems.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="dashboard-content-stack">
      <section className="dashboard-panel dashboard-panel-primary overflow-hidden">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <div className="border-b border-border/60 p-6 md:p-8 lg:border-b-0 lg:border-r">
            <p className="dashboard-section-index">
              01 · {t('overview.lastDays', { days: data.rangeDays })}
            </p>
            <p className="mt-8 text-sm font-medium text-muted-foreground">
              {t('learners.total')}
            </p>
            <p className="mt-2 text-6xl font-semibold tracking-[-0.06em] tabular-nums md:text-7xl">
              {data.totalLearners}
            </p>
          </div>
          <dl className="grid sm:grid-cols-3">
            <div className="dashboard-metric">
              <dt>{t('learners.active7d')}</dt>
              <dd>{data.engagedLast7Days}</dd>
              <p>
                {t('learners.active7dHint', {
                  rate: formatPercent(data.engagedLast7Days / data.totalLearners),
                })}
              </p>
            </div>
            <div className="dashboard-metric">
              <dt>{t('learners.calibrated')}</dt>
              <dd>{data.calibratedLearners}</dd>
              <p>{t('overview.rate', { rate: formatPercent(data.calibrationRate) })}</p>
            </div>
            <div className="dashboard-metric">
              <dt>{t('learners.notCalibrated')}</dt>
              <dd>{data.uncalibratedLearners}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.4fr)]">
        <section className="dashboard-panel p-6 md:p-8">
          <p className="dashboard-section-index">02 · {t('learners.behavior')}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {t('learners.perLearner')}
          </h2>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7">
            {[
              [t('learners.avgSessions'), formatAvg(data.avgSessions)],
              [t('learners.avgOpens'), formatAvg(data.avgWidgetOpens)],
              [t('learners.avgPersonalizations'), formatAvg(data.avgPersonalizations)],
              [t('learners.avgPageTime'), formatDuration(data.avgPageTimeMs)],
            ].map(([label, value]) => (
              <div key={String(label)}>
                <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                <dd className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="dashboard-panel p-6 md:p-8">
          <p className="dashboard-section-index">03 · {t('learners.profiles')}</p>
          <div className="mt-7 grid gap-8 md:grid-cols-2 md:divide-x md:divide-border/60">
            <div>
              <h2 className="dashboard-subheading">{t('learners.calibrationStatus')}</h2>
              <ul className="mt-5 space-y-4">
                <ShareBar
                  label={t('learners.calibratedLabel')}
                  value={data.calibratedLearners}
                  total={data.totalLearners}
                />
                <ShareBar
                  label={t('learners.uncalibratedLabel')}
                  value={data.uncalibratedLearners}
                  total={data.totalLearners}
                />
              </ul>
            </div>
            <div className="md:pl-8">
              <h2 className="dashboard-subheading">{t('learners.lastMode')}</h2>
              <ul className="mt-5 space-y-4">
                {modeItems.map((item) => (
                  <ShareBar
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    total={modeTotal}
                  />
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
