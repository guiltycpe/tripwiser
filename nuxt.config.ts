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
    redirect: true,
    redirectOptions: {
      login: '/auth/login',
      callback: '/',
      exclude: ['/', '/auth/*', '/features', '/pricing', '/about'],
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: 'lax',
      secure: false // Set to true in production with HTTPS
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
      sourcemap: false,
      rollupOptions: {
        onwarn(warning, warn) {
          // Ignore Supabase unused import warnings
          if (
            warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
            warning.exporter?.includes('@supabase/')
          ) {
            return
          }
          warn(warning)
        }
      }
    },
    server: {
      hmr: {
        overlay: true
      }
    },
    // Suppress specific warnings in dev mode
    optimizeDeps: {
      exclude: []
    }
  },
  // Suppress build warnings globally
  build: {
    transpile: []
  },
  // Custom hook to suppress console warnings
  hooks: {
    'vite:extendConfig'(config) {
      if (config.build?.rollupOptions) {
        const originalOnwarn = config.build.rollupOptions.onwarn
        config.build.rollupOptions.onwarn = (warning, warn) => {
          if (
            warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
            (warning.exporter?.includes('@supabase/') || 
             warning.exporter?.includes('node_modules/@supabase/'))
          ) {
            return
          }
          if (originalOnwarn) {
            originalOnwarn(warning, warn)
          } else {
            warn(warning)
          }
        }
      }
    }
  }
})