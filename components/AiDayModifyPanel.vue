<template>
  <!--
    AiDayModifyPanel — Inline AI panel for day-level modification
    Appears below the day header when triggered. Minimalist violet theme.
  -->
  <div class="mb-4 overflow-hidden rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 to-white shadow-lg shadow-violet-100/50">
    <!-- Header -->
    <div class="flex items-center gap-2.5 px-4 pt-3.5 pb-2">
      <div class="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
        <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 text-white" fill="currentColor" v-html="ICON_SPARKLES" />
      </div>
      <h4 class="text-sm font-bold text-gray-800">Modifier ce jour</h4>
      <button
        class="ml-auto p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-colors cursor-pointer"
        @click="$emit('close')"
      >
        <svg viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
        </svg>
      </button>
    </div>

    <!-- Idle / Error State -->
    <div v-if="status === 'idle' || status === 'error'" class="px-4 pb-4">
      <div class="relative">
        <input
          ref="promptInput"
          v-model="prompt"
          type="text"
          placeholder="Ex: Rendre moins cher, plus de culture..."
          class="w-full text-sm rounded-xl border border-violet-200 bg-white px-3.5 py-2.5 pr-10 text-gray-900 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all"
          @keydown.enter="submit"
          @keydown.escape="$emit('close')"
        />
        <button
          :disabled="!prompt.trim()"
          class="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          @click="submit"
        >
          <svg viewBox="0 0 20 20" class="h-3.5 w-3.5" fill="currentColor">
            <path fill-rule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
      <p v-if="status === 'error'" class="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
        <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 flex-shrink-0" fill="currentColor">
          <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd"/>
        </svg>
        {{ errorMessage }}
      </p>
      <!-- Suggestions -->
      <div class="flex flex-wrap gap-1.5 mt-2.5">
        <button
          v-for="s in suggestions"
          :key="s"
          class="text-xs px-2.5 py-1 rounded-full bg-white text-gray-600 hover:bg-violet-100 hover:text-violet-700 transition-colors cursor-pointer border border-gray-200 hover:border-violet-300"
          @click="prompt = s; submit()"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="status === 'loading'" class="px-4 pb-4 space-y-3">
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
        <span class="text-xs text-violet-600 font-medium">Génération en cours...</span>
      </div>
      <div class="space-y-2">
        <div class="h-3 bg-violet-100 rounded-full w-full animate-pulse"></div>
        <div class="h-3 bg-violet-100 rounded-full w-4/5 animate-pulse" style="animation-delay: 75ms"></div>
        <div class="h-3 bg-violet-100 rounded-full w-3/5 animate-pulse" style="animation-delay: 150ms"></div>
      </div>
    </div>

    <!-- Preview State -->
    <div v-if="status === 'preview' && preview" class="px-4 pb-4">
      <div class="bg-violet-50/80 rounded-xl border border-violet-100 p-3 mb-3">
        <p class="text-xs font-semibold text-violet-700 mb-1.5">Proposition de l'IA</p>
        <p class="text-xs text-gray-500 mb-2">
          {{ preview.length }} activité{{ preview.length > 1 ? 's' : '' }} proposée{{ preview.length > 1 ? 's' : '' }}
        </p>
        <div class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          <div
            v-for="(act, i) in preview"
            :key="i"
            class="flex items-center gap-2.5 text-xs py-1 px-2 rounded-lg bg-white/60"
          >
            <span class="text-violet-500 font-mono font-semibold tabular-nums min-w-[3rem]">{{ act.time_flexible || '—' }}</span>
            <span class="text-gray-700 truncate">{{ act.name || act.description }}</span>
            <span v-if="act.estimated_cost_usd" class="ml-auto text-green-600 font-semibold flex-shrink-0">${{ act.estimated_cost_usd }}</span>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          class="flex-1 text-xs font-semibold px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all cursor-pointer shadow-sm shadow-violet-500/20"
          @click="$emit('accept')"
        >
          ✓ Appliquer
        </button>
        <button
          class="flex-1 text-xs font-semibold px-3 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
          @click="$emit('discard')"
        >
          ✕ Ignorer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { ICON_SPARKLES } from '~/utils/cardIcons'

const props = withDefaults(defineProps<{
  status: 'idle' | 'loading' | 'preview' | 'error'
  preview?: any[] | null
  errorMessage?: string
}>(), {
  status: 'idle',
  preview: null,
  errorMessage: '',
})

const emit = defineEmits<{
  close: []
  submit: [prompt: string]
  accept: []
  discard: []
}>()

const prompt = ref('')
const promptInput = ref<HTMLInputElement | null>(null)

const suggestions = [
  'Rendre moins cher',
  'Plus authentique',
  'Adapter pour enfants',
  "Plus d'aventure",
]

function submit() {
  if (!prompt.value.trim()) return
  emit('submit', prompt.value.trim())
}

// Focus input on mount
watch(
  () => props.status,
  async (s) => {
    if (s === 'idle') {
      await nextTick()
      promptInput.value?.focus()
    }
  },
  { immediate: true },
)
</script>
