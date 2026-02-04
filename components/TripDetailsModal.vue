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
        <div class="relative w-full max-w-7xl h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col border border-white/20">
          
          <!-- Header (Always Visible) -->
          <div class="bg-white/80 backdrop-blur-md p-6 border-b border-gray-100 flex items-center justify-between z-20">
            <div>
               <h2 class="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
                 {{ tripData.trip_summary.destination }}
                 <span class="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-widest font-bold shadow-sm">
                   {{ getBudgetLabel(tripData.trip_summary.budget_tier) }}
                 </span>
               </h2>
               <p class="text-sm font-medium text-gray-500 mt-2 flex items-center gap-2">
                 <Icon name="heroicons:calendar-20-solid" class="h-4 w-4 text-gray-400" />
                 {{ formatDate(props.trip.departure_date) }} - {{ formatDate(props.trip.return_date) }}
                 <span class="text-gray-300">•</span>
                 {{ tripData.trip_summary.duration_days }} Jours
               </p>
            </div>

            <div class="flex items-center gap-4">
              <!-- Delete button (left side) -->
              <button 
                @click="$emit('delete', props.trip.id)" 
                class="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors group cursor-pointer"
                title="Supprimer le voyage"
              >
                <Icon name="heroicons:trash-20-solid" class="h-5 w-5" />
              </button>

              <!-- Tabs -->
              <div class="hidden md:flex bg-gray-100/50 p-1 rounded-xl">
                 <button 
                   @click="activeTab = 'overview'"
                   class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                   :class="activeTab === 'overview' ? 'bg-white shadow text-teal-600' : 'text-gray-500 hover:text-gray-700'"
                 >
                   Vue d'ensemble
                 </button>
                 <button 
                   @click="activeTab = 'itinerary'"
                   class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                   :class="activeTab === 'itinerary' ? 'bg-white shadow text-teal-600' : 'text-gray-500 hover:text-gray-700'"
                 >
                   Itinéraire Détaillé
                 </button>
              </div>

              <button @click="$emit('close')" class="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors cursor-pointer">
                <Icon name="heroicons:x-mark-20-solid" class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Content Area -->
          <div class="flex-1 overflow-hidden relative flex flex-col md:flex-row">
            
            <!-- OVERVIEW TAB -->
            <div v-if="activeTab === 'overview'" class="w-full h-full overflow-y-auto p-6 md:p-8 space-y-8 animate-fade-in">
               
               <!-- Top Stats Row -->
               <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Budget Breakdown -->
                  <!-- Budget Breakdown -->
                  <div class="card p-0 border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                     <div class="p-6 border-b border-gray-50 bg-gray-50/50">
                        <div class="flex items-center justify-between mb-4">
                           <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <div class="p-1.5 bg-teal-100 rounded-lg text-teal-600">
                                 <Icon name="heroicons:banknotes-20-solid" class="h-4 w-4" />
                              </div>
                              Budget Estimé
                           </h3>
                           <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm">
                              {{ props.trip.travelers }} voyageur{{ props.trip.travelers > 1 ? 's' : '' }}
                           </span>
                        </div>
                        
                        <div class="flex items-baseline gap-1.5">
                           <span class="text-4xl font-black text-gray-900 tracking-tight">${{ tripData.trip_summary.total_estimated_cost_usd }}</span>
                           <span class="text-sm text-gray-500 font-medium">total</span>
                        </div>
                        
                        <!-- Per Person / Per Day Stats -->
                        <div class="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                           <span class="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 px-2.5 py-1.5 rounded-md border border-teal-100/50">
                              <Icon name="heroicons:user-20-solid" class="h-3 w-3 opacity-60" />
                              ~${{ Math.round(tripData.trip_summary.total_estimated_cost_usd / props.trip.travelers) }} / pers.
                           </span>
                           <span class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-md border border-blue-100/50">
                              <Icon name="heroicons:clock-20-solid" class="h-3 w-3 opacity-60" />
                              ~${{ Math.round(tripData.trip_summary.total_estimated_cost_usd / tripData.trip_summary.duration_days) }} / jour
                           </span>
                        </div>
                     </div>

                     <!-- Detailed Breakdown List -->
                     <div class="p-5 space-y-5">
                        <!-- Accommodation -->
                        <div class="group">
                           <div class="flex justify-between items-center mb-2">
                              <span class="text-sm font-bold text-gray-700 flex items-center gap-2.5">
                                 <span class="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200"></span> Hébergement
                              </span>
                              <span class="text-sm font-extrabold text-gray-900">${{ tripData.trip_summary.cost_breakdown?.accommodation_total || 0 }}</span>
                           </div>
                           <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div class="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-600" :style="{ width: ((tripData.trip_summary.cost_breakdown?.accommodation_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100) + '%' }"></div>
                           </div>
                           <p class="text-[10px] uppercase tracking-wider text-gray-400 mt-1.5 text-right font-semibold">
                              {{ Math.round(((tripData.trip_summary.cost_breakdown?.accommodation_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100)) }}% du budget
                           </p>
                        </div>

                        <!-- Food -->
                        <div class="group">
                           <div class="flex justify-between items-center mb-2">
                              <span class="text-sm font-bold text-gray-700 flex items-center gap-2.5">
                                 <span class="h-2.5 w-2.5 rounded-full bg-teal-500 shadow-sm shadow-teal-200"></span> Nourriture
                              </span>
                              <span class="text-sm font-extrabold text-gray-900">${{ tripData.trip_summary.cost_breakdown?.food_total || 0 }}</span>
                           </div>
                           <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div class="bg-teal-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-teal-600" :style="{ width: ((tripData.trip_summary.cost_breakdown?.food_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100) + '%' }"></div>
                           </div>
                           <p class="text-[10px] uppercase tracking-wider text-gray-400 mt-1.5 text-right font-semibold">
                              {{ Math.round(((tripData.trip_summary.cost_breakdown?.food_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100)) }}% du budget
                           </p>
                        </div>

                        <!-- Activities -->
                        <div class="group">
                           <div class="flex justify-between items-center mb-2">
                              <span class="text-sm font-bold text-gray-700 flex items-center gap-2.5">
                                 <span class="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-200"></span> Activités
                              </span>
                              <span class="text-sm font-extrabold text-gray-900">${{ tripData.trip_summary.cost_breakdown?.activities_total || 0 }}</span>
                           </div>
                           <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div class="bg-orange-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-orange-600" :style="{ width: ((tripData.trip_summary.cost_breakdown?.activities_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100) + '%' }"></div>
                           </div>
                           <p class="text-[10px] uppercase tracking-wider text-gray-400 mt-1.5 text-right font-semibold">
                              {{ Math.round(((tripData.trip_summary.cost_breakdown?.activities_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100)) }}% du budget
                           </p>
                        </div>
                     </div>
                  </div>

                  <!-- Accommodation Strategy -->
                  <div class="card p-6 border border-gray-100 bg-white md:col-span-2">
                     <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                        <Icon name="heroicons:home-modern-20-solid" class="h-4 w-4 mr-2" />
                        Stratégie d'Hébergement
                     </h3>
                     <p class="text-gray-700 italic mb-6 border-l-4 border-teal-500 pl-4 py-1 bg-teal-50/50 rounded-r-lg">
                       "{{ tripData.accommodation_strategy?.reasoning }}"
                     </p>

                     <div class="grid md:grid-cols-2 gap-4">
                        <div v-for="(base, idx) in tripData.accommodation_strategy?.bases" :key="idx" class="p-4 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors bg-gray-50 hover:bg-white group relative">
                           <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="h-4 w-4 text-teal-500" />
                           </div>
                           <h4 class="font-bold text-gray-900">{{ base.neighborhood }}</h4>
                           <p class="text-xs text-gray-500 mb-2">{{ base.nights }} Nuits • ${{ base.estimated_cost_per_night_usd }}/nuit</p>
                           <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ base.why_here }}</p>
                           <a :href="base.booking_link" target="_blank" class="text-xs font-bold text-teal-600 uppercase tracking-wide flex items-center hover:underline">
                             Voir logements <Icon name="heroicons:chevron-right-20-solid" class="h-3 w-3 ml-1" />
                           </a>
                        </div>
                     </div>
                  </div>
               </div>

               <!-- Flights Card -->
               <div v-if="tripData.transport" class="card p-6 border border-blue-100 bg-blue-50/30">
                  <h3 class="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center">
                     <Icon name="heroicons:paper-airplane-20-solid" class="h-4 w-4 mr-2" />
                     Transport Aérien Recommandé
                  </h3>
                  <div class="grid md:grid-cols-2 gap-6">
                     <a :href="tripData.transport.outbound_flight.kayak_link || tripData.transport.outbound_flight.google_flights_link || tripData.transport.outbound_flight.skyscanner_link" target="_blank" class="flex items-center gap-4 group p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                        <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                           <Icon name="heroicons:arrow-up-right-20-solid" class="h-5 w-5" />
                        </div>
                        <div>
                           <p class="text-xs text-gray-500 uppercase font-bold">Aller • {{ tripData.transport.outbound_flight.departure_date }}</p>
                           <p class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Rechercher vols vers {{ tripData.trip_summary.destination }}</p>
                        </div>
                     </a>
                     <a :href="tripData.transport.return_flight.kayak_link || tripData.transport.return_flight.google_flights_link || tripData.transport.return_flight.skyscanner_link" target="_blank" class="flex items-center gap-4 group p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                        <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                           <Icon name="heroicons:arrow-down-left-20-solid" class="h-5 w-5" />
                        </div>
                        <div>
                           <p class="text-xs text-gray-500 uppercase font-bold">Retour • {{ tripData.transport.return_flight.return_date }}</p>
                           <p class="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Rechercher vols retour</p>
                        </div>
                     </a>
                  </div>
               </div>

            </div>

             <!-- ITINERARY TAB -->
            <div v-if="activeTab === 'itinerary'" class="flex w-full h-full flex-col md:flex-row animate-fade-in">
               
               <!-- Left: Map (Desktop) / Top (Mobile) -->
               <div class="w-full md:w-1/2 h-[300px] md:h-full relative border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50">
                  <MapViewer 
                    :activities="flatActivities" 
                  />
                  <!-- Map Controls -->

               </div>

               <!-- Right: Timeline -->
               <div class="w-full md:w-1/2 h-full overflow-y-auto bg-gray-50/50 p-6">
                  <div class="space-y-10">
                     
                     <div v-for="(section, sIdx) in tripData.itinerary_sections" :key="sIdx" class="relative">
                        <!-- Section Header -->
                        <div class="mb-6 pt-4 border-b border-gray-100 pb-2">
                           <h3 class="text-xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600">{{ section.section_title }}</h3>
                           <div class="flex items-center gap-3 text-sm text-gray-500 mt-1">
                              <span class="flex items-center"><Icon name="heroicons:map-pin-20-solid" class="h-3 w-3 mr-1" /> {{ section.geographic_focus }}</span>
                              <span class="flex items-center"><Icon name="heroicons:home-20-solid" class="h-3 w-3 mr-1" /> Base: {{ section.accommodation_base }}</span>
                           </div>
                        </div>

                        <!-- Days in Section -->
                         <div class="space-y-8 pl-4 border-l-2 border-teal-200 ml-3">
                            <div v-for="day in section.daily_plans" :key="day.day" class="relative">
                               <!-- Day Dot -->
                               <div class="absolute -left-[23px] top-0 h-4 w-4 rounded-full border-2 border-white bg-teal-500 shadow-md"></div>
                               
                               <div class="mb-4">
                                  <h4 class="font-bold text-gray-900 text-lg">Jour {{ day.day }} : {{ day.title }}</h4>
                                  <p class="text-xs font-bold text-teal-600 bg-teal-50 inline-block px-2 py-0.5 rounded-full mt-1">{{ day.daily_pace }}</p>
                               </div>

                               <!-- Activities -->
                               <div class="space-y-4">
                                  <div v-for="(act, aIdx) in day.activities" :key="aIdx" class="card p-4 hover:shadow-md transition-shadow bg-white rounded-xl border border-gray-100 group">
                                     <div class="flex gap-4">
                                        <!-- Time / Icon -->
                                        <div class="flex-shrink-0 flex flex-col items-center gap-2 w-16">
                                           <div class="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                                              <Icon :name="getActivityIcon(act.activity_type)" class="h-5 w-5" />
                                           </div>
                                        </div>

                                        <!-- Content -->
                                        <div class="flex-1 min-w-0">
                                           <div class="flex justify-between items-start">
                                              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{{ act.time_flexible }}</p>
                                              <span v-if="act.estimated_cost_usd > 0" class="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                                ${{ act.estimated_cost_usd }}
                                              </span>
                                           </div>
                                           
                                           <h5 class="text-gray-900 font-medium leading-snug" :class="{'text-lg': act.has_physical_location}">
                                              {{ act.name || act.description }}
                                           </h5>
                                           
                                           <p v-if="act.name" class="text-sm text-gray-600 mt-1">{{ act.description }}</p>
                                           
                                           <!-- Location/Details -->
                                           <div v-if="act.has_physical_location" class="mt-3 flex flex-wrap gap-2">
                                              <a v-if="act.google_maps_link" :href="act.google_maps_link" target="_blank" class="inline-flex items-center text-xs font-bold text-blue-600 hover:underline">
                                                 <Icon name="heroicons:map-20-solid" class="h-3 w-3 mr-1" /> View Map
                                              </a>
                                              <span v-if="act.rating" class="inline-flex items-center text-xs text-yellow-600 bg-yellow-50 px-1.5 rounded">
                                                 <Icon name="heroicons:star-20-solid" class="h-3 w-3 mr-1" /> {{ act.rating }}
                                              </span>
                                           </div>

                                           <p v-if="act.notes" class="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2">
                                              "{{ act.notes }}"
                                           </p>
                                        </div>
                                     </div>
                                  </div>
                               </div>

                            </div>
                         </div>

                     </div>

                  </div>
               </div>
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

defineEmits(['close', 'delete'])

const activeTab = ref('overview')

// Helper to access the correct root property structure
const tripData = computed(() => {
  // If it's the new format, trip.itinerary is the root object containing everything
  if (props.trip.itinerary && props.trip.itinerary.itinerary_sections) {
    return props.trip.itinerary
  }
  return null
})

// Flatten activities for the map
const flatActivities = computed(() => {
  if (!tripData.value) return []
  const allActs: any[] = []
  
  tripData.value.itinerary_sections.forEach((section: any) => {
    section.daily_plans.forEach((day: any) => {
      day.activities.forEach((act: any) => {
        if (act.has_physical_location && act.lat && act.lng) {
          allActs.push({
             ...act,
             day: day.day
          })
        }
      })
    })
  })
  return allActs
})


function getBudgetLabel(tier: string) {
  if (!tier) return ''
  const t = tier.toLowerCase()
  const map: Record<string, string> = {
    'low': 'Budget Friendly',
    'budget': 'Budget Friendly',
    'medium': 'Balanced Comfort',
    'moderate': 'Balanced Comfort',
    'balanced': 'Balanced Comfort',
    'high': 'Luxury Experience',
    'luxury': 'Luxury Experience'
  }
  return map[t] || tier
}

// Utilities
function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}



function getActivityIcon(type: string) {
  const map: any = {
    arrival_logistics: 'heroicons:arrow-down-on-square-stack-20-solid',
    dining: 'heroicons:cake-20-solid',
    accommodation: 'heroicons:home-modern-20-solid',
    culture: 'heroicons:building-library-20-solid',
    nature: 'heroicons:sun-20-solid',
    shopping: 'heroicons:shopping-bag-20-solid',
    transport: 'heroicons:ticket-20-solid'
  }
  return map[type] || 'heroicons:map-pin-20-solid'
}
</script>

<style scoped>
/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
