<template>
  <div 
    class="card-hover group relative overflow-hidden"
    :class="bgColorClass"
  >
    <!-- Gradient overlay on hover -->
    <div 
      class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"
      :class="gradientClass"
    ></div>
    
    <div class="relative z-10">
      <!-- Icon -->
      <div 
        class="mb-4 inline-flex rounded-xl p-3 transition-transform duration-300 group-hover:scale-110"
        :class="iconBgClass"
      >
        <Icon 
          :name="icon" 
          class="h-6 w-6"
          :class="iconColorClass"
        />
      </div>
      
      <!-- Title -->
      <h3 class="mb-3 text-xl font-bold text-gray-900">
        {{ title }}
      </h3>
      
      <!-- Description -->
      <p class="text-gray-600 leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  title: string
  description: string
  color?: 'teal' | 'purple' | 'orange' | 'cyan'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'teal'
})

const colorMap = {
  teal: {
    bg: 'bg-white',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    gradient: 'bg-gradient-to-br from-teal-500 to-cyan-500'
  },
  purple: {
    bg: 'bg-white',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500'
  },
  orange: {
    bg: 'bg-white',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    gradient: 'bg-gradient-to-br from-orange-500 to-pink-500'
  },
  cyan: {
    bg: 'bg-white',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500'
  }
}

const bgColorClass = computed(() => colorMap[props.color].bg)
const iconBgClass = computed(() => colorMap[props.color].iconBg)
const iconColorClass = computed(() => colorMap[props.color].iconColor)
const gradientClass = computed(() => colorMap[props.color].gradient)
</script>
