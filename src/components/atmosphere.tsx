/**
 * Soft luminous field behind glass panels.
 * Kept restrained — enough texture for blur to catch, not decorative orbs.
 */
export function Atmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[color:var(--field-mid)]" />

      {/* Soft pearl wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(165deg, var(--field-top) 0%, var(--field-mid) 48%, var(--field-bottom) 100%)',
        }}
      />

      {/* Large luminous orb — top left */}
      <div
        className="absolute -left-[14%] -top-[20%] h-[52vmin] w-[52vmin] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, var(--orb-a), transparent 72%)',
        }}
      />

      {/* Cool orb — right */}
      <div
        className="absolute -right-[10%] top-[12%] h-[44vmin] w-[44vmin] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--orb-b), transparent 74%)',
        }}
      />

      {/* Soft band across mid */}
      <div
        className="absolute left-[12%] top-[44%] h-[30vmin] w-[62vmin] -rotate-6 rounded-[50%] opacity-45 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, var(--orb-c), transparent 74%)',
        }}
      />

      {/* Bottom glow */}
      <div
        className="absolute bottom-[-12%] left-[22%] h-[34vmin] w-[52vmin] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at center, var(--orb-d), transparent 72%)',
        }}
      />

      {/* Fine grain — very light so blur has micro-detail without noise */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%270.45%27/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  )
}
