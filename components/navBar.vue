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
              <button @click="handleLogout" class="btn-primary flex items-center gap-2">
                <Icon name="heroicons:arrow-right-on-rectangle-20-solid" class="h-4 w-4" />
                {{ t.nav.logout }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

// Use global translations
const { t } = useTranslations()

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/')
}
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
