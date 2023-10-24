# vite-plugin-unocss-watcher

[![NPM version](https://img.shields.io/npm/v/vite-plugin-unocss-watcher?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-unocss-watcher)

A simple Vite plugin to reload UnoCSS config when files changed.

Sometimes you want to reload UnoCSS config when files changed. For example, if you import a file that contains UnoCSS shortcuts, like this:

```js
// my-shortcuts.js
export const shortcuts = {
  btn: 'p-2 bg-blue-500 rounded text-white',
  // ...
}
```

```js
// unocss.config.js
import { shortcuts } from './my-shortcuts.js'

export default {
  shortcuts,
}
```

You want to reload UnoCSS config when `my-shortcuts.js` changed. This plugin will help you to do that.

## Installation

```
npm install vite-plugin-unocss-watcher
```

## Usage

```diff
  // vite.config.ts
  import UnoCSS from 'unocss/vite'
+ import { unocssWatcher } from 'vite-plugin-unocss-watcher'
  import { defineConfig } from 'vite'

  export default defineConfig({
    plugins: [
      UnoCSS(),
+     unocssWatcher(['./my-shortcuts.js']),
    ],
  })
```

## License

MIT
