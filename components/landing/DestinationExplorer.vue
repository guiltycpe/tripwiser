<template>
  <section class="relative py-32 overflow-hidden bg-white dark:bg-slate-900">
    <div ref="sectionRef" class="relative max-w-7xl mx-auto px-6">
      <div :class="['transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <!-- Header -->
        <div class="text-center mb-16">
          <span class="inline-block px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6 border border-cyan-100 dark:border-cyan-800">
            {{ t.home.destinations.badge }}
          </span>
          <h2 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ t.home.destinations.title }}
          </h2>
          <p class="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {{ t.home.destinations.subtitle }}
          </p>
        </div>

        <!-- Destination Grid — Bento-style -->
        <div ref="gridRef" class="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-4">
          <div
            v-for="(dest, i) in destinations"
            :key="i"
            :style="getItemStyle(i)"
            :class="[
              'group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]',
              dest.span
            ]"
            @click="navigateToPlan(dest.city)"
          >
            <!-- Image -->
            <img
              :src="dest.image"
              :alt="dest.city"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500"></div>

            <!-- Content -->
            <div class="absolute inset-0 flex flex-col justify-end p-5">
              <div class="transform transition-transform duration-500 group-hover:translate-y-0 translate-y-1">
                <h3 class="text-white font-bold text-lg md:text-xl mb-1">{{ dest.city }}</h3>
                <p class="text-white/70 text-xs font-medium flex items-center gap-1.5">
                  <Icon name="heroicons:map-pin-20-solid" class="h-3 w-3" />
                  {{ dest.country }}
                </p>
              </div>
              
              <!-- Arrow on hover -->
              <div class="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-white/20">
                <Icon name="heroicons:arrow-up-right-20-solid" class="h-4 w-4 text-white" />
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
const router = useRouter()
const { elementRef: sectionRef, isVisible } = useScrollReveal()
const { elementRef: gridRef, getItemStyle } = useStaggerReveal(8, { staggerDelay: 60, threshold: 0.05 })

const destinations = [
  {
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    span: 'col-span-2 row-span-2',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    span: 'col-span-1 row-span-1',
  },
  {
    city: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    span: 'col-span-1 row-span-1',
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop',
    span: 'col-span-1 row-span-1',
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=400&fit=crop',
    span: 'col-span-1 row-span-2',
  },
  {
    city: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
    span: 'col-span-1 row-span-1',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
    span: 'col-span-1 row-span-1',
  },
]

function navigateToPlan(city: string) {
  router.push({ path: '/plan', query: { departure: city } })
}
</script>
