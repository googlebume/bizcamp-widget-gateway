#!/usr/bin/env bun
/**
 * Build the production widget IIFE and place it at public/widget.js
 * so the gateway can serve the real embed script.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const gatewayRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const widgetRoot = resolve(gatewayRoot, '../react-widget-bizcamp')
const artifact = resolve(widgetRoot, 'dist/widget.js')
const publicDir = resolve(gatewayRoot, 'public')
const target = resolve(publicDir, 'widget.js')

if (!existsSync(widgetRoot)) {
  console.error(
    '[sync-widget] Missing ../react-widget-bizcamp. Run `bun run ensure-widget` first.',
  )
  process.exit(1)
}

const build = spawnSync('bunx', ['vite', 'build'], {
  cwd: widgetRoot,
  stdio: 'inherit',
  env: process.env,
})

if (build.status !== 0) {
  console.error('[sync-widget] Widget Vite build failed.')
  process.exit(build.status ?? 1)
}

if (!existsSync(artifact)) {
  console.error(`[sync-widget] Expected artifact missing: ${artifact}`)
  process.exit(1)
}

mkdirSync(publicDir, { recursive: true })
copyFileSync(artifact, target)
console.log(`[sync-widget] Wrote ${target}`)
