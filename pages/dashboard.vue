<template>
  <div class="min-h-screen">
    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">
            {{ t.dashboard.welcome }}, {{ userName }}
          </h1>
          <p class="mt-1 text-sm text-slate-500">{{ t.dashboard.subtitle }}</p>
        </div>
        <button
          @click="router.push('/plan')"
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition-colors shadow-sm cursor-pointer"
        >
          <Icon name="heroicons:plus-20-solid" class="h-4 w-4" />
          {{ t.dashboard.newTrip }}
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <div class="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t.dashboard.stats.totalTrips }}</p>
              <p class="mt-1 text-2xl font-semibold text-slate-900">{{ trips.length }}</p>
            </div>
            <div class="rounded-lg bg-teal-50 p-2.5">
              <Icon name="heroicons:map-20-solid" class="h-5 w-5 text-teal-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t.dashboard.stats.countries }}</p>
              <p class="mt-1 text-2xl font-semibold text-slate-900">{{ countriesCount }}</p>
            </div>
            <div class="rounded-lg bg-indigo-50 p-2.5">
              <Icon name="heroicons:globe-americas-20-solid" class="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t.dashboard.stats.upcoming }}</p>
              <p class="mt-1 text-2xl font-semibold text-slate-900">{{ upcomingTrips }}</p>
            </div>
            <div class="rounded-lg bg-amber-50 p-2.5">
              <Icon name="heroicons:calendar-20-solid" class="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ t.dashboard.stats.totalBudget }}</p>
              <p class="mt-1 text-2xl font-semibold text-slate-900">{{ totalBudget }}</p>
            </div>
            <div class="rounded-lg bg-emerald-50 p-2.5">
              <Icon name="heroicons:currency-dollar-20-solid" class="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Trips Section -->
      <div class="animate-fade-in">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-slate-900">{{ t.dashboard.trips.title }}</h2>
          <div class="flex items-center gap-3">
            <!-- Search -->
            <div class="relative">
              <Icon name="heroicons:magnifying-glass-20-solid" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t.dashboard.trips.searchPlaceholder"
                class="pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-44 sm:w-52"
              />
            </div>
            <!-- Filter -->
            <select
              v-model="filterStatus"
              class="appearance-none cursor-pointer pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm font-medium shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            >
              <option value="all">{{ t.dashboard.trips.all }}</option>
              <option value="upcoming">{{ t.dashboard.trips.upcoming }}</option>
              <option value="past">{{ t.dashboard.trips.past }}</option>
            </select>
            <!-- View Toggle -->
            <div class="flex bg-slate-100 rounded-lg p-0.5">
              <button
                @click="viewMode = 'grid'"
                class="p-1.5 rounded-md transition-colors cursor-pointer"
                :class="viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'"
              >
                <Icon name="heroicons:squares-2x2-20-solid" class="h-4 w-4" />
              </button>
              <button
                @click="viewMode = 'list'"
                class="p-1.5 rounded-md transition-colors cursor-pointer"
                :class="viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'"
              >
                <Icon name="heroicons:bars-3-bottom-left-20-solid" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Loading Skeletons -->
        <div v-if="loading" class="space-y-4">
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="i in 3" :key="i" class="rounded-2xl bg-white border border-slate-200 overflow-hidden">
              <div class="h-40 skeleton-shimmer"></div>
              <div class="p-4 space-y-3">
                <div class="h-5 skeleton-shimmer rounded w-3/4"></div>
                <div class="h-4 skeleton-shimmer rounded w-1/2"></div>
                <div class="flex gap-2">
                  <div class="h-6 skeleton-shimmer rounded-full w-20"></div>
                  <div class="h-6 skeleton-shimmer rounded-full w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTrips.length === 0" class="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div class="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Icon name="heroicons:map-20-solid" class="h-8 w-8 text-slate-400" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-slate-900">{{ t.dashboard.trips.empty }}</h3>
          <p class="mb-6 text-sm text-slate-500">{{ t.dashboard.trips.emptySubtitle }}</p>
          <button
            @click="router.push('/plan')"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition-colors shadow-sm cursor-pointer"
          >
            <Icon name="heroicons:plus-20-solid" class="h-4 w-4" />
            {{ t.dashboard.trips.createFirst }}
          </button>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <TripCard
            v-for="trip in filteredTrips"
            :key="trip.id"
            :trip="trip"
            @click="router.push('/trip/' + trip.id)"
            @delete="confirmDeleteTrip"
          />
        </div>

        <!-- List View -->
        <div v-else class="space-y-3">
          <TripListItem
            v-for="trip in filteredTrips"
            :key="trip.id"
            :trip="trip"
            @click="router.push('/trip/' + trip.id)"
            @delete="confirmDeleteTrip"
          />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="deleteConfirmId" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40" @click="deleteConfirmId = null"></div>
        <div class="relative bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-slate-200">
          <div class="flex flex-col items-center text-center">
            <div class="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
              <Icon name="heroicons:exclamation-triangle-20-solid" class="h-6 w-6 text-rose-600" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2">{{ t.common.delete }}</h3>
            <p class="text-sm text-slate-500 mb-6">{{ t.dashboard.trips.deleteConfirm }}</p>
            <div class="flex gap-3 w-full">
              <button
                @click="deleteConfirmId = null"
                class="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {{ t.common.cancel }}
              </button>
              <button
                @click="executeDeleteTrip"
                class="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 transition-colors cursor-pointer"
              >
                {{ t.common.delete }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue'
definePageMeta({
  layout: 'dashboard'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const { t, locale } = useTranslations()
const toast = useToast()

const trips = ref<any[]>([])
const loading = ref(true)
const filterStatus = ref('all')
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

const userName = computed(() => {
  return user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'Traveler'
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
  let result = trips.value

  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    result = result.filter(trip =>
      (trip.destination || '').toLowerCase().includes(query) ||
      (trip.departure || '').toLowerCase().includes(query)
    )
  }

  if (filterStatus.value === 'all') return result

  const now = new Date()
  if (filterStatus.value === 'upcoming') {
    return result.filter(t => {
      if (!t.departure_date) return false
      return new Date(t.departure_date) > now
    })
  } else {
    return result.filter(t => {
      if (!t.departure_date) return true
      return new Date(t.departure_date) <= now
    })
  }
})

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

const deleteConfirmId = ref<string | null>(null)

function confirmDeleteTrip(tripId: string) {
  deleteConfirmId.value = tripId
}

async function executeDeleteTrip() {
  const tripId = deleteConfirmId.value
  if (!tripId) return
  deleteConfirmId.value = null

  try {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId)

    if (error) throw error

    trips.value = trips.value.filter(t => t.id !== tripId)

    toast.add({
      title: t.value.dashboard.trips.deleteSuccess,
      color: 'success'
    })
  } catch {
    toast.add({
      title: t.value.common.error,
      description: t.value.dashboard.trips.deleteError,
      color: 'error'
    })
  }
}
</script>
