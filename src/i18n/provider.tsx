import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  isLocale,
  localeTags,
  translate,
  type Locale,
  type TranslateParams,
} from '@/i18n'
import type { MessageKey } from '@/i18n/messages/en'

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey, params?: TranslateParams) => string
  dateLocale: string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)
const STORAGE_KEY = 'bizcamp-gateway-locale'

function getPreferredLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isLocale(stored)) return stored
  const browser = window.navigator.language.toLowerCase()
  return browser.startsWith('uk') ? 'uk' : 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => getPreferredLocale())

  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const t = useCallback(
    (key: MessageKey, params?: TranslateParams) =>
      translate(locale, key, params),
    [locale],
  )

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      dateLocale: localeTags[locale],
    }),
    [locale, setLocale, t],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}

export function useI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useI18n must be used within LocaleProvider')
  return ctx
}
