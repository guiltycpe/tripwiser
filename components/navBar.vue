<template>
  <header class="sticky top-0 z-50 bg-white border-b border-slate-200">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

      <!-- Left: Logo + Navigation Links (Desktop) -->
      <div class="flex items-center gap-8">
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <img src="~/assets/images/logo.png" alt="TripWiser Logo" class="h-8 w-8 rounded-lg object-cover">
          <span class="text-lg font-semibold text-slate-900">TripWiser</span>
        </NuxtLink>

        <nav class="hidden gap-6 md:flex">
          <NuxtLink to="/" class="nav-link">{{ t.nav.home }}</NuxtLink>
          <NuxtLink to="/features" class="nav-link">{{ t.nav.features }}</NuxtLink>
          <NuxtLink to="/pricing" class="nav-link">{{ t.nav.pricing }}</NuxtLink>
          <NuxtLink to="/about" class="nav-link">{{ t.nav.about }}</NuxtLink>
        </nav>
      </div>

      <!-- Right: User Controls -->
      <div class="flex items-center gap-3">
        <LanguageSelector />

        <template v-if="!user">
          <NuxtLink to="/auth/login" class="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
            {{ t.nav.login }}
          </NuxtLink>
          <NuxtLink to="/auth/signup" class="btn-primary text-sm px-4 py-2">
            {{ t.nav.signup }}
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/dashboard" class="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
            <Icon name="heroicons:squares-2x2-20-solid" class="h-4 w-4" />
            {{ t.nav.dashboard }}
          </NuxtLink>
          <NuxtLink to="/profile" class="group">
            <div class="h-9 w-9 rounded-full bg-teal-50 border border-slate-200 flex items-center justify-center overflow-hidden hover:border-teal-300 transition-colors">
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
          class="md:hidden p-2 -mr-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Icon :name="mobileMenuOpen ? 'heroicons:x-mark-20-solid' : 'heroicons:bars-3-20-solid'" class="h-5 w-5 text-slate-700" />
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
      <nav v-if="mobileMenuOpen" class="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-1">
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

        <div class="border-t border-slate-100 pt-3 mt-3 space-y-1">
          <template v-if="!user">
            <NuxtLink to="/auth/login" class="mobile-nav-link" @click="mobileMenuOpen = false">
              <Icon name="heroicons:arrow-right-on-rectangle-20-solid" class="h-5 w-5 text-slate-400" />
              {{ t.nav.login }}
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="mobile-nav-link font-semibold text-teal-600" @click="mobileMenuOpen = false">
              <Icon name="heroicons:user-plus-20-solid" class="h-5 w-5 text-teal-500" />
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

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const userProfile = ref<UserProfile | null>(null)
const isLoadingProfile = ref(false)
const mobileMenuOpen = ref(false)

const { t } = useTranslations()

const route = useRoute()
watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
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
.nav-link {
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.25rem 0;
  transition: color 0.15s ease;
}

.nav-link:hover {
  color: #0f172a;
}

.router-link-exact-active.nav-link {
  color: #0d9488;
  font-weight: 600;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #475569;
  transition: all 0.15s ease;
}

.mobile-nav-link:hover {
  background: #f8fafc;
  color: #0f172a;
}
</style>
