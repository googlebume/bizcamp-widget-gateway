import { Eye, Gauge, ShieldCheck } from 'lucide-react'
import { LiquidGlass } from '@/components/liquid-glass'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import type { MessageKey } from '@/i18n/messages/en'

const benefits = [
  {
    icon: Eye,
    titleKey: 'benefits.shared.title',
    bodyKey: 'benefits.shared.body',
    span: 'col-span-12 md:col-span-7',
  },
  {
    icon: Gauge,
    titleKey: 'benefits.calibrated.title',
    bodyKey: 'benefits.calibrated.body',
    span: 'col-span-12 md:col-span-5',
  },
  {
    icon: ShieldCheck,
    titleKey: 'benefits.enterprise.title',
    bodyKey: 'benefits.enterprise.body',
    span: 'col-span-12',
  },
] as const satisfies ReadonlyArray<{
  icon: typeof Eye
  titleKey: MessageKey
  bodyKey: MessageKey
  span: string
}>

export function BenefitsSection({ className }: { className?: string }) {
  const { t } = useI18n()

  return (
    <section
      className={cn('grid grid-cols-12 gap-6 md:gap-8', className)}
      aria-labelledby="benefits-heading"
    >
      <div className="col-span-12 max-w-2xl pb-2">
        <h2
          id="benefits-heading"
          className="text-3xl font-semibold tracking-tight text-balance md:text-4xl"
        >
          {t('benefits.heading')}
        </h2>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-pretty text-muted-foreground">
          {t('benefits.subheading')}
        </p>
      </div>

      {benefits.map((benefit) => (
        <LiquidGlass key={benefit.titleKey} className={cn('p-6 md:p-7', benefit.span)}>
          <div className="flex size-9 items-center justify-center rounded-xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-recess)]">
            <benefit.icon className="size-4 text-foreground/80" aria-hidden />
          </div>
          <h3 className="mt-5 text-lg font-semibold tracking-tight text-balance">
            {t(benefit.titleKey)}
          </h3>
          <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {t(benefit.bodyKey)}
          </p>
        </LiquidGlass>
      ))}
    </section>
  )
}
