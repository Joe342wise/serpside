import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export default defineNuxtConfig({
  compatibilityDate: '2026-05-15',
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    config: {
      plugins: [require('daisyui')],
      daisyui: {
        themes: ['dark', 'light'],
        logs: false,
      },
    },
  },
  app: {
    head: {
      title: 'SerpSide',
    },
  },
})
