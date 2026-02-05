<template>
  <!--
    TimePickerPopover — Modern minimal time selector
    
    Opens as a small popover with two scroll columns (hours + minutes).
    Selected values highlighted in teal. Emits confirm with "HH:MM" string.
    Zero external dependencies — pure Tailwind + native scroll.
  -->
  <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-56" @click.stop>
    <!-- Current Selection Display -->
    <div class="text-center mb-3">
      <div class="text-3xl font-black text-gray-900 tabular-nums tracking-tight">
        {{ pad(hour) }}<span class="text-teal-500 mx-0.5">:</span>{{ pad(minute) }}
      </div>
    </div>

    <!-- Scroll Columns -->
    <div class="flex gap-2 mb-3">
      <!-- Hours -->
      <div ref="hourScrollRef" class="flex-1 h-36 overflow-y-auto rounded-xl bg-gray-50 scroll-smooth">
        <div class="p-1 space-y-0.5">
          <button
            v-for="h in 24"
            :key="h"
            @click="hour = h - 1"
            class="w-full py-1.5 text-sm font-semibold rounded-lg transition-colors duration-100 cursor-pointer"
            :class="hour === h - 1
              ? 'bg-teal-500 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'"
          >
            {{ pad(h - 1) }}h
          </button>
        </div>
      </div>

      <!-- Minutes (5-min increments) -->
      <div ref="minuteScrollRef" class="flex-1 h-36 overflow-y-auto rounded-xl bg-gray-50 scroll-smooth">
        <div class="p-1 space-y-0.5">
          <button
            v-for="m in minuteOptions"
            :key="m"
            @click="minute = m"
            class="w-full py-1.5 text-sm font-semibold rounded-lg transition-colors duration-100 cursor-pointer"
            :class="minute === m
              ? 'bg-teal-500 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'"
          >
            {{ pad(m) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <button
        @click="$emit('close')"
        class="flex-1 py-2 text-xs font-bold text-gray-500 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
      >
        Annuler
      </button>
      <button
        @click="confirm"
        class="flex-1 py-2 text-xs font-bold text-white bg-teal-500 rounded-xl hover:bg-teal-600 transition-colors shadow-sm cursor-pointer"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps<{
  initialTime?: string
}>()

const emit = defineEmits<{
  'confirm': [time: string]
  'close': []
}>()

// ─── Parse initial time string ───
function parseTime(timeStr?: string): { hour: number; minute: number } {
  if (!timeStr) return { hour: 9, minute: 0 }
  // Match HH:MM or H:MM patterns (first occurrence in string)
  const match = timeStr.match(/(\d{1,2}):(\d{2})/)
  if (match) {
    let h = parseInt(match[1]!)
    const m = parseInt(match[2]!)
    // Handle AM/PM
    if (timeStr.toLowerCase().includes('pm') && h < 12) h += 12
    if (timeStr.toLowerCase().includes('am') && h === 12) h = 0
    return { hour: Math.min(h, 23), minute: Math.min(m, 59) }
  }
  // Try to extract a bare hour number like "9h" or "14h30"
  const hMatch = timeStr.match(/(\d{1,2})h(\d{2})?/)
  if (hMatch) {
    return { hour: Math.min(parseInt(hMatch[1]!), 23), minute: hMatch[2] ? Math.min(parseInt(hMatch[2]), 59) : 0 }
  }
  return { hour: 9, minute: 0 }
}

const parsed = parseTime(props.initialTime)
const hour = ref(parsed.hour)
const minute = ref(parsed.minute)

const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

// Snap to nearest 5-min increment
if (!minuteOptions.includes(minute.value)) {
  minute.value = minuteOptions.reduce((prev, curr) =>
    Math.abs(curr - minute.value) < Math.abs(prev - minute.value) ? curr : prev
  )
}

const hourScrollRef = ref<HTMLElement | null>(null)
const minuteScrollRef = ref<HTMLElement | null>(null)

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function confirm() {
  emit('confirm', `${pad(hour.value)}:${pad(minute.value)}`)
}

// Scroll active items into view on mount
onMounted(() => {
  nextTick(() => {
    const itemH = 32 // approx button height + gap
    if (hourScrollRef.value) {
      hourScrollRef.value.scrollTop = Math.max(0, hour.value * itemH - 52)
    }
    if (minuteScrollRef.value) {
      const mIdx = minuteOptions.indexOf(minute.value)
      minuteScrollRef.value.scrollTop = Math.max(0, mIdx * itemH - 52)
    }
  })
})
</script>

<style scoped>
/* Thin custom scrollbar for the scroll columns */
div::-webkit-scrollbar {
  width: 3px;
}
div::-webkit-scrollbar-track {
  background: transparent;
}
div::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}
</style>
