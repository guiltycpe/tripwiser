<template>
  <form
      class="flex w-full max-w-md items-center gap-2 rounded-xl border p-6 shadow-md"
      @submit.prevent="emit('submit', city)"
  >
    <label class="block w-full text-left text-sm font-semibold text-gray-700">
      Departure city
      <div class="relative mt-1">
        <Icon name="heroicons:home" class="absolute left-3 top-1/2 -translate-y-1/2" />
        <input
            v-model="city"
            type="text"
            placeholder="Paris"
            class="w-full rounded-lg border pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </label>

    <AtomsBaseButton type="submit" class="whitespace-nowrap">
      Start planning
    </AtomsBaseButton>

  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'submit', value: string): void
}>()

const city = ref('Paris')
</script>
