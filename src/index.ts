import path from 'node:path'

import type { UnocssPluginContext } from '@unocss/core'
import type { Plugin, ViteDevServer } from 'vite'

type GetContext = () => UnocssPluginContext | undefined

function unocssWatcher(files: string[], options?: { debug?: boolean }): Plugin {
  if (!Array.isArray(files)) {
    throw new TypeError(
      `[vite-plugin-unocss-watcher] 'files' must be an array of strings. Got: ${typeof files}`,
    )
  }

  files = files.map((f) => path.normalize(f))

  const debug = options?.debug ?? false

  let getContext: GetContext | null = null

  async function handleFileChange(server: ViteDevServer, p: string) {
    if (!files.includes(p)) {
      return
    }

    if (debug) {
      console.debug(
        `[vite-plugin-unocss-watcher] ${p} changed. Reloading UnoCSS config`,
      )
    }

    const ctx = getContext?.()
    if (!ctx) {
      console.warn('[vite-plugin-unocss-watcher] Unable to find UnoCSS context')
      return
    }

    await ctx.reloadConfig()
    server.ws.send({
      type: 'custom',
      event: 'unocss:config-changed',
    })
  }

  async function safeHandleFileChange(server: ViteDevServer, p: string) {
    try {
      await handleFileChange(server, p)
    } catch (e) {
      console.warn(
        `[vite-plugin-unocss-watcher] Error handling file change: ${e}`,
      )
    }
  }

  return {
    name: 'vite-plugin-unocss-watcher',

    configResolved(config) {
      const unocssApiPlugin = config.plugins.find(
        (plugin) => plugin.name === 'unocss:api',
      )
      if (!unocssApiPlugin) {
        console.warn(
          '[vite-plugin-unocss-watcher] Unable to find unocss:api plugin',
        )
        return
      }

      getContext = () => {
        const api = unocssApiPlugin.api as { getContext?: GetContext }
        return api?.getContext?.()
      }
    },

    configureServer(server) {
      if (files.length === 0) {
        return
      }

      server.watcher.add(files)

      server.watcher.on('change', (path) => {
        void safeHandleFileChange(server, path)
      })
    },
  }
}

export { unocssWatcher }
export default unocssWatcher
