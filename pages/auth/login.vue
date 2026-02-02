<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="glass rounded-2xl p-8 shadow-2xl animate-scale-in">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 mb-4">
            <Icon name="heroicons:lock-closed-20-solid" class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900">{{ t.auth.login.title }}</h1>
          <p class="text-gray-600 mt-2">{{ t.auth.login.subtitle }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ error }}
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.auth.login.email }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="heroicons:envelope-20-solid" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="block w-full pl-10 pr-3 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-gray-400"
                :placeholder="t.auth.login.emailPlaceholder"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.auth.login.password }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="heroicons:lock-closed-20-solid" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="block w-full pl-10 pr-3 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-gray-400"
                :placeholder="t.auth.login.passwordPlaceholder"
              />
            </div>
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center">
              <input type="checkbox" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              <span class="ml-2 text-gray-600">{{ t.auth.login.rememberMe }}</span>
            </label>
            <a href="#" class="text-teal-600 hover:text-teal-700 font-medium">{{ t.auth.login.forgotPassword }}</a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="btn-primary w-full hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">{{ t.auth.login.submit }}</span>
            <span v-else class="flex items-center justify-center">
              <Icon name="heroicons:arrow-path-20-solid" class="animate-spin h-5 w-5 mr-2" />
              {{ t.auth.login.submitting }}
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <!-- Sign Up Link -->
        <div class="text-center">
          <p class="text-gray-600">
            {{ t.auth.login.noAccount }}
            <NuxtLink to="/auth/signup" class="text-teal-600 hover:text-teal-700 font-semibold">
              {{ t.auth.login.signupLink }}
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 text-sm flex items-center justify-center gap-2">
          <Icon name="heroicons:arrow-left-20-solid" class="h-4 w-4" />
          {{ t.auth.login.backHome }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const { t } = useTranslations()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

// Redirect if already logged in
watchEffect(() => {
  if (user.value) {
    router.push('/dashboard')
  }
})

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (signInError) throw signInError

    // Success - redirect to dashboard
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'An error occurred during sign in'
  } finally {
    loading.value = false
  }
}
</script>
