<template>
  <!-- Modern navbar with glassmorphism effect -->
  <header class="sticky top-0 z-50 glass border-b border-white/20 animate-slide-down">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      
      <!-- Left: Navigation Links -->
      <div class="flex-1">
        <nav class="hidden gap-8 md:flex">
          <NuxtLink to="/" class="nav-link group">
            <span>{{ t.nav.home }}</span>
            <span class="nav-underline"></span>
          </NuxtLink>
          <NuxtLink to="/features" class="nav-link group">
            <span>{{ t.nav.features }}</span>
            <span class="nav-underline"></span>
          </NuxtLink>
          <NuxtLink to="/pricing" class="nav-link group">
            <span>{{ t.nav.pricing }}</span>
            <span class="nav-underline"></span>
          </NuxtLink>
          <NuxtLink to="/about" class="nav-link group">
            <span>{{ t.nav.about }}</span>
            <span class="nav-underline"></span>
          </NuxtLink>
        </nav>
      </div>
      
      <!-- Center: Logo with subtle animation -->
      <NuxtLink
        to="/"
        class="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white p-2 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-110 animate-pulse-subtle"
      >
        <img src="~/assets/images/logo.png" alt="TripWiser Logo" class="h-14 w-14 rounded-full object-cover">
      </NuxtLink>
      
      <!-- Right: User Controls -->
      <div class="flex-1">
        <div class="flex items-center justify-end gap-4">
          <!-- Language Selector -->
          <LanguageSelector />
          
          <!-- Auth Buttons - Dynamic based on auth state -->
          <div class="flex items-center gap-4">
            <template v-if="!user">
              <!-- Not logged in -->
              <NuxtLink to="/auth/login" class="btn-secondary hidden sm:block">
                {{ t.nav.login }}
              </NuxtLink>
              <NuxtLink to="/auth/signup" class="btn-primary whitespace-nowrap">
                <span>{{ t.nav.signup }}</span>
              </NuxtLink>
            </template>
            <template v-else>
              <!-- Logged in -->
              <NuxtLink to="/dashboard" class="btn-secondary hidden sm:flex items-center gap-2">
                <Icon name="heroicons:rectangle-stack-20-solid" class="h-4 w-4" />
                {{ t.nav.dashboard }}
              </NuxtLink>
              <!-- Profile Avatar -->
              <NuxtLink to="/profile" class="group relative">
                <div class="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 p-0.5 shadow-md hover:shadow-lg transition-all cursor-pointer">
                  <div class="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img 
                      v-if="userProfile?.avatar_url" 
                      :src="userProfile.avatar_url" 
                      :alt="userProfile.full_name || 'User avatar'"
                      class="h-full w-full object-cover"
                    />
                    <Icon 
                      v-else 
                      name="heroicons:user-circle-20-solid" 
                      class="h-7 w-7 text-teal-600" 
                    />
                  </div>
                </div>
                <!-- Tooltip on hover -->
                <div class="absolute right-0 top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div class="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    {{ t.nav.profile }}
                  </div>
                </div>
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { UserProfile } from '~/types/profile.types'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const userProfile = ref<UserProfile | null>(null)
const isLoadingProfile = ref(false)

// Use global translations
const { t } = useTranslations()

// Load user profile when user is authenticated
watch(user, async (newUser) => {
  if (newUser && !isLoadingProfile.value) {
    isLoadingProfile.value = true
    try {
      // Add a small delay to ensure session is fully ready
      await new Promise(resolve => setTimeout(resolve, 100))
      userProfile.value = await $fetch<UserProfile>('/api/profile')
    } catch (error: any) {
      // Silently handle 401 errors during initial load
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

// Also listen to auth state changes
onMounted(() => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user && !userProfile.value) {
      try {
        userProfile.value = await $fetch<UserProfile>('/api/profile')
      } catch (error) {
        // Silently ignore errors
      }
    } else if (event === 'SIGNED_OUT') {
      userProfile.value = null
    }
  })
})
</script>

<style scoped>
.nav-link {
  position: relative;
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  padding-bottom: 4px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #111827;
}

.nav-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #14b8a6, #06b6d4);
  transition: width 0.3s ease;
}

.nav-link:hover .nav-underline {
  width: 100%;
}

.router-link-exact-active {
  color: #14b8a6;
  font-weight: 600;
}

.router-link-exact-active .nav-underline {
  width: 100%;
}
</style>
