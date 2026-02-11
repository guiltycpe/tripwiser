<script setup lang="ts">
import FeatureCard from '~/components/FeatureCard.vue'

const { t } = useTranslations()
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero -->
    <section class="section bg-slate-50 text-center">
      <div class="mx-auto max-w-4xl animate-fade-in">
        <h1 class="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          {{ t.features.hero.title }} <span class="text-teal-600">{{ t.features.hero.titleGradient }}</span>
        </h1>
        <p class="mt-6 text-lg leading-8 text-slate-600">
          {{ t.features.hero.subtitle }}
        </p>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="section">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon="heroicons:cpu-chip-20-solid" :title="t.features.list.ai.title" :description="t.features.list.ai.description" color="teal" />
          <FeatureCard icon="heroicons:map-20-solid" :title="t.features.list.maps.title" :description="t.features.list.maps.description" color="purple" />
          <FeatureCard icon="heroicons:currency-euro-20-solid" :title="t.features.list.budget.title" :description="t.features.list.budget.description" color="orange" />
          <FeatureCard icon="heroicons:user-group-20-solid" :title="t.features.list.collab.title" :description="t.features.list.collab.description" color="cyan" />
          <FeatureCard icon="heroicons:cloud-arrow-down-20-solid" :title="t.features.list.offline.title" :description="t.features.list.offline.description" color="teal" />
          <FeatureCard icon="heroicons:sparkles-20-solid" :title="t.features.list.recommendations.title" :description="t.features.list.recommendations.description" color="purple" />
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section section-alt text-center">
      <div class="mx-auto max-w-3xl">
        <h2 class="text-3xl font-semibold text-slate-900">{{ t.features.cta.title }}</h2>
        <div class="mt-8 flex flex-wrap justify-center gap-4">
          <NuxtLink to="/plan" class="btn-primary px-6 py-3 text-sm">{{ t.features.cta.startPlanning }}</NuxtLink>
          <NuxtLink to="/pricing" class="btn-secondary px-6 py-3 text-sm">{{ t.features.cta.viewPricing }}</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
