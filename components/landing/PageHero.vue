<template>
  <section class="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20 pb-16">
    <!-- Animated background -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-teal-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
      
      <!-- Animated gradient orbs -->
      <div class="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[100px] animate-orb-1" :class="orbColor1"></div>
      <div class="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full blur-[80px] animate-orb-2" :class="orbColor2"></div>

      <!-- Grid pattern -->
      <div class="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style="background-image: linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px); background-size: 60px 60px;"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
      <!-- Badge -->
      <div class="hero-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-white/5 border border-teal-200 dark:border-white/10 backdrop-blur-sm mb-8" style="--delay: 0s;">
        <Icon v-if="badgeIcon" :name="badgeIcon" class="h-4 w-4 text-teal-600 dark:text-teal-400" />
        <span class="text-sm font-medium text-teal-700 dark:text-teal-300/90">{{ badge }}</span>
      </div>

      <!-- Headline -->
      <h1 class="hero-reveal" style="--delay: 0.1s;">
        <span class="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[0.95]">
          {{ title }}
        </span>
        <span v-if="titleGradient" class="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mt-2 leading-[0.95] bg-clip-text text-transparent" :class="gradientClass">
          {{ titleGradient }}
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="hero-reveal mt-8 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light" style="--delay: 0.2s;">
        {{ subtitle }}
      </p>

      <!-- Optional slot for extra content (e.g., billing toggle) -->
      <div v-if="$slots.default" class="hero-reveal mt-10" style="--delay: 0.35s;">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  badge: string
  badgeIcon?: string
  title: string
  titleGradient?: string
  subtitle: string
  accentColor?: 'teal' | 'indigo' | 'amber'
}

const props = withDefaults(defineProps<Props>(), {
  accentColor: 'teal'
})

const colorMap = {
  teal: {
    gradient: 'bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-500 dark:from-teal-400 dark:via-cyan-400 dark:to-teal-300',
    orb1: 'bg-teal-400/20 dark:bg-teal-500/20',
    orb2: 'bg-cyan-400/15 dark:bg-cyan-500/15'
  },
  indigo: {
    gradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-300',
    orb1: 'bg-indigo-400/20 dark:bg-indigo-500/20',
    orb2: 'bg-purple-400/15 dark:bg-purple-500/15'
  },
  amber: {
    gradient: 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 dark:from-amber-400 dark:via-orange-400 dark:to-amber-300',
    orb1: 'bg-amber-400/20 dark:bg-amber-500/20',
    orb2: 'bg-orange-400/15 dark:bg-orange-500/15'
  }
}

const gradientClass = computed(() => colorMap[props.accentColor].gradient)
const orbColor1 = computed(() => colorMap[props.accentColor].orb1)
const orbColor2 = computed(() => colorMap[props.accentColor].orb2)
</script>

<style scoped>
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

.animate-orb-1 {
  animation: orbMove1 25s ease-in-out infinite;
}
.animate-orb-2 {
  animation: orbMove2 30s ease-in-out infinite;
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
</style>
