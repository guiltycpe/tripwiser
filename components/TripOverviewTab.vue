<template>
  <div class="w-full h-full overflow-y-auto p-8 space-y-6 animate-fade-in">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
      <!-- LEFT COLUMN: Budget Summary (1/3) -->
      <div class="lg:col-span-1 space-y-6 flex flex-col">
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex-1 flex flex-col">
          <div class="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 text-white">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Icon name="heroicons:banknotes-20-solid" class="h-4 w-4" />
                {{ t.tripDetails.overview.totalBudget }}
              </h3>
              <span class="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                {{ travelers }} {{ t.tripDetails.overview.persons }}
              </span>
            </div>
            <div class="text-4xl font-black tracking-tight">${{ tripData.trip_summary.total_estimated_cost_usd }}</div>
          </div>
          
          <div class="p-4 space-y-3 flex-1 flex flex-col">
            <div class="flex gap-2">
              <div class="flex-1 bg-teal-50 rounded-lg p-2.5 text-center border border-teal-100">
                <div class="text-xs text-teal-600 font-semibold mb-0.5">{{ t.tripDetails.overview.perPerson }}</div>
                <div class="text-lg font-black text-teal-700">${{ Math.round(tripData.trip_summary.total_estimated_cost_usd / travelers) }}</div>
              </div>
              <div class="flex-1 bg-blue-50 rounded-lg p-2.5 text-center border border-blue-100">
                <div class="text-xs text-blue-600 font-semibold mb-0.5">{{ t.tripDetails.overview.perDay }}</div>
                <div class="text-lg font-black text-blue-700">${{ Math.round(tripData.trip_summary.total_estimated_cost_usd / tripData.trip_summary.duration_days) }}</div>
              </div>
            </div>

            <div class="space-y-2.5 pt-2 border-t border-gray-100 flex-1">
              <div class="flex items-center justify-between text-sm">
                <span class="flex items-center gap-2 text-gray-700 font-medium">
                  <span class="h-2 w-2 rounded-full bg-indigo-500"></span>
                  {{ t.tripDetails.overview.accommodation }}
                </span>
                <span class="font-bold text-gray-900">${{ tripData.trip_summary.cost_breakdown?.accommodation_total || 0 }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-1.5">
                <div class="bg-indigo-500 h-full rounded-full" :style="{ width: ((tripData.trip_summary.cost_breakdown?.accommodation_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100) + '%' }"></div>
              </div>

              <div class="flex items-center justify-between text-sm">
                <span class="flex items-center gap-2 text-gray-700 font-medium">
                  <span class="h-2 w-2 rounded-full bg-teal-500"></span>
                  {{ t.tripDetails.overview.food }}
                </span>
                <span class="font-bold text-gray-900">${{ tripData.trip_summary.cost_breakdown?.food_total || 0 }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-1.5">
                <div class="bg-teal-500 h-full rounded-full" :style="{ width: ((tripData.trip_summary.cost_breakdown?.food_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100) + '%' }"></div>
              </div>

              <div class="flex items-center justify-between text-sm">
                <span class="flex items-center gap-2 text-gray-700 font-medium">
                  <span class="h-2 w-2 rounded-full bg-orange-500"></span>
                  {{ t.tripDetails.overview.activities }}
                </span>
                <span class="font-bold text-gray-900">${{ tripData.trip_summary.cost_breakdown?.activities_total || 0 }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-1.5">
                <div class="bg-orange-500 h-full rounded-full" :style="{ width: ((tripData.trip_summary.cost_breakdown?.activities_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100) + '%' }"></div>
              </div>
            </div>

            <button 
              @click="$emit('open-budget-panel')"
              class="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 group cursor-pointer mt-auto"
            >
              <Icon name="heroicons:calculator-20-solid" class="h-4 w-4" />
              {{ t.tripDetails.overview.fullDetails }}
              <Icon name="heroicons:arrow-right-20-solid" class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Flights + Accommodation (2/3) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Flights -->
        <div v-if="tripData.transport" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 overflow-hidden">
          <div class="p-5">
            <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Icon name="heroicons:paper-airplane-20-solid" class="h-4 w-4 text-blue-600" />
              {{ t.tripDetails.overview.recommendedFlights }}
            </h3>
            
            <div class="grid md:grid-cols-2 gap-4">
              <a :href="tripData.transport.outbound_flight.kayak_link || tripData.transport.outbound_flight.google_flights_link || tripData.transport.outbound_flight.skyscanner_link" target="_blank" class="group/flight bg-white rounded-xl p-4 hover:shadow-md transition-all border border-blue-100 hover:border-blue-300">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow group-hover/flight:scale-110 transition-transform">
                    <Icon name="heroicons:arrow-up-right-20-solid" class="h-5 w-5" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-blue-600 uppercase font-bold tracking-wide">{{ t.tripDetails.overview.outbound }}</p>
                    <p class="font-bold text-gray-900 truncate">{{ formatDestination(tripData.trip_summary.destination) }}</p>
                    <p class="text-xs text-gray-600 font-medium">{{ tripData.transport.outbound_flight.departure_date }}</p>
                  </div>
                </div>
              </a>
              
              <a :href="tripData.transport.return_flight.kayak_link || tripData.transport.return_flight.google_flights_link || tripData.transport.return_flight.skyscanner_link" target="_blank" class="group/flight bg-white rounded-xl p-4 hover:shadow-md transition-all border border-indigo-100 hover:border-indigo-300">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow group-hover/flight:scale-110 transition-transform">
                    <Icon name="heroicons:arrow-down-left-20-solid" class="h-5 w-5" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-indigo-600 uppercase font-bold tracking-wide">{{ t.tripDetails.overview.return }}</p>
                    <p class="font-bold text-gray-900 truncate">{{ t.tripDetails.overview.returnFlight }}</p>
                    <p class="text-xs text-gray-600 font-medium">{{ tripData.transport.return_flight.return_date }}</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Accommodation -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="p-5">
            <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Icon name="heroicons:home-modern-20-solid" class="h-4 w-4 text-purple-600" />
              {{ t.tripDetails.overview.whereToSleep }}
            </h3>
            
            <div class="mb-4 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border-l-4 border-teal-500">
              <p class="text-sm text-gray-700 italic leading-relaxed">
                "{{ tripData.accommodation_strategy?.reasoning }}"
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-3">
              <a v-for="(base, idx) in tripData.accommodation_strategy?.bases" :key="idx" :href="base.booking_link" target="_blank" class="block p-4 rounded-xl border-2 border-gray-200 hover:border-teal-400 transition-all bg-gray-50 hover:bg-white hover:shadow-md group/base cursor-pointer">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-bold text-gray-900 group-hover/base:text-teal-600 transition-colors">{{ base.neighborhood }}</h4>
                  <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="h-4 w-4 text-gray-400 group-hover/base:text-teal-500 transition-colors flex-shrink-0" />
                </div>
                <div class="flex gap-2 mb-2">
                  <span class="text-xs font-bold px-2 py-1 rounded-md bg-indigo-100 text-indigo-700">{{ base.nights }} {{ t.tripDetails.overview.nights }}</span>
                  <span class="text-xs font-bold px-2 py-1 rounded-md bg-green-100 text-green-700">${{ base.estimated_cost_per_night_usd }}/{{ t.tripDetails.overview.night }}</span>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed line-clamp-2">{{ base.why_here }}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Itinerary } from '~/types/itinerary.types'

defineProps<{
  tripData: Itinerary
  travelers: number
}>()

defineEmits(['open-budget-panel'])

const { t } = useTranslations()
</script>
