<template>
  <header class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <AtomsLogo />

    <nav class="hidden gap-8 md:flex">
      <NuxtLink to="/"       class="nav-link" exact>Home</NuxtLink>
      <NuxtLink to="/features" class="nav-link">Features</NuxtLink>
      <NuxtLink to="/pricing"  class="nav-link">Pricing</NuxtLink>
      <NuxtLink to="/about"    class="nav-link">About</NuxtLink>
    </nav>

    <div class="flex items-center gap-4">
      <select v-model="lang" class="rounded-md border p-1 text-sm">
        <option value="en-US">English</option>
        <option value="fr-FR">Français</option>
      </select>

      <BaseButton variant="outline">Log in</BaseButton>
      <BaseButton>Sign up</BaseButton>
    </div>
  </header>
</template>

<script setup lang="ts">
const lang = ref('en-US')
</script>

<style>
@reference "~/assets/css/tailwind.css";

.nav-link {
  @apply text-gray-700 hover:text-primary-600 font-medium transition-colors;
}
</style>
