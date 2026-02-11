<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
    <!-- Header -->
    <div class="mb-8 animate-fade-in">
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ t.profile.title }}</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ t.profile.subtitle }}</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <Icon name="heroicons:arrow-path-20-solid" class="h-8 w-8 animate-spin text-slate-400" />
    </div>

    <!-- Content -->
    <div v-else class="space-y-6 animate-fade-in">
      <!-- Tabs -->
      <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
          :class="activeTab === tab.id ? 'bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
        >
          <span class="flex items-center gap-2">
            <Icon :name="tab.icon" class="h-4 w-4" />
            {{ tab.label }}
          </span>
        </button>
      </div>

      <!-- Tab 1: Personal -->
      <div v-show="activeTab === 'personal'" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm dark:shadow-slate-900/50">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <ProfileAvatar
              :avatar-url="profile?.avatar_url"
              :full-name="profile?.full_name"
              @update="handleAvatarUpdate"
            />
          </div>

          <!-- Form -->
          <div class="flex-1 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{{ t.profile.form.fullName }}</label>
              <input
                v-model="formData.full_name"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                :placeholder="t.profile.form.fullNamePlaceholder"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{{ t.profile.form.bio }}</label>
              <textarea
                v-model="formData.bio"
                rows="3"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none hover:border-slate-300 dark:hover:border-slate-600"
                :placeholder="t.profile.form.bioPlaceholder"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{{ t.profile.form.language }}</label>
                <select
                  v-model="formData.preferred_languages![0]"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer appearance-none hover:border-slate-300 dark:hover:border-slate-600"
                  style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%2394a3b8%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3e%3c/svg%3e'); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25rem; padding-right: 2.5rem;"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{{ t.profile.form.currency }}</label>
                <select
                  v-model="formData.currency_preference"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer appearance-none hover:border-slate-300 dark:hover:border-slate-600"
                  style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%2394a3b8%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3e%3c/svg%3e'); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25rem; padding-right: 2.5rem;"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Preferences -->
      <div v-show="activeTab === 'preferences'">
        <PreferencesForm
          :preferences="formData.travel_preferences || {}"
          @update="handlePreferencesUpdate"
        />
      </div>

      <!-- Tab 3: Dietary -->
      <div v-show="activeTab === 'dietary'" class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm dark:shadow-slate-900/50">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Icon name="heroicons:heart-20-solid" class="h-5 w-5 text-amber-500" />
          {{ t.profile.dietary.title }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="restriction in availableDietaryRestrictions"
            :key="restriction"
            @click="toggleDietaryRestriction(restriction)"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-medium transition-all border cursor-pointer',
              formData.dietary_restrictions?.includes(restriction)
                ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
            ]"
          >
            {{ (t.profile.dietary.options as any)[restriction] }}
          </button>
        </div>
      </div>

      <!-- Tab 4: Stats -->
      <div v-show="activeTab === 'stats'">
        <TravelStats
          :trips="trips"
          :created-at="user?.created_at || new Date().toISOString()"
        />
      </div>

      <!-- Save Button -->
      <div class="flex justify-end pt-4">
        <button
          @click="saveProfile"
          :disabled="saving"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon
            v-if="saving"
            name="heroicons:arrow-path-20-solid"
            class="h-4 w-4 animate-spin"
          />
          <Icon
            v-else
            name="heroicons:check-20-solid"
            class="h-4 w-4"
          />
          {{ saving ? t.profile.saving : t.profile.save }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { UserProfile, UpdateProfilePayload } from '~/types/profile.types'

definePageMeta({
  layout: 'dashboard'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const { t, locale } = useTranslations()
const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const profile = ref<UserProfile | null>(null)
const trips = ref<any[]>([])
const activeTab = ref('personal')

const tabs = computed(() => [
  { id: 'personal', label: locale.value === 'fr' ? 'Personnel' : 'Personal', icon: 'heroicons:user-20-solid' },
  { id: 'preferences', label: locale.value === 'fr' ? 'Préférences' : 'Preferences', icon: 'heroicons:adjustments-horizontal-20-solid' },
  { id: 'dietary', label: locale.value === 'fr' ? 'Alimentaire' : 'Dietary', icon: 'heroicons:heart-20-solid' },
  { id: 'stats', label: locale.value === 'fr' ? 'Statistiques' : 'Stats', icon: 'heroicons:chart-bar-20-solid' }
])

const formData = ref<UpdateProfilePayload>({
  full_name: '',
  bio: '',
  travel_preferences: {
    budget_default: 'Medium',
    travel_style_default: 'adventure',
    preferred_pace: 'moderate',
    food_preferences: [],
    accessibility_needs: [],
    interests: [],
    avoid: []
  },
  dietary_restrictions: [],
  preferred_languages: ['en'],
  currency_preference: 'USD'
})

const availableDietaryRestrictions = ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'nut_allergy', 'halal', 'kosher']

onMounted(async () => {
  if (!user.value) {
    router.push('/auth/login')
    return
  }

  await loadProfile()
  await loadTrips()
})

async function loadProfile() {
  try {
    loading.value = true
    const data = await $fetch<UserProfile>('/api/profile')

    profile.value = data

    formData.value = {
      full_name: data.full_name || '',
      bio: data.bio || '',
      travel_preferences: data.travel_preferences || formData.value.travel_preferences,
      dietary_restrictions: data.dietary_restrictions || [],
      preferred_languages: data.preferred_languages || ['en'],
      currency_preference: data.currency_preference || 'USD'
    }
  } catch (error: any) {
    if (error?.status === 401 || error?.statusCode === 401) {
      toast.add({
        title: t.value.common.error,
        description: locale.value === 'fr' ? 'Session expirée. Veuillez vous reconnecter.' : 'Session expired. Please log in again.',
        color: 'error'
      })
      await supabase.auth.signOut()
      router.push('/auth/login')
    } else {
      toast.add({
        title: t.value.common.error,
        description: locale.value === 'fr' ? 'Erreur lors du chargement du profil.' : 'Failed to load profile.',
        color: 'error'
      })
    }
  } finally {
    loading.value = false
  }
}

async function loadTrips() {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      trips.value = data || []
    }
  } catch (error) {
    console.error('Error loading trips:', error)
  }
}

async function saveProfile() {
  try {
    saving.value = true

    await $fetch('/api/profile', {
      method: 'PUT',
      body: formData.value
    })

    toast.add({
      title: t.value.profile.saveSuccess,
      color: 'success'
    })
  } catch {
    toast.add({
      title: t.value.common.error,
      description: t.value.profile.saveError,
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

function handleAvatarUpdate(url: string) {
  if (profile.value) {
    profile.value.avatar_url = url
  }
}

function handlePreferencesUpdate(preferences: any) {
  formData.value.travel_preferences = preferences
}

function toggleDietaryRestriction(restriction: string) {
  if (!formData.value.dietary_restrictions) {
    formData.value.dietary_restrictions = []
  }

  const index = formData.value.dietary_restrictions.indexOf(restriction)
  if (index > -1) {
    formData.value.dietary_restrictions.splice(index, 1)
  } else {
    formData.value.dietary_restrictions.push(restriction)
  }
}
</script>
