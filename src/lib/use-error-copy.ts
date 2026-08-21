import { useI18n } from '@/i18n/provider'
import type { MessageKey } from '@/i18n/messages/en'
import type { UserFacingErrorCopy } from '@/lib/user-facing-error'

/** Localized offline / network / timeout wrappers around a feature-specific fallback. */
export function useErrorCopy() {
  const { t } = useI18n()

  return (fallbackKey: MessageKey): UserFacingErrorCopy => ({
    fallback: t(fallbackKey),
    offline: t('errors.offline'),
    network: t('errors.network'),
    timeout: t('errors.timeout'),
  })
}
