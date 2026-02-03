<script setup lang="ts">
import { ref } from 'vue'
import PricingCard from '~/components/PricingCard.vue'

const { t } = useTranslations()

const billingPeriod = ref<'monthly' | 'yearly'>('monthly')

const getPricing = (monthlyPrice: number) => {
  if (billingPeriod.value === 'yearly') {
    const yearlyPrice = monthlyPrice * 10 // 2 months free
    return { price: yearlyPrice, period: t.value.common.year }
  }
  return { price: monthlyPrice, period: t.value.common.month }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="section bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 text-center">
      <div class="mx-auto max-w-4xl animate-fade-in">
        <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          {{ t.pricing.hero.title }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">{{ t.pricing.hero.titleGradient }}</span>
        </h1>
        <p class="mt-6 text-xl leading-8 text-gray-600">
          {{ t.pricing.hero.subtitle }}
        </p>

        <!-- Billing Toggle -->
        <div class="mt-10 inline-flex rounded-lg bg-white p-2 shadow-md">
          <button
            @click="billingPeriod = 'monthly'"
            class="rounded-md px-6 py-2 text-sm font-semibold transition-all duration-300"
            :class="billingPeriod === 'monthly' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' : 'text-gray-600 hover:text-gray-900'"
          >
            {{ t.pricing.hero.monthly }}
          </button>
          <button
            @click="billingPeriod = 'yearly'"
            class="rounded-md px-6 py-2 text-sm font-semibold transition-all duration-300"
            :class="billingPeriod === 'yearly' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' : 'text-gray-600 hover:text-gray-900'"
          >
            {{ t.pricing.hero.yearly }}
            <span class="ml-2 rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-700">{{ t.pricing.hero.save }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="section -mt-16">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-8 md:grid-cols-3">
          <!-- Free Plan -->
          <div class="animate-slide-up">
            <PricingCard
              :tier="t.pricing.plans.free.name"
              :price="0"
              :period="getPricing(0).period"
              :description="t.pricing.plans.free.description"
              :features="t.pricing.plans.free.features"
              :cta-text="t.pricing.plans.free.button"
            />
          </div>

          <!-- Pro Plan (Highlighted) -->
          <div class="animate-slide-up delay-100">
            <PricingCard
              :tier="t.pricing.plans.pro.name"
              :price="getPricing(12).price"
              :period="getPricing(12).period"
              :description="t.pricing.plans.pro.description"
              :features="t.pricing.plans.pro.features"
              :highlighted="true"
              :cta-text="t.pricing.plans.pro.button"
            />
          </div>

          <!-- Enterprise Plan -->
          <div class="animate-slide-up delay-200">
            <PricingCard
              :tier="t.pricing.plans.team.name"
              :price="t.pricing.plans.team.price"
              :period="getPricing(0).period"
              :description="t.pricing.plans.team.description"
              :features="t.pricing.plans.team.features"
              :cta-text="t.pricing.plans.team.button"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">{{ t.pricing.faq.title }}</h2>
        <div class="space-y-4">
          <div class="glass rounded-xl p-6 text-left">
            <h3 class="font-semibold text-gray-900">{{ t.pricing.faq.q1 }}</h3>
            <p class="mt-2 text-gray-600">{{ t.pricing.faq.a1 }}</p>
          </div>
          <div class="glass rounded-xl p-6 text-left">
            <h3 class="font-semibold text-gray-900">{{ t.pricing.faq.q2 }}</h3>
            <p class="mt-2 text-gray-600">{{ t.pricing.faq.a2 }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>