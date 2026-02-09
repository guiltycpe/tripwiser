<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-500 font-medium">Loading shared trip...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md">
        <Icon name="heroicons:exclamation-triangle-20-solid" class="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Trip not found</h1>
        <p class="text-gray-500 mb-6">This shared link may be invalid or the trip has been removed.</p>
        <NuxtLink to="/" class="btn-primary">Go to TripWiser</NuxtLink>
      </div>
    </div>

    <!-- Trip Content -->
    <div v-else-if="trip" class="max-w-5xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
          <Icon name="heroicons:share-20-solid" class="h-4 w-4" />
          Shared Itinerary
        </div>
        
        <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-3">
          {{ formatDestination(trip.itinerary?.trip_summary?.destination || trip.destination || '') }}
        </h1>
        
        <p class="text-gray-500 font-medium">
          {{ formatDate(trip.departure_date) }} — {{ formatDate(trip.return_date) }}
          <span class="mx-2">•</span>
          {{ trip.itinerary?.trip_summary?.duration_days }} days
          <span class="mx-2">•</span>
          {{ trip.travelers }} traveler(s)
        </p>

        <!-- Hero image -->
        <div v-if="trip.destination_image_url" class="mt-6 rounded-2xl overflow-hidden shadow-xl max-h-80">
          <img :src="trip.destination_image_url" :alt="trip.destination" class="w-full h-80 object-cover" />
        </div>
      </div>

      <!-- Budget Summary -->
      <div v-if="trip.itinerary?.trip_summary" class="grid grid-cols-3 gap-4 mb-10">
        <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div class="text-2xl font-black text-teal-600">${{ trip.itinerary.trip_summary.total_estimated_cost_usd }}</div>
          <div class="text-xs text-gray-500 font-semibold">Total Budget</div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div class="text-2xl font-black text-blue-600">${{ Math.round(trip.itinerary.trip_summary.total_estimated_cost_usd / trip.travelers) }}</div>
          <div class="text-xs text-gray-500 font-semibold">Per Person</div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div class="text-2xl font-black text-indigo-600">${{ Math.round(trip.itinerary.trip_summary.total_estimated_cost_usd / trip.itinerary.trip_summary.duration_days) }}</div>
          <div class="text-xs text-gray-500 font-semibold">Per Day</div>
        </div>
      </div>

      <!-- Itinerary -->
      <div v-if="trip.itinerary?.itinerary_sections" class="space-y-8">
        <div v-for="section in trip.itinerary.itinerary_sections" :key="section.section_title" class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div class="bg-gradient-to-r from-teal-500 to-cyan-500 p-5 text-white">
            <h2 class="text-xl font-bold">{{ section.section_title }}</h2>
            <p class="text-sm opacity-90">{{ section.geographic_focus }} • Base: {{ section.accommodation_base }}</p>
          </div>

          <div class="p-6 space-y-6">
            <div v-for="day in section.daily_plans" :key="day.day">
              <h3 class="text-lg font-bold text-gray-900 mb-1">Day {{ day.day }}: {{ day.title }}</h3>
              <span class="inline-block text-xs font-semibold bg-teal-50 text-teal-700 px-3 py-1 rounded-full mb-3">{{ day.daily_pace }}</span>

              <div class="space-y-3 ml-4 border-l-2 border-teal-200 pl-4">
                <div v-for="act in day.activities" :key="act.description" class="flex gap-3">
                  <span class="text-sm text-gray-500 font-semibold whitespace-nowrap min-w-[60px]">{{ act.time_flexible }}</span>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ act.description }}</p>
                    <p v-if="act.notes" class="text-xs text-gray-500 mt-0.5">{{ act.notes }}</p>
                    <div class="flex items-center gap-3 mt-1">
                      <span v-if="act.estimated_cost_usd" class="text-xs font-bold text-teal-600">${{ act.estimated_cost_usd }}</span>
                      <a v-if="act.google_maps_link" :href="act.google_maps_link" target="_blank" class="text-xs text-blue-500 hover:underline">📍 Maps</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-12 py-8 border-t border-gray-200">
        <p class="text-gray-500 mb-4">Want to create your own personalized itinerary?</p>
        <NuxtLink to="/plan" class="btn-primary text-lg px-8 py-3">
          Plan Your Trip with TripWiser
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SharedTrip {
  destination: string
  departure_date: string
  return_date: string
  travelers: number
  budget: string
  itinerary: any
  destination_image_url: string | null
}

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const token = computed(() => route.params.token as string)

const { data: trip, pending, error } = await useFetch<SharedTrip>('/api/shared-trip', {
  query: { token },
})

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

useHead({
  title: trip.value ? `${trip.value.destination} - TripWiser` : 'Shared Trip - TripWiser',
})
</script>
