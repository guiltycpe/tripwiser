<template>
  <section class="relative py-32 overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-100 via-teal-50 to-slate-100 dark:from-slate-900 dark:via-teal-950 dark:to-slate-900"></div>
    
    <!-- Animated orbs -->
    <div class="absolute top-1/4 left-0 w-[500px] h-[500px] bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
    <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow" style="animation-delay: 1.5s;"></div>

    <!-- Grid pattern -->
    <div class="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style="background-image: linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px); background-size: 50px 50px;"></div>

    <div ref="sectionRef" class="relative max-w-4xl mx-auto px-6 text-center">
      <div :class="['transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <!-- Emoji sparkle -->
        <div class="text-5xl mb-6">✈️</div>

        <h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {{ t.home.finalCta.title }}
          <span class="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {{ t.home.finalCta.titleHighlight }}
          </span>
        </h2>

        <p class="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {{ t.home.finalCta.subtitle }}
        </p>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            @click="$emit('start-planning')"
            class="group px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-base hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 active:scale-[0.98] cursor-pointer"
          >
            <span class="flex items-center gap-2">
              {{ t.home.finalCta.button }}
              <Icon name="heroicons:arrow-right-20-solid" class="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          <NuxtLink
            to="/pricing"
            class="px-8 py-4 rounded-xl text-slate-600 dark:text-slate-300 font-semibold text-base hover:text-slate-900 dark:hover:text-white transition-all duration-300 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"
          >
            {{ t.home.finalCta.secondary }}
          </NuxtLink>
        </div>

        <!-- Trust badges -->
        <div class="mt-12 flex items-center justify-center gap-6 text-slate-500 dark:text-slate-500 text-xs font-medium">
          <span class="flex items-center gap-1.5">
            <Icon name="heroicons:shield-check-20-solid" class="h-4 w-4 text-teal-500" />
            {{ t.home.finalCta.trust1 }}
          </span>
          <span class="flex items-center gap-1.5">
            <Icon name="heroicons:bolt-20-solid" class="h-4 w-4 text-teal-500" />
            {{ t.home.finalCta.trust2 }}
          </span>
          <span class="flex items-center gap-1.5">
            <Icon name="heroicons:heart-20-solid" class="h-4 w-4 text-teal-500" />
            {{ t.home.finalCta.trust3 }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

defineEmits<{
  'start-planning': []
}>()

const { t } = useTranslations()
const { elementRef: sectionRef, isVisible } = useScrollReveal()
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulseSlow 6s ease-in-out infinite;
}

@keyframes pulseSlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>
