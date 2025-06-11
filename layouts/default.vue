<template>
  <div class="flex min-h-screen flex-col">
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
body {
  background-color: #ffffff;
}
footer {
  background-color: #f1f1f1;
}
</style>