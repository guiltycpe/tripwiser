<!-- components/GooglePlacesInput.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'

// --- Props & Emits pour le v-model ---
const props = defineProps<{
  modelValue: string, // La valeur de l'input (v-model)
  placeholder?: string
}>()
const emit = defineEmits(['update:modelValue', 'place_changed'])

// --- State interne du composant ---
const searchTerm = ref(props.modelValue) // Terme de recherche local
const predictions = ref<google.maps.places.AutocompletePrediction[]>([])
const loading = ref(false)
const debounceTimer = ref<NodeJS.Timeout | null>(null)

const isSelectionInProgress = ref(false)

watch(() => props.modelValue, (newValueFromParent) => {
  // Si la valeur du parent est différente de celle de notre input, on met à jour.
  // Cela synchronise le composant avec les changements externes (comme l'URL).
  if (newValueFromParent !== searchTerm.value) {
    searchTerm.value = newValueFromParent
  }
})

function handleInput(event: Event) {
  const inputValue = (event.target as HTMLInputElement).value
  // On met à jour nos refs manuellement
  searchTerm.value = inputValue
  emit('update:modelValue', inputValue)

  // On court-circuite la recherche si une sélection est en cours (utile si on retape juste après un clic)
  if (isSelectionInProgress.value) {
    isSelectionInProgress.value = false
    return
  }

  // On garde la logique de debounce et de recherche ici
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  if (!inputValue) {
    predictions.value = []
    return
  }
  debounceTimer.value = setTimeout(async () => {
    loading.value = true
    try {
      const data = await $fetch<any[]>(`/api/places`, { params: { input: inputValue } })
      // On s'assure de ne pas afficher la liste si l'utilisateur a déjà fait une sélection
      if (!isSelectionInProgress.value) {
        predictions.value = data
      }
    } catch (error) {
      console.error('Failed to fetch places from our API:', error)
      predictions.value = []
    } finally {
      loading.value = false
    }
  }, 300)
}

// --- Quand l'utilisateur sélectionne un lieu ---
function selectPlace(place: any) {
  isSelectionInProgress.value = true
  const mainText = place.structured_formatting?.main_text ?? place.description ?? ''
  searchTerm.value = mainText
  emit('update:modelValue', mainText) // On notifie aussi le parent !
  predictions.value = []
  emit('place_changed', place)
}

// Pour fermer la liste si on clique ailleurs
function closePredictions() {
  setTimeout(() => predictions.value = [], 100)
}
</script>

<template>
  <div class="relative w-full">
    <input
        :value="searchTerm"
        @input="handleInput"
        type="text"
        :placeholder="placeholder"
        class="w-full"
        autocomplete="off"
        @blur="closePredictions"
    />

    <!-- Liste des suggestions -->
    <div v-if="predictions.length > 0" class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg border">
      <ul>
        <li
            v-for="place in predictions"
            :key="place.place_id"
            @click="selectPlace(place)"
            class="cursor-pointer p-3 hover:bg-gray-100 text-left text-sm text-gray-800"
        >
          {{ place.description }}
        </li>
      </ul>
    </div>

    <!-- Indicateur de chargement (optionnel) -->
    <div v-if="loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
      <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </div>
</template>