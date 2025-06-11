<template>
  <div class="flex min-h-screen flex-col bg-white">
    <navBar />

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t py-6 text-center text-sm text-gray-500">
      © {{ year }} TripWiser
    </footer>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
<style>

</style>