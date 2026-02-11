<script setup lang="ts">
import { ref } from 'vue'
import PricingCard from '~/components/PricingCard.vue'

const { t } = useTranslations()

const billingPeriod = ref<'monthly' | 'yearly'>('monthly')

const getPricing = (monthlyPrice: number) => {
  if (billingPeriod.value === 'yearly') {
    const yearlyPrice = monthlyPrice * 10
    return { price: yearlyPrice, period: t.value.common.year }
  }
  return { price: monthlyPrice, period: t.value.common.month }
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <!-- Hero -->
    <section class="section bg-slate-50 dark:bg-slate-800 text-center">
      <div class="mx-auto max-w-4xl animate-fade-in">
        <h1 class="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
          {{ t.pricing.hero.title }} <span class="text-teal-600">{{ t.pricing.hero.titleGradient }}</span>
        </h1>
        <p class="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
          {{ t.pricing.hero.subtitle }}
        </p>

        <!-- Billing Toggle -->
        <div class="mt-10 inline-flex rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1">
          <button
            @click="billingPeriod = 'monthly'"
            class="rounded-lg px-5 py-2 text-sm font-medium transition-all cursor-pointer"
            :class="billingPeriod === 'monthly' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'"
          >
            {{ t.pricing.hero.monthly }}
          </button>
          <button
            @click="billingPeriod = 'yearly'"
            class="rounded-lg px-5 py-2 text-sm font-medium transition-all cursor-pointer"
            :class="billingPeriod === 'yearly' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'"
          >
            {{ t.pricing.hero.yearly }}
            <span class="ml-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 text-xs text-teal-700 font-medium">{{ t.pricing.hero.save }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="section -mt-12">
      <div class="mx-auto max-w-7xl">
        <div class="grid gap-6 md:grid-cols-3">
          <PricingCard :tier="t.pricing.plans.free.name" :price="0" :period="getPricing(0).period" :description="t.pricing.plans.free.description" :features="t.pricing.plans.free.features" :cta-text="t.pricing.plans.free.button" />
          <PricingCard :tier="t.pricing.plans.pro.name" :price="getPricing(12).price" :period="getPricing(12).period" :description="t.pricing.plans.pro.description" :features="t.pricing.plans.pro.features" :highlighted="true" :cta-text="t.pricing.plans.pro.button" />
          <PricingCard :tier="t.pricing.plans.team.name" :price="t.pricing.plans.team.price" :period="getPricing(0).period" :description="t.pricing.plans.team.description" :features="t.pricing.plans.team.features" :cta-text="t.pricing.plans.team.button" />
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-8">{{ t.pricing.faq.title }}</h2>
        <div class="space-y-4">
          <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-left">
            <h3 class="font-semibold text-slate-900 dark:text-slate-100">{{ t.pricing.faq.q1 }}</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ t.pricing.faq.a1 }}</p>
          </div>
          <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-left">
            <h3 class="font-semibold text-slate-900 dark:text-slate-100">{{ t.pricing.faq.q2 }}</h3>
            <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{{ t.pricing.faq.a2 }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
