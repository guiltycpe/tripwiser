<template>
  <section class="relative py-24 overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
    <div class="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style="background-image: linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px); background-size: 40px 40px;"></div>
    
    <!-- Glow accents -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-[100px]"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[100px]"></div>

    <div ref="sectionRef" class="relative max-w-7xl mx-auto px-6">
      <div :class="['transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <!-- Headline -->
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ t.home.stats.title }}
          </h2>
          <p class="mt-4 text-slate-600 dark:text-slate-400 text-lg">{{ t.home.stats.subtitle }}</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div v-for="(stat, i) in stats" :key="i" class="text-center group">
            <div class="relative inline-flex items-center justify-center mb-4">
              <!-- Animated ring -->
              <div class="absolute inset-0 rounded-full border-2 border-teal-500/20 dark:border-teal-500/20 group-hover:border-teal-500/40 dark:group-hover:border-teal-500/40 transition-colors duration-500"></div>
              <div class="h-16 w-16 rounded-full bg-gradient-to-br from-teal-500/10 to-cyan-500/10 flex items-center justify-center">
                <Icon :name="stat.icon" class="h-7 w-7 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <div class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tabular-nums">
              <span>{{ formatNumber(stat.current) }}</span><span class="text-teal-600 dark:text-teal-400">{{ stat.suffix }}</span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 font-medium">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'

const { t } = useTranslations()
const { elementRef: sectionRef, isVisible } = useScrollReveal({ threshold: 0.2 })

// Animated count values
const usersCount = ref(0)
const tripsCount = ref(0)
const countriesCount = ref(0)
const ratingCount = ref(0)

let frames: number[] = []

function animateValue(target: number, duration: number, setter: (v: number) => void) {
  const startTime = performance.now()
  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    setter(Math.round(eased * target))
    if (progress < 1) {
      frames.push(requestAnimationFrame(step))
    }
  }
  frames.push(requestAnimationFrame(step))
}

watch(isVisible, (visible) => {
  if (visible) {
    animateValue(10000, 2000, v => usersCount.value = v)
    animateValue(50000, 2500, v => tripsCount.value = v)
    animateValue(150, 1500, v => countriesCount.value = v)
    animateValue(49, 1800, v => ratingCount.value = v)
  }
})

onUnmounted(() => {
  frames.forEach(f => cancelAnimationFrame(f))
})

const stats = computed(() => [
  {
    icon: 'heroicons:users-20-solid',
    current: usersCount.value,
    suffix: '+',
    label: t.value.home.stats.users
  },
  {
    icon: 'heroicons:map-20-solid',
    current: tripsCount.value,
    suffix: '+',
    label: t.value.home.stats.trips
  },
  {
    icon: 'heroicons:globe-alt-20-solid',
    current: countriesCount.value,
    suffix: '+',
    label: t.value.home.stats.countries
  },
  {
    icon: 'heroicons:star-20-solid',
    current: ratingCount.value,
    suffix: '/5',
    label: t.value.home.stats.rating
  }
])

function formatNumber(n: number): string {
  if (n >= 1000) {
    return new Intl.NumberFormat().format(n)
  }
  // For rating, add decimal: 49 → 4.9
  if (n <= 50 && n > 0) {
    return (n / 10).toFixed(1)
  }
  return String(n)
}
</script>
