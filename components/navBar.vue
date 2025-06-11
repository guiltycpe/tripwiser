<template>
  <header class="w-full border-b bg-[#f8f9fa]">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <Logo />

      <nav class="hidden gap-8 md:flex">
        <NuxtLink to="/" exact class="nav-link">Home</NuxtLink>
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
    </div>
  </header>
</template>

<script setup lang="ts">
const lang = ref('en-US')
</script>

<style scoped>
@reference "tailwindcss";

.nav-link {
  @apply text-gray-700 font-medium transition-colors;
}
.nav-link:hover,
.nav-link.active {
  @apply text-primary-600;
}
</style>
