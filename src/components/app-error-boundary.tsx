import { Component, type ErrorInfo, type ReactNode } from 'react'
import { LiquidGlass } from '@/components/liquid-glass'
import { Button } from '@/components/ui/button'

type AppErrorBoundaryProps = {
  children: ReactNode
  title: string
  body: string
  reloadLabel: string
}

type AppErrorBoundaryState = {
  hasError: boolean
}

/**
 * Catches render crashes and shows a calm recovery UI instead of a blank page.
 */
export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Bizcamp] Uncaught UI error', error, info.componentStack)
  }

  private handleReload = (): void => {
    window.location.assign('/')
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-6 py-16">
        <LiquidGlass className="w-full p-7 md:p-8" intensity="strong" interactive={false}>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {this.props.title}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {this.props.body}
          </p>
          <Button type="button" className="mt-6" onClick={this.handleReload}>
            {this.props.reloadLabel}
          </Button>
        </LiquidGlass>
      </div>
    )
  }
}
