<script setup lang="ts">
import { ref } from 'vue'
import PricingCard from '~/components/PricingCard.vue'

const { t, locale } = useTranslations()

const billingPeriod = ref<'monthly' | 'yearly'>('monthly')

const getPricing = (monthlyPrice: number) => {
  if (billingPeriod.value === 'yearly') {
    const yearlyPrice = monthlyPrice * 10 // 2 months free
    return { price: yearlyPrice, period: locale.value === 'fr' ? 'an' : 'year' }
  }
  return { price: monthlyPrice, period: locale.value === 'fr' ? 'mois' : 'month' }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="section bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 text-center">
      <div class="mx-auto max-w-4xl animate-fade-in">
        <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          {{ t.pricing.hero.title }}
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
            {{ locale === 'fr' ? 'Mensuel' : 'Monthly' }}
          </button>
          <button
            @click="billingPeriod = 'yearly'"
            class="rounded-md px-6 py-2 text-sm font-semibold transition-all duration-300"
            :class="billingPeriod === 'yearly' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' : 'text-gray-600 hover:text-gray-900'"
          >
            {{ locale === 'fr' ? 'Annuel' : 'Yearly' }}
            <span class="ml-2 rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-700">{{ locale === 'fr' ? '-17%' : 'Save 17%' }}</span>
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
              :description="locale === 'fr' ? 'Parfait pour essayer TripWiser et planifier des voyages simples.' : 'Perfect for trying out TripWiser and planning simple trips.'"
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
              :description="locale === 'fr' ? 'Pour les voyageurs fréquents qui veulent une planification sans limites.' : 'For frequent travelers who want unlimited planning power.'"
              :features="t.pricing.plans.pro.features"
              :highlighted="true"
              :cta-text="t.pricing.plans.pro.button"
            />
          </div>

          <!-- Enterprise Plan -->
          <div class="animate-slide-up delay-200">
            <PricingCard
              :tier="t.pricing.plans.team.name"
              :price="locale === 'fr' ? 'Sur mesure' : 'Custom'"
              :period="getPricing(0).period"
              :description="locale === 'fr' ? 'Pour les agences de voyage et les entreprises aux besoins personnalisés.' : 'For travel agencies and businesses with custom needs.'"
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
        <h2 class="text-3xl font-bold text-gray-900 mb-8">{{ locale === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions' }}</h2>
        <div class="space-y-4">
          <div class="glass rounded-xl p-6 text-left">
            <h3 class="font-semibold text-gray-900">{{ locale === 'fr' ? 'Puis-je annuler à tout moment ?' : 'Can I cancel anytime?' }}</h3>
            <p class="mt-2 text-gray-600">{{ locale === 'fr' ? 'Oui ! Vous pouvez annuler votre abonnement à tout moment sans frais.' : 'Yes! You can cancel your subscription at any time with no fees.' }}</p>
          </div>
          <div class="glass rounded-xl p-6 text-left">
            <h3 class="font-semibold text-gray-900">{{ locale === 'fr' ? 'L\'essai gratuit est-il vraiment gratuit ?' : 'Is the free trial really free?' }}</h3>
            <p class="mt-2 text-gray-600">{{ locale === 'fr' ? 'Absolument ! 14 jours complets pour essayer toutes les fonctionnalités Pro.' : 'Absolutely! Full 14 days to try all Pro features.' }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>