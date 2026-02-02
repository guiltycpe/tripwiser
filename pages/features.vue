<script setup lang="ts">
import FeatureCard from '~/components/FeatureCard.vue'

const { t } = useTranslations()
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="section bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 text-center">
      <div class="mx-auto max-w-4xl animate-fade-in">
        <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          {{ t.features.hero.title }}
        </h1>
        <p class="mt-6 text-xl leading-8 text-gray-600">
          {{ t.features.hero.subtitle }}
        </p>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="section">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div class="animate-slide-up">
            <FeatureCard
              icon="heroicons:cpu-chip-20-solid"
              :title="t.features.list.ai.title"
              :description="t.features.list.ai.description"
              color="teal"
            />
          </div>

          <!-- Feature 2 -->
          <div class="animate-slide-up delay-100">
            <FeatureCard
              icon="heroicons:map-20-solid"
              :title="t.features.list.maps.title"
              :description="t.features.list.maps.description"
              color="purple"
            />
          </div>

          <!-- Feature 3 -->
          <div class="animate-slide-up delay-200">
            <FeatureCard
              icon="heroicons:currency-euro-20-solid"
              :title="t.features.list.budget.title"
              :description="t.features.list.budget.description"
              color="orange"
            />
          </div>

          <!-- Feature 4 -->
          <div class="animate-slide-up delay-300">
            <FeatureCard
              icon="heroicons:user-group-20-solid"
              :title="t.features.list.collab.title"
              :description="t.features.list.collab.description"
              color="cyan"
            />
          </div>

          <!-- Feature 5 -->
          <div class="animate-slide-up delay-400">
            <FeatureCard
              icon="heroicons:cloud-arrow-down-20-solid"
              :title="t.features.list.offline.title"
              :description="t.features.list.offline.description"
              color="teal"
            />
          </div>

          <!-- Feature 6 -->
          <div class="animate-slide-up delay-500">
            <FeatureCard
              icon="heroicons:sparkles-20-solid"
              :title="t.features.list.recommendations.title"
              :description="t.features.list.recommendations.description"
              color="purple"
            />
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
          <NuxtLink to="/plan" class="btn-primary px-8 py-4 text-lg">
            {{ t.home.cta.button }}
          </NuxtLink>
          <NuxtLink to="/pricing" class="btn-secondary px-8 py-4 text-lg">
            {{ t.nav.pricing }}
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>