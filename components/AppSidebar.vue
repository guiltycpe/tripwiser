<template>
  <!-- Desktop Sidebar -->
  <aside
    class="hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-200 ease-in-out flex-shrink-0 relative group/sidebar"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <!-- Header: Logo -->
    <div class="flex items-center h-14 px-4 border-b border-slate-100 dark:border-slate-700">
      <NuxtLink to="/dashboard" class="flex items-center gap-3 min-w-0">
        <img src="~/assets/images/logo.png" alt="TripWiser" class="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-x-2"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 -translate-x-2"
        >
          <span
            v-if="!collapsed"
            class="text-lg font-bold text-slate-900 dark:text-slate-100 truncate"
          >
            TripWiser
          </span>
        </Transition>
      </NuxtLink>
    </div>

    <!-- New Trip CTA Button -->
    <div class="px-3 pt-4 pb-2">
      <NuxtLink
        to="/plan"
        class="flex items-center gap-2.5 w-full rounded-xl text-sm font-semibold transition-all duration-200 bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 hover:from-teal-600 hover:to-cyan-600 active:scale-[0.98]"
        :class="collapsed ? 'justify-center p-2.5' : 'px-4 py-2.5'"
        :title="collapsed ? (t?.nav?.newTrip || 'New Trip') : undefined"
      >
        <Icon name="heroicons:plus-20-solid" class="h-5 w-5 flex-shrink-0" />
        <span v-if="!collapsed">{{ t?.nav?.newTrip || 'New Trip' }}</span>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-2 space-y-0.5">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="[
          isActive(item.to)
            ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
          collapsed ? 'justify-center px-0' : ''
        ]"
        :title="collapsed ? item.label : undefined"
      >
        <Icon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
        <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer: User Menu + Collapse -->
    <div class="border-t border-slate-100 dark:border-slate-700">
      <!-- User Account Button — opens popover -->
      <div class="relative px-3 py-3" ref="userMenuRef">
        <button
          @click="userMenuOpen = !userMenuOpen"
          class="flex items-center gap-3 w-full rounded-xl px-2.5 py-2 transition-all duration-150 cursor-pointer"
          :class="[
            userMenuOpen
              ? 'bg-slate-100 dark:bg-slate-800'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800',
            collapsed ? 'justify-center' : ''
          ]"
          :title="collapsed ? displayName : undefined"
        >
          <div class="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-slate-900">
            <img
              v-if="userProfile?.avatar_url"
              :src="userProfile.avatar_url"
              :alt="userProfile.full_name || ''"
              class="h-full w-full object-cover"
            />
            <Icon v-else name="heroicons:user-20-solid" class="h-4 w-4 text-teal-600" />
          </div>
          <template v-if="!collapsed">
            <div class="min-w-0 flex-1 text-left">
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate leading-tight">{{ displayName }}</p>
              <p class="text-[11px] text-slate-400 dark:text-slate-500 truncate leading-tight">{{ user?.email }}</p>
            </div>
            <Icon
              name="heroicons:chevron-up-down-20-solid"
              class="h-4 w-4 text-slate-400 flex-shrink-0"
            />
          </template>
        </button>

        <!-- User Menu Popover -->
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 translate-y-1 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-1 scale-95"
        >
          <div
            v-if="userMenuOpen"
            class="absolute bottom-full left-3 right-3 mb-2 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
            :class="collapsed ? 'left-0 right-auto min-w-[220px] ml-1' : ''"
          >
            <!-- Profile link -->
            <NuxtLink
              to="/profile"
              @click="userMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700"
            >
              <Icon name="heroicons:user-circle-20-solid" class="h-5 w-5 text-slate-400" />
              {{ t?.nav?.profile || 'Profile' }}
            </NuxtLink>

            <!-- Theme Toggle -->
            <button
              @click="toggleTheme"
              class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors w-full cursor-pointer"
            >
              <Icon :name="isDark ? 'heroicons:moon-20-solid' : 'heroicons:sun-20-solid'" class="h-5 w-5 text-slate-400" />
              {{ isDark ? (t?.nav?.lightMode || 'Light mode') : (t?.nav?.darkMode || 'Dark mode') }}
            </button>

            <!-- Language Submenu -->
            <div class="relative" ref="langSubmenuRef">
              <button
                @click="langSubmenuOpen = !langSubmenuOpen"
                class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors w-full cursor-pointer"
              >
                <Icon name="heroicons:globe-alt-20-solid" class="h-5 w-5 text-slate-400" />
                <span class="flex-1 text-left">{{ currentLanguage.name }}</span>
                <Icon name="heroicons:chevron-right-20-solid" class="h-4 w-4 text-slate-400 transition-transform duration-150" :class="{ 'rotate-90': langSubmenuOpen }" />
              </button>

              <!-- Language Options (inline expand) -->
              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
              >
                <div v-if="langSubmenuOpen" class="bg-slate-50 dark:bg-slate-900/50">
                  <button
                    v-for="lang in languages"
                    :key="lang.code"
                    @click="selectLanguage(lang.code)"
                    class="w-full flex items-center gap-3 px-4 pl-12 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    :class="locale === lang.code ? 'text-teal-600 dark:text-teal-400 font-medium' : 'text-slate-500 dark:text-slate-400'"
                  >
                    <span class="flex-1">{{ lang.name }}</span>
                    <Icon v-if="locale === lang.code" name="heroicons:check-20-solid" class="h-4 w-4 text-teal-500" />
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Divider -->
            <div class="border-t border-slate-100 dark:border-slate-700"></div>

            <!-- Logout -->
            <button
              @click="handleLogout"
              class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors w-full cursor-pointer"
            >
              <Icon name="heroicons:arrow-right-on-rectangle-20-solid" class="h-5 w-5" />
              {{ t?.nav?.logout || 'Logout' }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Collapse Toggle — subtle chevron -->
      <button
        @click="toggle"
        class="flex items-center justify-center w-full py-2 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors cursor-pointer border-t border-slate-100 dark:border-slate-700"
        :title="collapsed ? (t?.nav?.expand || 'Expand') : (t?.nav?.collapse || 'Collapse')"
      >
        <Icon
          :name="collapsed ? 'heroicons:chevron-double-right-20-solid' : 'heroicons:chevron-double-left-20-solid'"
          class="h-4 w-4"
        />
      </button>
    </div>
  </aside>

  <!-- Mobile Header Bar -->
  <div class="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/80 dark:border-slate-700/80">
    <button @click="openMobile" class="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
      <Icon name="heroicons:bars-3-20-solid" class="h-5 w-5 text-slate-700 dark:text-slate-300" />
    </button>
    <NuxtLink to="/dashboard" class="flex items-center gap-2">
      <img src="~/assets/images/logo.png" alt="TripWiser" class="h-7 w-7 rounded-lg object-cover" />
      <span class="text-base font-semibold text-slate-900 dark:text-slate-100">TripWiser</span>
    </NuxtLink>
    <!-- New Trip shortcut on mobile header -->
    <NuxtLink
      to="/plan"
      class="p-2 -mr-2 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
    >
      <Icon name="heroicons:plus-20-solid" class="h-5 w-5" />
    </NuxtLink>
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
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeMobile"></div>

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
          <aside v-if="mobileOpen" class="relative w-72 h-full bg-white dark:bg-slate-900 flex flex-col shadow-2xl">
            <!-- Header -->
            <div class="flex items-center justify-between h-14 px-4 border-b border-slate-100 dark:border-slate-700">
              <NuxtLink to="/dashboard" class="flex items-center gap-2" @click="closeMobile">
                <img src="~/assets/images/logo.png" alt="TripWiser" class="h-7 w-7 rounded-lg object-cover" />
                <span class="text-base font-semibold text-slate-900 dark:text-slate-100">TripWiser</span>
              </NuxtLink>
              <button @click="closeMobile" class="p-2 -mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Icon name="heroicons:x-mark-20-solid" class="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <!-- New Trip CTA -->
            <div class="px-4 pt-4 pb-2">
              <NuxtLink
                to="/plan"
                @click="closeMobile"
                class="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 transition-all"
              >
                <Icon name="heroicons:plus-20-solid" class="h-5 w-5" />
                {{ t?.nav?.newTrip || 'New Trip' }}
              </NuxtLink>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 px-3 py-2 space-y-0.5">
              <NuxtLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                :class="isActive(item.to) ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'"
                @click="closeMobile"
              >
                <Icon :name="item.icon" class="h-5 w-5 flex-shrink-0" />
                <span>{{ item.label }}</span>
              </NuxtLink>
            </nav>

            <!-- Footer -->
            <div class="border-t border-slate-100 dark:border-slate-700 px-3 py-3 space-y-0.5">
              <!-- User Info / Profile link -->
              <NuxtLink
                to="/profile"
                @click="closeMobile"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div class="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    v-if="userProfile?.avatar_url"
                    :src="userProfile.avatar_url"
                    :alt="userProfile.full_name || ''"
                    class="h-full w-full object-cover"
                  />
                  <Icon v-else name="heroicons:user-20-solid" class="h-4 w-4 text-teal-600" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate leading-tight">{{ displayName }}</p>
                  <p class="text-[11px] text-slate-400 dark:text-slate-500 truncate leading-tight">{{ t?.nav?.viewProfile || 'View profile' }}</p>
                </div>
                <Icon name="heroicons:chevron-right-20-solid" class="h-4 w-4 text-slate-300 dark:text-slate-600" />
              </NuxtLink>

              <!-- Compact row: Theme + Language + Logout -->
              <div class="flex items-center gap-1 px-1 pt-1">
                <!-- Theme Toggle -->
                <button
                  @click="toggleTheme"
                  class="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer text-xs font-medium"
                >
                  <Icon :name="isDark ? 'heroicons:moon-20-solid' : 'heroicons:sun-20-solid'" class="h-4 w-4" />
                  <span>{{ isDark ? (t?.nav?.light || 'Light') : (t?.nav?.dark || 'Dark') }}</span>
                </button>

                <!-- Divider -->
                <div class="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>

                <!-- Language Toggle -->
                <button
                  @click="toggleLanguage"
                  class="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer text-xs font-medium"
                >
                  <Icon name="heroicons:globe-alt-20-solid" class="h-4 w-4" />
                  <span>{{ locale === 'fr' ? 'EN' : 'FR' }}</span>
                </button>

                <!-- Divider -->
                <div class="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>

                <!-- Logout -->
                <button
                  @click="handleLogout"
                  class="flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer text-xs font-medium"
                >
                  <Icon name="heroicons:arrow-right-on-rectangle-20-solid" class="h-4 w-4" />
                  <span>{{ t?.nav?.logout || 'Logout' }}</span>
                </button>
              </div>
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
const { isDark, toggleTheme } = useTheme()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()

const userProfile = ref<UserProfile | null>(null)

// User menu popover state
const userMenuOpen = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)
const langSubmenuOpen = ref(false)
const langSubmenuRef = ref<HTMLElement | null>(null)

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
]

const currentLanguage = computed(() => {
  return languages.find(l => l.code === locale.value) || languages[0]
})

function selectLanguage(code: string) {
  setLocale(code as 'en' | 'fr')
  langSubmenuOpen.value = false
  userMenuOpen.value = false
}

function toggleLanguage() {
  setLocale(locale.value === 'fr' ? 'en' : 'fr')
}

// Close user menu on click outside
function handleClickOutside(event: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    userMenuOpen.value = false
    langSubmenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const displayName = computed(() => {
  return userProfile.value?.full_name || user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'Traveler'
})

const navItems = computed(() => [
  { to: '/dashboard', icon: 'heroicons:squares-2x2-20-solid', label: t.value?.nav?.dashboard || 'Dashboard' },
])

function isActive(path: string) {
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path.startsWith('/trip/')
  }
  return route.path === path
}

async function handleLogout() {
  userMenuOpen.value = false
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

// Close user menu when collapsing sidebar
watch(collapsed, () => {
  userMenuOpen.value = false
  langSubmenuOpen.value = false
})
</script>
