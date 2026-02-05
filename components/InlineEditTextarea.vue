<template>
  <!--
    InlineEditTextarea — Click-to-edit multi-line text (ISOLATED STATE)
    
    Perf: Same local-buffer pattern as InlineEditField.
    Keystrokes stay in a local ref — zero reactivity cost to parent.
    Only emits on blur/save.
  -->
  <p
    v-if="!isActive"
    :class="[
      displayClass,
      'rounded-lg transition-colors duration-200 px-2 py-1 -mx-2 -my-1',
      !props.readonly && 'cursor-pointer select-none hover:bg-gray-50 hover:ring-1 hover:ring-gray-200'
    ]"
    :role="props.readonly ? undefined : 'button'"
    :tabindex="props.readonly ? -1 : 0"
    :title="props.readonly ? undefined : 'Click to edit'"
    @click="!props.readonly && activate()"
    @keydown.enter="!props.readonly && activate()"
  >
    {{ modelValue || placeholder }}
  </p>

  <textarea
    v-else
    ref="textareaRef"
    :value="localValue"
    :placeholder="placeholder"
    :class="[
      displayClass,
      'w-full resize-none rounded-lg border-0 bg-transparent outline-none',
      'ring-2 ring-blue-500/20 focus:ring-blue-500/40',
      'px-2 py-1 -mx-2 -my-1'
    ]"
    :rows="1"
    @input="onInput"
    @blur="save"
    @keydown.escape="cancel"
    @keydown.meta.enter="($event.target as HTMLTextAreaElement)?.blur()"
    @keydown.ctrl.enter="($event.target as HTMLTextAreaElement)?.blur()"
  />
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  displayClass?: string
  placeholder?: string
  readonly?: boolean
}>(), {
  displayClass: '',
  placeholder: 'Add a description...',
  readonly: false
})

const emit = defineEmits<{
  'save': [value: string, previousValue: string]
}>()

const isActive = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// ─── LOCAL BUFFERED STATE ───
const localValue = ref('')
const originalValue = ref('')

function autoResize() {
  const el = textareaRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

async function activate() {
  localValue.value = props.modelValue
  originalValue.value = props.modelValue
  isActive.value = true
  await nextTick()
  if (textareaRef.value) {
    autoResize()
    textareaRef.value.focus()
    const len = textareaRef.value.value.length
    textareaRef.value.setSelectionRange(len, len)
  }
}

function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  // Update LOCAL ref only — zero parent reactivity cost
  localValue.value = target.value
  autoResize()
}

function save() {
  isActive.value = false
  emit('save', localValue.value, originalValue.value)
}

function cancel() {
  isActive.value = false
}
</script>
