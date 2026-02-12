<template>
  <section class="relative py-32 overflow-hidden bg-white dark:bg-slate-900">
    <div ref="sectionRef" class="relative max-w-5xl mx-auto px-6">
      <div :class="['transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <!-- Header -->
        <div class="text-center mb-20">
          <span class="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-100 dark:border-indigo-800">
            {{ t.home.howItWorks.badge }}
          </span>
          <h2 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ t.home.howItWorks.title }}
          </h2>
          <p class="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {{ t.home.howItWorks.subtitle }}
          </p>
        </div>

        <!-- Steps -->
        <div ref="stepsRef" class="relative">
          <!-- Connecting line -->
          <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/0 via-teal-500/30 to-teal-500/0"></div>

          <div class="space-y-16 md:space-y-24">
            <div
              v-for="(step, i) in steps"
              :key="i"
              :style="getItemStyle(i)"
              :class="['relative grid md:grid-cols-2 gap-8 md:gap-16 items-center', i % 2 === 1 ? 'md:direction-rtl' : '']"
            >
              <!-- Number dot on the line -->
              <div class="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                <div class="h-12 w-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30 flex items-center justify-center text-white font-black text-sm ring-4 ring-white dark:ring-slate-900">
                  {{ i + 1 }}
                </div>
              </div>

              <!-- Content side -->
              <div :class="['md:direction-ltr', i % 2 === 1 ? 'md:text-right md:col-start-2' : 'md:col-start-1']">
                <!-- Mobile number -->
                <div class="md:hidden inline-flex h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold text-sm items-center justify-center mb-4 shadow-lg shadow-teal-500/20">
                  {{ i + 1 }}
                </div>
                <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-3">{{ step.title }}</h3>
                <p class="text-slate-600 dark:text-slate-400 leading-relaxed">{{ step.description }}</p>
              </div>

              <!-- Icon side -->
              <div :class="['flex', i % 2 === 1 ? 'md:justify-start md:col-start-1 md:row-start-1' : 'md:justify-end md:col-start-2']">
                <div class="h-20 w-20 rounded-2xl bg-gradient-to-br shadow-xl flex items-center justify-center" :class="step.gradient">
                  <Icon :name="step.icon" class="h-9 w-9 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal, useStaggerReveal } from '~/composables/useScrollReveal'

const { t } = useTranslations()
const { elementRef: sectionRef, isVisible } = useScrollReveal()
const { elementRef: stepsRef, getItemStyle } = useStaggerReveal(3, { staggerDelay: 150, threshold: 0.1 })

const steps = computed(() => [
  {
    title: t.value.home.howItWorks.step1.title,
    description: t.value.home.howItWorks.step1.description,
    icon: 'heroicons:map-pin-20-solid',
    gradient: 'from-teal-500 to-cyan-500 shadow-teal-500/30',
  },
  {
    title: t.value.home.howItWorks.step2.title,
    description: t.value.home.howItWorks.step2.description,
    icon: 'heroicons:sparkles-20-solid',
    gradient: 'from-indigo-500 to-purple-500 shadow-indigo-500/30',
  },
  {
    title: t.value.home.howItWorks.step3.title,
    description: t.value.home.howItWorks.step3.description,
    icon: 'heroicons:rocket-launch-20-solid',
    gradient: 'from-amber-500 to-orange-500 shadow-amber-500/30',
  },
])
</script>

<style scoped>
.md\:direction-rtl {
  direction: rtl;
}
.md\:direction-ltr {
  direction: ltr;
}
</style>
