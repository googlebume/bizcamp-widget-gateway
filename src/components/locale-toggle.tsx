import { useI18n } from '@/i18n/provider'
import { LOCALES, type Locale } from '@/i18n'
import { cn } from '@/lib/utils'

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-recess)] p-0.5',
        className,
      )}
      role="group"
      aria-label={t('common.switchLanguage')}
    >
      {LOCALES.map((code) => {
        const active = code === locale
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(code)}
            className={cn(
              'rounded-lg px-2.5 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200',
              active
                ? 'bg-[color:var(--glass-fill-strong)] text-foreground shadow-[inset_0_1px_0_var(--glass-inset)]'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {labelFor(code, t)}
          </button>
        )
      })}
    </div>
  )
}

function labelFor(
  code: Locale,
  t: (key: 'common.localeEn' | 'common.localeUk') => string,
): string {
  return code === 'en' ? t('common.localeEn') : t('common.localeUk')
}
