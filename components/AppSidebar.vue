<template>
  <!-- Desktop Sidebar -->
  <aside
    class="hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-200 ease-in-out flex-shrink-0"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- Header: Logo -->
    <div class="flex items-center h-16 px-4 border-b border-slate-100">
      <NuxtLink to="/dashboard" class="flex items-center gap-3 min-w-0">
        <img src="~/assets/images/logo.png" alt="TripWiser" class="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
        <span
          v-if="!collapsed"
          class="text-lg font-semibold text-slate-900 truncate transition-opacity duration-200"
        >
          TripWiser
        </span>
      </NuxtLink>
    </div>

    <!-- User Info -->
    <div v-if="!collapsed" class="px-4 py-4 border-b border-slate-100">
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img
            v-if="userProfile?.avatar_url"
            :src="userProfile.avatar_url"
            :alt="userProfile.full_name || ''"
            class="h-full w-full object-cover"
          />
          <Icon v-else name="heroicons:user-20-solid" class="h-5 w-5 text-teal-600" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium text-slate-900 truncate">{{ displayName }}</p>
          <p class="text-xs text-slate-400 truncate">{{ user?.email }}</p>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-center py-4 border-b border-slate-100">
      <div class="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden">
        <img
          v-if="userProfile?.avatar_url"
          :src="userProfile.avatar_url"
          :alt="userProfile.full_name || ''"
          class="h-full w-full object-cover"
        />
        <Icon v-else name="heroicons:user-20-solid" class="h-4 w-4 text-teal-600" />
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="[
          isActive(item.to)
            ? 'bg-teal-50 text-teal-700 border-l-2 border-teal-500 ml-0'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
          collapsed ? 'justify-center px-0' : ''
        ]"
        :title="collapsed ? item.label : undefined"
      >
        <Icon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div class="px-3 py-4 border-t border-slate-100 space-y-1">
      <!-- Language Selector (dropdown) -->
      <div class="relative" ref="langDropdownRef">
        <button
          v-if="!collapsed"
          @click="langOpen = !langOpen"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 w-full cursor-pointer"
        >
          <Icon name="heroicons:globe-alt-20-solid" class="h-5 w-5 flex-shrink-0" />
          <span class="truncate flex-1 text-left">{{ currentLanguage.name }}</span>
          <Icon name="heroicons:chevron-up-20-solid" class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-150" :class="{ 'rotate-180': !langOpen }" />
        </button>
        <button
          v-else
          @click="langOpen = !langOpen"
          class="flex items-center justify-center p-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 w-full cursor-pointer"
          title="Language"
        >
          <Icon name="heroicons:globe-alt-20-solid" class="h-5 w-5" />
        </button>

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div v-if="langOpen" class="absolute bottom-full left-0 mb-2 w-full min-w-[180px] rounded-xl bg-white shadow-lg border border-slate-200 overflow-hidden z-50">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="selectLanguage(lang.code)"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              :class="locale === lang.code ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-600'"
            >
              <span class="flex-1">{{ lang.name }}</span>
              <Icon v-if="locale === lang.code" name="heroicons:check-20-solid" class="h-4 w-4 text-teal-500" />
            </button>
          </div>
        </Transition>
      </div>

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150 w-full cursor-pointer"
        :class="collapsed ? 'justify-center px-0' : ''"
        :title="collapsed ? t?.nav?.logout || 'Logout' : undefined"
      >
        <Icon name="heroicons:arrow-right-on-rectangle-20-solid" class="h-5 w-5 flex-shrink-0" />
        <span v-if="!collapsed" class="truncate">{{ t?.nav?.logout || 'Logout' }}</span>
      </button>

      <!-- Collapse Toggle -->
      <button
        @click="toggle"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all duration-150 w-full cursor-pointer"
        :class="collapsed ? 'justify-center px-0' : ''"
      >
        <Icon
          :name="collapsed ? 'heroicons:chevron-right-20-solid' : 'heroicons:chevron-left-20-solid'"
          class="h-5 w-5 flex-shrink-0"
        />
        <span v-if="!collapsed" class="truncate">{{ locale === 'fr' ? 'Réduire' : 'Collapse' }}</span>
      </button>
    </div>
  </aside>

  <!-- Mobile Header Bar -->
  <div class="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 bg-white border-b border-slate-200">
    <button @click="openMobile" class="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
      <Icon name="heroicons:bars-3-20-solid" class="h-5 w-5 text-slate-700" />
    </button>
    <NuxtLink to="/dashboard" class="flex items-center gap-2">
      <img src="~/assets/images/logo.png" alt="TripWiser" class="h-7 w-7 rounded-lg object-cover" />
      <span class="text-base font-semibold text-slate-900">TripWiser</span>
    </NuxtLink>
    <div class="w-9"></div>
  </div>

  <!-- Mobile Sidebar Overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileOpen" class="md:hidden fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40" @click="closeMobile"></div>

        <!-- Sidebar Panel -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="-translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="-translate-x-full"
          appear
        >
          <aside v-if="mobileOpen" class="relative w-64 h-full bg-white flex flex-col shadow-xl">
            <!-- Close -->
            <div class="flex items-center justify-between h-14 px-4 border-b border-slate-100">
              <div class="flex items-center gap-2">
                <img src="~/assets/images/logo.png" alt="TripWiser" class="h-7 w-7 rounded-lg object-cover" />
                <span class="text-base font-semibold text-slate-900">TripWiser</span>
              </div>
              <button @click="closeMobile" class="p-2 -mr-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <Icon name="heroicons:x-mark-20-solid" class="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <!-- User Info -->
            <div class="px-4 py-4 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    v-if="userProfile?.avatar_url"
                    :src="userProfile.avatar_url"
                    :alt="userProfile.full_name || ''"
                    class="h-full w-full object-cover"
                  />
                  <Icon v-else name="heroicons:user-20-solid" class="h-5 w-5 text-teal-600" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-900 truncate">{{ displayName }}</p>
                  <p class="text-xs text-slate-400 truncate">{{ user?.email }}</p>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-3 py-4 space-y-1">
              <NuxtLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                :class="isActive(item.to) ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
                @click="closeMobile"
              >
                <Icon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
                <span>{{ item.label }}</span>
              </NuxtLink>
            </nav>

            <!-- Footer -->
            <div class="px-3 py-4 border-t border-slate-100 space-y-1">
              <!-- Mobile Language Dropdown -->
              <div class="relative" ref="mobileLangDropdownRef">
                <button
                  @click="mobileLangOpen = !mobileLangOpen"
                  class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 w-full cursor-pointer"
                >
                  <Icon name="heroicons:globe-alt-20-solid" class="h-5 w-5 flex-shrink-0" />
                  <span class="flex-1 text-left">{{ currentLanguage.name }}</span>
                  <Icon name="heroicons:chevron-up-20-solid" class="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-150" :class="{ 'rotate-180': !mobileLangOpen }" />
                </button>
                <Transition
                  enter-active-class="transition duration-150 ease-out"
                  enter-from-class="opacity-0 translate-y-1"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-1"
                >
                  <div v-if="mobileLangOpen" class="absolute bottom-full left-0 mb-2 w-full rounded-xl bg-white shadow-lg border border-slate-200 overflow-hidden z-50">
                    <button
                      v-for="lang in languages"
                      :key="lang.code"
                      @click="selectLanguage(lang.code); mobileLangOpen = false"
                      class="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                      :class="locale === lang.code ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-600'"
                    >
                      <span>{{ lang.flag }}</span>
                      <span class="flex-1">{{ lang.name }}</span>
                      <Icon v-if="locale === lang.code" name="heroicons:check-20-solid" class="h-4 w-4 text-teal-500" />
                    </button>
                  </div>
                </Transition>
              </div>
              <button
                @click="handleLogout"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-150 w-full cursor-pointer"
              >
                <Icon name="heroicons:arrow-right-on-rectangle-20-solid" class="h-5 w-5 flex-shrink-0" />
                <span>{{ t?.nav?.logout || 'Logout' }}</span>
              </button>
            </div>
          </aside>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { UserProfile } from '~/types/profile.types'

const { t, locale, setLocale } = useTranslations()
const { collapsed, mobileOpen, toggle, openMobile, closeMobile } = useSidebarState()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()

const userProfile = ref<UserProfile | null>(null)

// Language dropdown state
const langOpen = ref(false)
const mobileLangOpen = ref(false)
const langDropdownRef = ref<HTMLElement | null>(null)
const mobileLangDropdownRef = ref<HTMLElement | null>(null)

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
]

const currentLanguage = computed(() => {
  return languages.find(l => l.code === locale.value) || languages[0]
})

function selectLanguage(code: string) {
  setLocale(code as 'en' | 'fr')
  langOpen.value = false
}

function handleLangClickOutside(event: MouseEvent) {
  if (langDropdownRef.value && !langDropdownRef.value.contains(event.target as Node)) {
    langOpen.value = false
  }
  if (mobileLangDropdownRef.value && !mobileLangDropdownRef.value.contains(event.target as Node)) {
    mobileLangOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleLangClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleLangClickOutside)
})

const displayName = computed(() => {
  return userProfile.value?.full_name || user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'Traveler'
})

const navItems = computed(() => [
  { to: '/dashboard', icon: 'heroicons:squares-2x2-20-solid', label: t.value?.nav?.dashboard || 'Dashboard' },
  { to: '/plan', icon: 'heroicons:plus-circle-20-solid', label: locale.value === 'fr' ? 'Nouveau voyage' : 'New Trip' },
  { to: '/profile', icon: 'heroicons:user-circle-20-solid', label: t.value?.nav?.profile || 'Profile' },
])

function isActive(path: string) {
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path.startsWith('/trip/')
  }
  return route.path === path
}

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/')
}

// Load user profile
watch(user, async (newUser) => {
  if (newUser) {
    try {
      userProfile.value = await $fetch<UserProfile>('/api/profile')
    } catch {
      // Silently handle
    }
  } else {
    userProfile.value = null
  }
}, { immediate: true })

// Close mobile sidebar on route change
watch(() => route.path, () => {
  closeMobile()
})
</script>
