<template>
  <div class="card">
    <h3 class="text-xl font-bold text-gray-900 mb-6">{{ t.profile.stats.title }}</h3>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <!-- Total Trips -->
      <div class="text-center p-4 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50">
        <Icon name="heroicons:map-20-solid" class="h-8 w-8 text-teal-600 mx-auto mb-2" />
        <p class="text-3xl font-bold text-gray-900">{{ stats.totalTrips }}</p>
        <p class="text-sm text-gray-600">{{ t.profile.stats.totalTrips }}</p>
      </div>

      <!-- Countries Visited -->
      <div class="text-center p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50">
        <Icon name="heroicons:globe-americas-20-solid" class="h-8 w-8 text-cyan-600 mx-auto mb-2" />
        <p class="text-3xl font-bold text-gray-900">{{ stats.countriesVisited }}</p>
        <p class="text-sm text-gray-600">{{ t.profile.stats.countries }}</p>
      </div>

      <!-- Days Traveled -->
      <div class="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
        <Icon name="heroicons:calendar-20-solid" class="h-8 w-8 text-orange-600 mx-auto mb-2" />
        <p class="text-3xl font-bold text-gray-900">{{ stats.daysTraveled }}</p>
        <p class="text-sm text-gray-600">{{ t.profile.stats.days }}</p>
      </div>

      <!-- Member Since -->
      <div class="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
        <Icon name="heroicons:user-20-solid" class="h-8 w-8 text-purple-600 mx-auto mb-2" />
        <p class="text-lg font-bold text-gray-900">{{ memberSince }}</p>
        <p class="text-sm text-gray-600">{{ t.profile.stats.member }}</p>
      </div>
    </div>

    <!-- Favorite Destinations -->
    <div v-if="stats.favoriteDestinations.length > 0" class="mt-6">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">{{ t.profile.stats.favorites }}</h4>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="dest in stats.favoriteDestinations.slice(0, 5)"
          :key="dest"
          class="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-medium"
        >
          {{ dest }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  trips: any[]
  createdAt: string
}>()

const { t, locale } = useTranslations()

const stats = computed(() => {
  const totalTrips = props.trips.length
  
  // Count unique countries/destinations
  const destinations = props.trips.map(t => t.destination?.split(',')[0]?.trim()).filter(Boolean)
  const countriesVisited = new Set(destinations).size
  
  // Calculate total days traveled
  const daysTraveled = props.trips.reduce((acc, trip) => {
    if (trip.departure_date && trip.return_date) {
      const start = new Date(trip.departure_date)
      const end = new Date(trip.return_date)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return acc + (days > 0 ? days : 0)
    }
    return acc
  }, 0)
  
  // Get most frequent destinations
  const destinationCounts = destinations.reduce((acc, dest) => {
    acc[dest] = (acc[dest] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const favoriteDestinations = Object.entries(destinationCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([dest]) => dest)
  
  return {
    totalTrips,
    countriesVisited,
    daysTraveled,
    favoriteDestinations
  }
})

const memberSince = computed(() => {
  const date = new Date(props.createdAt)
  const localeStr = locale.value === 'fr' ? 'fr-FR' : 'en-US'
  return date.toLocaleDateString(localeStr, { month: 'short', year: 'numeric' })
})
</script>
