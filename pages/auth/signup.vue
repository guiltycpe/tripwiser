<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm animate-fade-in">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 mb-4">
            <Icon name="heroicons:user-plus-20-solid" class="w-7 h-7 text-teal-600" />
          </div>
          <h1 class="text-2xl font-semibold text-slate-900">{{ t.auth.signup.title }}</h1>
          <p class="text-slate-500 mt-2 text-sm">{{ t.auth.signup.subtitle }}</p>
        </div>

        <div v-if="success" class="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
          {{ t.auth.signup.success }}
        </div>

        <div v-if="error" class="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleSignup" class="space-y-5">
          <div>
            <label for="fullName" class="block text-sm font-medium text-slate-700 mb-1.5">{{ t.auth.signup.fullName }}</label>
            <input
              id="fullName" v-model="fullName" type="text" required
              class="block w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 hover:border-slate-300"
              :placeholder="t.auth.signup.fullNamePlaceholder"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">{{ t.auth.signup.email }}</label>
            <input
              id="email" v-model="email" type="email" required
              class="block w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 hover:border-slate-300"
              :placeholder="t.auth.signup.emailPlaceholder"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-1.5">{{ t.auth.signup.password }}</label>
            <input
              id="password" v-model="password" type="password" required minlength="6"
              class="block w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 hover:border-slate-300"
              :placeholder="t.auth.signup.passwordPlaceholder"
            />
            <p class="mt-1 text-xs text-slate-400">{{ t.auth.signup.passwordHint }}</p>
          </div>

          <div class="flex items-start">
            <input id="terms" v-model="acceptedTerms" type="checkbox" required class="mt-1 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
            <label for="terms" class="ml-2 text-sm text-slate-600">
              {{ t.auth.signup.terms }}
              <a href="#" class="text-teal-600 hover:text-teal-700 font-medium">{{ t.auth.signup.termsLink }}</a>
              {{ t.auth.signup.and }}
              <a href="#" class="text-teal-600 hover:text-teal-700 font-medium">{{ t.auth.signup.privacyLink }}</a>
            </label>
          </div>

          <button
            type="submit" :disabled="loading || !acceptedTerms"
            class="w-full py-2.5 px-4 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!loading">{{ t.auth.signup.submit }}</span>
            <span v-else class="flex items-center justify-center">
              <Icon name="heroicons:arrow-path-20-solid" class="animate-spin h-4 w-4 mr-2" />
              {{ t.auth.signup.submitting }}
            </span>
          </button>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
          <div class="relative flex justify-center text-sm"><span class="px-4 bg-white text-slate-400">Or</span></div>
        </div>

        <div class="text-center">
          <p class="text-sm text-slate-600">
            {{ t.auth.signup.hasAccount }}
            <NuxtLink to="/auth/login" class="text-teal-600 hover:text-teal-700 font-semibold">{{ t.auth.signup.loginLink }}</NuxtLink>
          </p>
        </div>
      </div>

      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-slate-500 hover:text-slate-900 text-sm flex items-center justify-center gap-2 transition-colors">
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

watchEffect(() => {
  if (user.value) router.push('/dashboard')
})

async function handleSignup() {
  try {
    loading.value = true
    error.value = ''
    success.value = false

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: { data: { full_name: fullName.value } },
    })

    if (signUpError) throw signUpError
    success.value = true
    setTimeout(() => { router.push('/dashboard') }, 1500)
  } catch (err: any) {
    error.value = err.message || 'An error occurred during sign up'
  } finally {
    loading.value = false
  }
}
</script>
