<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 1. Initialiser la ref avec une chaîne vide au lieu de 'Paris'
const departureCity = ref('')
const departureInputRef = ref<HTMLInputElement | null>(null)
const router = useRouter()

// On utilise notre composable
useGooglePlaces(departureInputRef, (place) => {
  // Quand un lieu est sélectionné, on met à jour notre v-model
  if (place.name) {
    departureCity.value = place.name
  }
})

function startPlanning() {
  // 2. Déterminer la ville à envoyer.
  // Si l'utilisateur a tapé quelque chose (departureCity.value n'est pas vide), on l'utilise.
  // Sinon, on utilise 'Paris' comme valeur par défaut.
  const cityToSend = departureCity.value || 'Paris';

  // On navigue vers la page /plan en passant la ville déterminée
  router.push({ path: '/plan', query: { departure: cityToSend } })
}
</script>

<template>
  <div class="px-6 py-24 text-center">
    <h1 class="text-5xl font-bold tracking-tight text-gray-900">
      Plan your trip wisely
    </h1>

    <p class="mt-6 text-lg leading-8 text-gray-600">
      Discover places and activities, and <br>
      create smart itineraries for your travels
    </p>

    <form @submit.prevent="startPlanning" class="mx-auto mt-10 max-w-md">
      <div class="rounded-xl border bg-white p-6 shadow-sm">
        <p class="text-left font-semibold text-gray-900">Departure city</p>
        <div class="mt-2 flex items-center gap-4">
          <div class="relative flex-1">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
              </svg>
            </div>
            <!-- 3. Ajouter l'attribut placeholder -->
            <input
                v-model="departureCity"
                type="text"
                placeholder="Paris"
                class="w-full rounded-full border-gray-300 py-3 pl-10 pr-4 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-teal-500"
            />
          </div>
          <button type="submit" class="flex-shrink-0 rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-600">
            Start planning
          </button>
        </div>
      </div>
    </form>
  </div>
</template>