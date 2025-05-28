<script setup lang="ts">
interface Props {
  /**
   * Chemin vers l'image (mettez-la idéalement dans /public)
   * Exemple : '/logo.svg' ou '/images/logo.png'
   */
  src?: string
  /** Texte alternatif pour l'accessibilité */
  alt?: string
  /** Largeur de l'image (px) */
  width?: number
  /** Hauteur de l'image (px) */
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  src: '/logo.svg',
  alt: 'TripWiser logo',
  width: 24,
  height: 24
})
</script>

<template>
  <NuxtLink to="/" class="flex items-center gap-2">
    <img
        :src="props.src"
        :alt="props.alt"
        :width="props.width"
        :height="props.height"
        class="object-contain"
    />
    <span class="text-xl font-black tracking-tight">TripWiser</span>
  </NuxtLink>
</template>