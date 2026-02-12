<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Animated background with gradient mesh -->
    <div class="absolute inset-0 z-0">
      <!-- Base gradient — light & dark -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
      
      <!-- Animated gradient orbs -->
      <div class="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-teal-400/20 dark:bg-teal-500/20 blur-[120px] animate-orb-1"></div>
      <div class="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-400/15 dark:bg-cyan-500/15 blur-[100px] animate-orb-2"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-400/10 dark:bg-indigo-500/10 blur-[80px] animate-orb-3"></div>
      
      <!-- Subtle grid pattern overlay -->
      <div class="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style="background-image: linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px); background-size: 60px 60px;"></div>

      <!-- Destination images floating subtly -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="hero-floating-image absolute top-[10%] left-[5%] w-64 h-40 rounded-2xl overflow-hidden opacity-30 dark:opacity-20 rotate-[-6deg] shadow-2xl" style="animation-delay: 0s;">
          <img src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=260&fit=crop" alt="" class="w-full h-full object-cover" loading="eager" />
        </div>
        <div class="hero-floating-image absolute top-[15%] right-[8%] w-56 h-36 rounded-2xl overflow-hidden opacity-25 dark:opacity-15 rotate-[4deg] shadow-2xl" style="animation-delay: 1s;">
          <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=260&fit=crop" alt="" class="w-full h-full object-cover" loading="eager" />
        </div>
        <div class="hero-floating-image absolute bottom-[15%] left-[10%] w-48 h-32 rounded-2xl overflow-hidden opacity-25 dark:opacity-15 rotate-[3deg] shadow-2xl" style="animation-delay: 2s;">
          <img src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=260&fit=crop" alt="" class="w-full h-full object-cover" loading="eager" />
        </div>
        <div class="hero-floating-image absolute bottom-[20%] right-[5%] w-52 h-34 rounded-2xl overflow-hidden opacity-30 dark:opacity-20 rotate-[-5deg] shadow-2xl" style="animation-delay: 0.5s;">
          <img src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=260&fit=crop" alt="" class="w-full h-full object-cover" loading="eager" />
        </div>
      </div>
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
      
      <!-- Badge -->
      <div class="hero-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-white/5 border border-teal-200 dark:border-white/10 backdrop-blur-sm mb-8" style="--delay: 0s;">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 dark:bg-teal-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-teal-500 dark:bg-teal-400"></span>
        </span>
        <span class="text-sm font-medium text-teal-700 dark:text-teal-300/90">{{ t.home.hero.badge }}</span>
      </div>

      <!-- Main Headline -->
      <h1 class="hero-reveal" style="--delay: 0.1s;">
        <span class="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white leading-[0.95]">
          {{ t.home.hero.title }}
        </span>
        <span class="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mt-2 leading-[0.95] bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500 dark:from-teal-400 dark:via-cyan-400 dark:to-teal-300 bg-clip-text text-transparent">
          {{ t.home.hero.titleGradient }}
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="hero-reveal mt-8 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light" style="--delay: 0.2s;">
        {{ t.home.hero.subtitle }}
      </p>

      <!-- Search + CTA -->
      <div class="hero-reveal mt-12 max-w-2xl mx-auto" style="--delay: 0.35s;">
        <form @submit.prevent="$emit('start-planning', departureCity)" class="relative">
          <div class="glass-hero rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
            <div class="relative flex-1">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 z-10">
                <Icon name="heroicons:map-pin-20-solid" class="h-5 w-5 text-teal-500 dark:text-teal-400" />
              </div>
              <LocationInput
                v-model="departureCity"
                :placeholder="t.home.hero.searchPlaceholder"
                inputClass="w-full rounded-xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-4 pl-12 pr-4 text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 focus:bg-white dark:focus:bg-white/10 hover:border-slate-300 dark:hover:border-white/20"
              />
            </div>
            <button
              type="submit"
              class="flex-shrink-0 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:from-teal-400 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
            >
              <span class="flex items-center gap-2">
                {{ t.home.hero.startButton }}
                <Icon name="heroicons:arrow-right-20-solid" class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>
        </form>

        <!-- Trust line -->
        <p class="mt-6 text-xs text-slate-500 dark:text-slate-500 flex items-center justify-center gap-3">
          <span class="flex items-center gap-1">
            <Icon name="heroicons:check-circle-20-solid" class="h-3.5 w-3.5 text-teal-500" />
            {{ t.home.hero.trustFree }}
          </span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span class="flex items-center gap-1">
            <Icon name="heroicons:check-circle-20-solid" class="h-3.5 w-3.5 text-teal-500" />
            {{ t.home.hero.trustAi }}
          </span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span class="flex items-center gap-1">
            <Icon name="heroicons:check-circle-20-solid" class="h-3.5 w-3.5 text-teal-500" />
            {{ t.home.hero.trustFast }}
          </span>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LocationInput from '~/components/LocationInput.vue'

defineEmits<{
  'start-planning': [city: string]
}>()

const { t } = useTranslations()
const departureCity = ref('')
</script>

<style scoped>
.glass-hero {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

:global(html.dark) .glass-hero {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Reveal animations */
.hero-reveal {
  opacity: 0;
  transform: translateY(30px);
  animation: heroReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes heroReveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Floating images */
.hero-floating-image {
  animation: heroFloat 20s ease-in-out infinite;
  animation-delay: var(--delay, 0s);
}

@keyframes heroFloat {
  0%, 100% { transform: translateY(0) rotate(var(--tw-rotate, 0deg)); }
  50% { transform: translateY(-20px) rotate(var(--tw-rotate, 0deg)); }
}

/* Gradient orbs */
.animate-orb-1 {
  animation: orbMove1 25s ease-in-out infinite;
}
.animate-orb-2 {
  animation: orbMove2 30s ease-in-out infinite;
}
.animate-orb-3 {
  animation: orbMove3 20s ease-in-out infinite;
}

@keyframes orbMove1 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(80px, -50px); }
  66% { transform: translate(-30px, 40px); }
}

@keyframes orbMove2 {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(-60px, 30px); }
  66% { transform: translate(40px, -60px); }
}

@keyframes orbMove3 {
  0%, 100% { transform: translate(-50%, -50%); }
  33% { transform: translate(calc(-50% + 40px), calc(-50% - 30px)); }
  66% { transform: translate(calc(-50% - 20px), calc(-50% + 50px)); }
}

</style>
