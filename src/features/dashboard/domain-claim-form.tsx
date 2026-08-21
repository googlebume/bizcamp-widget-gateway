import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from 'convex/react'
import { useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { api } from '@bizcamp-backend/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  createDomainClaimSchema,
  type DomainClaimInput,
} from '@/features/registration/schema'
import { useI18n } from '@/i18n/provider'
import { useErrorCopy } from '@/lib/use-error-copy'
import { toUserFacingError } from '@/lib/user-facing-error'
import type { Id } from '@bizcamp-backend/_generated/dataModel'

type DomainClaimFormProps = {
  organizationId: Id<'organizations'>
  onClaimed: (domain: string) => void
}

export function DomainClaimForm({
  organizationId,
  onClaimed,
}: DomainClaimFormProps) {
  const { t } = useI18n()
  const errorCopy = useErrorCopy()
  const claimDomain = useMutation(api.organizations.claimDomain)
  const seedDemo = useMutation(api.seedDemo.seedDemoIfEmpty)
  const [serverError, setServerError] = useState<string | null>(null)
  const schema = useMemo(() => createDomainClaimSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DomainClaimInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      domain: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    try {
      const result = await claimDomain({
        domain: values.domain,
        organizationId,
      })
      try {
        await seedDemo({
          domain: result.domain,
          organizationId,
        })
      } catch (seedError) {
        console.warn('[Bizcamp] Demo seed skipped', seedError)
      }
      onClaimed(result.domain)
    } catch (error) {
      setServerError(toUserFacingError(error, errorCopy('domain.saveFailed')))
    }
  })

  const hintParts = t('domain.hint', { localhost: 'localhost' }).split(
    'localhost',
  )

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="domain">{t('domain.label')}</Label>
        <Input
          id="domain"
          type="text"
          autoComplete="url"
          placeholder={t('domain.placeholder')}
          aria-invalid={Boolean(errors.domain)}
          {...register('domain')}
        />
        {errors.domain ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.domain.message}
          </p>
        ) : (
          <p className="text-xs leading-relaxed text-muted-foreground text-pretty">
            {hintParts[0]}
            <code className="rounded bg-[color:var(--glass-recess)] px-1 py-0.5">
              localhost
            </code>
            {hintParts[1] ?? ''}
          </p>
        )}
      </div>

      {serverError ? (
        <p className="text-sm text-destructive" role="alert">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" className="mt-2 w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            {t('domain.linking')}
          </>
        ) : (
          t('domain.openDashboard')
        )}
      </Button>
    </form>
  )
}
