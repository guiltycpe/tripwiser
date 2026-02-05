<template>
  <!--
    AiModifyPopover — Small popover for AI-powered activity modification
    Opens near the element, not a full-screen modal.
    Shows skeleton loader while generating, then Keep/Discard.
  -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-1 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-1 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed bottom-20 right-8 z-50 w-80 rounded-2xl bg-white border border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center gap-2 px-4 pt-4 pb-2">
        <div class="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Icon name="heroicons:sparkles-20-solid" class="h-4 w-4 text-white" />
        </div>
        <h4 class="text-sm font-semibold text-gray-900">AI Modify</h4>
        <button
          class="ml-auto p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          @click="$emit('close')"
        >
          <Icon name="heroicons:x-mark-20-solid" class="h-4 w-4" />
        </button>
      </div>

      <!-- Idle: Input prompt -->
      <div v-if="status === 'idle' || status === 'error'" class="px-4 pb-4">
        <p class="text-xs text-gray-500 mb-2">How should I change this activity?</p>
        <div class="relative">
          <input
            ref="promptInput"
            v-model="prompt"
            type="text"
            placeholder="e.g. Make it cheaper, find an alternative..."
            class="w-full text-sm rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 pr-10 text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-500/20 transition-all"
            @keydown.enter="submit"
            @keydown.escape="$emit('close')"
          />
          <button
            :disabled="!prompt.trim()"
            class="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            @click="submit"
          >
            <Icon name="heroicons:arrow-up-20-solid" class="h-3.5 w-3.5" />
          </button>
        </div>
        <p v-if="status === 'error'" class="mt-2 text-xs text-red-500 flex items-center gap-1">
          <Icon name="heroicons:exclamation-triangle-20-solid" class="h-3.5 w-3.5" />
          {{ errorMessage }}
        </p>
        <!-- Quick suggestions -->
        <div class="flex flex-wrap gap-1.5 mt-2.5">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            class="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors cursor-pointer border border-transparent hover:border-violet-200"
            @click="prompt = suggestion; submit()"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Loading: Skeleton -->
      <div v-if="status === 'loading'" class="px-4 pb-4 space-y-3">
        <div class="flex items-center gap-2 mb-1">
          <div class="h-4 w-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
          <span class="text-xs text-violet-600 font-medium">Generating with AI...</span>
        </div>
        <!-- Skeleton lines -->
        <div class="space-y-2">
          <div class="h-3 bg-gray-100 rounded-full w-full animate-pulse"></div>
          <div class="h-3 bg-gray-100 rounded-full w-4/5 animate-pulse" style="animation-delay: 75ms"></div>
          <div class="h-3 bg-gray-100 rounded-full w-3/5 animate-pulse" style="animation-delay: 150ms"></div>
        </div>
        <div class="flex gap-2 pt-1">
          <div class="h-6 bg-gray-100 rounded-full w-16 animate-pulse"></div>
          <div class="h-6 bg-gray-100 rounded-full w-12 animate-pulse"></div>
        </div>
      </div>

      <!-- Preview: Show changes + Keep/Discard -->
      <div v-if="status === 'preview' && preview" class="px-4 pb-4">
        <p class="text-xs font-medium text-gray-500 mb-2">Proposed changes:</p>
        <div class="bg-violet-50/50 rounded-xl border border-violet-100 p-3 space-y-1.5">
          <p v-if="preview.name" class="text-sm font-semibold text-gray-900">{{ preview.name }}</p>
          <p v-if="preview.description" class="text-xs text-gray-600 leading-relaxed">{{ preview.description }}</p>
          <div class="flex items-center gap-3 pt-1">
            <span v-if="preview.time_flexible" class="text-xs text-gray-500 font-medium">
              <Icon name="heroicons:clock-20-solid" class="h-3 w-3 inline" /> {{ preview.time_flexible }}
            </span>
            <span v-if="preview.estimated_cost_usd != null" class="text-xs font-semibold text-green-700">
              ${{ preview.estimated_cost_usd }}
            </span>
          </div>
        </div>

        <div class="flex gap-2 mt-3">
          <button
            class="flex-1 text-xs font-semibold px-3 py-2 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            @click="$emit('accept')"
          >
            <Icon name="heroicons:check-20-solid" class="h-3.5 w-3.5" />
            Keep
          </button>
          <button
            class="flex-1 text-xs font-semibold px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            @click="$emit('discard')"
          >
            <Icon name="heroicons:x-mark-20-solid" class="h-3.5 w-3.5" />
            Discard
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

const props = withDefaults(defineProps<{
  isOpen: boolean
  status: 'idle' | 'loading' | 'preview' | 'error'
  preview?: any
  errorMessage?: string
}>(), {
  status: 'idle',
  preview: null,
  errorMessage: ''
})

const emit = defineEmits<{
  'close': []
  'submit': [prompt: string]
  'accept': []
  'discard': []
}>()

const prompt = ref('')
const promptInput = ref<HTMLInputElement | null>(null)

const suggestions = [
  'Make it cheaper',
  'Find an alternative',
  'More adventurous',
  'Family-friendly'
]

function submit() {
  if (!prompt.value.trim()) return
  emit('submit', prompt.value.trim())
}

watch(() => props.isOpen, async (val) => {
  if (val) {
    prompt.value = ''
    await nextTick()
    promptInput.value?.focus()
  }
})
</script>
