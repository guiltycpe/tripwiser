<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LocationInput from '~/components/LocationInput.vue'

const departureCity = ref('')
const router = useRouter()
const { t } = useTranslations()
const user = useSupabaseUser()

// Redirect authenticated users to dashboard
watch(user, (newUser) => {
  if (newUser) {
    router.replace('/dashboard')
  }
}, { immediate: true })

function startPlanning() {
  const cityToSend = departureCity.value || 'Paris';
  router.push({ path: '/plan', query: { departure: cityToSend } })
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-slate-50 px-6 py-24 md:py-32">
      <div class="relative mx-auto max-w-4xl text-center">
        <h1 class="animate-fade-in text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
          {{ t.home.hero.title }} <span class="text-teal-600">{{ t.home.hero.titleGradient }}</span>
        </h1>

        <p class="animate-fade-in mt-6 text-lg leading-8 text-slate-600 md:text-xl">
          {{ t.home.hero.subtitle }}
        </p>

        <form @submit.prevent="startPlanning" class="animate-fade-in mx-auto mt-12 max-w-2xl">
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p class="text-left text-sm font-semibold text-slate-900 mb-3">{{ t.plan.form.departurePlaceholder }}</p>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div class="relative flex-1">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Icon name="heroicons:map-pin-20-solid" class="h-5 w-5 text-teal-500" />
                </div>
                <LocationInput
                  v-model="departureCity"
                  :placeholder="t.home.hero.searchPlaceholder"
                  inputClass="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-slate-900 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 hover:border-slate-300"
                />
              </div>
              <button
                type="submit"
                class="flex-shrink-0 px-6 py-3 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition-colors shadow-sm cursor-pointer"
              >
                <Icon name="heroicons:arrow-right-20-solid" class="inline-block h-4 w-4 mr-1.5" />
                {{ t.home.hero.startButton }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section">
      <div class="mx-auto max-w-7xl">
        <div class="text-center">
          <h2 class="text-3xl font-semibold text-slate-900">{{ t.home.features.title }}</h2>
        </div>

        <div class="mt-16 grid gap-8 md:grid-cols-3">
          <div class="text-center p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
            <div class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
              <Icon name="heroicons:cpu-chip-20-solid" class="h-6 w-6 text-teal-600" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900">{{ t.home.features.ai.title }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ t.home.features.ai.description }}</p>
          </div>

          <div class="text-center p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
            <div class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <Icon name="heroicons:currency-euro-20-solid" class="h-6 w-6 text-indigo-600" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900">{{ t.home.features.save.title }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ t.home.features.save.description }}</p>
          </div>

          <div class="text-center p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
            <div class="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
              <Icon name="heroicons:user-group-20-solid" class="h-6 w-6 text-amber-600" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900">{{ t.home.features.share.title }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ t.home.features.share.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section section-alt text-center">
      <div class="mx-auto max-w-3xl">
        <h2 class="text-3xl font-semibold text-slate-900">{{ t.home.cta.title }}</h2>
        <p class="mt-4 text-slate-600">{{ t.home.cta.subtitle }}</p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <button @click="startPlanning" class="btn-primary px-6 py-3 text-sm cursor-pointer">
            {{ t.home.cta.button }}
          </button>
          <NuxtLink to="/pricing" class="btn-secondary px-6 py-3 text-sm">
            {{ t.nav.pricing }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
