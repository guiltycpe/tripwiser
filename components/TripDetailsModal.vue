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
            <div class="flex-1 min-h-0 relative">
              <MapViewer 
                :activities="visibleActivities" 
                :transport-mode="selectedTransportMode" 
                @route-updated="handleRouteUpdated"
              />
              
              <!-- Map Controls (Stacked on the left) -->
              <div class="absolute top-4 left-4 z-[1000] flex flex-col gap-3">
                <!-- Transport Mode Selector -->
                <div class="flex gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-xl border border-white/50">
                  <button 
                    v-for="mode in (['driving', 'walking', 'cycling'] as const)" 
                    :key="mode"
                    @click="selectedTransportMode = mode"
                    class="p-2 rounded-lg transition-all duration-300 flex items-center justify-center"
                    :class="selectedTransportMode === mode ? 'bg-teal-500 text-white shadow-md scale-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
                    :title="$t(`common.transport.${mode}`)"
                  >
                    <Icon 
                      :name="mode === 'driving' ? 'heroicons:truck-20-solid' : mode === 'walking' ? 'heroicons:user-20-solid' : 'heroicons:bolt-20-solid'" 
                      class="h-5 w-5" 
                    />
                  </button>
                </div>
              </div>

              <!-- Route Stats Overlay (Bottom Left) -->
              <div v-if="routeInfo" class="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/50 flex flex-col gap-1.5 animate-in slide-in-from-bottom-4 duration-500">
                <div class="flex items-center gap-3">
                  <div class="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                    <Icon name="heroicons:clock-20-solid" class="h-4 w-4" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Durée estimée</p>
                    <p class="text-sm font-bold text-gray-900 leading-none">{{ formatDuration(routeInfo.duration) }}</p>
                  </div>
                </div>
                <div class="h-px bg-gray-100/50 mx-1"></div>
                <div class="flex items-center gap-3">
                  <div class="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <Icon name="heroicons:map-20-solid" class="h-4 w-4" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Distance totale</p>
                    <p class="text-sm font-bold text-gray-900 leading-none">{{ formatDistance(routeInfo.distance) }}</p>
                  </div>
                </div>
              </div>
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
              
              <div v-for="day in trip.itinerary" :key="day.day" class="border rounded-xl overflow-hidden transition-all duration-300" :class="activeDay === day.day ? 'border-teal-500 bg-teal-50/10' : 'border-gray-100 hover:border-teal-200'">
                <!-- Accordion Header -->
                <button 
                  @click="toggleDay(day.day)"
                  class="w-full flex items-center justify-between p-4 text-left transition-colors"
                  :class="activeDay === day.day ? 'bg-teal-50/50' : 'bg-white hover:bg-gray-50'"
                >
                  <div class="flex items-center gap-3">
                    <div 
                      class="h-8 w-8 rounded-xl flex items-center justify-center font-bold text-sm transition-colors"
                      :class="activeDay === day.day ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'"
                    >
                      {{ day.day }}
                    </div>
                    <h4 class="font-bold text-gray-900">{{ day.title }}</h4>
                  </div>
                  <Icon 
                    name="heroicons:chevron-down-20-solid" 
                    class="h-5 w-5 text-gray-400 transition-transform duration-300"
                    :class="{ 'rotate-180': activeDay === day.day }"
                  />
                </button>

                <!-- Accordion Body -->
                <div v-show="activeDay === day.day" class="block p-4 bg-white border-t border-teal-100/50">
                  <div class="ml-3 pl-6 border-l-2 border-dashed border-teal-100 space-y-6">
                    <div 
                      v-for="activity in day.activities" 
                      :key="activity.time"
                      class="relative group"
                    >
                      <!-- Dot -->
                      <div class="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-teal-400 shadow-sm z-10 transition-transform group-hover:scale-125 group-hover:bg-teal-600"></div>
                      
                      <div>
                        <div class="flex items-baseline justify-between mb-1">
                          <span class="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{{ activity.time }}</span>
                        </div>
                        <p class="text-sm text-gray-700 leading-relaxed font-medium">{{ activity.description }}</p>
                        <p v-if="activity.location" class="text-xs text-gray-500 mt-1 flex items-center">
                           <Icon name="heroicons:map-pin-20-solid" class="h-3 w-3 mr-1" />
                           {{ activity.location }}
                        </p>
                      </div>
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
import { computed, ref } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  trip: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const activeDay = ref(1)

function toggleDay(dayNum: number) {
  if (activeDay.value === dayNum) {
    return 
  }
  activeDay.value = dayNum
}

const visibleActivities = computed(() => {
  if (!props.trip.itinerary) return []
  // Filter for the active day
  const day = props.trip.itinerary.find((d: any) => d.day === activeDay.value)
  return day ? day.activities : []
})

const selectedTransportMode = ref<'driving' | 'walking' | 'cycling'>('driving')
const routeInfo = ref<{ duration: number, distance: number, legs: any[] } | null>(null)

function handleRouteUpdated(info: { duration: number, distance: number, legs: any[] } | null) {
  routeInfo.value = info
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.ceil((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes} min`
}

function formatDistance(meters: number) {
  if (meters > 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${Math.round(meters)} m`
}
</script>
