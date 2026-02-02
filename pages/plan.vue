<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GooglePlacesInput from '~/components/GooglePlacesInput.vue'

const route = useRoute()
const { t } = useTranslations()

const departure = ref('')
const destination = ref('')
const departureDate = ref('07/07/25')
const returnDate = ref('21/07/25')
const budget = ref('High')
const takeRoadTrip = ref(true)
const travelStyle = ref('Confort')
const isGenerating = ref(false)

onMounted(() => {
  if (route.query.departure) {
    departure.value = route.query.departure as string
  }
})

function generateItinerary() {
  isGenerating.value = true
  console.log({
    departure: departure.value,
    destination: destination.value,
    departureDate: departureDate.value,
    returnDate: returnDate.value,
    budget: budget.value,
    takeRoadTrip: takeRoadTrip.value,
    travelStyle: travelStyle.value
  })
  
  setTimeout(() => {
    isGenerating.value = false
    alert('Generating itinerary... (check console)')
  }, 1500)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
    <!-- Hero Section -->
    <section class="section">
      <div class="mx-auto max-w-4xl text-center animate-fade-in">
        <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          {{ t.plan.hero.title }}
        </h1>
        <p class="mt-4 text-xl text-gray-600">
          {{ t.plan.hero.subtitle }}
        </p>
      </div>
    </section>

    <!-- Form Section -->
    <section class="px-4 pb-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl">
        <div class="glass rounded-2xl p-8 shadow-xl animate-slide-up">
          <form @submit.prevent="generateItinerary" class="space-y-6">
            <!-- Departure & Destination -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label for="departure" class="block text-sm font-semibold text-gray-900 mb-2">
                  <Icon name="heroicons:map-pin-20-solid" class="inline h-5 w-5 text-teal-500 mr-1" />
                  {{ t.plan.form.departure }}
                </label>
                <GooglePlacesInput
                  v-model="departure"
                  id="departure"
                  :placeholder="t.plan.form.departurePlaceholder"
                  class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              
              <div>
                <label for="destination" class="block text-sm font-semibold text-gray-900 mb-2">
                  <Icon name="heroicons:map-20-solid" class="inline h-5 w-5 text-purple-500 mr-1" />
                  {{ t.plan.form.destination }}
                </label>
                <GooglePlacesInput
                  v-model="destination"
                  id="destination"
                  :placeholder="t.plan.form.destinationPlaceholder"
                  class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <!-- Dates -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-2">
                <Icon name="heroicons:calendar-20-solid" class="inline h-5 w-5 text-orange-500 mr-1" />
                {{ t.plan.form.departureDate }} / {{ t.plan.form.returnDate }}
              </label>
              <div class="flex items-center gap-4">
                <input 
                  v-model="departureDate" 
                  type="text" 
                  placeholder="DD/MM/YY"
                  class="block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                >
                <Icon name="heroicons:arrow-right-20-solid" class="h-5 w-5 text-gray-400" />
                <input 
                  v-model="returnDate" 
                  type="text" 
                  placeholder="DD/MM/YY"
                  class="block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                >
              </div>
            </div>

            <!-- Budget -->
            <div>
              <label for="budget" class="block text-sm font-semibold text-gray-900 mb-2">
                <Icon name="heroicons:currency-euro-20-solid" class="inline h-5 w-5 text-green-500 mr-1" />
                {{ t.plan.form.budget }}
              </label>
              <select 
                v-model="budget" 
                id="budget" 
                class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="Low">{{ t.plan.form.budgetOptions.budget }}</option>
                <option value="Medium">{{ t.plan.form.budgetOptions.moderate }}</option>
                <option value="High">{{ t.plan.form.budgetOptions.luxury }}</option>
              </select>
            </div>

            <!-- Road Trip Toggle -->
            <div class="card flex items-center justify-between p-4">
              <div class="flex items-center gap-3">
                <Icon name="heroicons:truck-20-solid" class="h-6 w-6 text-teal-500" />
                <span class="text-sm font-semibold text-gray-900">{{ t.plan.form.roadTrip }}</span>
              </div>
              <label for="roadtrip-toggle" class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" v-model="takeRoadTrip" id="roadtrip-toggle" class="peer sr-only">
                <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300"></div>
              </label>
            </div>

            <!-- Travel Style -->
            <div>
              <label for="travel-style" class="block text-sm font-semibold text-gray-900 mb-2">
                <Icon name="heroicons:star-20-solid" class="inline h-5 w-5 text-yellow-500 mr-1" />
                {{ t.plan.form.travelStyle }}
              </label>
              <select 
                v-model="travelStyle" 
                id="travel-style" 
                class="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="adventure">{{ t.plan.form.styleOptions.adventure }}</option>
                <option value="relaxation">{{ t.plan.form.styleOptions.relaxation }}</option>
                <option value="culture">{{ t.plan.form.styleOptions.culture }}</option>
                <option value="food">{{ t.plan.form.styleOptions.food }}</option>
                <option value="nature">{{ t.plan.form.styleOptions.nature }}</option>
              </select>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isGenerating"
              class="btn-primary w-full py-4 text-lg hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <template v-if="!isGenerating">
                <Icon name="heroicons:sparkles-20-solid" class="inline h-5 w-5 mr-2" />
                {{ t.plan.form.submit }}
              </template>
              <template v-else>
                <Icon name="heroicons:arrow-path-20-solid" class="inline h-5 w-5 mr-2 animate-spin" />
                {{ t.plan.form.generating }}
              </template>
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
