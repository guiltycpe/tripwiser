<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'

const { t } = useTranslations()

const { elementRef: missionRef, isVisible: missionVisible } = useScrollReveal({ threshold: 0.2 })
const { elementRef: storyRef, isVisible: storyVisible } = useScrollReveal({ threshold: 0.1 })
const { elementRef: statsRef, isVisible: statsVisible } = useScrollReveal({ threshold: 0.2 })
const { elementRef: valuesRef, isVisible: valuesVisible } = useScrollReveal({ threshold: 0.1 })
const { elementRef: teamRef, isVisible: teamVisible } = useScrollReveal({ threshold: 0.1 })

// Animated counters
const usersCount = ref(0)
const tripsCount = ref(0)
const countriesCount = ref(0)
let frames: number[] = []

function animateValue(target: number, duration: number, setter: (v: number) => void) {
  const startTime = performance.now()
  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    setter(Math.round(eased * target))
    if (progress < 1) frames.push(requestAnimationFrame(step))
  }
  frames.push(requestAnimationFrame(step))
}

watch(statsVisible, (visible) => {
  if (visible) {
    animateValue(10000, 2000, v => usersCount.value = v)
    animateValue(50000, 2500, v => tripsCount.value = v)
    animateValue(150, 1500, v => countriesCount.value = v)
  }
})

onUnmounted(() => { frames.forEach(f => cancelAnimationFrame(f)) })

const formatNum = (n: number) => n >= 1000 ? new Intl.NumberFormat().format(n) : String(n)

const values = computed(() => [
  { icon: 'heroicons:sparkles-20-solid', color: 'teal', title: t.value.about.values.innovation, desc: t.value.about.values.innovation_desc },
  { icon: 'heroicons:heart-20-solid', color: 'indigo', title: t.value.about.values.quality, desc: t.value.about.values.quality_desc },
  { icon: 'heroicons:user-group-20-solid', color: 'amber', title: t.value.about.values.community, desc: t.value.about.values.community_desc },
  { icon: 'heroicons:globe-alt-20-solid', color: 'cyan', title: t.value.about.values.accessibility, desc: t.value.about.values.accessibility_desc }
])

const colorClasses: Record<string, { iconBg: string; icon: string; glow: string }> = {
  teal: { iconBg: 'bg-teal-50 dark:bg-teal-900/20', icon: 'text-teal-600 dark:text-teal-400', glow: 'bg-teal-500/10' },
  indigo: { iconBg: 'bg-indigo-50 dark:bg-indigo-900/20', icon: 'text-indigo-600 dark:text-indigo-400', glow: 'bg-indigo-500/10' },
  amber: { iconBg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-600 dark:text-amber-400', glow: 'bg-amber-500/10' },
  cyan: { iconBg: 'bg-cyan-50 dark:bg-cyan-900/20', icon: 'text-cyan-600 dark:text-cyan-400', glow: 'bg-cyan-500/10' }
}

const teams = computed(() => [
  { icon: 'heroicons:rocket-launch-20-solid', color: 'from-teal-500 to-cyan-500', shadow: 'shadow-teal-500/20', title: t.value.about.team.founding, desc: t.value.about.team.founding_desc },
  { icon: 'heroicons:paint-brush-20-solid', color: 'from-indigo-500 to-purple-500', shadow: 'shadow-indigo-500/20', title: t.value.about.team.design, desc: t.value.about.team.design_desc },
  { icon: 'heroicons:chat-bubble-left-right-20-solid', color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20', title: t.value.about.team.support, desc: t.value.about.team.support_desc }
])
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <LandingPageHero
      :badge="t.about.badge"
      badge-icon="heroicons:heart-20-solid"
      :title="t.about.hero.title"
      :title-gradient="t.about.hero.titleGradient"
      :subtitle="t.about.hero.subtitle"
      accent-color="amber"
    />

    <!-- Mission -->
    <section class="relative py-24 overflow-hidden bg-white dark:bg-slate-900">
      <div class="absolute top-1/2 left-0 w-[400px] h-[400px] bg-teal-400/10 dark:bg-teal-500/8 rounded-full blur-[100px]"></div>

      <div ref="missionRef" class="relative max-w-4xl mx-auto px-6 text-center">
        <div :class="['transition-all duration-700', missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
          <span class="inline-block px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-widest mb-6 border border-teal-100 dark:border-teal-800">
            {{ t.about.mission.badge }}
          </span>
          <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ t.about.mission.title }}
          </h2>
          <p class="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
            {{ t.about.mission.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Story + Stats -->
    <section class="relative py-24 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
      <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-400/10 dark:bg-amber-500/8 rounded-full blur-[100px]"></div>

      <div ref="storyRef" class="relative max-w-6xl mx-auto px-6">
        <div :class="['grid lg:grid-cols-2 gap-16 items-center transition-all duration-700', storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12']">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-6">
              <Icon name="heroicons:book-open-20-solid" class="h-4 w-4" />
              {{ t.about.story.label }}
            </div>
            <h3 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              {{ t.about.story.title }}
            </h3>
            <div class="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>{{ t.about.story.p1 }}</p>
              <p>{{ t.about.story.p2 }}</p>
              <p>{{ t.about.story.p3 }}</p>
            </div>
          </div>

          <!-- Stats Card -->
          <div ref="statsRef" class="relative">
            <div class="relative rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-8 shadow-2xl shadow-black/5 dark:shadow-black/20">
              <div class="space-y-8">
                <div v-for="(stat, i) in [
                  { icon: 'heroicons:users-20-solid', count: formatNum(usersCount), suffix: '+', label: t.about.stats.activeUsers, color: 'teal' },
                  { icon: 'heroicons:map-pin-20-solid', count: formatNum(tripsCount), suffix: '+', label: t.about.stats.tripsPlanned, color: 'indigo' },
                  { icon: 'heroicons:globe-alt-20-solid', count: formatNum(countriesCount), suffix: '+', label: t.about.stats.countries, color: 'amber' }
                ]" :key="i" class="flex items-center gap-5">
                  <div class="flex-shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center" :class="colorClasses[stat.color].iconBg">
                    <Icon :name="stat.icon" class="h-7 w-7" :class="colorClasses[stat.color].icon" />
                  </div>
                  <div>
                    <div class="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                      {{ stat.count }}<span class="text-teal-600 dark:text-teal-400">{{ stat.suffix }}</span>
                    </div>
                    <div class="text-sm text-slate-600 dark:text-slate-400 font-medium">{{ stat.label }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute -inset-4 bg-gradient-to-r from-amber-500/15 to-teal-500/15 rounded-3xl blur-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="relative py-24 overflow-hidden bg-white dark:bg-slate-900">
      <div class="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-400/10 dark:bg-indigo-500/8 rounded-full blur-[100px]"></div>

      <div ref="valuesRef" class="relative max-w-7xl mx-auto px-6">
        <div :class="['transition-all duration-700', valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
          <div class="text-center mb-16">
            <span class="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 border border-indigo-100 dark:border-indigo-800">
              {{ t.about.values.badge }}
            </span>
            <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ t.about.values.title }}
            </h2>
          </div>

          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="(value, i) in values"
              :key="i"
              :style="{ transitionDelay: valuesVisible ? `${i * 100}ms` : '0ms' }"
              :class="['transition-all duration-500 group', valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6']"
            >
              <div class="relative text-center p-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 h-full">
                <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" :class="colorClasses[value.color].glow"></div>
                <div class="mb-5 inline-flex rounded-2xl p-4 transition-transform duration-300 group-hover:scale-110" :class="colorClasses[value.color].iconBg">
                  <Icon :name="value.icon" class="h-7 w-7" :class="colorClasses[value.color].icon" />
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">{{ value.title }}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ value.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="relative py-24 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
      <div ref="teamRef" class="relative max-w-4xl mx-auto px-6">
        <div :class="['transition-all duration-700', teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ t.about.team.title }}
            </h2>
            <p class="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              {{ t.about.team.description }}
            </p>
          </div>

          <div class="grid gap-8 sm:grid-cols-3">
            <div
              v-for="(member, i) in teams"
              :key="i"
              :style="{ transitionDelay: teamVisible ? `${i * 120}ms` : '0ms' }"
              :class="['transition-all duration-500', teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6']"
            >
              <div class="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1">
                <div class="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-5 shadow-lg" :class="[member.color, member.shadow]">
                  <Icon :name="member.icon" class="h-8 w-8 text-white" />
                </div>
                <h3 class="font-bold text-slate-900 dark:text-white text-lg">{{ member.title }}</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">{{ member.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <LandingPageCTA
      :title="t.about.cta.title"
      :title-highlight="t.about.cta.titleHighlight"
      :subtitle="t.about.cta.subtitle"
      :primary-text="t.about.cta.button"
      primary-link="/plan"
      :secondary-text="t.about.cta.secondary"
      secondary-link="/features"
    />
  </div>
</template>
