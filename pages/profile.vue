<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
    <main class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold mb-2">
            <span class="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{{ t.profile.title }}</span>
          </h1>
          <p class="text-gray-600 text-lg">{{ t.profile.subtitle }}</p>
        </div>
        <button
          @click="handleLogout"
          class="px-4 py-2 rounded-xl border-2 border-red-200 bg-white text-red-600 font-medium hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Icon name="heroicons:arrow-right-on-rectangle-20-solid" class="h-5 w-5" />
          {{ t.nav.logout }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <Icon name="heroicons:arrow-path-20-solid" class="h-12 w-12 animate-spin text-teal-500" />
      </div>

      <!-- Profile Content -->
      <div v-else class="space-y-8">
        <!-- Personal Info Card -->
        <div class="card border-2 border-gray-100">
          <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Icon name="heroicons:user-20-solid" class="h-6 w-6 text-teal-600" />
            Informations Personnelles
          </h3>
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <ProfileAvatar 
                :avatar-url="profile?.avatar_url"
                :full-name="profile?.full_name"
                @update="handleAvatarUpdate"
              />
            </div>

            <!-- Basic Info Form -->
            <div class="flex-1 space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ t.profile.form.fullName }}
                </label>
                <input
                  v-model="formData.full_name"
                  type="text"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm"
                  :placeholder="t.profile.form.fullNamePlaceholder"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ t.profile.form.bio }}
                </label>
                <textarea
                  v-model="formData.bio"
                  rows="4"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none shadow-sm"
                  :placeholder="t.profile.form.bioPlaceholder"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t.profile.form.language }}
                  </label>
                  <select
                    v-model="formData.preferred_languages![0]"
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 font-semibold shadow-sm hover:border-teal-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all cursor-pointer appearance-none"
                    style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%236b7280%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3e%3c/svg%3e'); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25rem; padding-right: 2.5rem;"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    {{ t.profile.form.currency }}
                  </label>
                  <select
                    v-model="formData.currency_preference"
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 font-semibold shadow-sm hover:border-teal-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all cursor-pointer appearance-none"
                    style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27 fill=%27%236b7280%27%3e%3cpath fill-rule=%27evenodd%27 d=%27M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z%27 clip-rule=%27evenodd%27/%3e%3c/svg%3e'); background-position: right 0.75rem center; background-repeat: no-repeat; background-size: 1.25rem; padding-right: 2.5rem;"
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

        <!-- Travel Preferences -->
        <PreferencesForm 
          :preferences="formData.travel_preferences || {}"
          @update="handlePreferencesUpdate"
        />

        <!-- Dietary Restrictions -->
        <div class="card border-2 border-gray-100">
          <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="heroicons:heart-20-solid" class="h-6 w-6 text-amber-600" />
            {{ t.profile.dietary.title }}
          </h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="restriction in availableDietaryRestrictions"
              :key="restriction"
              @click="toggleDietaryRestriction(restriction)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all border-2 cursor-pointer',
                formData.dietary_restrictions?.includes(restriction)
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
              ]"
            >
              {{ (t.profile.dietary.options as any)[restriction] }}
            </button>
          </div>
        </div>

        <!-- Travel Statistics -->
        <TravelStats 
          :trips="trips"
          :created-at="user?.created_at || new Date().toISOString()"
        />

        <!-- Action Buttons -->
        <div class="flex justify-center gap-4 mt-8">
          <button
            @click="router.push('/dashboard')"
            class="px-8 py-3.5 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all cursor-pointer min-w-[140px]"
          >
            {{ t.common.cancel }}
          </button>
          <button
            @click="saveProfile"
            :disabled="saving"
            class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center gap-2 cursor-pointer min-w-[180px] justify-center"
          >
            <Icon 
              v-if="saving"
              name="heroicons:arrow-path-20-solid" 
              class="h-5 w-5 animate-spin"
            />
            <Icon 
              v-else
              name="heroicons:check-20-solid" 
              class="h-5 w-5"
            />
            {{ saving ? t.profile.saving : t.profile.save }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { UserProfile, UpdateProfilePayload } from '~/types/profile.types'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const { t } = useTranslations()

const loading = ref(true)
const saving = ref(false)
const profile = ref<UserProfile | null>(null)
const trips = ref<any[]>([])

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
  // Verify user is authenticated
  if (!user.value) {
    console.error('No user found in profile page')
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
    
    // Populate form
    formData.value = {
      full_name: data.full_name || '',
      bio: data.bio || '',
      travel_preferences: data.travel_preferences || formData.value.travel_preferences,
      dietary_restrictions: data.dietary_restrictions || [],
      preferred_languages: data.preferred_languages || ['en'],
      currency_preference: data.currency_preference || 'USD'
    }
  } catch (error: any) {
    console.error('Error loading profile:', error)
    
    // If unauthorized, redirect to login
    if (error?.status === 401 || error?.statusCode === 401) {
      alert('Session expirée. Veuillez vous reconnecter.')
      await supabase.auth.signOut()
      router.push('/auth/login')
    } else {
      alert('Erreur lors du chargement du profil. Veuillez réessayer.')
    }
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/')
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

    // Show success message
    alert(t.value.profile.saveSuccess)
    
    // Optionally redirect back to dashboard
    // router.push('/dashboard')
  } catch (error) {
    console.error('Error saving profile:', error)
    alert(t.value.profile.saveError)
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
