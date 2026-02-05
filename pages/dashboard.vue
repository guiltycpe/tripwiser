<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-12 animate-fade-in">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-gray-900">
              {{ t.dashboard.welcome }}, <span class="text-gradient">{{ userName }}</span>!
            </h1>
            <p class="mt-2 text-gray-600">{{ t.dashboard.subtitle }}</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="router.push('/plan')"
              class="group relative px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative flex items-center gap-2">
                <Icon name="heroicons:plus-20-solid" class="h-5 w-5" />
                {{ t.dashboard.newTrip }}
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <div class="card hover-lift group transition-all duration-300 hover:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t.dashboard.stats.totalTrips }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{{ trips.length }}</p>
            </div>
            <div class="rounded-full bg-teal-100 w-12 h-12 flex items-center justify-center group-hover:scale-110 group-hover:bg-teal-200 transition-all">
              <Icon name="heroicons:map-20-solid" class="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div class="card hover-lift group transition-all duration-300 hover:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t.dashboard.stats.countries }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{{ countriesCount }}</p>
            </div>
            <div class="rounded-full bg-cyan-100 w-12 h-12 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-200 transition-all">
              <Icon name="heroicons:globe-americas-20-solid" class="h-6 w-6 text-cyan-600" />
            </div>
          </div>
        </div>

        <div class="card hover-lift group transition-all duration-300 hover:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t.dashboard.stats.upcoming }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{{ upcomingTrips }}</p>
            </div>
            <div class="rounded-full bg-orange-100 w-12 h-12 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-200 transition-all">
              <Icon name="heroicons:calendar-20-solid" class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div class="card hover-lift group transition-all duration-300 hover:shadow-xl">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t.dashboard.stats.totalBudget || 'Total Budget' }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{{ totalBudget }}</p>
            </div>
            <div class="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-200 transition-all">
              <Icon name="heroicons:currency-dollar-20-solid" class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Trips Section -->
      <div class="animate-slide-up" style="animation-delay: 0.1s">
        <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 class="text-2xl font-bold text-gray-900">{{ t.dashboard.trips.title }}</h2>
          <div class="relative">
             <select 
               v-model="filterStatus" 
               class="appearance-none cursor-pointer pl-4 pr-10 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 text-sm font-semibold shadow-sm hover:border-teal-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
             >
               <option value="all" class="text-gray-900 bg-white">{{ t.dashboard.trips.all }}</option>
               <option value="upcoming" class="text-gray-900 bg-white">{{ t.dashboard.trips.upcoming }}</option>
               <option value="past" class="text-gray-900 bg-white">{{ t.dashboard.trips.past }}</option>
             </select>
             <Icon name="heroicons:chevron-down-20-solid" class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <Icon name="heroicons:arrow-path-20-solid" class="h-12 w-12 animate-spin text-teal-500" />
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTrips.length === 0" class="glass rounded-2xl p-12 text-center">
          <div class="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500">
            <Icon name="heroicons:map-20-solid" class="h-10 w-10 text-white" />
          </div>
          <h3 class="mb-2 text-xl font-bold text-gray-900">{{ t.dashboard.trips.empty }}</h3>
          <p class="mb-6 text-gray-600">{{ t.dashboard.trips.emptySubtitle }}</p>
          <button
            @click="router.push('/plan')"
            class="group relative px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative flex items-center gap-2">
              <Icon name="heroicons:plus-20-solid" class="h-5 w-5" />
              {{ t.dashboard.trips.createFirst }}
            </div>
          </button>
        </div>

        <!-- Trips Grid -->
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <TripCard
            v-for="trip in filteredTrips"
            :key="trip.id"
            :trip="trip"
            @click="openTripDetails(trip)"
            @delete="deleteTrip"
            @refresh-image="handleRefreshImage"
          />
        </div>
      </div>
    </main>

    <!-- Modals -->
    <TripDetailsModal 
      v-if="selectedTrip"
      :is-open="isModalOpen" 
      :trip="selectedTrip" 
      @close="closeModal" 
      @delete="deleteTrip"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue'
definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const { t, locale } = useTranslations()

const trips = ref<any[]>([])
const loading = ref(true)
const filterStatus = ref('all')

// Modal State
const isModalOpen = ref(false)
const selectedTrip = ref<any>(null)

function openTripDetails(trip: any) {
  selectedTrip.value = trip
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  setTimeout(() => {
    selectedTrip.value = null
  }, 300)
}

const userName = computed(() => {
  return user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || (t.value.about as any).team?.founding_desc?.split(' & ')[0] || 'Traveler'
})

const memberSince = computed(() => {
  if (!user.value?.created_at) return ''
  const date = new Date(user.value.created_at)
  const localeStr = locale.value === 'fr' ? 'fr-FR' : 'en-US'
  return date.toLocaleDateString(localeStr, { month: 'short', year: 'numeric' })
})

const countriesCount = computed(() => {
  const destinations = trips.value.map(t => t.destination)
  return new Set(destinations).size
})

const upcomingTrips = computed(() => {
  const now = new Date()
  return trips.value.filter(t => {
    if (!t.departure_date) return false
    return new Date(t.departure_date) > now
  }).length
})

const totalBudget = computed(() => {
  const total = trips.value.reduce((sum, trip) => {
    // Le budget est dans l'itinéraire JSON sous trip_summary.total_estimated_cost_usd
    if (trip.itinerary && typeof trip.itinerary === 'object') {
      const itinerary = trip.itinerary as any
      const budget = itinerary?.trip_summary?.total_estimated_cost_usd || 0
      return sum + budget
    }
    return sum
  }, 0)
  return total > 0 ? `$${Math.round(total).toLocaleString()}` : '$0'
})

const filteredTrips = computed(() => {
  if (filterStatus.value === 'all') return trips.value
  
  const now = new Date()
  if (filterStatus.value === 'upcoming') {
    return trips.value.filter(t => {
      if (!t.departure_date) return false
      return new Date(t.departure_date) > now
    })
  } else {
    return trips.value.filter(t => {
      if (!t.departure_date) return true
      return new Date(t.departure_date) <= now
    })
  }
})

// Redirect if not logged in
watchEffect(() => {
  if (!user.value) {
    router.push('/auth/login')
  }
})

// Load trips on mount
onMounted(async () => {
  await loadTrips()
})

async function loadTrips() {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    trips.value = data || []
  } catch (err) {
    console.error('Error loading trips:', err)
  } finally {
    loading.value = false
  }
}

async function deleteTrip(tripId: string) {
  if (!confirm(t.value.dashboard.trips.deleteConfirm)) return

  try {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId)

    if (error) throw error

    // Remove from local array
    trips.value = trips.value.filter(t => t.id !== tripId)
    
    // Close modal if it's open
    if (isModalOpen.value && selectedTrip.value?.id === tripId) {
      closeModal()
    }
  } catch (err) {
    console.error('Error deleting trip:', err)
    alert('Failed to delete trip. Please try again.')
  }
}

async function handleRefreshImage(tripId: string) {
  const trip = trips.value.find(t => t.id === tripId)
  if (!trip) return

  try {
    // Show loading state on card (optional, but good UX - here we just wait)
    // Ideally we would have a loading state on the card itself, but for now we just do it.
    
    // Fetch new image
    const { url } = await $fetch('/api/get-destination-image', {
      params: { 
        destination: trip.destination.split(',')[0], 
        // Add random param to bypass cache if needed, but Unsplash 'random' endpoint should handle it.
        // But the browser or server might cache?
        timestamp: Date.now() 
      }
    }) as any

    if (!url) {
      alert('Could not find a new image.')
      return
    }

    // Update DB
    const { error } = await supabase
      .from('trips')
      .update({ destination_image_url: url })
      .eq('id', tripId)

    if (error) throw error

    // Update local
    trip.destination_image_url = url
    
  } catch (err) {
    console.error('Error refreshing image:', err)
    alert('Failed to refresh image.')
  }
}

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/')
}


// Helpers can be removed or kept if used elsewhere. Removed unused ones for clarity.
function formatDestination(dest: string) {
  if (!dest) return 'Unknown'
  return dest.split(',')[0].trim()
}
// Other helpers moved to TripCard or unused

</script>
