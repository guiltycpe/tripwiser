<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
    <!-- Navbar -->
    <navBar />

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
              class="btn-primary hover-glow"
            >
              <Icon name="heroicons:plus-20-solid" class="mr-2 h-5 w-5" />
              {{ t.dashboard.newTrip }}
            </button>
            <button
              @click="handleLogout"
              class="btn-secondary"
            >
              <Icon name="heroicons:arrow-right-on-rectangle-20-solid" class="mr-2 h-5 w-5" />
              {{ t.dashboard.logout }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up">
        <div class="card hover-lift">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t.dashboard.stats.totalTrips }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ trips.length }}</p>
            </div>
            <div class="rounded-full bg-teal-100 p-3">
              <Icon name="heroicons:map-20-solid" class="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div class="card hover-lift">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t.dashboard.stats.countries }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ countriesCount }}</p>
            </div>
            <div class="rounded-full bg-purple-100 p-3">
              <Icon name="heroicons:globe-americas-20-solid" class="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div class="card hover-lift">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t.dashboard.stats.upcoming }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">{{ upcomingTrips }}</p>
            </div>
            <div class="rounded-full bg-orange-100 p-3">
              <Icon name="heroicons:calendar-20-solid" class="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div class="card hover-lift">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t.dashboard.stats.memberSince }}</p>
              <p class="mt-1 text-xl font-bold text-gray-900">{{ memberSince }}</p>
            </div>
            <div class="rounded-full bg-cyan-100 p-3">
              <Icon name="heroicons:user-20-solid" class="h-6 w-6 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Trips Section -->
      <div class="animate-slide-up" style="animation-delay: 0.1s">
        <div class="mb-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">{{ t.dashboard.trips.title }}</h2>
          <select v-model="filterStatus" class="rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500">
            <option value="all">{{ t.dashboard.trips.all }}</option>
            <option value="upcoming">{{ t.dashboard.trips.upcoming }}</option>
            <option value="past">{{ t.dashboard.trips.past }}</option>
          </select>
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
            class="btn-primary hover-glow"
          >
            <Icon name="heroicons:plus-20-solid" class="mr-2 h-5 w-5" />
            {{ t.dashboard.trips.createFirst }}
          </button>
        </div>

        <!-- Trips Grid -->
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="trip in filteredTrips"
            :key="trip.id"
            class="card-hover group relative overflow-hidden bg-white"
          >
            <!-- Trip Header -->
            <div class="mb-4">
              <div class="mb-2 flex items-start justify-between">
                <h3 class="text-xl font-bold text-gray-900">{{ trip.destination }}</h3>
                <button
                  @click="deleteTrip(trip.id)"
                  class="opacity-0 transition-opacity group-hover:opacity-100 rounded-lg p-2 hover:bg-red-50"
                  :title="t.common.delete"
                >
                  <Icon name="heroicons:trash-20-solid" class="h-5 w-5 text-red-500" />
                </button>
              </div>
              <p class="text-sm text-gray-600">{{ t.dashboard.trips.from }} {{ trip.departure }}</p>
            </div>

            <!-- Trip Details -->
            <div class="space-y-2 mb-4">
              <div v-if="trip.departure_date" class="flex items-center text-sm text-gray-600">
                <Icon name="heroicons:calendar-20-solid" class="mr-2 h-4 w-4 text-teal-500" />
                {{ formatDate(trip.departure_date) }}
                <span v-if="trip.return_date"> - {{ formatDate(trip.return_date) }}</span>
              </div>
              <div v-if="trip.budget" class="flex items-center text-sm text-gray-600">
                <Icon name="heroicons:currency-euro-20-solid" class="mr-2 h-4 w-4 text-green-500" />
                {{ trip.budget }} {{ t.dashboard.trips.budget }}
              </div>
              <div v-if="trip.travel_style" class="flex items-center text-sm text-gray-600">
                <Icon name="heroicons:sparkles-20-solid" class="mr-2 h-4 w-4 text-purple-500" />
                {{ trip.travel_style }}
              </div>
              <div v-if="trip.road_trip" class="flex items-center text-sm text-gray-600">
                <Icon name="heroicons:truck-20-solid" class="mr-2 h-4 w-4 text-orange-500" />
                Road Trip
              </div>
            </div>

            <!-- Trip Footer -->
            <div class="flex gap-2 border-t border-gray-100 pt-4">
              <button class="flex-1 rounded-lg bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 transition-all hover:bg-teal-100">
                {{ t.dashboard.trips.viewDetails }}
              </button>
              <button class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:border-teal-500 hover:text-teal-600">
                {{ t.dashboard.trips.edit }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
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

const userName = computed(() => {
  return user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'Traveler'
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
  } catch (err) {
    console.error('Error deleting trip:', err)
    alert('Failed to delete trip. Please try again.')
  }
}

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/')
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const localeStr = locale.value === 'fr' ? 'fr-FR' : 'en-US'
  return date.toLocaleDateString(localeStr, { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
