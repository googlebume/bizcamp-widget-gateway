import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from 'convex/react'
import { Check, Loader2 } from 'lucide-react'
import { api } from '@bizcamp-backend/_generated/api'
import type { Id } from '@bizcamp-backend/_generated/dataModel'
import { LiquidGlass } from '@/components/liquid-glass'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DomainClaimForm } from '@/features/dashboard/domain-claim-form'
import {
  createOrganizationPasswordSchema,
  createOrganizationProfileSchema,
  type OrganizationPasswordInput,
  type OrganizationProfileInput,
} from '@/features/registration/schema'
import { useI18n } from '@/i18n/provider'
import { useErrorCopy } from '@/lib/use-error-copy'
import { toUserFacingError } from '@/lib/user-facing-error'

type OrganizationDetails = {
  companyName: string
  createdAt: number
  domain?: string
  domainClaimedAt?: number
  domainVerificationExpiresAt?: number
  domainVerificationHost?: string
  domainVerificationValue?: string
  pendingDomain?: string
  phone: string
  workEmail: string
}

type SettingsPanelProps = {
  organization: OrganizationDetails
  organizationId: string
}

export function SettingsPanel({
  organization,
  organizationId,
}: SettingsPanelProps) {
  const { t, dateLocale } = useI18n()
  const errorCopy = useErrorCopy()
  const orgId = organizationId as Id<'organizations'>
  const updateProfile = useMutation(api.organizations.updateProfile)
  const updatePassword = useMutation(api.organizations.updatePassword)

  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const profileSchema = useMemo(
    () => createOrganizationProfileSchema(t),
    [t],
  )
  const passwordSchema = useMemo(
    () => createOrganizationPasswordSchema(t),
    [t],
  )

  const profileForm = useForm<OrganizationProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      companyName: organization.companyName,
      phone: organization.phone,
      workEmail: organization.workEmail,
    },
  })

  const passwordForm = useForm<OrganizationPasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    profileForm.reset({
      companyName: organization.companyName,
      phone: organization.phone,
      workEmail: organization.workEmail,
    })
  }, [
    organization.companyName,
    organization.phone,
    organization.workEmail,
    profileForm,
  ])

  const onSaveProfile = profileForm.handleSubmit(async (values) => {
    setProfileError(null)
    setProfileMessage(null)
    try {
      await updateProfile({ ...values, organizationId: orgId })
      setProfileMessage(t('settings.profileSaved'))
    } catch (error) {
      setProfileError(toUserFacingError(error, errorCopy('settings.profileFailed')))
    }
  })

  const onSavePassword = passwordForm.handleSubmit(async (values) => {
    setPasswordError(null)
    setPasswordMessage(null)
    try {
      await updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        organizationId: orgId,
      })
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setPasswordMessage(t('settings.passwordUpdated'))
    } catch (error) {
      setPasswordError(toUserFacingError(error, errorCopy('settings.passwordFailed')))
    }
  })

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <LiquidGlass className="p-6 md:p-7">
        <h2 className="text-xl font-semibold tracking-tight">
          {t('settings.orgTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('settings.orgBody')}
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSaveProfile} noValidate>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 space-y-2 md:col-span-6">
              <Label htmlFor="settingsCompany">{t('form.companyName')}</Label>
              <Input
                id="settingsCompany"
                autoComplete="organization"
                aria-invalid={Boolean(profileForm.formState.errors.companyName)}
                {...profileForm.register('companyName')}
              />
              {profileForm.formState.errors.companyName ? (
                <p className="text-xs text-destructive" role="alert">
                  {profileForm.formState.errors.companyName.message}
                </p>
              ) : null}
            </div>
            <div className="col-span-12 space-y-2 md:col-span-6">
              <Label htmlFor="settingsEmail">{t('form.workEmail')}</Label>
              <Input
                id="settingsEmail"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(profileForm.formState.errors.workEmail)}
                {...profileForm.register('workEmail')}
              />
              {profileForm.formState.errors.workEmail ? (
                <p className="text-xs text-destructive" role="alert">
                  {profileForm.formState.errors.workEmail.message}
                </p>
              ) : null}
            </div>
            <div className="col-span-12 space-y-2 md:col-span-6">
              <Label htmlFor="settingsPhone">{t('form.phoneShort')}</Label>
              <Input
                id="settingsPhone"
                type="tel"
                autoComplete="tel"
                aria-invalid={Boolean(profileForm.formState.errors.phone)}
                {...profileForm.register('phone')}
              />
              {profileForm.formState.errors.phone ? (
                <p className="text-xs text-destructive" role="alert">
                  {profileForm.formState.errors.phone.message}
                </p>
              ) : null}
            </div>
            <div className="col-span-12 space-y-2 md:col-span-6">
              <Label htmlFor="settingsOrgId">{t('settings.orgId')}</Label>
              <Input
                id="settingsOrgId"
                value={organizationId}
                readOnly
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                {t('settings.created', {
                  date: new Date(organization.createdAt).toLocaleString(
                    dateLocale,
                  ),
                })}
              </p>
            </div>
          </div>

          {profileError ? (
            <p className="text-sm text-destructive" role="alert">
              {profileError}
            </p>
          ) : null}
          {profileMessage ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="size-4" aria-hidden />
              {profileMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
          >
            {profileForm.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                {t('common.saving')}
              </>
            ) : (
              t('settings.saveOrg')
            )}
          </Button>
        </form>
      </LiquidGlass>

      <LiquidGlass className="p-6 md:p-7">
        <h2 className="text-xl font-semibold tracking-tight">
          {t('settings.domainTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          {t('settings.domainBody')}
        </p>

        <div className="mt-6 max-w-md">
          <DomainClaimForm
            organizationId={orgId}
            verifiedDomain={organization.domain}
            claimedAt={organization.domainClaimedAt}
            pendingDomain={organization.pendingDomain}
            txtHost={organization.domainVerificationHost}
            txtValue={organization.domainVerificationValue}
            expiresAt={organization.domainVerificationExpiresAt}
            submitFullWidth={false}
          />
        </div>
      </LiquidGlass>

      <LiquidGlass className="p-6 md:p-7">
        <h2 className="text-xl font-semibold tracking-tight">
          {t('settings.passwordTitle')}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('settings.passwordBody')}
        </p>

        <form
          className="mt-6 max-w-md space-y-4"
          onSubmit={onSavePassword}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              {t('settings.currentPassword')}
            </Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(
                passwordForm.formState.errors.currentPassword,
              )}
              {...passwordForm.register('currentPassword')}
            />
            {passwordForm.formState.errors.currentPassword ? (
              <p className="text-xs text-destructive" role="alert">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">{t('settings.newPassword')}</Label>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(passwordForm.formState.errors.newPassword)}
              {...passwordForm.register('newPassword')}
            />
            {passwordForm.formState.errors.newPassword ? (
              <p className="text-xs text-destructive" role="alert">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t('settings.confirmPassword')}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(
                passwordForm.formState.errors.confirmPassword,
              )}
              {...passwordForm.register('confirmPassword')}
            />
            {passwordForm.formState.errors.confirmPassword ? (
              <p className="text-xs text-destructive" role="alert">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          {passwordError ? (
            <p className="text-sm text-destructive" role="alert">
              {passwordError}
            </p>
          ) : null}
          {passwordMessage ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="size-4" aria-hidden />
              {passwordMessage}
            </p>
          ) : null}

          <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
            {passwordForm.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                {t('common.updating')}
              </>
            ) : (
              t('settings.updatePassword')
            )}
          </Button>
        </form>
      </LiquidGlass>
    </div>
  )
}
