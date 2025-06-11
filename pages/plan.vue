<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const departure = ref('')
const destination = ref('')
const departureDate = ref('07/07/25')
const returnDate = ref('21/07/25')
const budget = ref('High')
const takeRoadTrip = ref(true)
const travelStyle = ref('Confort')

const departureInputRef = ref<HTMLInputElement | null>(null)
const destinationInputRef = ref<HTMLInputElement | null>(null)

// --- Utilisation des composables ---
// Un pour chaque input
useGooglePlaces(departureInputRef, (place) => {
  if (place.name) departure.value = place.name
})

useGooglePlaces(destinationInputRef, (place) => {
  if (place.name) destination.value = place.name
})

onMounted(() => {
  if (route.query.departure) {
    departure.value = route.query.departure as string
  }
})

function generateItinerary() {
  console.log({
    departure: departure.value,
    destination: destination.value,
    departureDate: departureDate.value,
    returnDate: returnDate.value,
    budget: budget.value,
    takeRoadTrip: takeRoadTrip.value,
    travelStyle: travelStyle.value
  })
  alert('Generating itinerary... (check console)')
}
</script>

<template>
  <div class="px-4 py-16 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl">
      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h2 class="text-center text-3xl font-bold text-gray-900">
          Your travel preferences
        </h2>

        <form @submit.prevent="generateItinerary" class="mt-8 space-y-6">

          <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div>
              <label for="departure" class="block text-sm font-medium text-gray-700">Departure</label>
              <input v-model="departure" ref="departureInputRef" type="text" id="departure" class="mt-1 block w-full rounded-md text-gray-700 border-gray-300 px-4 py-3 shadow-sm focus:border-teal-500 focus:ring-teal-500">
            </div>
            <div>
              <label for="destination" class="block text-sm font-medium text-gray-700">Destination(s)</label>
              <input v-model="destination" ref="destinationInputRef" placeholder="Tokyo, Osaka" type="text" id="destination" class="mt-1 block w-full rounded-md text-gray-700 border-gray-300 px-4 py-3 shadow-sm focus:border-teal-500 focus:ring-teal-500">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Departure and return dates</label>
            <div class="mt-1 flex items-center gap-4">
              <input v-model="departureDate" type="text" class="block w-full rounded-md text-gray-700 border-gray-300 px-4 py-3 shadow-sm focus:border-teal-500 focus:ring-teal-500">
              <span class="text-gray-500">></span>
              <input v-model="returnDate" type="text" class="block w-full rounded-md text-gray-700 border-gray-300 px-4 py-3 shadow-sm focus:border-teal-500 focus:ring-teal-500">
            </div>
          </div>

          <div>
            <label for="budget" class="block text-sm font-medium text-gray-700">Budget</label>
            <select v-model="budget" id="budget" class="mt-1 block w-full rounded-md text-gray-700 border-gray-300 px-4 py-3 shadow-sm focus:border-teal-500 focus:ring-teal-500">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Take a Road Trip</span>
            <label for="roadtrip-toggle" class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" v-model="takeRoadTrip" id="roadtrip-toggle" class="peer sr-only">
              <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300"></div>
            </label>
          </div>

          <div>
            <label for="travel-style" class="block text-sm font-medium text-gray-700">Travel style</label>
            <select v-model="travelStyle" id="travel-style" class="mt-1 block w-full rounded-md text-gray-700 border-gray-300 px-4 py-3 shadow-sm focus:border-teal-500 focus:ring-teal-500">
              <option>Backpacker</option>
              <option>Confort</option>
              <option>Luxury</option>
            </select>
          </div>

          <div class="pt-4">
            <button type="submit" class="w-full rounded-lg bg-teal-500 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-teal-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-600">
              Generate my itinerary
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>