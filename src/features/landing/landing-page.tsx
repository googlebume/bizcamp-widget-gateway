import { useState } from 'react'
import { LiquidGlass } from '@/components/liquid-glass'
import { LocaleToggle } from '@/components/locale-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { BenefitsSection } from '@/features/landing/benefits-section'
import { RegistrationForm } from '@/features/landing/registration-form'
import { SignInForm } from '@/features/landing/sign-in-form'
import { WidgetPreview } from '@/features/landing/widget-preview'
import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'
import type { Id } from '@bizcamp-backend/_generated/dataModel'

type LandingPageProps = {
  onAuthenticated: (organizationId: string) => void
}

type AuthMode = 'register' | 'signin'

export function LandingPage({ onAuthenticated }: LandingPageProps) {
  const { t, locale } = useI18n()
  const [mode, setMode] = useState<AuthMode>('register')

  return (
    <div className="relative min-h-dvh">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-7 md:px-10">
        <div className="flex items-center gap-3">
          <span
            className="grid size-9 place-items-center rounded-xl text-[13px] font-semibold tracking-tight text-foreground glass-surface"
            aria-hidden
          >
            B
          </span>
          <p className="text-[15px] font-semibold tracking-tight">
            {t('common.brand')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 pb-28 md:px-10">
        <section className="grid grid-cols-12 items-start gap-8 py-12 md:gap-10 md:py-20">
          <div className="col-span-12 flex flex-col gap-10 lg:col-span-7">
            <div className="max-w-xl space-y-6">
              <h1 className="text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-balance md:text-5xl lg:text-[3.5rem]">
                {t('landing.hero.title')}
              </h1>
              <p className="max-w-md text-[17px] leading-relaxed text-pretty text-muted-foreground md:text-lg">
                {t('landing.hero.body')}
              </p>
            </div>

            <LiquidGlass id="register" className="p-7 md:p-8" intensity="strong">
              <div
                className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-[color:var(--glass-recess)] p-1"
                role="tablist"
                aria-label={t('landing.auth.aria')}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    mode === 'register'
                      ? 'bg-[color:var(--glass-fill-strong)] text-foreground shadow-[inset_0_1px_0_var(--glass-inset)]'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setMode('register')}
                >
                  {t('landing.auth.register')}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'signin'}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    mode === 'signin'
                      ? 'bg-[color:var(--glass-fill-strong)] text-foreground shadow-[inset_0_1px_0_var(--glass-inset)]'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setMode('signin')}
                >
                  {t('landing.auth.signIn')}
                </button>
              </div>

              {mode === 'register' ? (
                <>
                  <div className="mb-7 space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight text-balance">
                      {t('landing.register.title')}
                    </h2>
                    <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">
                      {t('landing.register.body')}
                    </p>
                  </div>
                  <RegistrationForm
                    key={`register-${locale}`}
                    onRegistered={(organizationId: Id<'organizations'>) => {
                      onAuthenticated(organizationId)
                    }}
                  />
                </>
              ) : (
                <>
                  <div className="mb-7 space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight text-balance">
                      {t('landing.signIn.title')}
                    </h2>
                    <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">
                      {t('landing.signIn.body')}
                    </p>
                  </div>
                  <SignInForm
                    key={`signin-${locale}`}
                    onSignedIn={(organizationId: Id<'organizations'>) => {
                      onAuthenticated(organizationId)
                    }}
                  />
                </>
              )}
            </LiquidGlass>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-8 lg:self-start">
            <WidgetPreview />
          </div>
        </section>

        <BenefitsSection />
      </main>
    </div>
  )
}
