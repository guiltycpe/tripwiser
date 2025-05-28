<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: ''
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:ring-primary-500"
  />
</template>