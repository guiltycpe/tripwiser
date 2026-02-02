<!-- components/LocationInput.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'

// --- Props & Emits pour le v-model ---
const props = defineProps<{
  modelValue: string,
  placeholder?: string,
  inputClass?: string
}>()
const emit = defineEmits(['update:modelValue', 'place_changed'])

// --- State interne du composant ---
const searchTerm = ref(props.modelValue)
const predictions = ref<any[]>([])
const loading = ref(false)
const debounceTimer = ref<NodeJS.Timeout | null>(null)

const isSelectionInProgress = ref(false)

watch(() => props.modelValue, (newValueFromParent) => {
  if (newValueFromParent !== searchTerm.value) {
    searchTerm.value = newValueFromParent
  }
})

function handleInput(event: Event) {
  const inputValue = (event.target as HTMLInputElement).value
  searchTerm.value = inputValue
  emit('update:modelValue', inputValue)

  if (isSelectionInProgress.value) {
    isSelectionInProgress.value = false
    return
  }

  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  if (!inputValue || inputValue.length < 2) {
    predictions.value = []
    return
  }
  debounceTimer.value = setTimeout(async () => {
    loading.value = true
    try {
      // Appel à notre API Photon locale
      const data = await $fetch<any[]>(`/api/places`, { params: { input: inputValue } })
      if (!isSelectionInProgress.value) {
        predictions.value = data
      }
    } catch (error) {
      console.error('Failed to fetch places:', error)
      predictions.value = []
    } finally {
      loading.value = false
    }
  }, 300)
}

function selectPlace(place: any) {
  isSelectionInProgress.value = true
  const mainText = place.description || ''
  searchTerm.value = mainText
  emit('update:modelValue', mainText)
  predictions.value = []
  emit('place_changed', place)
}

function closePredictions() {
  setTimeout(() => predictions.value = [], 200)
}
</script>

<template>
  <div class="relative w-full">
    <input
        :value="searchTerm"
        @input="handleInput"
        @blur="closePredictions"
        type="text"
        :placeholder="placeholder"
        :class="inputClass"
        class="w-full relative z-20 outline-none"
        autocomplete="off"
    />

    <!-- Liste des suggestions -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="predictions.length > 0" class="absolute left-0 right-0 top-full z-[100] mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur-md">
        <ul class="max-h-64 overflow-y-auto py-1">
          <li
              v-for="place in predictions"
              :key="place.place_id"
              @click="selectPlace(place)"
              class="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
          >
            <Icon name="heroicons:map-pin-20-solid" class="h-4 w-4 text-gray-400 group-hover:text-purple-500" />
            <span class="flex-1 font-medium">{{ place.description }}</span>
          </li>
        </ul>
      </div>
    </Transition>

    <!-- Indicateur de chargement -->
    <div v-if="loading" class="absolute inset-y-0 right-3 z-30 flex items-center">
      <div class="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
    </div>
  </div>
</template>