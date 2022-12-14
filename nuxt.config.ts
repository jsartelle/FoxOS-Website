// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [
    'sanitize.css',
    'sanitize.css/typography.css',
    '@/assets/scss/main.scss',
  ],
  experimental: {
    reactivityTransform: true,
  },
  modules: ['@nuxt/content'],
  routeRules: {
    '/': { redirect: '/desktop' },
    '/desktop': { ssr: false },
  },
})
