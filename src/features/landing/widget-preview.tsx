import { LiquidGlass } from '@/components/liquid-glass'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

type WidgetPreviewProps = {
  className?: string
}

/**
 * Live demo embeds the real widget host page in an iframe so behavior matches
 * production 1:1 (fixed overlay, shadow DOM, auth, quiz, personalization)
 * without restyling the landing page chrome.
 *
 * Glass is an explicit-height flex column: header shrink-0, iframe flex-1
 * so the cream lesson fills all space below the header (no empty glass strip).
 */
export function WidgetPreview({ className }: WidgetPreviewProps) {
  const { t } = useI18n()

  return (
    <LiquidGlass
      intensity="strong"
      className={cn(
        'h-[min(72vh,54rem)] min-h-[48rem] overflow-hidden p-0',
        className,
      )}
      aria-label={t('preview.aria')}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[color:var(--glass-stroke-outer)] px-5 py-4">
        <div>
          <p className="text-[13px] font-medium tracking-tight text-muted-foreground">
            {t('preview.liveDemo')}
          </p>
          <p className="mt-0.5 text-[15px] font-semibold tracking-tight">
            {t('preview.subtitle')}
          </p>
        </div>
        <span className="rounded-lg border border-[color:var(--glass-stroke)] bg-[color:var(--glass-recess)] px-2.5 py-1 text-xs font-medium text-foreground/75">
          1:1
        </span>
      </div>

      <iframe
        title={t('preview.iframeTitle')}
        src="/widget-demo.html"
        className="min-h-0 h-full w-full flex-1 border-0 bg-[color:var(--field-mid)]"
        allow="clipboard-write"
      />
    </LiquidGlass>
  )
}
