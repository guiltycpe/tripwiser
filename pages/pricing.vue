<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'
import PricingCard from '~/components/PricingCard.vue'

const { t } = useTranslations()

const billingPeriod = ref<'monthly' | 'yearly'>('monthly')

const { elementRef: cardsRef, isVisible: cardsVisible } = useScrollReveal({ threshold: 0.1 })
const { elementRef: faqRef, isVisible: faqVisible } = useScrollReveal({ threshold: 0.1 })

const getPricing = (monthlyPrice: number) => {
  if (billingPeriod.value === 'yearly') {
    const yearlyPrice = monthlyPrice * 10
    return { price: yearlyPrice, period: t.value.common.year }
  }
  return { price: monthlyPrice, period: t.value.common.month }
}

const faqItems = computed(() => [
  { q: t.value.pricing.faq.q1, a: t.value.pricing.faq.a1 },
  { q: t.value.pricing.faq.q2, a: t.value.pricing.faq.a2 },
  { q: t.value.pricing.faq.q3, a: t.value.pricing.faq.a3 },
  { q: t.value.pricing.faq.q4, a: t.value.pricing.faq.a4 }
])

const openFaq = ref<number | null>(null)
const toggleFaq = (i: number) => { openFaq.value = openFaq.value === i ? null : i }
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <LandingPageHero
      :badge="t.pricing.badge"
      badge-icon="heroicons:tag-20-solid"
      :title="t.pricing.hero.title"
      :title-gradient="t.pricing.hero.titleGradient"
      :subtitle="t.pricing.hero.subtitle"
      accent-color="indigo"
    >
      <!-- Billing Toggle -->
      <div class="inline-flex rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 p-1.5 shadow-lg shadow-black/5">
        <button
          @click="billingPeriod = 'monthly'"
          class="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer"
          :class="billingPeriod === 'monthly' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'"
        >
          {{ t.pricing.hero.monthly }}
        </button>
        <button
          @click="billingPeriod = 'yearly'"
          class="rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer"
          :class="billingPeriod === 'yearly' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'"
        >
          {{ t.pricing.hero.yearly }}
          <span class="ml-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 px-2 py-0.5 text-xs text-teal-700 dark:text-teal-300 font-bold">{{ t.pricing.hero.save }}</span>
        </button>
      </div>
    </LandingPageHero>

    <!-- Pricing Cards -->
    <section class="relative py-24 -mt-16 overflow-hidden bg-white dark:bg-slate-900">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-400/10 dark:bg-indigo-500/8 rounded-full blur-[120px]"></div>

      <div ref="cardsRef" class="relative max-w-7xl mx-auto px-6">
        <div class="grid gap-8 md:grid-cols-3 items-start">
          <div
            v-for="(plan, i) in ['free', 'pro', 'team']"
            :key="plan"
            :style="{ transitionDelay: cardsVisible ? `${i * 120}ms` : '0ms' }"
            :class="['transition-all duration-600', cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
          >
            <PricingCard
              v-if="plan === 'free'"
              :tier="t.pricing.plans.free.name"
              :price="0"
              :period="getPricing(0).period"
              :description="t.pricing.plans.free.description"
              :features="t.pricing.plans.free.features"
              :cta-text="t.pricing.plans.free.button"
            />
            <div v-else-if="plan === 'pro'" class="relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur-lg opacity-20"></div>
              <PricingCard
                :tier="t.pricing.plans.pro.name"
                :price="getPricing(12).price"
                :period="getPricing(12).period"
                :description="t.pricing.plans.pro.description"
                :features="t.pricing.plans.pro.features"
                :highlighted="true"
                :cta-text="t.pricing.plans.pro.button"
                class="relative"
              />
            </div>
            <PricingCard
              v-else
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

    <!-- FAQ -->
    <section class="relative py-24 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
      <div ref="faqRef" class="relative max-w-3xl mx-auto px-6">
        <div :class="['transition-all duration-700', faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ t.pricing.faq.title }}
            </h2>
            <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">
              {{ t.pricing.faq.subtitle }}
            </p>
          </div>

          <div class="space-y-4">
            <div
              v-for="(item, i) in faqItems"
              :key="i"
              class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300"
              :class="openFaq === i ? 'shadow-lg shadow-black/5 dark:shadow-black/20' : ''"
            >
              <button
                @click="toggleFaq(i)"
                class="w-full flex items-center justify-between p-6 text-left cursor-pointer"
              >
                <h3 class="font-semibold text-slate-900 dark:text-white pr-4">{{ item.q }}</h3>
                <Icon
                  name="heroicons:chevron-down-20-solid"
                  class="h-5 w-5 text-slate-400 transition-transform duration-300 flex-shrink-0"
                  :class="openFaq === i ? 'rotate-180' : ''"
                />
              </button>
              <div
                class="overflow-hidden transition-all duration-300"
                :class="openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'"
              >
                <p class="px-6 pb-6 text-slate-500 dark:text-slate-400 leading-relaxed">{{ item.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <LandingPageCTA
      :title="t.pricing.cta.title"
      title-highlight=""
      :subtitle="t.pricing.cta.subtitle"
      :primary-text="t.pricing.cta.button"
      primary-link="/plan"
      :secondary-text="t.pricing.cta.secondary"
      secondary-link="/features"
    />
  </div>
</template>
