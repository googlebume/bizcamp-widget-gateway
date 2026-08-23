const STORAGE_KEY = 'bizcamp-org-session'

export function readOrgSession(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function writeOrgSession(organizationId: string): void {
  window.localStorage.setItem(STORAGE_KEY, organizationId)
}

export function clearOrgSession(): void {
  window.localStorage.removeItem(STORAGE_KEY)
}
