import { en, type MessageKey } from '@/i18n/messages/en'
import { uk } from '@/i18n/messages/uk'

export type Locale = 'en' | 'uk'

export const LOCALES: Locale[] = ['en', 'uk']

export const localeTags: Record<Locale, string> = {
  en: 'en-US',
  uk: 'uk-UA',
}

const dictionaries: Record<Locale, Record<MessageKey, string>> = {
  en,
  uk,
}

export type TranslateParams = Record<string, string | number>

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: TranslateParams,
): string {
  const template = dictionaries[locale][key] ?? en[key]
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name]
    return value === undefined ? match : String(value)
  })
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'en' || value === 'uk'
}
