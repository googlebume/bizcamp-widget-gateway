import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from 'convex/react'
import {
  Building2,
  Check,
  ChevronDown,
  Globe2,
  KeyRound,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import { api } from '@bizcamp-backend/_generated/api'
import type { Id } from '@bizcamp-backend/_generated/dataModel'
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

function SettingsSection({
  children,
  defaultOpen = false,
  icon: Icon,
  index,
  title,
}: {
  children: ReactNode
  defaultOpen?: boolean
  icon: LucideIcon
  index: string
  title: string
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <details
      className="dashboard-disclosure group"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary>
        <span className="flex min-w-0 items-start gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-[18px]" aria-hidden />
          </span>
          <span className="min-w-0">
            <small className="dashboard-section-index">{index}</small>
            <strong className="mt-1 block">{title}</strong>
          </span>
        </span>
        <ChevronDown aria-hidden />
      </summary>
      <div className="border-t border-border/60 p-6 md:p-8">{children}</div>
    </details>
  )
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
    <div className="dashboard-content-stack">
      <SettingsSection
        defaultOpen
        icon={Building2}
        index="01"
        title={t('settings.orgTitle')}
      >
        <form className="max-w-3xl space-y-5" onSubmit={onSaveProfile} noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
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
            <div className="space-y-2">
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
            <div className="space-y-2">
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
          </div>

          <details className="max-w-3xl rounded-xl border border-border/60 bg-[color:var(--glass-recess)]">
            <summary className="cursor-pointer px-4 py-3 text-xs font-medium text-muted-foreground">
              {t('settings.technicalDetails')}
            </summary>
            <dl className="grid gap-4 border-t border-border/60 px-4 py-4 text-xs md:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">{t('settings.orgId')}</dt>
                <dd className="mt-1 break-all font-mono">{organizationId}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('settings.createdLabel')}</dt>
                <dd className="mt-1">
                  {new Date(organization.createdAt).toLocaleString(dateLocale)}
                </dd>
              </div>
            </dl>
          </details>

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

          <Button type="submit" disabled={profileForm.formState.isSubmitting}>
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
      </SettingsSection>

      <SettingsSection
        defaultOpen={Boolean(organization.pendingDomain && !organization.domain)}
        icon={Globe2}
        index="02"
        title={t('settings.domainTitle')}
      >
        <div className="max-w-xl">
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
      </SettingsSection>

      <SettingsSection
        icon={KeyRound}
        index="03"
        title={t('settings.passwordTitle')}
      >
        <form
          className="max-w-md space-y-4"
          onSubmit={onSavePassword}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t('settings.currentPassword')}</Label>
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(passwordForm.formState.errors.currentPassword)}
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
            <Label htmlFor="confirmPassword">{t('settings.confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(passwordForm.formState.errors.confirmPassword)}
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
      </SettingsSection>
    </div>
  )
}
