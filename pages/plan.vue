<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import LocationInput from '~/components/LocationInput.vue'
import type { UserProfile } from '~/types/profile.types'

definePageMeta({
  layout: 'dashboard'
})

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
const userProfile = ref<UserProfile | null>(null)
const toast = useToast()

// Wizard state
const currentStep = ref(1)
const totalSteps = 4

const wizardSteps = computed(() => [
  { num: 1, label: t.value.plan.wizard.step1, desc: t.value.plan.wizard.step1Desc, icon: 'heroicons:map-pin-20-solid' },
  { num: 2, label: t.value.plan.wizard.step2, desc: t.value.plan.wizard.step2Desc, icon: 'heroicons:calendar-20-solid' },
  { num: 3, label: t.value.plan.wizard.step3, desc: t.value.plan.wizard.step3Desc, icon: 'heroicons:adjustments-horizontal-20-solid' },
  { num: 4, label: t.value.plan.wizard.step4, desc: t.value.plan.wizard.step4Desc, icon: 'heroicons:check-circle-20-solid' }
])

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: return destinations.value.length > 0
    case 2: return !!departureDate.value && !!returnDate.value
    case 3: return true
    case 4: return true
    default: return false
  }
})

function nextStep() {
  if (currentStep.value < totalSteps && canProceed.value) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Re-trigger animation on step change
const stepKey = ref(0)
watch(currentStep, () => {
  stepKey.value++
  nextTick(() => {
    const el = document.querySelector('.wizard-step[style*="display: none"]')
    // Re-trigger animation on visible step
    document.querySelectorAll('.wizard-step').forEach((step) => {
      const htmlStep = step as HTMLElement
      if (htmlStep.style.display !== 'none') {
        htmlStep.style.animation = 'none'
        // Force reflow
        void htmlStep.offsetHeight
        htmlStep.style.animation = ''
      }
    })
  })
})

onMounted(async () => {
  if (route.query.departure) {
    departure.value = route.query.departure as string
  }

  await loadUserProfile()
})

async function loadUserProfile() {
  try {
    const profile = await $fetch<UserProfile>('/api/profile')
    userProfile.value = profile

    if (profile.travel_preferences) {
      if (profile.travel_preferences.budget_default) {
        budget.value = profile.travel_preferences.budget_default
      }
      if (profile.travel_preferences.travel_style_default) {
        travelStyle.value = profile.travel_preferences.travel_style_default
      }
    }
  } catch {
    // Profile not available — use default form values
  }
}

function parseDate(dateStr: string) {
  if (!dateStr) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr

  const parts = dateStr.split(/[-/]/)
  if (parts.length !== 3) return null

  const d = parts[0] || ''
  const m = parts[1] || ''
  let y = parts[2] || ''

  if (d.length === 4) return `${d}-${m.padStart(2, '0')}-${y.padStart(2, '0')}`
  if (y.length === 2) y = '20' + y

  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

// SSE streaming for real-time generation progress
const { state: streamState, startStream, abort: abortStream } = useItineraryStream()
const isFallbackMode = ref(false)

// Fallback: simulated progress (used when SSE fails)
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

const fallbackProgress = computed(() =>
  ((generationStep.value + 1) / generationMessages.value.length) * 100
)

onBeforeUnmount(() => {
  abortStream()
})

// Review helpers
const budgetLabel = computed(() => {
  const opts = t.value.plan.form.budgetOptions as any
  const map: Record<string, string> = { 'low': opts.budget, 'medium': opts.moderate, 'high': opts.luxury }
  return map[budget.value.toLowerCase()] || budget.value
})

const styleLabel = computed(() => {
  const opts = t.value.plan.form.styleOptions as any
  return opts[travelStyle.value] || travelStyle.value
})

const formattedDateRange = computed(() => {
  const localeStr = locale.value === 'fr' ? 'fr-FR' : 'en-US'
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const start = departureDate.value ? new Date(departureDate.value).toLocaleDateString(localeStr, opts) : '—'
  const end = returnDate.value ? new Date(returnDate.value).toLocaleDateString(localeStr, opts) : '—'
  return `${start} → ${end}`
})

async function generateItinerary() {
  try {
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser || !authUser.id) {
      toast.add({ title: t.value.common.error, description: locale.value === 'fr' ? 'Session invalide' : 'Session invalid', color: 'error' })
      return router.push('/auth/login')
    }

    if (destinations.value.length === 0) {
      toast.add({ title: t.value.plan.form.noDestinations, color: 'warning' })
      return
    }

    const currentUserId = authUser.id
    isGenerating.value = true
    isFallbackMode.value = false

    const requestBody = {
      departure: departure.value,
      destination: destinations.value.join(', '),
      departure_date: parseDate(departureDate.value) || departureDate.value,
      return_date: parseDate(returnDate.value) || returnDate.value,
      budget: budget.value,
      travel_style: travelStyle.value,
      road_trip: takeRoadTrip.value,
      travelers: travelers.value,
      user_preferences: userProfile.value ? {
        interests: userProfile.value.travel_preferences?.interests,
        food_preferences: userProfile.value.travel_preferences?.food_preferences,
        dietary_restrictions: userProfile.value.dietary_restrictions,
        avoid: userProfile.value.travel_preferences?.avoid,
        preferred_pace: userProfile.value.travel_preferences?.preferred_pace,
        accessibility_needs: userProfile.value.travel_preferences?.accessibility_needs
      } : undefined
    }

    let aiResponse: any

    // Try SSE stream first, fallback to regular fetch
    try {
      aiResponse = await startStream(requestBody)
    } catch (streamError) {
      console.warn('SSE stream failed, falling back to regular fetch:', streamError)
      isFallbackMode.value = true
      generationStep.value = 0

      const stepInterval = setInterval(() => {
        if (generationStep.value < generationMessages.value.length - 2) {
          generationStep.value++
        }
      }, 1500)

      try {
        aiResponse = await $fetch('/api/generate-itinerary', {
          method: 'POST',
          body: requestBody
        })
        clearInterval(stepInterval)
      } catch (fetchError) {
        clearInterval(stepInterval)
        throw fetchError
      }
    }

    let destinationImageUrl = null
    try {
      const mainDestination = destinations.value[0] || 'Travel'
      const imageResponse = await $fetch('/api/get-destination-image', {
        params: { destination: mainDestination }
      }) as any

      if (imageResponse?.url) {
        destinationImageUrl = imageResponse.url
      }
    } catch {
      // Continue without image
    }

    const payload = {
        user_id: currentUserId,
        departure: departure.value || 'Unknown',
        destination: destinations.value.join(', '),
        departure_date: parseDate(departureDate.value),
        return_date: parseDate(returnDate.value),
        budget: budget.value,
        travel_style: travelStyle.value,
        road_trip: takeRoadTrip.value,
        travelers: travelers.value,
        itinerary: aiResponse,
        destination_image_url: destinationImageUrl
    }

    const { data: insertedTrips, error: dbError } = await (supabase
      .from('trips' as any)
      .insert([payload] as any)
      .select('id') as any)

    if (dbError) {
      toast.add({
        title: t.value.common.error,
        description: locale.value === 'fr' ? 'Impossible de sauvegarder le voyage.' : 'Failed to save trip.',
        color: 'error'
      })
      isGenerating.value = false
      return
    }

    const newTripId = insertedTrips?.[0]?.id

    setTimeout(() => {
      router.push(newTripId ? `/trip/${newTripId}` : '/dashboard')
    }, 800)

  } catch (err: any) {
    toast.add({
      title: t.value.common.error,
      description: err?.statusMessage || err?.message || (locale.value === 'fr' ? 'Une erreur est survenue' : 'An error occurred'),
      color: 'error'
    })
    isGenerating.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
    <!-- Generation Loading Screen -->
    <GenerationLoadingScreen
      :visible="isGenerating"
      :destination="destinations.join(', ')"
      :overall-progress="isFallbackMode ? fallbackProgress : streamState.overallProgress"
      :phases="streamState.phases"
      :current-phase="streamState.currentPhase"
      :validated-places="streamState.validatedPlaces"
      :total-places="streamState.totalPlaces"
      :current-fact="streamState.currentFact"
      :is-fallback="isFallbackMode"
      :fallback-message="isFallbackMode ? generationMessages[generationStep] : undefined"
    />

    <!-- Header -->
    <div class="mb-8 animate-fade-in">
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {{ t.plan.hero.title }} <span class="text-teal-600">{{ t.plan.hero.titleGradient }}</span>
      </h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ t.plan.hero.subtitle }}</p>
    </div>

    <!-- Progress Steps -->
    <div class="mb-8">
      <div class="flex items-center gap-2">
        <template v-for="(step, idx) in wizardSteps" :key="step.num">
          <button
            @click="step.num < currentStep ? currentStep = step.num : null"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
            :class="[
              currentStep === step.num
                ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-700'
                : step.num < currentStep
                  ? 'text-teal-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800'
                  : 'text-slate-400 dark:text-slate-500'
            ]"
          >
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              :class="[
                step.num < currentStep
                  ? 'bg-teal-500 text-white'
                  : currentStep === step.num
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              ]"
            >
              <Icon v-if="step.num < currentStep" name="heroicons:check-20-solid" class="h-3.5 w-3.5" />
              <span v-else>{{ step.num }}</span>
            </div>
            <span class="hidden sm:inline">{{ step.label }}</span>
          </button>
          <div v-if="idx < wizardSteps.length - 1" class="flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
        </template>
      </div>
    </div>

    <!-- Wizard Card -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-8 shadow-sm dark:shadow-slate-900/50 animate-fade-in overflow-hidden">
      <!-- Step 1: Where -->
      <div v-show="currentStep === 1" class="wizard-step space-y-6">
        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {{ t.plan.form.departure }}
          </label>
          <LocationInput
            v-model="departure"
            :placeholder="t.plan.form.departurePlaceholder"
            inputClass="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 hover:border-slate-300 dark:hover:border-slate-600"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {{ t.plan.form.destination }}
          </label>
          <LocationInput
            v-model="currentDestination"
            :placeholder="t.plan.form.destinationPlaceholder"
            @place_changed="(place: any) => {
              if (place && place.description) {
                if (!destinations.includes(place.description)) {
                  destinations.push(place.description)
                }
                currentDestination = ''
              }
            }"
            inputClass="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-slate-100 text-sm transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 hover:border-slate-300 dark:hover:border-slate-600"
          />

          <!-- Selected destinations -->
          <div class="flex flex-wrap gap-2 mt-3 min-h-[32px]">
            <TransitionGroup
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-90"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-90"
            >
              <div
                v-for="(dest, index) in destinations"
                :key="dest"
                class="flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 border border-teal-100 transition-all hover:bg-teal-100"
              >
                <span>{{ dest }}</span>
                <button
                  type="button"
                  @click="destinations.splice(index, 1)"
                  class="rounded-full p-0.5 text-teal-400 hover:text-teal-700 focus:outline-none cursor-pointer"
                >
                  <Icon name="heroicons:x-mark-20-solid" class="h-3.5 w-3.5" />
                </button>
              </div>
            </TransitionGroup>
            <span v-if="destinations.length === 0" class="text-xs text-slate-400 py-2">
              {{ t.plan.form.noDestinations }}
            </span>
          </div>
        </div>
      </div>

      <!-- Step 2: When -->
      <div v-show="currentStep === 2" class="wizard-step space-y-6">
        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {{ t.plan.form.departureDate }}
          </label>
          <AppDatePicker
            v-model="departureDate"
            :min-date="new Date()"
            :placeholder="t.plan.form.departureDate"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {{ t.plan.form.returnDate }}
          </label>
          <AppDatePicker
            v-model="returnDate"
            :min-date="departureDate"
            :placeholder="t.plan.form.returnDate"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {{ t.plan.form.travelers }}
          </label>
          <div class="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 w-fit">
            <button
              type="button"
              @click="travelers > 1 ? travelers-- : null"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              :disabled="travelers <= 1"
            >
              <Icon name="heroicons:minus-20-solid" class="h-4 w-4" />
            </button>
            <span class="text-lg font-semibold text-slate-900 dark:text-slate-100 min-w-[2ch] text-center">{{ travelers }}</span>
            <button
              type="button"
              @click="travelers < 20 ? travelers++ : null"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              :disabled="travelers >= 20"
            >
              <Icon name="heroicons:plus-20-solid" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: How -->
      <div v-show="currentStep === 3" class="wizard-step space-y-6">
        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {{ t.plan.form.budget }}
          </label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="opt in [
                { value: 'Low', label: t.plan.form.budgetOptions.budget, icon: 'heroicons:banknotes-20-solid' },
                { value: 'Medium', label: t.plan.form.budgetOptions.moderate, icon: 'heroicons:credit-card-20-solid' },
                { value: 'High', label: t.plan.form.budgetOptions.luxury, icon: 'heroicons:sparkles-20-solid' }
              ]"
              :key="opt.value"
              type="button"
              @click="budget = opt.value"
              class="flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all cursor-pointer"
              :class="budget === opt.value
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'"
            >
              <Icon :name="opt.icon" class="h-5 w-5" />
              <span class="text-center text-xs">{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {{ t.plan.form.travelStyle }}
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="opt in [
                { value: 'adventure', label: t.plan.form.styleOptions.adventure, icon: 'heroicons:fire-20-solid' },
                { value: 'relaxation', label: t.plan.form.styleOptions.relaxation, icon: 'heroicons:sun-20-solid' },
                { value: 'culture', label: t.plan.form.styleOptions.culture, icon: 'heroicons:building-library-20-solid' },
                { value: 'food', label: t.plan.form.styleOptions.food, icon: 'heroicons:cake-20-solid' },
                { value: 'nature', label: t.plan.form.styleOptions.nature, icon: 'heroicons:globe-americas-20-solid' }
              ]"
              :key="opt.value"
              type="button"
              @click="travelStyle = opt.value"
              class="flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer"
              :class="travelStyle === opt.value
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'"
            >
              <Icon :name="opt.icon" class="h-4 w-4" />
              <span>{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div class="flex items-center gap-3">
            <Icon name="heroicons:truck-20-solid" class="h-5 w-5 text-teal-500" />
            <span class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ t.plan.form.roadTrip }}</span>
          </div>
          <label for="roadtrip-toggle" class="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" v-model="takeRoadTrip" id="roadtrip-toggle" class="peer sr-only">
            <div class="peer h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-500 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500/20"></div>
          </label>
        </div>
      </div>

      <!-- Step 4: Review -->
      <div v-show="currentStep === 4" class="wizard-step space-y-6">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ t.plan.wizard.reviewTitle }}</h3>

        <div class="space-y-4">
          <!-- From -->
          <div class="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <Icon name="heroicons:map-pin-20-solid" class="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ t.plan.wizard.reviewFrom }}</p>
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{{ departure || '—' }}</p>
            </div>
          </div>

          <!-- To -->
          <div class="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
            <Icon name="heroicons:map-20-solid" class="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ t.plan.wizard.reviewTo }}</p>
              <div class="flex flex-wrap gap-1.5 mt-1">
                <span
                  v-for="dest in destinations"
                  :key="dest"
                  class="inline-flex px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-medium border border-teal-100"
                >{{ dest }}</span>
              </div>
            </div>
          </div>

          <!-- Dates + Travelers -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <Icon name="heroicons:calendar-20-solid" class="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ t.plan.wizard.reviewDates }}</p>
                <p class="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{{ formattedDateRange }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <Icon name="heroicons:users-20-solid" class="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ t.plan.wizard.reviewTravelers }}</p>
                <p class="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{{ travelers }}</p>
              </div>
            </div>
          </div>

          <!-- Budget + Style + Road Trip -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <Icon name="heroicons:banknotes-20-solid" class="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ t.plan.wizard.reviewBudget }}</p>
                <p class="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{{ budgetLabel }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <Icon name="heroicons:star-20-solid" class="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ t.plan.wizard.reviewStyle }}</p>
                <p class="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{{ styleLabel }}</p>
              </div>
            </div>
            <div class="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
              <Icon name="heroicons:truck-20-solid" class="h-5 w-5 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{{ t.plan.wizard.reviewRoadTrip }}</p>
                <p class="text-sm font-medium text-slate-900 dark:text-slate-100 mt-0.5">{{ takeRoadTrip ? t.plan.wizard.reviewYes : t.plan.wizard.reviewNo }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
        <button
          v-if="currentStep > 1"
          @click="prevStep"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Icon name="heroicons:arrow-left-20-solid" class="h-4 w-4" />
          {{ t.plan.wizard.back }}
        </button>
        <div v-else></div>

        <button
          v-if="currentStep < totalSteps"
          @click="nextStep"
          :disabled="!canProceed"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition-colors shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {{ t.plan.wizard.next }}
          <Icon name="heroicons:arrow-right-20-solid" class="h-4 w-4" />
        </button>
        <button
          v-else
          @click="generateItinerary"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition-colors shadow-sm cursor-pointer"
        >
          <Icon name="heroicons:sparkles-20-solid" class="h-4 w-4" />
          {{ t.plan.wizard.generate }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wizard-step {
  animation: wizardFadeIn 0.2s ease-out;
}

@keyframes wizardFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
