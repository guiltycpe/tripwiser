<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="glass rounded-2xl p-8 shadow-2xl animate-scale-in">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
            <Icon name="heroicons:user-plus-20-solid" class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900">{{ t.auth.signup.title }}</h1>
          <p class="text-gray-600 mt-2">{{ t.auth.signup.subtitle }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {{ t.auth.signup.success }}
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ error }}
        </div>

        <!-- Signup Form -->
        <form @submit.prevent="handleSignup" class="space-y-6">
          <!-- Full Name Field -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.auth.signup.fullName }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="heroicons:user-20-solid" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="fullName"
                v-model="fullName"
                type="text"
                required
                class="block w-full pl-10 pr-3 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                :placeholder="t.auth.signup.fullNamePlaceholder"
              />
            </div>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.auth.signup.email }}
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
                class="block w-full pl-10 pr-3 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                :placeholder="t.auth.signup.emailPlaceholder"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              {{ t.auth.signup.password }}
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
                minlength="6"
                class="block w-full pl-10 pr-3 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-gray-400"
                :placeholder="t.auth.signup.passwordPlaceholder"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">{{ t.auth.signup.passwordHint }}</p>
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="acceptedTerms"
              type="checkbox"
              required
              class="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label for="terms" class="ml-2 text-sm text-gray-600">
              {{ t.auth.signup.terms }}
              <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">{{ t.auth.signup.termsLink }}</a>
              {{ t.auth.signup.and }}
              <a href="#" class="text-purple-600 hover:text-purple-700 font-medium">{{ t.auth.signup.privacyLink }}</a>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || !acceptedTerms"
            class="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">{{ t.auth.signup.submit }}</span>
            <span v-else class="flex items-center justify-center">
              <Icon name="heroicons:arrow-path-20-solid" class="animate-spin h-5 w-5 mr-2" />
              {{ t.auth.signup.submitting }}
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

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-gray-600">
            {{ t.auth.signup.hasAccount }}
            <NuxtLink to="/auth/login" class="text-purple-600 hover:text-purple-700 font-semibold">
              {{ t.auth.signup.loginLink }}
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 text-sm flex items-center justify-center gap-2">
          <Icon name="heroicons:arrow-left-20-solid" class="h-4 w-4" />
          {{ t.auth.signup.backHome }}
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

const fullName = ref('')
const email = ref('')
const password = ref('')
const acceptedTerms = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

// Redirect if already logged in
watchEffect(() => {
  if (user.value) {
    router.push('/dashboard')
  }
})

async function handleSignup() {
  try {
    loading.value = true
    error.value = ''
    success.value = false

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: fullName.value,
        },
      },
    })

    if (signUpError) throw signUpError

    success.value = true
    
    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (err: any) {
    error.value = err.message || 'An error occurred during sign up'
  } finally {
    loading.value = false
  }
}
</script>
