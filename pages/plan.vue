<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LocationInput from '~/components/LocationInput.vue'

const route = useRoute()
const { t, locale } = useTranslations()

const departure = ref('')
const destination = ref('')
const departureDate = ref('07/07/25')
const returnDate = ref('21/07/25')
const budget = ref('High')
const takeRoadTrip = ref(true)
const travelStyle = ref('Confort')
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

// Utility to convert DD/MM/YY to YYYY-MM-DD
function parseDate(dateStr: string) {
  if (!dateStr) return null
  const [day, month, year] = dateStr.split('/')
  if (!day || !month || !year) return null
  // Assuming 20xx for year
  return `20${year}-${month}-${day}`
}

const generationStep = ref(0)
const generationMessages = computed(() => [
  t.value.plan.form.generating,
  locale.value === 'fr' ? 'Analyse des destinations...' : 'Analyzing destinations...',
  locale.value === 'fr' ? 'Calcul de l\'itinéraire optimal...' : 'Calculating optimal route...',
  locale.value === 'fr' ? 'Optimisation du budget ' + budget.value + '...' : `Optimizing for ${budget.value} budget...`,
  locale.value === 'fr' ? 'Recherche d\'activités ' + travelStyle.value + '...' : `Finding ${travelStyle.value} activities...`,
  locale.value === 'fr' ? 'Finalisation de votre voyage...' : 'Finalizing your trip...'
])

async function generateItinerary() {
  console.log('--- STARTING GENERATION ---')
  
  try {
    // 1. Force a fresh check of the user session (more reliable than the reactive value)
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError || !authData.user) {
      console.error('--- CRITICAL: AUTH FAILED ---', authError)
      alert(locale.value === 'fr' ? 'Session expiree. Veuillez vous reconnecter.' : 'Session expired. Please log in again.')
      return router.push('/auth/login')
    }

    const userId = authData.user.id
    if (!userId) {
       console.error('--- CRITICAL: USER ID IS NULL ---')
       alert('Internal Error: User ID could not be retrieved. Please try logging out and back in.')
       return
    }
    console.log('--- SESSION VALIDATED --- User:', userId)

    isGenerating.value = true
    generationStep.value = 0
    
    const stepInterval = setInterval(() => {
      if (generationStep.value < generationMessages.value.length - 1) {
        generationStep.value++
      }
    }, 1000)

    // 2. Call our AI Generation API
    const aiResponse = await $fetch('/api/generate-itinerary', {
      method: 'POST',
      body: {
        departure: departure.value,
        destination: destination.value,
        departure_date: parseDate(departureDate.value),
        return_date: parseDate(returnDate.value),
        budget: budget.value,
        travel_style: travelStyle.value,
        road_trip: takeRoadTrip.value
      }
    }) as any

    console.log('AI Response received. Preparing payload...')

    const payload = {
        user_id: userId,
        departure: departure.value,
        destination: destination.value,
        departure_date: parseDate(departureDate.value),
        return_date: parseDate(returnDate.value),
        budget: budget.value,
        travel_style: travelStyle.value,
        road_trip: takeRoadTrip.value,
        itinerary: aiResponse?.itinerary
    }

    console.log('Final Database Payload:', payload)

    // 3. Save to Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('trips')
      .insert(payload)
      .select()

    if (insertError) {
      console.error('SUPABASE INSERT ERROR:', insertError)
      // Special alert for this common error
      if (insertError.message.includes('not-null constraint')) {
        alert('Erreur Base de Données : L\'identifiant utilisateur (user_id) manque à l\'appel. Avez-vous bien ouvert votre session ?')
      } else {
        throw insertError
      }
      isGenerating.value = false
      clearInterval(stepInterval)
      return
    }

    console.log('Trip saved successfully:', insertData)
    
    setTimeout(() => {
      clearInterval(stepInterval)
      router.push('/dashboard')
    }, 1200)

  } catch (err: any) {
    console.error('GLOBAL PLAN ERROR:', err)
    alert('DEBUG ERROR: ' + (err.message || 'Unknown error'))
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
                <div class="relative">
                  <LocationInput
                    v-model="destination"
                    id="destination"
                    :placeholder="t.plan.form.destinationPlaceholder"
                    inputClass="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 transition-all duration-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
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
              class="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <Icon name="heroicons:sparkles-20-solid" class="h-6 w-6" />
              {{ t.plan.form.submit }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>
