import { useQuery } from 'convex/react'
import {
  LayoutDashboard,
  LogOut,
  Puzzle,
  Settings,
  Users,
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@bizcamp-backend/_generated/api'
import type { Id } from '@bizcamp-backend/_generated/dataModel'
import { LiquidGlass } from '@/components/liquid-glass'
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
  { id: 'overview', labelKey: 'nav.overview', icon: LayoutDashboard },
  { id: 'learners', labelKey: 'nav.learners', icon: Users },
  { id: 'widget', labelKey: 'nav.widget', icon: Puzzle },
  { id: 'settings', labelKey: 'nav.settings', icon: Settings },
] as const satisfies ReadonlyArray<{
  id: DashboardTab
  labelKey: MessageKey
  icon: typeof LayoutDashboard
}>

function isDashboardTab(value: string | null): value is DashboardTab {
  return (
    value === 'overview' ||
    value === 'learners' ||
    value === 'widget' ||
    value === 'settings'
  )
}

type DashboardShellProps = {
  organizationId: string
}

type NavProps = {
  activeTab: DashboardTab
  onSelect: (tab: DashboardTab) => void
}

function DesktopAside({
  activeTab,
  onLogout,
  onSelect,
}: NavProps & { onLogout: () => void }) {
  const { t } = useI18n()

  return (
    <LiquidGlass className="hidden h-fit w-64 shrink-0 flex-col p-5 md:flex min-[1020px]:w-80">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold tracking-tight">
            {t('common.adminBrand')}
          </p>
          <p className="text-xs text-muted-foreground">{t('common.admin')}</p>
        </div>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </div>

      <nav className="flex flex-col gap-1" aria-label={t('nav.dashboardAria')}>
        {navItems.map((item) => {
          const isActive = item.id === activeTab
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onSelect(item.id)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[color:var(--glass-fill-strong)] text-foreground shadow-[inset_0_1px_0_var(--glass-inset)]'
                  : 'text-muted-foreground hover:bg-[color:var(--glass-fill)] hover:text-foreground',
              )}
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {t(item.labelKey)}
            </button>
          )
        })}
      </nav>

      <Button
        type="button"
        variant="glass"
        className="mt-8 w-full justify-start"
        onClick={onLogout}
      >
        <LogOut />
        {t('common.logout')}
      </Button>
    </LiquidGlass>
  )
}

function MobileTopBar({ onLogout }: { onLogout: () => void }) {
  const { t } = useI18n()

  return (
    <div className="flex items-center justify-between md:hidden">
      <div>
        <p className="text-[15px] font-semibold tracking-tight">
          {t('common.adminBrand')}
        </p>
        <p className="text-xs text-muted-foreground">{t('common.admin')}</p>
      </div>
      <div className="flex items-center gap-2">
        <LocaleToggle />
        <ThemeToggle />
        <Button
          type="button"
          variant="glass"
          size="icon"
          onClick={onLogout}
          aria-label={t('common.logout')}
        >
          <LogOut />
        </Button>
      </div>
    </div>
  )
}

function MobilePillTabBar({ activeTab, onSelect }: NavProps) {
  const { t } = useI18n()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <LiquidGlass
        intensity="strong"
        interactive={false}
        className={cn(
          'pointer-events-auto w-full max-w-md !rounded-full p-1.5 shadow-[0_12px_40px_-12px_var(--glass-shadow-deep)]',
          /* Solid underlay + near-opaque glass — readable over scrolling content */
          'before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:bg-background/95 dark:before:bg-background/92',
          '[--glass-fill:color-mix(in_oklch,var(--background)_96%,transparent)]',
          '[--glass-fill-strong:color-mix(in_oklch,var(--background)_99%,transparent)]',
          '[--glass-stroke:color-mix(in_oklch,var(--foreground)_14%,transparent)]',
          '[--glass-tint:transparent] [--glass-highlight:oklch(1_0_0/0.1)] [--glass-specular-opacity:0.1]',
          'dark:[--glass-stroke:oklch(1_0_0/0.2)] dark:[--glass-highlight:oklch(1_0_0/0.05)]',
          'backdrop-blur-md backdrop-saturate-125',
        )}
      >
        <nav
          className="grid grid-cols-4 gap-0.5"
          aria-label={t('nav.dashboardAria')}
        >
          {navItems.map((item) => {
            const isActive = item.id === activeTab
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelect(item.id)}
                className={cn(
                  'flex min-w-0 flex-col items-center gap-1 rounded-full px-2 py-2.5 text-[10px] font-medium tracking-tight transition-all duration-200',
                  isActive
                    ? 'bg-foreground/12 font-semibold text-foreground shadow-[inset_0_1px_0_var(--glass-inset)] dark:bg-foreground/18'
                    : 'text-foreground/72',
                )}
              >
                <item.icon className="size-5 shrink-0" aria-hidden />
                <span className="truncate">{t(item.labelKey)}</span>
              </button>
            )
          })}
        </nav>
      </LiquidGlass>
    </div>
  )
}

export function DashboardShell({ organizationId }: DashboardShellProps) {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const orgId = organizationId as Id<'organizations'>
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: DashboardTab = isDashboardTab(tabParam) ? tabParam : 'overview'

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

  const setTab = (next: DashboardTab): void => {
    const params = new URLSearchParams(searchParams)
    if (next === 'overview') params.delete('tab')
    else params.set('tab', next)
    setSearchParams(params, { replace: true })
  }

  if (org === null) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-6 py-16">
        <LiquidGlass className="w-full p-7 md:p-8" intensity="strong" interactive={false}>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {t('errors.orgNotFoundTitle')}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {t('errors.orgNotFoundBody')}
          </p>
          <Button asChild className="mt-6">
            <Link to="/">{t('common.backHome')}</Link>
          </Button>
        </LiquidGlass>
      </div>
    )
  }

  return (
    <div className="min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-[90rem] gap-5 p-4 pb-28 md:gap-6 md:p-7 md:pb-7">
        <DesktopAside activeTab={activeTab} onLogout={logout} onSelect={setTab} />

        <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-6">
          <MobileTopBar onLogout={logout} />

          <LiquidGlass className="p-6 md:p-8" intensity="strong">
            <p className="text-[13px] font-medium text-muted-foreground">
              {t('dashboard.workspace')}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-balance">
              {org?.companyName ?? t('dashboard.yourOrg')}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-pretty text-muted-foreground">
              {org?.domain
                ? t('dashboard.analyticsFor', { domain: org.domain })
                : t('dashboard.linkDomainHint')}
            </p>
            {org ? (
              <dl className="mt-7 grid grid-cols-12 gap-4 text-sm">
                <div className="col-span-12 rounded-xl border border-[color:var(--glass-stroke-outer)] bg-[color:var(--glass-recess)] p-4 shadow-[inset_0_1px_0_var(--glass-inset)] md:col-span-4">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t('dashboard.workEmail')}
                  </dt>
                  <dd className="mt-1 font-medium tracking-tight">
                    {org.workEmail}
                  </dd>
                </div>
                <div className="col-span-12 rounded-xl border border-[color:var(--glass-stroke-outer)] bg-[color:var(--glass-recess)] p-4 shadow-[inset_0_1px_0_var(--glass-inset)] md:col-span-4">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t('dashboard.phone')}
                  </dt>
                  <dd className="mt-1 font-medium tracking-tight">{org.phone}</dd>
                </div>
                <div className="col-span-12 rounded-xl border border-[color:var(--glass-stroke-outer)] bg-[color:var(--glass-recess)] p-4 shadow-[inset_0_1px_0_var(--glass-inset)] md:col-span-4">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t('dashboard.domain')}
                  </dt>
                  <dd className="mt-1 font-medium tracking-tight">
                    {org.domain ?? t('dashboard.domainNotLinked')}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                {t('dashboard.loadingOrg')}
              </p>
            )}
          </LiquidGlass>

          {org && !org.domain ? (
            <LiquidGlass className="p-6 md:p-8" intensity="strong">
              <div className="mb-6 max-w-xl space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  {t('dashboard.claimTitle')}
                </h2>
                <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">
                  {t('dashboard.claimBody')}
                </p>
              </div>
              <div className="max-w-md">
                <DomainClaimForm
                  key={locale}
                  organizationId={orgId}
                  pendingDomain={org.pendingDomain}
                  txtHost={org.domainVerificationHost}
                  txtValue={org.domainVerificationValue}
                  expiresAt={org.domainVerificationExpiresAt}
                  onClaimed={() => undefined}
                />
              </div>
            </LiquidGlass>
          ) : null}

          {org?.domain && activeTab === 'overview' && stats === undefined ? (
            <LiquidGlass className="p-6">
              <p className="text-sm text-muted-foreground">
                {t('dashboard.loadingAnalytics')}
              </p>
            </LiquidGlass>
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
            <LiquidGlass className="p-6">
              <p className="text-sm text-muted-foreground">
                {t('dashboard.claimFirst')}
              </p>
            </LiquidGlass>
          ) : null}
        </div>
      </div>

      <MobilePillTabBar activeTab={activeTab} onSelect={setTab} />
    </div>
  )
}
