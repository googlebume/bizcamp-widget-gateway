#!/usr/bin/env bun
/**
 * Clone ../react-widget-bizcamp when missing (Vercel CI).
 * Uses WIDGET_GITHUB_TOKEN / GITHUB_TOKEN / GH_TOKEN for private GitHub repos.
 */
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const gatewayRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const widgetRoot = resolve(gatewayRoot, '../react-widget-bizcamp')

if (existsSync(resolve(widgetRoot, 'convex'))) {
  process.exit(0)
}

const defaultUrl = 'https://github.com/khos-streks/react-widget-bizcamp.git'
const sourceUrl = process.env.WIDGET_REPO_URL?.trim() || defaultUrl
const token =
  process.env.WIDGET_GITHUB_TOKEN?.trim() ||
  process.env.GITHUB_TOKEN?.trim() ||
  process.env.GH_TOKEN?.trim()

let cloneUrl = sourceUrl
if (token && /^https:\/\/github\.com\//.test(sourceUrl)) {
  cloneUrl = sourceUrl.replace(
    'https://github.com/',
    `https://x-access-token:${token}@github.com/`,
  )
}

console.log('[ensure-widget] Cloning widget backend into ../react-widget-bizcamp')
const clone = spawnSync('git', ['clone', '--depth', '1', cloneUrl, widgetRoot], {
  stdio: ['ignore', 'inherit', 'inherit'],
})
if (clone.status !== 0) {
  console.error('[ensure-widget] git clone failed. Set WIDGET_GITHUB_TOKEN on Vercel.')
  process.exit(clone.status ?? 1)
}

const install = spawnSync('bun', ['install'], {
  cwd: widgetRoot,
  stdio: 'inherit',
})
process.exit(install.status ?? 1)
