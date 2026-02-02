<template>
  <div 
    class="card-hover relative overflow-hidden"
    :class="[
      highlighted ? 'ring-2 ring-teal-500 shadow-2xl scale-105' : '',
      'bg-white'
    ]"
  >
    <!-- Popular Badge -->
    <div 
      v-if="highlighted"
      class="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-1 text-xs font-bold text-white uppercase tracking-wide"
    >
      Popular
    </div>
    
    <div class="p-8">
      <!-- Tier Name -->
      <h3 class="text-2xl font-bold text-gray-900">
        {{ tier }}
      </h3>
      
      <!-- Price -->
      <div class="mt-4 flex items-baseline">
        <span class="text-5xl font-extrabold tracking-tight text-gray-900">
          €{{ price }}
        </span>
        <span class="ml-2 text-gray-500">
          /{{ period }}
        </span>
      </div>
      
      <!-- Description -->
      <p class="mt-4 text-gray-600">
        {{ description }}
      </p>
      
      <!-- CTA Button -->
      <button 
        class="mt-8 w-full rounded-lg py-3 px-6 font-semibold transition-all duration-300"
        :class="buttonClass"
      >
        {{ ctaText }}
      </button>
      
      <!-- Features List -->
      <ul class="mt-8 space-y-4">
        <li 
          v-for="(feature, index) in features" 
          :key="index"
          class="flex items-start"
        >
          <Icon 
            name="heroicons:check-circle-20-solid" 
            class="h-6 w-6 flex-shrink-0 text-teal-500 mr-3"
          />
          <span class="text-gray-700">{{ feature }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  tier: string
  price: number | string
  period?: string
  description: string
  features: string[]
  highlighted?: boolean
  ctaText?: string
}

const props = withDefaults(defineProps<Props>(), {
  period: 'month',
  highlighted: false,
  ctaText: 'Get Started'
})

const buttonClass = computed(() => {
  if (props.highlighted) {
    return 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
  }
  return 'border-2 border-gray-300 text-gray-800 hover:border-teal-500 hover:text-teal-600'
})
</script>
