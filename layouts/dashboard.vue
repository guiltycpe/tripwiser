<template>
  <div class="flex h-screen bg-slate-50 dark:bg-slate-900">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto md:pt-0 pt-14">
      <slot />
    </main>
  </div>
</template>
