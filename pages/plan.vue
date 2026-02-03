<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import LocationInput from '~/components/LocationInput.vue'

const route = useRoute()
const { t, locale } = useTranslations()

const departure = ref('')
const destinations = ref<string[]>([])
const currentDestination = ref('')
const departureDate = ref(new Date().toISOString().split('T')[0])
const returnDate = ref(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
const budget = ref('High')
const takeRoadTrip = ref(true)
const travelStyle = ref('adventure')
const travelers = ref(2)
const isGenerating = ref(false)

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

onMounted(async () => {
  if (route.query.departure) {
    departure.value = route.query.departure as string
  }

  // Double check auth on mount
  const { data } = await supabase.auth.getUser()
  if (!data?.user) {
    console.warn('No user session on mount, redirecting to login...')
    router.push('/auth/login')
  }
})

// Improved utility to convert DD/MM/YY or YYYY-MM-DD to YYYY-MM-DD
function parseDate(dateStr: string) {
  if (!dateStr) return null
  
  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr

  const parts = dateStr.split(/[-/]/)
  if (parts.length !== 3) return null
  
  const d = parts[0] || ''
  const m = parts[1] || ''
  let y = parts[2] || ''
  
  // Handle case where year is first (YYYY/MM/DD)
  if (d.length === 4) return `${d}-${m.padStart(2, '0')}-${y.padStart(2, '0')}`
  
  // Normalizing to 4 digits for year (assume 21st century)
  if (y.length === 2) y = '20' + y
  
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

const generationStep = ref(0)
const generationMessages = computed(() => {
  const budgetOptions = t.value.plan.form.budgetOptions as any
  const styleOptions = t.value.plan.form.styleOptions as any
  
  const budgetMap: Record<string, string> = {
    'low': 'budget',
    'medium': 'moderate',
    'high': 'luxury'
  }
  const budgetKey = budgetMap[budget.value.toLowerCase()] || 'budget'
  const budgetLabel = budgetOptions[budgetKey] || budget.value
  const styleLabel = styleOptions[travelStyle.value] || travelStyle.value
  
  const steps = t.value.plan.form.steps as any
  
  return [
    t.value.plan.form.generating,
    steps.analyzing,
    steps.calculating,
    steps.optimizing.replace('{budget}', budgetLabel),
    steps.finding.replace('{style}', styleLabel),
    steps.finalizing
  ]
})

async function generateItinerary() {
  console.log('--- ITINERARY GENERATION v3 CHECK ---')
  
  try {
    // 1. FORCE AUTH CHECK
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authUser || !authUser.id) {
      console.error('Session check failed:', authError)
      alert(t.value.common.error + ": Session invalid")
      return router.push('/auth/login')
    }

    if (destinations.value.length === 0) {
      alert(t.value.plan.form.noDestinations)
      return
    }

    const currentUserId = authUser.id
    console.log('--- SESSION VALIDATED (v3) --- User:', currentUserId)

    isGenerating.value = true
    generationStep.value = 0
    
    const stepInterval = setInterval(() => {
      if (generationStep.value < generationMessages.value.length - 2) {
        generationStep.value++
      }
    }, 1500)

    // 2. AI GENERATION
    console.log('Calling AI API...')
    const aiResponse = await $fetch('/api/generate-itinerary', {
      method: 'POST',
      body: {
        departure: departure.value,
        destination: destinations.value.join(', '),
        departure_date: parseDate(departureDate.value),
        return_date: parseDate(returnDate.value),
        budget: budget.value,
        travel_style: travelStyle.value,
        road_trip: takeRoadTrip.value,
        travelers: travelers.value
      }
    }) as any

    // 3. DATABASE INSERTION (using array for stability)
    const payload = {
        user_id: currentUserId,
        departure: departure.value || 'Unknown',
        destination: destinations.value.join(', ') || 'Asia',
        departure_date: parseDate(departureDate.value),
        return_date: parseDate(returnDate.value),
        budget: budget.value,
        travel_style: travelStyle.value,
        road_trip: takeRoadTrip.value,
        travelers: travelers.value,
        itinerary: aiResponse?.itinerary
    }

    console.log('DATABASE INSERT (v3) - Checking ID before send:', payload.user_id)

    const { data: dbData, error: dbError } = await (supabase
      .from('trips' as any)
      .insert([payload] as any)
      .select() as any)

    if (dbError) {
      console.error('SUPABASE DB ERROR (v3):', dbError)
      // Showing full message to user
      alert(`ERREUR BASE DE DONNÉES (v3) :\nCode: ${dbError.code}\nMessage: ${dbError.message}\n\nHint: Verifiez si vous etes connecte sur un autre onglet.`)
      isGenerating.value = false
      generationStep.value = generationMessages.value.length - 1
      clearInterval(stepInterval)
      return
    }

    console.log('Trip saved (v3). Entry ID:', (dbData as any)?.[0]?.id)
    
    setTimeout(() => {
      generationStep.value = generationMessages.value.length - 1
      clearInterval(stepInterval)
      router.push('/dashboard')
    }, 800)

  } catch (err: any) {
    console.error('GLOBAL PLAN ERROR:', err)
    alert('DEBUG ERROR (v3): ' + (err.message || 'Unknown error'))
    isGenerating.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
    <!-- Generation Overlay -->
    <Transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isGenerating" class="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-xl">
        <div class="max-w-md w-full px-8 text-center">
          <div class="relative mb-8 flex justify-center">
            <div class="absolute inset-0 animate-ping rounded-full bg-teal-400/20"></div>
            <div class="relative rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 p-6 shadow-2xl">
              <Icon name="heroicons:sparkles-20-solid" class="h-12 w-12 text-white animate-pulse" />
            </div>
          </div>
          
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            {{ locale === 'fr' ? 'Génération en cours' : 'Generating Trip' }}
          </h2>
          <p class="text-gray-600 mb-8 h-6 italic">
            {{ generationMessages[generationStep] }}
          </p>
          
          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
            <div 
              class="bg-gradient-to-r from-teal-500 to-cyan-500 h-full transition-all duration-700 ease-out"
              :style="{ width: ((generationStep + 1) / generationMessages.length) * 100 + '%' }"
            ></div>
          </div>
          
          <p class="text-xs text-gray-400 font-medium tracking-widest uppercase">
            {{ Math.round(((generationStep + 1) / generationMessages.length) * 100) }}% {{ locale === 'fr' ? 'terminé' : 'complete' }}
          </p>
        </div>
      </div>
    </Transition>

    <!-- Hero Section -->
    <section class="section relative z-10">
      <div class="mx-auto max-w-4xl text-center animate-fade-in">
        <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          {{ t.plan.hero.title }}
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
            {{ t.plan.hero.titleGradient || 'Adventure' }}
          </span>
        </h1>
        <p class="mt-4 text-xl text-gray-600">
          {{ t.plan.hero.subtitle }}
        </p>
      </div>
    </section>

    <!-- Form Section -->
    <section class="px-4 pb-16 sm:px-6 lg:px-8 relative z-10">
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
                <div class="relative">
                  <LocationInput
                    v-model="departure"
                    id="departure"
                    :placeholder="t.plan.form.departurePlaceholder"
                    inputClass="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>
              
              <div>
                <label for="destination" class="block text-sm font-semibold text-gray-900 mb-2">
                  <Icon name="heroicons:map-20-solid" class="inline h-5 w-5 text-cyan-500 mr-1" />
                  {{ t.plan.form.destination }}
                </label>
                <div class="space-y-3">
                  <div class="relative">
                    <LocationInput
                      v-model="currentDestination"
                      id="destination"
                      :placeholder="t.plan.form.destinationPlaceholder"
                      @place_changed="(place) => {
                        if (place && place.description) {
                           if (!destinations.includes(place.description)) {
                              destinations.push(place.description)
                           }
                           currentDestination = ''
                        }
                      }"
                      inputClass="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  
                  <!-- Selected Destinations Tags -->
                  <div class="flex flex-wrap gap-2 min-h-[32px]">
                    <TransitionGroup 
                      enter-active-class="transition duration-300 ease-out"
                      enter-from-class="opacity-0 scale-90"
                      enter-to-class="opacity-100 scale-100"
                      leave-active-class="transition duration-200 ease-in"
                      leave-from-class="opacity-100 scale-100"
                      leave-to-class="opacity-0 scale-90"
                    >
                      <div 
                        v-for="(dest, index) in destinations" 
                        :key="dest"
                        class="group flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700 border border-cyan-100 shadow-sm transition-all hover:bg-cyan-100 hover:border-cyan-200"
                      >
                         <span>{{ dest }}</span>
                         <button 
                            type="button" 
                            @click="destinations.splice(index, 1)"
                            class="ml-1 rounded-full p-0.5 text-cyan-400 hover:bg-cyan-200 hover:text-cyan-700 focus:outline-none"
                         >
                           <Icon name="heroicons:x-mark-20-solid" class="h-4 w-4" />
                         </button>
                      </div>
                    </TransitionGroup>
                    <span v-if="destinations.length === 0" class="text-xs text-gray-400 italic py-2">
                       {{ t.plan.form.noDestinations }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dates & Travelers -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  <Icon name="heroicons:calendar-20-solid" class="inline h-5 w-5 text-orange-500 mr-1" />
                  {{ t.plan.form.departureDate }} / {{ t.plan.form.returnDate }}
                </label>
                <div class="flex items-center gap-2">
                  <AppDatePicker
                    v-model="departureDate"
                    :min-date="new Date()"
                    :placeholder="t.plan.form.departureDate"
                  />
                  <Icon name="heroicons:arrow-right-20-solid" class="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <AppDatePicker
                    v-model="returnDate"
                    :min-date="departureDate"
                    :placeholder="t.plan.form.returnDate"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-900 mb-2">
                  <Icon name="heroicons:users-20-solid" class="inline h-5 w-5 text-purple-500 mr-1" />
                  {{ t.plan.form.travelers }}
                </label>
                <div class="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all duration-300 hover:border-teal-500/50">
                   <button 
                    type="button"
                    @click="travelers > 1 ? travelers-- : null"
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-teal-100 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="travelers <= 1"
                  >
                    <Icon name="heroicons:minus-20-solid" class="h-5 w-5" />
                  </button>
                  
                  <span class="text-lg font-bold text-gray-900 min-w-[2ch] text-center">{{ travelers }}</span>
                  
                  <button 
                    type="button"
                    @click="travelers < 20 ? travelers++ : null"
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-teal-100 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="travelers >= 20"
                  >
                    <Icon name="heroicons:plus-20-solid" class="h-5 w-5" />
                  </button>
                </div>
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
              class="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Icon name="heroicons:sparkles-20-solid" class="h-6 w-6" />
              {{ t.plan.form.generateButton }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
