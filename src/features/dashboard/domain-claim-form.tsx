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
import { api } from '@bizcamp-backend/_generated/api'
import type { Id } from '@bizcamp-backend/_generated/dataModel'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction, useMutation } from 'convex/react'
import { Check, Copy, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

type DomainChallenge = {
	domain: string
	expiresAt?: number
	txtHost: string
	txtValue: string
}

type DomainClaimFormProps = {
	allowSkip?: boolean
	claimedAt?: number
	expiresAt?: number
	onClaimed?: (domain: string) => void
	onSkip?: () => void
	organizationId: Id<'organizations'>
	pendingDomain?: string
	submitFullWidth?: boolean
	txtHost?: string
	txtValue?: string
	verifiedDomain?: string
}

export function DomainClaimForm({
	allowSkip = false,
	claimedAt,
	expiresAt,
	onClaimed,
	onSkip,
	organizationId,
	pendingDomain,
	submitFullWidth = true,
	txtHost,
	txtValue,
	verifiedDomain,
}: DomainClaimFormProps) {
	const { t, dateLocale } = useI18n()
	const errorCopy = useErrorCopy()
	const beginClaim = useMutation(api.organizations.beginDomainClaim)
	const verifyClaim = useAction(api.verifyDomain.verifyDomainClaim)
	const [serverError, setServerError] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [challenge, setChallenge] = useState<DomainChallenge | null>(null)
	const [verifying, setVerifying] = useState(false)
	const [copiedField, setCopiedField] = useState<'host' | 'value' | null>(null)
	const schema = useMemo(() => createDomainClaimSchema(t), [t])

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<DomainClaimInput>({
		resolver: zodResolver(schema),
		defaultValues: {
			domain: pendingDomain ?? verifiedDomain ?? '',
		},
	})

	useEffect(() => {
		if (pendingDomain && txtHost && txtValue) {
			setChallenge({
				domain: pendingDomain,
				expiresAt,
				txtHost,
				txtValue,
			})
			reset({ domain: pendingDomain })
			return
		}
		if (!pendingDomain) {
			setChallenge(null)
		}
	}, [expiresAt, pendingDomain, reset, txtHost, txtValue])

	const finishClaim = (domain: string): void => {
		setChallenge(null)
		setSuccessMessage(t('settings.domainUpdated', { domain }))
		onClaimed?.(domain)
	}

	const onSubmit = handleSubmit(async values => {
		setServerError(null)
		setSuccessMessage(null)
		try {
			const result = await beginClaim({
				domain: values.domain,
				organizationId,
			})
			if (result.verified) {
				finishClaim(result.domain)
				return
			}
			if (!result.txtHost || !result.txtValue) {
				throw new Error(t('domain.verifyFailed'))
			}
			setChallenge({
				domain: result.domain,
				expiresAt: result.expiresAt,
				txtHost: result.txtHost,
				txtValue: result.txtValue,
			})
		} catch (error) {
			setServerError(toUserFacingError(error, errorCopy('domain.saveFailed')))
		}
	})

	const onVerify = async (): Promise<void> => {
		setServerError(null)
		setVerifying(true)
		try {
			const result = await verifyClaim({ organizationId })
			finishClaim(result.domain)
		} catch (error) {
			setServerError(toUserFacingError(error, errorCopy('domain.verifyFailed')))
		} finally {
			setVerifying(false)
		}
	}

	const copyValue = async (
		field: 'host' | 'value',
		value: string,
	): Promise<void> => {
		try {
			await navigator.clipboard.writeText(value)
			setCopiedField(field)
			window.setTimeout(() => setCopiedField(null), 2000)
		} catch (error) {
			setServerError(toUserFacingError(error, errorCopy('common.copyFailed')))
		}
	}

	return (
		<div className='space-y-4'>
			{verifiedDomain ? (
				<p className='text-sm text-muted-foreground'>
					{claimedAt
						? t('settings.domainClaimSince', {
								date: new Date(claimedAt).toLocaleString(dateLocale),
							})
						: t('settings.domainNone')}
				</p>
			) : null}

			{challenge ? (
				<div className='space-y-3 rounded-xl border border-[color:var(--glass-stroke-outer)] bg-[color:var(--glass-recess)] p-4'>
					<p className='text-sm font-medium tracking-tight'>
						{t('domain.challengeTitle')}
					</p>
					<p className='text-sm leading-relaxed text-muted-foreground text-pretty'>
						{t('domain.challengeBody', { domain: challenge.domain })}
					</p>
					<TxtCopyRow
						copied={copiedField === 'host'}
						label={t('domain.txtHost')}
						onCopy={() => void copyValue('host', challenge.txtHost)}
						value={challenge.txtHost}
					/>
					<TxtCopyRow
						copied={copiedField === 'value'}
						label={t('domain.txtValue')}
						onCopy={() => void copyValue('value', challenge.txtValue)}
						value={challenge.txtValue}
					/>
					<p className='text-xs text-muted-foreground'>
						{t('domain.txtTypeHint')}
					</p>
					<div className='flex flex-wrap gap-2'>
						<Button
							type='button'
							disabled={verifying}
							onClick={() => void onVerify()}
						>
							{verifying ? (
								<>
									<Loader2 className='animate-spin' />
									{t('domain.checkingDns')}
								</>
							) : (
								t('domain.verifyTxt')
							)}
						</Button>
						<Button
							type='button'
							variant='ghost'
							onClick={() => {
								setChallenge(null)
								setServerError(null)
							}}
						>
							{t('domain.changeDomain')}
						</Button>
						{allowSkip && onSkip ? (
							<Button type='button' variant='ghost' onClick={onSkip}>
								{t('domain.skipForNow')}
							</Button>
						) : null}
					</div>
				</div>
			) : (
				<form className='space-y-4' onSubmit={onSubmit} noValidate>
					<div className='space-y-2'>
						<Label htmlFor='domain'>{t('domain.label')}</Label>
						<Input
							id='domain'
							type='text'
							autoComplete='url'
							placeholder={t('domain.placeholder')}
							aria-invalid={Boolean(errors.domain)}
							{...register('domain')}
						/>
						{errors.domain ? (
							<p className='text-xs text-destructive' role='alert'>
								{errors.domain.message}
							</p>
						) : null}
					</div>
					<div className='flex flex-wrap items-center gap-2'>
						<Button
							type='submit'
							className={submitFullWidth ? 'w-full' : undefined}
							size={submitFullWidth ? 'lg' : 'default'}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className='animate-spin' />
									{t('domain.linking')}
								</>
							) : verifiedDomain ? (
								t('settings.updateDomain')
							) : (
								t('domain.openDashboard')
							)}
						</Button>
						{allowSkip && onSkip && !verifiedDomain ? (
							<Button
								type='button'
								variant='ghost'
								className={submitFullWidth ? 'w-full' : undefined}
								onClick={onSkip}
							>
								{t('domain.skipForNow')}
							</Button>
						) : null}
					</div>
				</form>
			)}

			{serverError ? (
				<p className='text-sm text-destructive' role='alert'>
					{serverError}
				</p>
			) : null}
			{successMessage ? (
				<p className='flex items-center gap-2 text-sm text-muted-foreground'>
					<Check className='size-4' aria-hidden />
					{successMessage}
				</p>
			) : null}
		</div>
	)
}

function TxtCopyRow({
	copied,
	label,
	onCopy,
	value,
}: {
	copied: boolean
	label: string
	onCopy: () => void
	value: string
}) {
	const { t } = useI18n()
	return (
		<div className='space-y-1'>
			<p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/80'>
				{label}
			</p>
			<div className='flex items-center gap-2'>
				<code className='min-w-0 flex-1 truncate rounded-lg border border-[color:var(--glass-stroke-outer)] bg-background/40 px-2.5 py-2 text-xs'>
					{value}
				</code>
				<Button type='button' variant='glass' size='sm' onClick={onCopy}>
					{copied ? <Check /> : <Copy />}
					{copied ? t('common.copied') : t('common.copySnippet')}
				</Button>
			</div>
		</div>
	)
}
