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

const { public: { googlePlacesApiKey } } = useRuntimeConfig()

// --- Logique d'autocomplétion ---
watch(searchTerm, (newVal) => {
  emit('update:modelValue', newVal)

  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  if (!newVal) {
    predictions.value = []
    return
  }

  debounceTimer.value = setTimeout(async () => {
    loading.value = true
    try {
      // ===== MODIFICATION PRINCIPALE ICI =====
      // On appelle notre propre API, pas celle de Google directement.
      const data = await $fetch<google.maps.places.AutocompletePrediction[]>(`/api/places`, {
        // On passe le terme de recherche en paramètre
        params: { input: newVal }
      })

      predictions.value = data
      // =======================================

    } catch (error) {
      console.error('Failed to fetch places from our API:', error)
      predictions.value = []
    } finally {
      loading.value = false
    }
  }, 300)
})

// --- Quand l'utilisateur sélectionne un lieu ---
function selectPlace(place: google.maps.places.AutocompletePrediction) {
  // On met à jour l'input avec la description principale du lieu
  const mainText = place.structured_formatting?.main_text ?? place.description ?? '';
  searchTerm.value = mainText;

  // On vide la liste des prédictions
  predictions.value = []

  // On notifie le parent du lieu sélectionné (si besoin de plus de détails)
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
        v-model="searchTerm"
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