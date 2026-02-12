<template>
  <header 
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      isScrolled || !isTransparent
        ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm'
        : 'bg-transparent border-b border-transparent'
    ]"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

      <!-- Left: Logo + Navigation Links (Desktop) -->
      <div class="flex items-center gap-8">
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <img src="~/assets/images/logo.png" alt="TripWiser Logo" class="h-8 w-8 rounded-lg object-cover">
          <span :class="['text-lg font-semibold transition-colors duration-300', isScrolled || !isTransparent ? 'text-slate-900 dark:text-slate-100' : 'text-slate-900 dark:text-white']">TripWiser</span>
        </NuxtLink>

        <nav class="hidden gap-2 md:flex">
          <NuxtLink to="/" :class="['nav-link dark:!text-white', { 'nav-link--transparent': !isScrolled && isTransparent }]">{{ t.nav.home }}</NuxtLink>
          <NuxtLink to="/features" :class="['nav-link dark:!text-white', { 'nav-link--transparent': !isScrolled && isTransparent }]">{{ t.nav.features }}</NuxtLink>
          <NuxtLink to="/pricing" :class="['nav-link dark:!text-white', { 'nav-link--transparent': !isScrolled && isTransparent }]">{{ t.nav.pricing }}</NuxtLink>
          <NuxtLink to="/about" :class="['nav-link dark:!text-white', { 'nav-link--transparent': !isScrolled && isTransparent }]">{{ t.nav.about }}</NuxtLink>
        </nav>
      </div>

      <!-- Right: User Controls -->
      <div class="flex items-center gap-3">
        <ThemeToggle />
        <LanguageSelector />

        <template v-if="!user">
          <NuxtLink to="/auth/login" :class="['login-btn dark:!text-white dark:!border-slate-500 dark:hover:!border-teal-400 dark:hover:!text-teal-400 dark:hover:!bg-teal-400/10', isScrolled || !isTransparent ? 'login-btn--solid' : 'login-btn--transparent']">
            {{ t.nav.login }}
          </NuxtLink>
          <NuxtLink to="/auth/signup" class="signup-btn">
            <span class="signup-btn__bg"></span>
            <span class="relative">{{ t.nav.signup }}</span>
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/dashboard" class="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
            <Icon name="heroicons:squares-2x2-20-solid" class="h-4 w-4" />
            {{ t.nav.dashboard }}
          </NuxtLink>
          <NuxtLink to="/profile" class="group">
            <div class="h-9 w-9 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden hover:border-teal-300 dark:hover:border-teal-500 transition-colors">
              <img
                v-if="userProfile?.avatar_url"
                :src="userProfile.avatar_url"
                :alt="userProfile.full_name || 'User'"
                class="h-full w-full object-cover"
              />
              <Icon v-else name="heroicons:user-20-solid" class="h-5 w-5 text-teal-600" />
            </div>
          </NuxtLink>
        </template>

        <!-- Mobile Hamburger -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 -mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Icon :name="mobileMenuOpen ? 'heroicons:x-mark-20-solid' : 'heroicons:bars-3-20-solid'" class="h-5 w-5 text-slate-700 dark:text-slate-300" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav v-if="mobileMenuOpen" class="md:hidden border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4 space-y-1">
        <NuxtLink to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <Icon name="heroicons:home-20-solid" class="h-5 w-5 text-slate-400" />
          {{ t.nav.home }}
        </NuxtLink>
        <NuxtLink to="/features" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <Icon name="heroicons:sparkles-20-solid" class="h-5 w-5 text-slate-400" />
          {{ t.nav.features }}
        </NuxtLink>
        <NuxtLink to="/pricing" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <Icon name="heroicons:credit-card-20-solid" class="h-5 w-5 text-slate-400" />
          {{ t.nav.pricing }}
        </NuxtLink>
        <NuxtLink to="/about" class="mobile-nav-link" @click="mobileMenuOpen = false">
          <Icon name="heroicons:information-circle-20-solid" class="h-5 w-5 text-slate-400" />
          {{ t.nav.about }}
        </NuxtLink>

        <div class="border-t border-slate-100 dark:border-slate-700 pt-3 mt-3 space-y-1">
          <template v-if="!user">
            <NuxtLink to="/auth/login" class="mobile-nav-link" @click="mobileMenuOpen = false">
              <Icon name="heroicons:arrow-right-on-rectangle-20-solid" class="h-5 w-5 text-slate-400" />
              {{ t.nav.login }}
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="mobile-signup-btn" @click="mobileMenuOpen = false">
              {{ t.nav.signup }}
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/dashboard" class="mobile-nav-link" @click="mobileMenuOpen = false">
              <Icon name="heroicons:squares-2x2-20-solid" class="h-5 w-5 text-slate-400" />
              {{ t.nav.dashboard }}
            </NuxtLink>
            <NuxtLink to="/profile" class="mobile-nav-link" @click="mobileMenuOpen = false">
              <Icon name="heroicons:user-circle-20-solid" class="h-5 w-5 text-slate-400" />
              {{ t.nav.profile }}
            </NuxtLink>
          </template>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import type { UserProfile } from '~/types/profile.types'

const props = defineProps<{
  transparent?: boolean
}>()

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const userProfile = ref<UserProfile | null>(null)
const isLoadingProfile = ref(false)
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const isTransparent = computed(() => props.transparent ?? false)

const { t } = useTranslations()

const route = useRoute()
watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})

// Track scroll for transparent navbar
function onScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(user, async (newUser) => {
  if (newUser && !isLoadingProfile.value) {
    isLoadingProfile.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      userProfile.value = await $fetch<UserProfile>('/api/profile')
    } catch (error: any) {
      if (error?.status !== 401 && error?.statusCode !== 401) {
        console.error('Failed to load user profile in navbar:', error)
      }
    } finally {
      isLoadingProfile.value = false
    }
  } else if (!newUser) {
    userProfile.value = null
  }
}, { immediate: true })

let authSubscription: { unsubscribe: () => void } | null = null

onMounted(() => {
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user && !userProfile.value) {
      try {
        userProfile.value = await $fetch<UserProfile>('/api/profile')
      } catch {
        // Silently ignore
      }
    } else if (event === 'SIGNED_OUT') {
      userProfile.value = null
    }
  })
  authSubscription = data.subscription
})

onUnmounted(() => {
  authSubscription?.unsubscribe()
})
</script>

<style scoped>
/* ─── Nav Links ─── */

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.25s ease;
}

/* Animated underline on hover */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0.25rem;
  left: 50%;
  right: 50%;
  height: 2px;
  background: linear-gradient(to right, #14b8a6, #06b6d4);
  border-radius: 2px;
  transition: left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), right 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.nav-link:hover::after {
  left: 1rem;
  right: 1rem;
}

.nav-link:hover {
  color: #0f172a;
  background: rgba(148, 163, 184, 0.1);
}

.nav-link--transparent {
  color: #1e293b;
}

.nav-link--transparent:hover {
  color: #0f172a;
  background: rgba(15, 23, 42, 0.06);
}

.router-link-exact-active.nav-link {
  color: #0d9488;
  background: rgba(13, 148, 136, 0.1);
}

.router-link-exact-active.nav-link::after {
  left: 1rem;
  right: 1rem;
}

.router-link-exact-active.nav-link--transparent {
  color: #0d9488;
  background: rgba(13, 148, 136, 0.08);
}

/* Dark mode nav-link colors handled via Tailwind dark:!text-white in template */

/* ─── Login Button ─── */

.login-btn {
  display: none;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.625rem;
  border: 1.5px solid transparent;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@media (min-width: 640px) {
  .login-btn {
    display: inline-flex;
  }
}

.login-btn--solid {
  color: #475569;
  border-color: #e2e8f0;
  background: transparent;
}

.login-btn--solid:hover {
  color: #0d9488;
  border-color: #0d9488;
  background: rgba(13, 148, 136, 0.05);
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.08);
}

.login-btn--transparent {
  color: #334155;
  border-color: rgba(51, 65, 85, 0.3);
}

.login-btn--transparent:hover {
  color: #0d9488;
  border-color: #0d9488;
  background: rgba(13, 148, 136, 0.05);
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.08);
}

/* Dark mode login-btn colors handled via Tailwind in template */

/* ─── Sign Up Button ─── */

.signup-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  border-radius: 0.625rem;
  padding: 0.5rem 1.125rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.signup-btn__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%);
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  transition: opacity 0.3s ease;
}

.signup-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.35), 0 0 0 2px rgba(13, 148, 136, 0.15);
}

/* Dark signup hover handled by same light mode styles — gradient is visible on both */

.signup-btn:active {
  transform: scale(0.98);
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ─── Mobile Nav ─── */

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.mobile-nav-link:hover {
  background: var(--color-surface-alt);
  color: var(--color-text-primary);
}

.mobile-signup-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  background: linear-gradient(135deg, #0d9488 0%, #06b6d4 100%);
  transition: all 0.2s ease;
}

.mobile-signup-btn:hover {
  box-shadow: 0 4px 16px rgba(13, 148, 136, 0.3);
}

/* Dark mobile signup hover uses same styles as light */
</style>
