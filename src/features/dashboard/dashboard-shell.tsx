import { useQuery } from 'convex/react'
import {
  Building2,
  Globe2,
  LayoutDashboard,
  LogOut,
  Puzzle,
  Settings,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@bizcamp-backend/_generated/api'
import type { Id } from '@bizcamp-backend/_generated/dataModel'
import { LocaleToggle } from '@/components/locale-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { DomainClaimForm } from '@/features/dashboard/domain-claim-form'
import { LearnersPanel } from '@/features/dashboard/learners-panel'
import { OverviewPanel } from '@/features/dashboard/overview-panel'
import { SettingsPanel } from '@/features/dashboard/settings-panel'
import { WidgetPanel } from '@/features/dashboard/widget-panel'
import { useI18n } from '@/i18n/provider'
import type { MessageKey } from '@/i18n/messages/en'
import { clearOrgSession } from '@/lib/org-session'
import { cn } from '@/lib/utils'

type DashboardTab = 'overview' | 'learners' | 'widget' | 'settings'

const navItems = [
  {
    id: 'overview',
    labelKey: 'nav.overview',
    icon: LayoutDashboard,
  },
  {
    id: 'learners',
    labelKey: 'nav.learners',
    icon: Users,
  },
  {
    id: 'widget',
    labelKey: 'nav.widget',
    icon: Puzzle,
  },
  {
    id: 'settings',
    labelKey: 'nav.settings',
    icon: Settings,
  },
] as const satisfies ReadonlyArray<{
  id: DashboardTab
  labelKey: MessageKey
  icon: typeof LayoutDashboard
}>

function isDashboardTab(value: string | null): value is DashboardTab {
  return navItems.some((item) => item.id === value)
}

function claimDismissStorageKey(organizationId: string): string {
  return `bizcamp:domain-claim-dismissed:${organizationId}`
}

function readClaimDismissed(organizationId: string): boolean {
  try {
    return sessionStorage.getItem(claimDismissStorageKey(organizationId)) === '1'
  } catch {
    return false
  }
}

function writeClaimDismissed(organizationId: string, dismissed: boolean): void {
  try {
    const key = claimDismissStorageKey(organizationId)
    if (dismissed) sessionStorage.setItem(key, '1')
    else sessionStorage.removeItem(key)
  } catch {
    /* ignore quota / private mode */
  }
}

type DashboardShellProps = {
  organizationId: string
}

type NavProps = {
  activeTab: DashboardTab
  onSelect: (tab: DashboardTab) => void
}

function BrandMark() {
  const { t } = useI18n()

  return (
    <div className="flex h-10 items-center">
      <p className="truncate text-[17px] font-semibold leading-none tracking-[-0.04em]">
        {t('common.adminBrand')}
      </p>
    </div>
  )
}

function DashboardNav({ activeTab, onSelect }: NavProps) {
  const { t } = useI18n()

  return (
    <nav className="space-y-1" aria-label={t('nav.dashboardAria')}>
      {navItems.map((item) => {
        const isActive = item.id === activeTab
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onSelect(item.id)}
            className={cn('dashboard-nav-item', isActive && 'is-active')}
          >
            <item.icon className="size-[18px] shrink-0" aria-hidden />
            <span>{t(item.labelKey)}</span>
          </button>
        )
      })}
    </nav>
  )
}

function DesktopAside({
  activeTab,
  onLogout,
  onSelect,
}: NavProps & { onLogout: () => void }) {
  const { t } = useI18n()

  return (
    <aside className="dashboard-sidebar hidden md:flex">
      <BrandMark />
      <div className="mt-10 flex-1">
        <DashboardNav activeTab={activeTab} onSelect={onSelect} />
      </div>
      <div className="mt-8 border-t border-border/60 pt-5">
        <div className="mb-3 flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
        </div>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={onLogout}
        >
          <LogOut />
          {t('common.logout')}
        </Button>
      </div>
    </aside>
  )
}

function MobileTopBar({ onLogout }: { onLogout: () => void }) {
  const { t } = useI18n()

  return (
    <header className="dashboard-mobile-header md:hidden">
      <BrandMark />
      <div className="flex items-center gap-1.5">
        <LocaleToggle />
        <ThemeToggle />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onLogout}
          aria-label={t('common.logout')}
        >
          <LogOut />
        </Button>
      </div>
    </header>
  )
}

function MobileTabBar({ activeTab, onSelect }: NavProps) {
  const { t } = useI18n()

  return (
    <nav className="dashboard-mobile-nav md:hidden" aria-label={t('nav.dashboardAria')}>
      {navItems.map((item) => {
        const isActive = item.id === activeTab
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onSelect(item.id)}
            className={cn('dashboard-mobile-nav-item', isActive && 'is-active')}
          >
            <item.icon className="size-5" aria-hidden />
            <span>{t(item.labelKey)}</span>
          </button>
        )
      })}
    </nav>
  )
}

export function DashboardShell({ organizationId }: DashboardShellProps) {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const orgId = organizationId as Id<'organizations'>
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: DashboardTab = isDashboardTab(tabParam) ? tabParam : 'overview'
  const activeNavItem = navItems.find((item) => item.id === activeTab) ?? navItems[0]
  const [claimSkipped, setClaimSkipped] = useState(() =>
    readClaimDismissed(organizationId),
  )

  const logout = (): void => {
    clearOrgSession()
    navigate('/', { replace: true })
  }

  const org = useQuery(api.organizations.getById, {
    organizationId: orgId,
  })
  const stats = useQuery(
    api.analytics.getDomainDashboard,
    org?.domain
      ? { domain: org.domain, organizationId: orgId, rangeDays: 30 }
      : 'skip',
  )

  useEffect(() => {
    if (org?.domain) {
      writeClaimDismissed(organizationId, false)
      setClaimSkipped(false)
    }
  }, [org?.domain, organizationId])

  const setTab = (next: DashboardTab): void => {
    const params = new URLSearchParams(searchParams)
    if (next === 'overview') params.delete('tab')
    else params.set('tab', next)
    setSearchParams(params, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const skipDomainClaim = (): void => {
    writeClaimDismissed(organizationId, true)
    setClaimSkipped(true)
  }

  if (org === null) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-6 py-16">
        <section className="dashboard-panel dashboard-panel-primary w-full p-7 md:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            {t('errors.orgNotFoundTitle')}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {t('errors.orgNotFoundBody')}
          </p>
          <Button asChild className="mt-6">
            <Link to="/">{t('common.backHome')}</Link>
          </Button>
        </section>
      </main>
    )
  }

  const showClaimCard =
    Boolean(org) && !org?.domain && !claimSkipped && activeTab === 'overview'
  const showPendingBanner =
    Boolean(org) &&
    !org?.domain &&
    claimSkipped &&
    Boolean(org?.pendingDomain) &&
    activeTab === 'overview'
  const showSkippedNoDomainBanner =
    Boolean(org) &&
    !org?.domain &&
    claimSkipped &&
    !org?.pendingDomain &&
    activeTab === 'overview'

  return (
    <div className="dashboard-layout">
      <a href="#dashboard-content" className="dashboard-skip-link">
        {t('common.skipToContent')}
      </a>
      <DesktopAside activeTab={activeTab} onLogout={logout} onSelect={setTab} />

      <div className="min-w-0 flex-1">
        <MobileTopBar onLogout={logout} />

        <main id="dashboard-content" className="dashboard-main" tabIndex={-1}>
          <header className="dashboard-page-header">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <span className="dashboard-eyebrow">
                  <Building2 className="size-3.5" aria-hidden />
                  {org?.companyName ?? t('dashboard.yourOrg')}
                </span>
                <span className={cn('dashboard-domain-status', !org?.domain && 'is-muted')}>
                  <Globe2 className="size-3.5" aria-hidden />
                  {org?.domain
                    ? org.domain
                    : org?.pendingDomain
                      ? t('dashboard.domainPending', { domain: org.pendingDomain })
                      : t('dashboard.domainNotLinked')}
                </span>
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.045em] text-balance md:text-5xl">
                {t(activeNavItem.labelKey)}
              </h1>
            </div>
          </header>

          <div className="dashboard-content-stack">
            {showPendingBanner && org?.pendingDomain ? (
              <section className="dashboard-notice" aria-live="polite">
                <p>
                  {t('dashboard.pendingVerifyBanner', { domain: org.pendingDomain })}
                </p>
                <Button type="button" variant="outline" onClick={() => setTab('settings')}>
                  {t('dashboard.pendingVerifyAction')}
                </Button>
              </section>
            ) : null}

            {showSkippedNoDomainBanner ? (
              <section className="dashboard-notice" aria-live="polite">
                <p>{t('dashboard.claimLaterBanner')}</p>
                <Button type="button" variant="outline" onClick={() => setTab('settings')}>
                  {t('dashboard.pendingVerifyAction')}
                </Button>
              </section>
            ) : null}

            {showClaimCard && org ? (
              <section className="dashboard-panel dashboard-panel-primary p-6 md:p-9">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(20rem,1fr)] lg:items-start">
                  <div>
                    <p className="dashboard-section-index">01 · {t('nav.overview')}</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance">
                      {t('dashboard.claimTitle')}
                    </h2>
                    <p className="mt-3 max-w-lg text-[15px] leading-7 text-pretty text-muted-foreground">
                      {t('dashboard.claimBody')}
                    </p>
                  </div>
                  <DomainClaimForm
                    key={locale}
                    allowSkip
                    organizationId={orgId}
                    pendingDomain={org.pendingDomain}
                    txtHost={org.domainVerificationHost}
                    txtValue={org.domainVerificationValue}
                    expiresAt={org.domainVerificationExpiresAt}
                    onClaimed={() => undefined}
                    onSkip={skipDomainClaim}
                  />
                </div>
              </section>
            ) : null}

            {org?.domain && activeTab === 'overview' && stats === undefined ? (
              <section className="dashboard-empty-state">
                <p>{t('dashboard.loadingAnalytics')}</p>
              </section>
            ) : null}

            {org?.domain && activeTab === 'overview' && stats ? (
              <OverviewPanel stats={stats} />
            ) : null}

            {org?.domain && activeTab === 'learners' ? (
              <LearnersPanel domain={org.domain} organizationId={orgId} />
            ) : null}

            {org?.domain && activeTab === 'widget' ? (
              <WidgetPanel domain={org.domain} stats={stats} />
            ) : null}

            {org && activeTab === 'settings' ? (
              <SettingsPanel
                key={locale}
                organization={org}
                organizationId={organizationId}
              />
            ) : null}

            {org &&
            !org.domain &&
            (activeTab === 'learners' || activeTab === 'widget') ? (
              <section className="dashboard-empty-state">
                <Globe2 className="size-5 text-primary" aria-hidden />
                <p>{t('dashboard.claimFirst')}</p>
                <Button type="button" variant="outline" onClick={() => setTab('settings')}>
                  {t('dashboard.pendingVerifyAction')}
                </Button>
              </section>
            ) : null}
          </div>
        </main>
      </div>

      <MobileTabBar activeTab={activeTab} onSelect={setTab} />
    </div>
  )
}
