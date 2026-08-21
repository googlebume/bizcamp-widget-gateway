import { ConvexError } from 'convex/values'

export type UserFacingErrorCopy = {
  fallback: string
  offline?: string
  network?: string
  timeout?: string
}

/**
 * Turn Convex / network failures into short UI copy.
 * Full details stay in the console — never surface request IDs or stack frames.
 */
export function toUserFacingError(
  error: unknown,
  copy: string | UserFacingErrorCopy,
): string {
  console.error('[Bizcamp]', error)

  const messages = typeof copy === 'string' ? { fallback: copy } : copy

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return messages.offline ?? messages.fallback
  }

  if (error instanceof ConvexError) {
    const fromData = readConvexData(error.data)
    if (fromData) return fromData
  }

  const raw = readErrorText(error)
  if (!raw) return messages.fallback

  const lowered = raw.toLowerCase()
  if (
    lowered.includes('failed to fetch') ||
    lowered.includes('networkerror') ||
    lowered.includes('load failed') ||
    lowered.includes('network request failed') ||
    lowered.includes('net::err_')
  ) {
    return messages.network ?? messages.fallback
  }
  if (lowered.includes('timed out') || lowered.includes('timeout')) {
    return messages.timeout ?? messages.fallback
  }

  const fromUncaught = raw
    .match(/Uncaught Error:\s*(.+?)(?:\r?\n|$)/i)?.[1]
    ?.trim()
  if (fromUncaught && isSafeUserMessage(fromUncaught)) {
    return fromUncaught
  }

  const firstLine = raw.split(/\r?\n/)[0]?.trim() ?? ''
  const stripped = firstLine
    .replace(/^\[CONVEX[^\]]*]\s*/gi, '')
    .replace(/\[Request ID:[^\]]*]\s*/gi, '')
    .replace(/^Server Error\s*/i, '')
    .replace(/^Error:\s*/i, '')
    .trim()

  if (isSafeUserMessage(stripped)) return stripped

  return messages.fallback
}

function readConvexData(data: unknown): string | null {
  if (typeof data === 'string' && isSafeUserMessage(data)) return data
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message: unknown }).message
    if (typeof message === 'string' && isSafeUserMessage(message)) {
      return message
    }
  }
  return null
}

function readErrorText(error: unknown): string {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message
    if (typeof message === 'string') return message
  }
  return ''
}

function isSafeUserMessage(message: string): boolean {
  if (!message || message.length > 220) return false
  if (
    /\[convex|request id|uncaught|at handler|convex\/|\.ts:\d+|server error|namedirective|call stack/i.test(
      message,
    )
  ) {
    return false
  }
  return true
}
