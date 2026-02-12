<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'
import FeatureCard from '~/components/FeatureCard.vue'

const { t } = useTranslations()

const { elementRef: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.1 })
const { elementRef: detailRef, isVisible: detailVisible } = useScrollReveal({ threshold: 0.1 })

const features = computed(() => [
  { icon: 'heroicons:cpu-chip-20-solid', title: t.value.features.list.ai.title, description: t.value.features.list.ai.description, color: 'teal' as const },
  { icon: 'heroicons:map-20-solid', title: t.value.features.list.maps.title, description: t.value.features.list.maps.description, color: 'purple' as const },
  { icon: 'heroicons:currency-euro-20-solid', title: t.value.features.list.budget.title, description: t.value.features.list.budget.description, color: 'orange' as const },
  { icon: 'heroicons:globe-alt-20-solid', title: t.value.features.list.multi.title, description: t.value.features.list.multi.description, color: 'cyan' as const },
  { icon: 'heroicons:user-group-20-solid', title: t.value.features.list.collab.title, description: t.value.features.list.collab.description, color: 'teal' as const },
  { icon: 'heroicons:cloud-arrow-down-20-solid', title: t.value.features.list.offline.title, description: t.value.features.list.offline.description, color: 'purple' as const },
  { icon: 'heroicons:sparkles-20-solid', title: t.value.features.list.recommendations.title, description: t.value.features.list.recommendations.description, color: 'orange' as const },
  { icon: 'heroicons:document-arrow-down-20-solid', title: t.value.features.list.export.title, description: t.value.features.list.export.description, color: 'cyan' as const }
])
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <LandingPageHero
      :badge="t.features.badge"
      badge-icon="heroicons:sparkles-20-solid"
      :title="t.features.hero.title"
      :title-gradient="t.features.hero.titleGradient"
      :subtitle="t.features.hero.subtitle"
    />

    <!-- Features Grid with staggered reveal -->
    <section class="relative py-24 overflow-hidden bg-white dark:bg-slate-900">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-400/10 dark:bg-teal-500/8 rounded-full blur-[120px]"></div>

      <div ref="gridRef" class="relative max-w-7xl mx-auto px-6">
        <div :class="['transition-all duration-700', gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ t.features.gridTitle }}
            </h2>
            <p class="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {{ t.features.gridSubtitle }}
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="(feature, i) in features"
              :key="i"
              :style="{ transitionDelay: gridVisible ? `${i * 80}ms` : '0ms' }"
              :class="['transition-all duration-500', gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6']"
            >
              <FeatureCard
                :icon="feature.icon"
                :title="feature.title"
                :description="feature.description"
                :color="feature.color"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Deep Dive: AI Feature Detail -->
    <section class="relative py-24 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
      <div class="absolute top-1/2 right-0 w-[400px] h-[400px] bg-teal-400/10 dark:bg-teal-500/8 rounded-full blur-[100px]"></div>

      <div ref="detailRef" class="relative max-w-7xl mx-auto px-6">
        <div :class="['grid lg:grid-cols-2 gap-16 items-center transition-all duration-700', detailVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12']">
          <!-- Text -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-6">
              <Icon name="heroicons:cpu-chip-20-solid" class="h-4 w-4" />
              {{ t.features.detail.label }}
            </div>
            <h3 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              {{ t.features.detail.title }}
            </h3>
            <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {{ t.features.detail.description }}
            </p>
            <ul class="space-y-4">
              <li v-for="(point, i) in t.features.detail.points" :key="i" class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Icon name="heroicons:check-20-solid" class="h-3.5 w-3.5 text-white" />
                </div>
                <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">{{ point }}</span>
              </li>
            </ul>
          </div>

          <!-- Visual mockup -->
          <div class="relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/10 border border-slate-200/50 dark:border-slate-700/50">
              <div class="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 flex items-center justify-center">
                <div class="w-full max-w-sm space-y-3">
                  <div class="flex items-center gap-3 mb-6">
                    <div class="h-3 w-3 rounded-full bg-red-400"></div>
                    <div class="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div class="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div class="space-y-3">
                    <div class="h-8 bg-teal-100 dark:bg-teal-900/40 rounded-lg w-3/4 flex items-center px-3">
                      <Icon name="heroicons:sparkles-20-solid" class="h-4 w-4 text-teal-500 mr-2" />
                      <div class="h-2 bg-teal-300 dark:bg-teal-600 rounded w-2/3"></div>
                    </div>
                    <div class="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div v-for="n in 4" :key="n" class="flex items-center gap-2">
                        <div class="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" :class="['bg-teal-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-amber-500'][n-1]">{{ n }}</div>
                        <div class="h-2 bg-slate-200 dark:bg-slate-600 rounded" :class="['flex-1', 'w-5/6', 'w-4/6', 'w-3/6'][n-1]"></div>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <div class="h-7 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex-1"></div>
                      <div class="h-7 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/3 border border-slate-200 dark:border-slate-700"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-3xl blur-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <LandingPageCTA
      :title="t.features.cta.title"
      :subtitle="t.features.cta.subtitle"
      :primary-text="t.features.cta.startPlanning"
      primary-link="/plan"
      :secondary-text="t.features.cta.viewPricing"
      secondary-link="/pricing"
    />
  </div>
</template>
