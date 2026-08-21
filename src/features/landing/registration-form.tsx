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
  createOrganizationRegistrationSchema,
  type OrganizationRegistrationInput,
} from '@/features/registration/schema'
import { useI18n } from '@/i18n/provider'
import { useErrorCopy } from '@/lib/use-error-copy'
import { toUserFacingError } from '@/lib/user-facing-error'
import type { Id } from '@bizcamp-backend/_generated/dataModel'

type RegistrationFormProps = {
  onRegistered: (organizationId: Id<'organizations'>) => void
}

export function RegistrationForm({ onRegistered }: RegistrationFormProps) {
  const { t } = useI18n()
  const errorCopy = useErrorCopy()
  const registerOrganization = useMutation(api.organizations.register)
  const [serverError, setServerError] = useState<string | null>(null)
  const schema = useMemo(() => createOrganizationRegistrationSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationRegistrationInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      workEmail: '',
      phone: '',
      companyName: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    try {
      const organizationId = await registerOrganization(values)
      onRegistered(organizationId)
    } catch (error) {
      setServerError(toUserFacingError(error, errorCopy('form.registerFailed')))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="workEmail">{t('form.workEmail')}</Label>
        <Input
          id="workEmail"
          type="email"
          autoComplete="email"
          placeholder={t('form.emailPlaceholder')}
          aria-invalid={Boolean(errors.workEmail)}
          {...register('workEmail')}
        />
        {errors.workEmail ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.workEmail.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t('form.phone')}</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder={t('form.phonePlaceholder')}
          aria-invalid={Boolean(errors.phone)}
          {...register('phone')}
        />
        {errors.phone ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">{t('form.companyName')}</Label>
        <Input
          id="companyName"
          type="text"
          autoComplete="organization"
          placeholder={t('form.companyPlaceholder')}
          aria-invalid={Boolean(errors.companyName)}
          {...register('companyName')}
        />
        {errors.companyName ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.companyName.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('form.password')}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder={t('form.passwordPlaceholder')}
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.password.message}
          </p>
        ) : null}
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
            {t('form.creatingWorkspace')}
          </>
        ) : (
          t('form.createWorkspace')
        )}
      </Button>

      <p className="text-center text-xs leading-relaxed text-muted-foreground text-pretty">
        {t('form.registerFootnote')}
      </p>
    </form>
  )
}
