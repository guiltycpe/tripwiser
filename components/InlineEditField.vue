<template>
  <!--
    InlineEditField — Click-to-edit text/number field (ISOLATED STATE)
    
    Perf: During editing, keystrokes update a LOCAL ref only.
    No events propagate to the parent until blur/save.
    This eliminates cross-card re-renders entirely.
  -->
  <span
    v-if="!isActive"
    :class="[
      displayClass,
      'rounded-md transition-colors duration-200 px-1.5 py-0.5 -mx-1.5 -my-0.5',
      !props.readonly && 'cursor-pointer select-none hover:bg-gray-100/80 hover:ring-1 hover:ring-gray-200'
    ]"
    :role="props.readonly ? undefined : 'button'"
    :tabindex="props.readonly ? -1 : 0"
    :title="props.readonly ? undefined : (placeholder || 'Click to edit')"
    @click="!props.readonly && activate()"
    @keydown.enter="!props.readonly && activate()"
  >
    <slot>{{ displayValue }}</slot>
  </span>

  <input
    v-else
    ref="inputRef"
    :type="type"
    :value="localValue"
    :placeholder="placeholder"
    :class="[
      inputClass,
      'rounded-md border-0 bg-transparent outline-none',
      'ring-2 ring-blue-500/20 focus:ring-blue-500/40',
      'px-1.5 py-0.5 -mx-1.5 -my-0.5'
    ]"
    :style="{ minWidth: minWidth }"
    @input="onInput"
    @blur="save"
    @keydown.enter="($event.target as HTMLInputElement)?.blur()"
    @keydown.escape="cancel"
  />
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string | number
  type?: 'text' | 'number'
  displayClass?: string
  inputClass?: string
  placeholder?: string
  prefix?: string
  suffix?: string
  minWidth?: string
  readonly?: boolean
}>(), {
  type: 'text',
  displayClass: '',
  inputClass: '',
  placeholder: '',
  prefix: '',
  suffix: '',
  minWidth: '3rem',
  readonly: false
})

const emit = defineEmits<{
  'save': [value: string | number, previousValue: string | number]
}>()

const isActive = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

// ─── LOCAL BUFFERED STATE ───
// These refs are ONLY used during active editing.
// No parent notification until blur.
const localValue = ref<string | number>(props.modelValue)
const originalValue = ref<string | number>(props.modelValue)

const displayValue = computed(() => {
  const val = String(props.modelValue)
  return `${props.prefix}${val}${props.suffix}`
})

async function activate() {
  // Snapshot the prop into local refs
  localValue.value = props.modelValue
  originalValue.value = props.modelValue
  isActive.value = true
  await nextTick()
  inputRef.value?.focus()
  inputRef.value?.select()
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  // Update LOCAL ref only — zero parent reactivity cost
  localValue.value = props.type === 'number' ? Number(target.value) : target.value
}

function save() {
  isActive.value = false
  // Single emission on blur — parent updates global state once
  emit('save', localValue.value, originalValue.value)
}

function cancel() {
  // Discard local edits, close without saving
  isActive.value = false
}
</script>
