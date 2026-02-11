<template>
  <div class="space-y-8">
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
        <Icon name="heroicons:cog-6-tooth-20-solid" class="h-5 w-5 text-teal-600" />
        {{ t.profile.preferences.title }}
      </h3>
      
      <div class="space-y-6">
        <!-- Default Budget -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ t.profile.preferences.defaultBudget }}
          </label>
          <select 
            v-model="localPreferences.budget_default"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer appearance-none"
            style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%236b7280%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3e%3c/svg%3e'); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25rem; padding-right: 2.5rem;"
          >
            <option value="Low">{{ t.plan.form.budgetOptions.budget }}</option>
            <option value="Medium">{{ t.plan.form.budgetOptions.moderate }}</option>
            <option value="High">{{ t.plan.form.budgetOptions.luxury }}</option>
          </select>
        </div>

        <!-- Default Travel Style -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ t.profile.preferences.defaultStyle }}
          </label>
          <select 
            v-model="localPreferences.travel_style_default"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer appearance-none"
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
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ t.profile.preferences.pace }}
          </label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="pace in (['slow', 'moderate', 'fast'] as const)"
              :key="pace"
              @click="localPreferences.preferred_pace = pace"
              :class="[
                'px-4 py-2.5 rounded-xl text-sm font-medium transition-all border cursor-pointer',
                localPreferences.preferred_pace === pace
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30'
              ]"
            >
              {{ (t.profile.preferences.paceOptions as any)[pace] }}
            </button>
          </div>
        </div>

        <!-- Interests -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ t.profile.preferences.interests }}
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="interest in availableInterests"
              :key="interest"
              @click="toggleArrayItem(localPreferences.interests, interest)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer',
                localPreferences.interests?.includes(interest)
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30'
              ]"
            >
              {{ (t.profile.preferences.interestOptions as any)[interest] }}
            </button>
          </div>
        </div>

        <!-- Food Preferences -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ t.profile.preferences.foodPreferences }}
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="pref in availableFoodPreferences"
              :key="pref"
              @click="toggleArrayItem(localPreferences.food_preferences, pref)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer',
                localPreferences.food_preferences?.includes(pref)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
              ]"
            >
              {{ (t.profile.preferences.foodOptions as any)[pref] }}
            </button>
          </div>
        </div>

        <!-- Things to Avoid -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {{ t.profile.preferences.avoid }}
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in availableAvoid"
              :key="item"
              @click="toggleArrayItem(localPreferences.avoid, item)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer',
                localPreferences.avoid?.includes(item)
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-900/30'
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
