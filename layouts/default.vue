<template>
  <div class="flex min-h-screen flex-col bg-white">
    <navBar />

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-slate-200 bg-slate-50">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Brand -->
          <div class="sm:col-span-2 lg:col-span-1">
            <NuxtLink to="/" class="text-lg font-semibold text-slate-900">
              TripWiser
            </NuxtLink>
            <p class="mt-2 text-sm text-slate-500 max-w-xs">{{ t.footer.tagline }}</p>
          </div>

          <!-- Product Links -->
          <div>
            <h4 class="text-sm font-semibold text-slate-900 mb-3">{{ t.footer.product }}</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/features" class="text-sm text-slate-500 hover:text-teal-600 transition-colors">{{ t.nav.features }}</NuxtLink></li>
              <li><NuxtLink to="/pricing" class="text-sm text-slate-500 hover:text-teal-600 transition-colors">{{ t.nav.pricing }}</NuxtLink></li>
              <li><NuxtLink to="/about" class="text-sm text-slate-500 hover:text-teal-600 transition-colors">{{ t.nav.about }}</NuxtLink></li>
            </ul>
          </div>

          <!-- Account Links -->
          <div>
            <h4 class="text-sm font-semibold text-slate-900 mb-3">{{ t.footer.account }}</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/dashboard" class="text-sm text-slate-500 hover:text-teal-600 transition-colors">{{ t.nav.dashboard }}</NuxtLink></li>
              <li><NuxtLink to="/profile" class="text-sm text-slate-500 hover:text-teal-600 transition-colors">{{ t.nav.profile }}</NuxtLink></li>
              <li><NuxtLink to="/plan" class="text-sm text-slate-500 hover:text-teal-600 transition-colors">{{ t.footer.planTrip }}</NuxtLink></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="text-sm font-semibold text-slate-900 mb-3">{{ t.footer.legal }}</h4>
            <ul class="space-y-2">
              <li><span class="text-sm text-slate-500">{{ t.footer.privacy }}</span></li>
              <li><span class="text-sm text-slate-500">{{ t.footer.terms }}</span></li>
            </ul>
          </div>
        </div>

        <div class="mt-8 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-sm text-slate-400">&copy; {{ year }} TripWiser. {{ t.footer.rights }}</p>
          <p class="text-xs text-slate-400">{{ t.footer.madeWith }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { t } = useTranslations()
const year = new Date().getFullYear()
</script>