<template>
  <div class="space-y-8">
    <div class="card border-2 border-gray-100">
      <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Icon name="heroicons:cog-6-tooth-20-solid" class="h-6 w-6 text-teal-600" />
        {{ t.profile.preferences.title }}
      </h3>
      
      <div class="space-y-6">
        <!-- Default Budget -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t.profile.preferences.defaultBudget }}
          </label>
          <select 
            v-model="localPreferences.budget_default"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 font-semibold shadow-sm hover:border-teal-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all cursor-pointer appearance-none"
            style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%236b7280%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3e%3c/svg%3e'); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25rem; padding-right: 2.5rem;"
          >
            <option value="Low">{{ t.plan.form.budgetOptions.budget }}</option>
            <option value="Medium">{{ t.plan.form.budgetOptions.moderate }}</option>
            <option value="High">{{ t.plan.form.budgetOptions.luxury }}</option>
          </select>
        </div>

        <!-- Default Travel Style -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t.profile.preferences.defaultStyle }}
          </label>
          <select 
            v-model="localPreferences.travel_style_default"
            class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 font-semibold shadow-sm hover:border-teal-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all cursor-pointer appearance-none"
            style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%236b7280%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3e%3c/svg%3e'); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25rem; padding-right: 2.5rem;"
          >
            <option value="adventure">{{ t.plan.form.styleOptions.adventure }}</option>
            <option value="relaxation">{{ t.plan.form.styleOptions.relaxation }}</option>
            <option value="cultural">{{ (t.plan.form.styleOptions as any).culture || 'Culture' }}</option>
            <option value="foodie">{{ (t.plan.form.styleOptions as any).food || 'Foodie' }}</option>
            <option value="nature">{{ t.plan.form.styleOptions.nature }}</option>
            <option value="urban">Urban</option>
          </select>
        </div>

        <!-- Preferred Pace -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t.profile.preferences.pace }}
          </label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="pace in (['slow', 'moderate', 'fast'] as const)"
              :key="pace"
              @click="localPreferences.preferred_pace = pace"
              :class="[
                'px-4 py-3 rounded-xl font-medium transition-all border-2 cursor-pointer',
                localPreferences.preferred_pace === pace
                  ? 'bg-teal-500 text-white border-teal-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300 hover:bg-teal-50'
              ]"
            >
              {{ (t.profile.preferences.paceOptions as any)[pace] }}
            </button>
          </div>
        </div>

        <!-- Interests -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t.profile.preferences.interests }}
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="interest in availableInterests"
              :key="interest"
              @click="toggleArrayItem(localPreferences.interests, interest)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all border-2 cursor-pointer',
                localPreferences.interests?.includes(interest)
                  ? 'bg-teal-500 text-white border-teal-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300 hover:bg-teal-50'
              ]"
            >
              {{ (t.profile.preferences.interestOptions as any)[interest] }}
            </button>
          </div>
        </div>

        <!-- Food Preferences -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t.profile.preferences.foodPreferences }}
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="pref in availableFoodPreferences"
              :key="pref"
              @click="toggleArrayItem(localPreferences.food_preferences, pref)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all border-2 cursor-pointer',
                localPreferences.food_preferences?.includes(pref)
                  ? 'bg-blue-500 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              ]"
            >
              {{ (t.profile.preferences.foodOptions as any)[pref] }}
            </button>
          </div>
        </div>

        <!-- Things to Avoid -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t.profile.preferences.avoid }}
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in availableAvoid"
              :key="item"
              @click="toggleArrayItem(localPreferences.avoid, item)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all border-2 cursor-pointer',
                localPreferences.avoid?.includes(item)
                  ? 'bg-red-500 text-white border-red-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50'
              ]"
            >
              {{ (t.profile.preferences.avoidOptions as any)[item] }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TravelPreferences } from '~/types/profile.types'

const props = defineProps<{
  preferences: TravelPreferences
}>()

const emit = defineEmits<{
  (e: 'update', preferences: TravelPreferences): void
}>()

const { t } = useTranslations()

const localPreferences = ref<TravelPreferences>({
  budget_default: props.preferences.budget_default || 'Medium',
  travel_style_default: props.preferences.travel_style_default || 'adventure',
  preferred_pace: props.preferences.preferred_pace || 'moderate',
  food_preferences: props.preferences.food_preferences || [],
  accessibility_needs: props.preferences.accessibility_needs || [],
  interests: props.preferences.interests || [],
  avoid: props.preferences.avoid || []
})

const availableInterests = ['history', 'nature', 'food', 'art', 'shopping', 'nightlife', 'sports', 'photography']
const availableFoodPreferences = ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten_free', 'local_cuisine', 'street_food']
const availableAvoid = ['extreme_sports', 'heights', 'water_activities', 'crowded_places', 'long_walks', 'early_mornings', 'late_nights']

function toggleArrayItem(arr: string[] | undefined, item: string) {
  if (!arr) {
    // Initialize the array in localPreferences based on which field we're toggling
    if (localPreferences.value.interests?.includes(item) === undefined) {
      localPreferences.value.interests = [item]
    } else if (localPreferences.value.food_preferences?.includes(item) === undefined) {
      localPreferences.value.food_preferences = [item]
    } else if (localPreferences.value.avoid?.includes(item) === undefined) {
      localPreferences.value.avoid = [item]
    }
    return
  }
  
  const index = arr.indexOf(item)
  if (index > -1) {
    arr.splice(index, 1)
  } else {
    arr.push(item)
  }
}

// Emit changes when preferences change
watch(localPreferences, (newVal) => {
  emit('update', newVal)
}, { deep: true })
</script>
