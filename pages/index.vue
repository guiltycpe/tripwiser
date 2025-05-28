<template>
  <OrganismsHeroSection @submit="startPlanning" />
</template>

<script setup lang="ts">
const startPlanning = (city: string) => {
  // TODO: router.push(`/planner?from=${encodeURIComponent(city)}`)
  console.log('City selected :', city)
}
</script>
