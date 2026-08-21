import * as React from 'react'
import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-[color:var(--glass-stroke-outer)] bg-[color:var(--glass-recess)] px-3.5 py-2 text-sm text-foreground',
          'shadow-[inset_0_1px_1px_var(--glass-shadow)] placeholder:text-muted-foreground/65',
          'transition-[box-shadow,border-color,background-color] duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-transparent focus-visible:bg-[color:var(--glass-fill)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
