<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div v-if="isOpen" class="fixed inset-y-0 right-0 z-[70] w-full md:w-[600px] lg:w-[700px] bg-white shadow-2xl flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white/20 rounded-lg">
              <Icon name="heroicons:calculator-20-solid" class="h-6 w-6" />
            </div>
            <div>
              <h2 class="text-2xl font-black">Budget Détaillé</h2>
              <p class="text-sm text-teal-100">Analyse complète des coûts</p>
            </div>
          </div>
          <button @click="$emit('close')" class="p-2 rounded-full hover:bg-white/20 transition-colors">
            <Icon name="heroicons:x-mark-20-solid" class="h-6 w-6" />
          </button>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p class="text-xs text-teal-100 mb-1">Total</p>
            <p class="text-xl font-black">${{ budgetAnalysis.total }}</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p class="text-xs text-teal-100 mb-1">Par personne</p>
            <p class="text-xl font-black">${{ budgetAnalysis.perPerson }}</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p class="text-xs text-teal-100 mb-1">Par jour</p>
            <p class="text-xl font-black">${{ budgetAnalysis.perDay }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Category Breakdown -->
        <div class="p-6 border-b border-gray-100 bg-gray-50">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon name="heroicons:chart-pie-20-solid" class="h-4 w-4 text-teal-600" />
            Répartition par Catégorie
          </h3>
          
          <div class="space-y-4">
            <!-- Hébergement -->
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-indigo-100 rounded-lg">
                    <Icon name="heroicons:home-modern-20-solid" class="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900">Hébergement</h4>
                    <p class="text-xs text-gray-500">{{ budgetAnalysis.accommodation.nights }} nuits</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-black text-gray-900">${{ budgetAnalysis.accommodation.total }}</p>
                  <p class="text-xs text-gray-500">${{ budgetAnalysis.accommodation.perNight }}/nuit</p>
                </div>
              </div>
              
              <!-- Accommodation Details -->
              <div class="space-y-2 mt-4 pt-4 border-t border-gray-100">
                <div v-for="(base, idx) in budgetAnalysis.accommodation.bases" :key="idx" class="flex justify-between items-center text-sm">
                  <div>
                    <p class="font-medium text-gray-700">{{ base.neighborhood }}</p>
                    <p class="text-xs text-gray-500">{{ base.nights }} nuits</p>
                  </div>
                  <p class="font-bold text-gray-900">${{ base.total }}</p>
                </div>
              </div>
            </div>

            <!-- Nourriture -->
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-teal-100 rounded-lg">
                    <Icon name="heroicons:cake-20-solid" class="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900">Nourriture & Boissons</h4>
                    <p class="text-xs text-gray-500">{{ budgetAnalysis.food.mealsCount }} repas estimés</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-black text-gray-900">${{ budgetAnalysis.food.total }}</p>
                  <p class="text-xs text-gray-500">${{ budgetAnalysis.food.perDay }}/jour</p>
                </div>
              </div>
            </div>

            <!-- Activités -->
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-orange-100 rounded-lg">
                    <Icon name="heroicons:ticket-20-solid" class="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900">Activités & Visites</h4>
                    <p class="text-xs text-gray-500">{{ budgetAnalysis.activities.count }} activités payantes</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-black text-gray-900">${{ budgetAnalysis.activities.total }}</p>
                  <p class="text-xs text-gray-500">${{ budgetAnalysis.activities.average }}/activité</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Breakdown -->
        <div class="p-6">
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Icon name="heroicons:calendar-days-20-solid" class="h-4 w-4 text-teal-600" />
            Détail par Jour
          </h3>

          <div class="space-y-3">
            <div 
              v-for="day in budgetAnalysis.dailyBreakdown" 
              :key="day.day"
              class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-teal-200 transition-colors"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="h-2 w-2 rounded-full bg-teal-500"></span>
                    <h4 class="font-bold text-gray-900">Jour {{ day.day }}</h4>
                  </div>
                  <p class="text-xs text-gray-500">{{ day.date }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xl font-black text-gray-900">${{ day.total }}</p>
                  <p class="text-xs text-gray-500">{{ day.activitiesCount }} activités</p>
                </div>
              </div>

              <!-- Activities List -->
              <div class="space-y-2 pl-4 border-l-2 border-gray-100">
                <div 
                  v-for="(activity, aIdx) in day.activities" 
                  :key="aIdx"
                  class="flex justify-between items-start text-sm"
                >
                  <div class="flex-1">
                    <p class="font-medium text-gray-700 line-clamp-1">{{ activity.name }}</p>
                    <p class="text-xs text-gray-500">{{ activity.type }}</p>
                  </div>
                  <p class="font-bold text-gray-900 ml-3">${{ activity.cost }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Budget Tips -->
        <div class="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-t border-amber-100">
          <div class="flex items-center gap-2 mb-3">
            <Icon name="heroicons:light-bulb-20-solid" class="h-5 w-5 text-amber-600" />
            <h3 class="text-sm font-bold text-gray-900">Conseils Budget</h3>
          </div>
          
          <div class="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-amber-100 mb-4">
            <p class="text-sm font-bold text-amber-900 mb-2">Budget recommandé avec marge (20%)</p>
            <p class="text-3xl font-black text-amber-700">${{ Math.round(budgetAnalysis.total * 1.2) }}</p>
            <p class="text-xs text-gray-600 mt-1">+${{ Math.round(budgetAnalysis.total * 0.2) }} de sécurité</p>
          </div>

          <ul class="space-y-2 text-xs text-gray-700">
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle-20-solid" class="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Ces coûts sont calculés à partir des activités réelles de votre itinéraire</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle-20-solid" class="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Les prix des hébergements sont basés sur les estimations fournies</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon name="heroicons:check-circle-20-solid" class="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Prévoyez une marge pour les achats spontanés et souvenirs</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isOpen: boolean
  tripData: any
  travelers: number
}

const props = defineProps<Props>()
defineEmits(['close'])

// Calculer l'analyse détaillée du budget à partir des vraies données
const budgetAnalysis = computed(() => {
  const data = props.tripData
  
  // Calcul des hébergements
  const accommodation = {
    total: data.trip_summary.cost_breakdown?.accommodation_total || 0,
    nights: data.trip_summary.duration_days,
    perNight: Math.round((data.trip_summary.cost_breakdown?.accommodation_total || 0) / data.trip_summary.duration_days),
    bases: data.accommodation_strategy?.bases?.map((base: any) => ({
      neighborhood: base.neighborhood,
      nights: base.nights,
      total: base.total_cost_usd || (base.estimated_cost_per_night_usd * base.nights)
    })) || []
  }

  // Calcul des activités réelles
  const allActivities: any[] = []
  data.itinerary_sections?.forEach((section: any) => {
    section.daily_plans?.forEach((day: any) => {
      day.activities?.forEach((activity: any) => {
        if (activity.estimated_cost_usd > 0) {
          allActivities.push({
            day: day.day,
            date: day.date,
            name: activity.name || activity.description,
            type: activity.activity_type,
            cost: activity.estimated_cost_usd
          })
        }
      })
    })
  })

  const activitiesTotal = allActivities.reduce((sum, act) => sum + act.cost, 0)
  
  // Calcul de la nourriture
  const foodTotal = data.trip_summary.cost_breakdown?.food_total || 0
  const mealsCount = data.trip_summary.duration_days * 3 // 3 repas/jour estimé

  // Breakdown par jour
  const dailyBreakdown = data.itinerary_sections?.flatMap((section: any) =>
    section.daily_plans?.map((day: any) => {
      const dayActivities = day.activities
        ?.filter((a: any) => a.estimated_cost_usd > 0)
        .map((a: any) => ({
          name: a.name || a.description,
          type: a.activity_type,
          cost: a.estimated_cost_usd
        })) || []
      
      const dayTotal = dayActivities.reduce((sum: number, a: any) => sum + a.cost, 0)

      return {
        day: day.day,
        date: day.date,
        title: day.title,
        activitiesCount: dayActivities.length,
        total: dayTotal,
        activities: dayActivities
      }
    })
  ) || []

  const total = accommodation.total + foodTotal + activitiesTotal

  return {
    total: Math.round(total),
    perPerson: Math.round(total / props.travelers),
    perDay: Math.round(total / data.trip_summary.duration_days),
    accommodation,
    food: {
      total: foodTotal,
      perDay: Math.round(foodTotal / data.trip_summary.duration_days),
      mealsCount
    },
    activities: {
      total: Math.round(activitiesTotal),
      count: allActivities.length,
      average: allActivities.length > 0 ? Math.round(activitiesTotal / allActivities.length) : 0
    },
    dailyBreakdown: dailyBreakdown.sort((a: any, b: any) => a.day - b.day)
  }
})
</script>

<style scoped>
/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #14b8a6;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #0d9488;
}
</style>
