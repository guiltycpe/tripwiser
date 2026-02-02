<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-md" @click="$emit('close')"></div>
      
        <!-- Main Container -->
        <div class="relative w-full max-w-6xl h-[90vh] md:h-[80vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col md:flex-row border border-white/20">
          
          <!-- Left Side: Map -->
          <div class="w-full md:w-3/5 h-[45vh] md:h-full relative border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50 flex flex-col">
            <div class="flex-1 min-h-0">
              <MapViewer :activities="allActivities" />
            </div>
          
          <button 
            @click="$emit('close')"
            class="absolute top-4 left-4 z-[30] rounded-full bg-white/90 p-2 text-gray-900 shadow-lg md:hidden"
          >
            <Icon name="heroicons:x-mark-20-solid" class="h-6 w-6" />
          </button>
        </div>

        <!-- Right Side: Details -->
        <div class="w-full md:w-2/5 flex flex-col h-[50vh] md:h-auto overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 z-20 bg-white/80 backdrop-blur-md p-6 border-b border-gray-100">
            <div class="flex items-start justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 leading-tight">{{ trip.destination }}</h2>
                <div class="flex items-center gap-4 mt-2">
                  <span class="inline-flex items-center text-sm font-medium text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full">
                    <Icon name="heroicons:sparkles-20-solid" class="mr-1 h-4 w-4" />
                    {{ trip.travel_style }}
                  </span>
                  <span class="inline-flex items-center text-sm font-medium text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full" v-if="trip.road_trip">
                    <Icon name="heroicons:truck-20-solid" class="mr-1 h-4 w-4" />
                    Road Trip
                  </span>
                </div>
              </div>
              <button 
                @click="$emit('close')"
                class="hidden md:block rounded-full hover:bg-gray-100 p-2 text-gray-400 transition-colors"
              >
                <Icon name="heroicons:x-mark-20-solid" class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-8 flex-1">
            <!-- Summary Stats -->
            <div class="grid grid-cols-2 gap-4">
              <div class="rounded-2xl bg-gray-50 p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Budget</p>
                <p class="text-lg font-bold text-gray-900">{{ trip.budget }}</p>
              </div>
              <div class="rounded-2xl bg-gray-50 p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Durée</p>
                <p class="text-lg font-bold text-gray-900">{{ trip.itinerary?.length || 0 }} Jours</p>
              </div>
            </div>

            <!-- Detailed Timeline -->
            <div class="space-y-6">
              <h3 class="text-lg font-bold text-gray-900">Itinéraire du voyage</h3>
              
              <div v-for="day in trip.itinerary" :key="day.day" class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {{ day.day }}
                  </div>
                  <h4 class="font-bold text-gray-900">{{ day.title }}</h4>
                </div>

                <div class="ml-4 pl-7 border-l-2 border-dashed border-gray-100 space-y-4">
                  <div 
                    v-for="activity in day.activities" 
                    :key="activity.time"
                    class="relative group"
                  >
                    <!-- Dot -->
                    <div class="absolute -left-[37px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-teal-500 shadow-sm z-10 transition-transform group-hover:scale-125"></div>
                    
                    <div>
                      <span class="text-xs font-bold text-teal-600 block mb-1">{{ activity.time }}</span>
                      <p class="text-sm text-gray-700 leading-relaxed">{{ activity.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Action -->
          <div class="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-4">
            <button class="flex-1 btn-primary py-3">
              <Icon name="heroicons:share-20-solid" class="mr-2 h-5 w-5" />
              Partager mon voyage
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  trip: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const allActivities = computed(() => {
  if (!props.trip.itinerary) return []
  return props.trip.itinerary.flatMap((day: any) => day.activities)
})
</script>
