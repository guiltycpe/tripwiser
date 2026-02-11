<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-800 px-4 py-12">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm animate-fade-in">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/30 mb-4">
            <Icon name="heroicons:lock-closed-20-solid" class="w-7 h-7 text-teal-600" />
          </div>
          <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ t.auth.login.title }}</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm">{{ t.auth.login.subtitle }}</p>
        </div>

        <div v-if="error" class="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{{ t.auth.login.email }}</label>
            <input
              id="email" v-model="email" type="email" required
              class="block w-full px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600"
              :placeholder="t.auth.login.emailPlaceholder"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{{ t.auth.login.password }}</label>
            <input
              id="password" v-model="password" type="password" required
              class="block w-full px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-slate-300 dark:hover:border-slate-600"
              :placeholder="t.auth.login.passwordPlaceholder"
            />
          </div>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center">
              <input type="checkbox" class="rounded border-slate-300 dark:border-slate-600 text-teal-600 focus:ring-teal-500" />
              <span class="ml-2 text-slate-600 dark:text-slate-400">{{ t.auth.login.rememberMe }}</span>
            </label>
            <a href="#" class="text-teal-600 hover:text-teal-700 font-medium">{{ t.auth.login.forgotPassword }}</a>
          </div>

          <button
            type="submit" :disabled="loading"
            class="w-full py-2.5 px-4 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span v-if="!loading">{{ t.auth.login.submit }}</span>
            <span v-else class="flex items-center justify-center">
              <Icon name="heroicons:arrow-path-20-solid" class="animate-spin h-4 w-4 mr-2" />
              {{ t.auth.login.submitting }}
            </span>
          </button>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
          <div class="relative flex justify-center text-sm"><span class="px-4 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500">Or</span></div>
        </div>

        <div class="text-center">
          <p class="text-sm text-slate-600 dark:text-slate-400">
            {{ t.auth.login.noAccount }}
            <NuxtLink to="/auth/signup" class="text-teal-600 hover:text-teal-700 font-semibold">{{ t.auth.login.signupLink }}</NuxtLink>
          </p>
        </div>
      </div>

      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-sm flex items-center justify-center gap-2 transition-colors">
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

watchEffect(() => {
  if (user.value) router.push('/dashboard')
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
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'An error occurred during sign in'
  } finally {
    loading.value = false
  }
}
</script>
