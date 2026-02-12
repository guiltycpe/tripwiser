<template>
  <section class="relative py-32 overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-100 via-teal-50 to-slate-100 dark:from-slate-900 dark:via-teal-950 dark:to-slate-900"></div>
    
    <!-- Orbs -->
    <div class="absolute top-1/4 left-0 w-[400px] h-[400px] bg-teal-400/10 dark:bg-teal-500/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[100px]"></div>

    <!-- Grid pattern -->
    <div class="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style="background-image: linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px); background-size: 50px 50px;"></div>

    <div ref="sectionRef" class="relative max-w-4xl mx-auto px-6 text-center">
      <div :class="['transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <h2 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {{ title }}
          <span v-if="titleHighlight" class="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {{ titleHighlight }}
          </span>
        </h2>

        <p class="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {{ subtitle }}
        </p>

        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink
            :to="primaryLink"
            class="group px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-base hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 active:scale-[0.98]"
          >
            <span class="flex items-center gap-2">
              {{ primaryText }}
              <Icon name="heroicons:arrow-right-20-solid" class="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </NuxtLink>
          <NuxtLink
            v-if="secondaryText"
            :to="secondaryLink"
            class="px-8 py-4 rounded-xl text-slate-600 dark:text-slate-300 font-semibold text-base hover:text-slate-900 dark:hover:text-white transition-all duration-300 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"
          >
            {{ secondaryText }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useScrollReveal } from '~/composables/useScrollReveal'

interface Props {
  title: string
  titleHighlight?: string
  subtitle: string
  primaryText: string
  primaryLink: string
  secondaryText?: string
  secondaryLink?: string
}

defineProps<Props>()

const { elementRef: sectionRef, isVisible } = useScrollReveal()
</script>
