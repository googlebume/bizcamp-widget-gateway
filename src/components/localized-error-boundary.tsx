import type { ReactNode } from 'react'
import { AppErrorBoundary } from '@/components/app-error-boundary'
import { useI18n } from '@/i18n/provider'

export function LocalizedErrorBoundary({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  return (
    <AppErrorBoundary
      title={t('errors.boundaryTitle')}
      body={t('errors.boundaryBody')}
      reloadLabel={t('errors.boundaryReload')}
    >
      {children}
    </AppErrorBoundary>
  )
}
