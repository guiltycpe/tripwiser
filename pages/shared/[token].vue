<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <Icon name="heroicons:arrow-path-20-solid" class="h-8 w-8 text-slate-400 animate-spin mx-auto mb-3" />
        <p class="text-slate-500 text-sm">Loading shared trip...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md">
        <div class="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <Icon name="heroicons:exclamation-triangle-20-solid" class="h-7 w-7 text-slate-400" />
        </div>
        <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Trip not found</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">This shared link may be invalid or the trip has been removed.</p>
        <NuxtLink to="/" class="btn-primary px-5 py-2.5 text-sm">Go to TripWiser</NuxtLink>
      </div>
    </div>

    <!-- Trip Content -->
    <div v-else-if="trip" class="max-w-5xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-xs font-medium px-3 py-1.5 rounded-lg border border-teal-100 dark:border-teal-800 mb-4">
          <Icon name="heroicons:share-20-solid" class="h-3.5 w-3.5" />
          Shared Itinerary
        </div>

        <h1 class="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {{ formatDestination(trip.itinerary?.trip_summary?.destination || trip.destination || '') }}
        </h1>

        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ formatDate(trip.departure_date) }} — {{ formatDate(trip.return_date) }}
          <span class="mx-2 text-slate-300">·</span>
          {{ trip.itinerary?.trip_summary?.duration_days }} days
          <span class="mx-2 text-slate-300">·</span>
          {{ trip.travelers }} traveler(s)
        </p>

        <div v-if="trip.destination_image_url" class="mt-6 rounded-2xl overflow-hidden max-h-72">
          <img :src="trip.destination_image_url" :alt="trip.destination" class="w-full h-72 object-cover" />
        </div>
      </div>

      <!-- Budget Summary -->
      <div v-if="trip.itinerary?.trip_summary" class="grid grid-cols-3 gap-4 mb-10">
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <div class="text-xl font-semibold text-teal-600">${{ trip.itinerary.trip_summary.total_estimated_cost_usd }}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Budget</div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <div class="text-xl font-semibold text-indigo-600">${{ Math.round(trip.itinerary.trip_summary.total_estimated_cost_usd / trip.travelers) }}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Per Person</div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <div class="text-xl font-semibold text-slate-700 dark:text-slate-300">${{ Math.round(trip.itinerary.trip_summary.total_estimated_cost_usd / trip.itinerary.trip_summary.duration_days) }}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Per Day</div>
        </div>
      </div>

      <!-- Itinerary -->
      <div v-if="trip.itinerary?.itinerary_sections" class="space-y-6">
        <div v-for="section in trip.itinerary.itinerary_sections" :key="section.section_title" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="bg-teal-600 p-5 text-white">
            <h2 class="text-lg font-semibold">{{ section.section_title }}</h2>
            <p class="text-sm text-white/80">{{ section.geographic_focus }} · Base: {{ section.accommodation_base }}</p>
          </div>

          <div class="p-6 space-y-6">
            <div v-for="day in section.daily_plans" :key="day.day">
              <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">Day {{ day.day }}: {{ day.title }}</h3>
              <span class="inline-block text-xs font-medium bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2.5 py-1 rounded-lg border border-teal-100 dark:border-teal-800 mb-3">{{ day.daily_pace }}</span>

              <div class="space-y-3 ml-3 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                <div v-for="act in day.activities" :key="act.description" class="flex gap-3">
                  <span class="text-xs text-slate-400 font-medium whitespace-nowrap min-w-[55px] mt-0.5">{{ act.time_flexible }}</span>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ act.description }}</p>
                    <p v-if="act.notes" class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ act.notes }}</p>
                    <div class="flex items-center gap-3 mt-1">
                      <span v-if="act.estimated_cost_usd" class="text-xs font-medium text-teal-600">${{ act.estimated_cost_usd }}</span>
                      <a v-if="act.google_maps_link" :href="act.google_maps_link" target="_blank" rel="noopener noreferrer" class="text-xs text-indigo-500 hover:underline">Maps</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center mt-12 py-8 border-t border-slate-200 dark:border-slate-700">
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Want to create your own personalized itinerary?</p>
        <NuxtLink to="/plan" class="btn-primary px-6 py-3 text-sm">
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
