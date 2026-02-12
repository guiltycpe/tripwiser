<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useTranslations()
const user = useSupabaseUser()

// Redirect authenticated users to dashboard
watch(user, (newUser) => {
  if (newUser) {
    router.replace('/dashboard')
  }
}, { immediate: true })

function startPlanning(city?: string) {
  const cityToSend = city || 'Paris'
  router.push({ path: '/plan', query: { departure: cityToSend } })
}
</script>

<template>
  <div class="bg-white dark:bg-slate-900">
    <!-- Hero: Full-screen immersive dark section -->
    <LandingHeroSection @start-planning="startPlanning" />

    <!-- How It Works: 3 steps timeline -->
    <LandingHowItWorks />

    <!-- Features: Apple-style alternating sections -->
    <LandingFeatureShowcase />

    <!-- Stats: Animated counters on dark bg -->
    <LandingStatsSection />

    <!-- Destinations: Bento grid -->
    <LandingDestinationExplorer />

    <!-- Testimonials: Glass cards -->
    <LandingTestimonialsSection />

    <!-- Final CTA -->
    <LandingFinalCTA @start-planning="startPlanning()" />
  </div>
</template>
