<template>
  <section class="relative py-32 overflow-hidden bg-white dark:bg-slate-900">
    <!-- Section header -->
    <div ref="headerRef" class="max-w-7xl mx-auto px-6 mb-24 text-center">
      <div :class="['transition-all duration-700', headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <span class="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-widest mb-6 border border-teal-100 dark:border-teal-800">
          {{ t.home.features.badge }}
        </span>
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ t.home.features.title }}
        </h2>
        <p class="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {{ t.home.features.subtitle }}
        </p>
      </div>
    </div>

    <!-- Feature blocks — alternating left/right -->
    <div class="space-y-32 lg:space-y-48">

      <!-- Feature 1: AI Planning -->
      <div ref="feature1Ref" class="max-w-7xl mx-auto px-6">
        <div :class="['grid lg:grid-cols-2 gap-16 items-center transition-all duration-700', feature1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12']">
          <!-- Text -->
          <div class="lg:pr-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-6">
              <Icon name="heroicons:cpu-chip-20-solid" class="h-4 w-4" />
              {{ t.home.features.ai.label }}
            </div>
            <h3 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              {{ t.home.features.ai.title }}
            </h3>
            <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {{ t.home.features.ai.description }}
            </p>
            <ul class="space-y-4">
              <li v-for="(point, i) in t.home.features.ai.points" :key="i" class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Icon name="heroicons:check-20-solid" class="h-3.5 w-3.5 text-white" />
                </div>
                <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">{{ point }}</span>
              </li>
            </ul>
          </div>
          <!-- Visual -->
          <div class="relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/10 border border-slate-200/50 dark:border-slate-700/50">
              <div class="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 flex items-center justify-center">
                <!-- Mockup of AI generating an itinerary -->
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
                      <div class="flex items-center gap-2">
                        <div class="h-5 w-5 rounded-full bg-teal-500 flex items-center justify-center text-[10px] font-bold text-white">1</div>
                        <div class="h-2 bg-slate-200 dark:bg-slate-600 rounded flex-1"></div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="h-5 w-5 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">2</div>
                        <div class="h-2 bg-slate-200 dark:bg-slate-600 rounded w-5/6"></div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">3</div>
                        <div class="h-2 bg-slate-200 dark:bg-slate-600 rounded w-4/6"></div>
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
            <!-- Glow -->
            <div class="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-3xl blur-2xl -z-10"></div>
          </div>
        </div>
      </div>

      <!-- Feature 2: Interactive Map — reversed layout -->
      <div ref="feature2Ref" class="max-w-7xl mx-auto px-6">
        <div :class="['grid lg:grid-cols-2 gap-16 items-center transition-all duration-700', feature2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12']">
          <!-- Visual (left on desktop) -->
          <div class="relative order-2 lg:order-1">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-slate-200/50 dark:border-slate-700/50">
              <div class="aspect-[4/3] bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-slate-800 dark:to-indigo-950/30 p-6 flex items-center justify-center">
                <!-- Map mockup -->
                <div class="w-full h-full relative rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <div class="absolute inset-0 opacity-40" style="background-image: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=450&fit=crop'); background-size: cover; background-position: center;"></div>
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <!-- Map pins -->
                  <div class="absolute top-[25%] left-[30%] animate-bounce-subtle" style="animation-delay: 0s;">
                    <div class="h-6 w-6 rounded-full bg-teal-500 border-2 border-white shadow-lg flex items-center justify-center">
                      <div class="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div class="absolute top-[40%] left-[55%] animate-bounce-subtle" style="animation-delay: 0.5s;">
                    <div class="h-6 w-6 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center">
                      <div class="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div class="absolute top-[60%] left-[70%] animate-bounce-subtle" style="animation-delay: 1s;">
                    <div class="h-6 w-6 rounded-full bg-indigo-500 border-2 border-white shadow-lg flex items-center justify-center">
                      <div class="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <!-- Route line -->
                  <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 120 80 Q 200 120 220 160 Q 240 200 280 240" stroke="url(#routeGrad)" stroke-width="2" fill="none" stroke-dasharray="6 4" opacity="0.6" />
                    <defs>
                      <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#14b8a6" />
                        <stop offset="100%" stop-color="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
            <div class="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl -z-10"></div>
          </div>
          <!-- Text (right on desktop) -->
          <div class="lg:pl-8 order-1 lg:order-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6">
              <Icon name="heroicons:map-20-solid" class="h-4 w-4" />
              {{ t.home.features.maps.label }}
            </div>
            <h3 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              {{ t.home.features.maps.title }}
            </h3>
            <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {{ t.home.features.maps.description }}
            </p>
            <ul class="space-y-4">
              <li v-for="(point, i) in t.home.features.maps.points" :key="i" class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Icon name="heroicons:check-20-solid" class="h-3.5 w-3.5 text-white" />
                </div>
                <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">{{ point }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Feature 3: Budget Tracking -->
      <div ref="feature3Ref" class="max-w-7xl mx-auto px-6">
        <div :class="['grid lg:grid-cols-2 gap-16 items-center transition-all duration-700', feature3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12']">
          <!-- Text -->
          <div class="lg:pr-8">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-6">
              <Icon name="heroicons:banknotes-20-solid" class="h-4 w-4" />
              {{ t.home.features.budget.label }}
            </div>
            <h3 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              {{ t.home.features.budget.title }}
            </h3>
            <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {{ t.home.features.budget.description }}
            </p>
            <ul class="space-y-4">
              <li v-for="(point, i) in t.home.features.budget.points" :key="i" class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-0.5 h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Icon name="heroicons:check-20-solid" class="h-3.5 w-3.5 text-white" />
                </div>
                <span class="text-sm text-slate-600 dark:text-slate-300 font-medium">{{ point }}</span>
              </li>
            </ul>
          </div>
          <!-- Visual -->
          <div class="relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-slate-200/50 dark:border-slate-700/50">
              <div class="aspect-[4/3] bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-slate-800 dark:to-emerald-950/20 p-8 flex items-center justify-center">
                <!-- Budget mockup -->
                <div class="w-full max-w-xs space-y-4">
                  <div class="text-center mb-4">
                    <p class="text-xs text-slate-400 font-medium uppercase tracking-wider">{{ t.home.features.budget.mockupLabel }}</p>
                    <p class="text-4xl font-black text-slate-900 dark:text-white mt-1">€1,247</p>
                  </div>
                  <!-- Budget bars -->
                  <div class="space-y-3">
                    <div>
                      <div class="flex justify-between text-xs font-medium mb-1">
                        <span class="text-slate-500">🏨 {{ t.home.features.budget.accommodation }}</span>
                        <span class="text-slate-900 dark:text-white">€480</span>
                      </div>
                      <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div class="h-full w-[38%] rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-xs font-medium mb-1">
                        <span class="text-slate-500">🍽️ {{ t.home.features.budget.food }}</span>
                        <span class="text-slate-900 dark:text-white">€320</span>
                      </div>
                      <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div class="h-full w-[26%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-xs font-medium mb-1">
                        <span class="text-slate-500">🎭 {{ t.home.features.budget.activities }}</span>
                        <span class="text-slate-900 dark:text-white">€280</span>
                      </div>
                      <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div class="h-full w-[22%] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-xs font-medium mb-1">
                        <span class="text-slate-500">🚕 {{ t.home.features.budget.transport }}</span>
                        <span class="text-slate-900 dark:text-white">€167</span>
                      </div>
                      <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                        <div class="h-full w-[14%] rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

const { t } = useTranslations()

const { elementRef: headerRef, isVisible: headerVisible } = useScrollReveal()
const { elementRef: feature1Ref, isVisible: feature1Visible } = useScrollReveal({ threshold: 0.1 })
const { elementRef: feature2Ref, isVisible: feature2Visible } = useScrollReveal({ threshold: 0.1 })
const { elementRef: feature3Ref, isVisible: feature3Visible } = useScrollReveal({ threshold: 0.1 })
</script>

<style scoped>
.animate-bounce-subtle {
  animation: bounceSubtle 3s ease-in-out infinite;
}

@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
</style>
