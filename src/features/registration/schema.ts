import { z } from 'zod'
import type { MessageKey } from '@/i18n/messages/en'

type Translate = (key: MessageKey) => string

export function createOrganizationRegistrationSchema(t: Translate) {
  return z.object({
    workEmail: z.string().trim().email(t('validation.email')).max(254),
    phone: z
      .string()
      .trim()
      .min(7, t('validation.phoneIncomplete'))
      .max(32, t('validation.phoneLong')),
    companyName: z
      .string()
      .trim()
      .min(2, t('validation.companyShort'))
      .max(120, t('validation.companyLong')),
    password: z
      .string()
      .min(8, t('validation.passwordShort'))
      .max(128, t('validation.passwordLong')),
  })
}

export type OrganizationRegistrationInput = z.infer<
  ReturnType<typeof createOrganizationRegistrationSchema>
>

export function createOrganizationSignInSchema(t: Translate) {
  return z.object({
    workEmail: z.string().trim().email(t('validation.email')).max(254),
    password: z
      .string()
      .min(1, t('validation.passwordRequired'))
      .max(128, t('validation.passwordLong')),
  })
}

export type OrganizationSignInInput = z.infer<
  ReturnType<typeof createOrganizationSignInSchema>
>

export function createDomainClaimSchema(t: Translate) {
  return z.object({
    domain: z
      .string()
      .trim()
      .min(3, t('validation.domainRequired'))
      .max(253, t('validation.domainLong')),
  })
}

export type DomainClaimInput = z.infer<ReturnType<typeof createDomainClaimSchema>>

export function createOrganizationProfileSchema(t: Translate) {
  return z.object({
    workEmail: z.string().trim().email(t('validation.email')).max(254),
    phone: z
      .string()
      .trim()
      .min(7, t('validation.phoneIncomplete'))
      .max(32, t('validation.phoneLong')),
    companyName: z
      .string()
      .trim()
      .min(2, t('validation.companyShort'))
      .max(120, t('validation.companyLong')),
  })
}

export type OrganizationProfileInput = z.infer<
  ReturnType<typeof createOrganizationProfileSchema>
>

export function createOrganizationPasswordSchema(t: Translate) {
  return z
    .object({
      currentPassword: z
        .string()
        .min(1, t('validation.currentPasswordRequired'))
        .max(128),
      newPassword: z
        .string()
        .min(8, t('validation.passwordShort'))
        .max(128, t('validation.passwordLong')),
      confirmPassword: z
        .string()
        .min(1, t('validation.confirmPasswordRequired'))
        .max(128),
    })
    .refine((value) => value.newPassword === value.confirmPassword, {
      message: t('validation.passwordsMismatch'),
      path: ['confirmPassword'],
    })
}

export type OrganizationPasswordInput = z.infer<
  ReturnType<typeof createOrganizationPasswordSchema>
>
