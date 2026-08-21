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
  createOrganizationSignInSchema,
  type OrganizationSignInInput,
} from '@/features/registration/schema'
import { useI18n } from '@/i18n/provider'
import { useErrorCopy } from '@/lib/use-error-copy'
import { toUserFacingError } from '@/lib/user-facing-error'
import type { Id } from '@bizcamp-backend/_generated/dataModel'

type SignInFormProps = {
  onSignedIn: (organizationId: Id<'organizations'>) => void
}

export function SignInForm({ onSignedIn }: SignInFormProps) {
  const { t } = useI18n()
  const errorCopy = useErrorCopy()
  const signIn = useMutation(api.organizations.signIn)
  const [serverError, setServerError] = useState<string | null>(null)
  const schema = useMemo(() => createOrganizationSignInSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationSignInInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      workEmail: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    try {
      const organizationId = await signIn(values)
      onSignedIn(organizationId)
    } catch (error) {
      setServerError(toUserFacingError(error, errorCopy('form.signInFailed')))
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <Label htmlFor="signInEmail">{t('form.workEmail')}</Label>
        <Input
          id="signInEmail"
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
        <Label htmlFor="signInPassword">{t('form.password')}</Label>
        <Input
          id="signInPassword"
          type="password"
          autoComplete="current-password"
          placeholder={t('form.passwordDots')}
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
            {t('form.signingIn')}
          </>
        ) : (
          t('form.signIn')
        )}
      </Button>
    </form>
  )
}
