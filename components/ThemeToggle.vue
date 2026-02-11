<template>
  <button
    @click="toggleTheme"
    class="theme-toggle relative flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    role="switch"
    :aria-checked="isDark"
    :aria-label="isDark ? 'Dark mode' : 'Light mode'"
  >
    <!-- Sun (visible in light mode, hidden in dark) -->
    <svg
      class="h-5 w-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:hidden"
      :class="isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>

    <!-- Moon (hidden in light mode, visible in dark) -->
    <svg
      class="h-5 w-5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hidden dark:block"
      :class="isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>
