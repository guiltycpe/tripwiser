<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'outline' | 'ghost'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false
})
</script>

<template>
  <button
      :type="props.type"
      :disabled="props.disabled"
      :class="[
      'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500',
      props.variant === 'primary' && 'bg-primary-600 text-white shadow hover:bg-primary-700',
      props.variant === 'outline' && 'border border-primary-600 text-primary-600 hover:bg-primary-50',
      props.variant === 'ghost' && 'text-gray-700 hover:bg-gray-100',
      props.disabled && 'opacity-50 cursor-not-allowed'
    ]"
  >
    <slot />
  </button>
</template>