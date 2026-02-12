<template>
  <section class="relative py-32 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
    <!-- Background accent -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[100px]"></div>

    <div ref="sectionRef" class="relative max-w-7xl mx-auto px-6">
      <div :class="['transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <!-- Header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-widest mb-6 border border-teal-100 dark:border-teal-800">
            {{ t.home.testimonials.badge }}
          </span>
          <h2 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ t.home.testimonials.title }}
          </h2>
          <p class="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {{ t.home.testimonials.subtitle }}
          </p>
        </div>

        <!-- Testimonials grid -->
        <div ref="gridRef" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(testimonial, i) in testimonials"
            :key="i"
            :style="getItemStyle(i)"
            class="group relative rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 hover:border-teal-200 dark:hover:border-teal-800 transition-all duration-500 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1"
          >
            <!-- Quote mark -->
            <div class="absolute top-4 right-4 text-5xl font-serif text-slate-100 dark:text-slate-800 select-none leading-none">"</div>
            
            <!-- Stars -->
            <div class="flex gap-0.5 mb-4">
              <Icon v-for="s in 5" :key="s" name="heroicons:star-20-solid" class="h-4 w-4 text-amber-400" />
            </div>

            <!-- Quote text -->
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 relative z-10">
              "{{ testimonial.quote }}"
            </p>

            <!-- Author -->
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white" :class="testimonial.avatarBg">
                {{ testimonial.initials }}
              </div>
              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ testimonial.name }}</p>
                <p class="text-xs text-slate-400">{{ testimonial.trip }}</p>
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
const { elementRef: gridRef, getItemStyle } = useStaggerReveal(6, { staggerDelay: 80, threshold: 0.1 })

const testimonials = computed(() => t.value.home.testimonials.items)
</script>
