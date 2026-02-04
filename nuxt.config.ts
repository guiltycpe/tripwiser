// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: true,
  devtools: { enabled: true },
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/global.css',
    'leaflet/dist/leaflet.css'
  ],
  modules: [
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
  ],
  icon: {
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    }
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' }
    ],
    defaultLocale: 'en'
  },
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    redirectOptions: {
      login: '/auth/login',
      callback: '/',
      exclude: ['/', '/auth/*', '/features', '/pricing', '/about'], // Removing /plan to force redirect
    }
  },
  runtimeConfig: {
    // Private keys (server-only)
    geoapifyApiKey: process.env.NUXT_GEOAPIFY_API_KEY,
    unsplashAccessKey: process.env.UNSPLASH_ACCESS_KEY,
    // Public keys (exposed to client)
    public: {
      // Add public keys here
    }
  },
  vite: {
    css: {
      devSourcemap: false
    },
    build: {
      sourcemap: false
    }
  }
})