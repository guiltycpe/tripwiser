<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LocationInput from '~/components/LocationInput.vue'

const departureCity = ref('')
const router = useRouter()
const { t } = useTranslations()

function startPlanning() {
  const cityToSend = departureCity.value || 'Paris';
  router.push({ path: '/plan', query: { departure: cityToSend } })
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section with Gradient Background -->
    <section class="relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 px-6 py-24 md:py-32">
      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-teal-200 to-cyan-200 opacity-20 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 opacity-20 blur-3xl"></div>
      
      <div class="relative mx-auto max-w-4xl text-center">
        <h1 class="animate-fade-in text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
          {{ t.home.hero.title }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">{{ t.home.hero.titleGradient }}</span>
        </h1>

        <p class="animate-slide-up mt-6 text-xl leading-8 text-gray-600 md:text-2xl">
          {{ t.home.hero.subtitle }}
        </p>

        <form @submit.prevent="startPlanning" class="animate-slide-up delay-200 mx-auto mt-12 max-w-2xl">
          <div class="glass rounded-2xl p-8 shadow-xl">
            <p class="text-left text-lg font-semibold text-gray-900">{{ t.plan.form.departurePlaceholder }}</p>
            <div class="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div class="relative flex-1">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Icon name="heroicons:map-pin-20-solid" class="h-6 w-6 text-teal-500" />
                </div>
                <LocationInput
                  v-model="departureCity"
                  :placeholder="t.home.hero.searchPlaceholder"
                  inputClass="w-full rounded-xl border-2 border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <button 
                type="submit" 
                class="btn-primary flex-shrink-0 px-8 py-4 text-base hover-glow"
              >
                <Icon name="heroicons:arrow-right-20-solid" class="inline-block h-5 w-5 mr-2" />
                {{ t.home.hero.startButton }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section">
      <div class="mx-auto max-w-7xl">
        <div class="text-center">
          <h2 class="text-4xl font-bold text-gray-900">{{ t.home.features.title }}</h2>
        </div>

        <div class="mt-16 grid gap-12 md:grid-cols-3">
          <!-- Feature 1 -->
          <div class="card-hover text-center animate-slide-up">
            <div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500">
              <Icon name="heroicons:cpu-chip-20-solid" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900">{{ t.home.features.ai.title }}</h3>
            <p class="mt-3 text-gray-600">
              {{ t.home.features.ai.description }}
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card-hover text-center animate-slide-up delay-100">
            <div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <Icon name="heroicons:currency-euro-20-solid" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900">{{ t.home.features.save.title }}</h3>
            <p class="mt-3 text-gray-600">
              {{ t.home.features.save.description }}
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card-hover text-center animate-slide-up delay-200">
            <div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-pink-500">
              <Icon name="heroicons:user-group-20-solid" class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900">{{ t.home.features.share.title }}</h3>
            <p class="mt-3 text-gray-600">
              {{ t.home.features.share.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section section-alt text-center">
      <div class="mx-auto max-w-3xl">
        <h2 class="text-4xl font-bold text-gray-900">{{ t.home.cta.title }}</h2>
        <p class="mt-4 text-lg text-gray-600">
          {{ t.home.cta.subtitle }}
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <button @click="startPlanning" class="btn-primary px-8 py-4 text-lg">
            {{ t.home.cta.button }}
          </button>
          <NuxtLink to="/pricing" class="btn-secondary px-8 py-4 text-lg">
            {{ t.nav.pricing }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
