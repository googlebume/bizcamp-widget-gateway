import * as React from 'react'
import { cn } from '@/lib/utils'

type PointerLightStyle = React.CSSProperties & {
  '--pointer-x'?: string
  '--pointer-y'?: string
}

export interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'soft' | 'strong'
  interactive?: boolean
}

/**
 * Physical liquid-glass slab.
 * Requires a textured Atmosphere behind it and NO transform/filter/opacity
 * ancestors (those flatten backdrop-filter).
 *
 * Content wrapper is a flex column that fills the slab so callers can use
 * flex-1 / min-h-0 children (e.g. iframes) without an extra layout hop.
 */
export function LiquidGlass({
  className,
  children,
  intensity = 'soft',
  interactive = true,
  style,
  ...props
}: LiquidGlassProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [light, setLight] = React.useState({ x: 38, y: 16 })
  const raf = React.useRef<number | null>(null)

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => setLight({ x, y }))
  }

  React.useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  const glassStyle: PointerLightStyle = {
    ...style,
    '--pointer-x': `${light.x}%`,
    '--pointer-y': `${light.y}%`,
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setLight({ x: 38, y: 16 })}
      style={glassStyle}
      className={cn(
        'group/glass relative flex flex-col rounded-2xl',
        'glass-surface',
        intensity === 'strong' && 'glass-surface-strong',
        'transition-[box-shadow,background] duration-300 ease-out',
        className,
      )}
      {...props}
    >
      {/* Subtle pointer sheen — kept low so glass stays restrained */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <div
          className="absolute inset-0 opacity-[var(--glass-specular-opacity)] transition-opacity duration-300 group-hover/glass:opacity-[calc(var(--glass-specular-opacity)+0.12)]"
          style={{
            background: `
              radial-gradient(
                36% 28% at var(--pointer-x) var(--pointer-y),
                var(--glass-sheen),
                transparent 62%
              )
            `,
          }}
        />

        {/* Thin edge lip — no heavy inset bevel bloom */}
        <div
          className="absolute inset-[1px] rounded-[calc(var(--radius)+0.25rem)] opacity-40"
          style={{
            boxShadow:
              'inset 0 1px 0 color-mix(in oklch, var(--glass-highlight) 50%, transparent)',
          }}
        />

        {/* Soft top highlight line */}
        <div
          className="absolute inset-x-0 top-0 h-px opacity-70"
          style={{
            background:
              'linear-gradient(90deg, transparent 8%, var(--glass-highlight) 35%, var(--glass-highlight) 65%, transparent 92%)',
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col">
        {children}
      </div>
    </div>
  )
}
