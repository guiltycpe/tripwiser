<template>
  <!--
    MoveActivityPopover — Minimal day-picker for moving an activity
    
    Anchored at the top-right of the parent activity card.
    Shows a compact list of all days. The current day is dimmed/disabled.
    Clicking a day moves the activity there, sorted by time.
  -->
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="isOpen" class="absolute top-0 right-3 z-50 origin-top-right">
      <!-- Backdrop (click to close) -->
      <div class="fixed inset-0 z-40" @click="$emit('close')"></div>

      <!-- Panel -->
      <div class="relative z-50 w-52 bg-white rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden">
        <!-- Header -->
        <div class="px-3.5 py-2.5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
          <p class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Déplacer vers</p>
          <button
            class="p-0.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            @click="$emit('close')"
          >
            <svg viewBox="0 0 20 20" class="h-3.5 w-3.5" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <!-- Day list -->
        <div class="max-h-48 overflow-y-auto py-1">
          <template v-for="(day, idx) in allDays" :key="idx">
            <button
              :disabled="day.sectionIdx === currentSectionIdx && day.dayIdx === currentDayIdx"
              class="w-full px-3.5 py-2 flex items-center gap-2.5 text-left transition-all duration-150"
              :class="
                day.sectionIdx === currentSectionIdx && day.dayIdx === currentDayIdx
                  ? 'opacity-40 cursor-default bg-gray-50'
                  : 'hover:bg-teal-50 cursor-pointer group/day'
              "
              @click="selectDay(day)"
            >
              <!-- Day number badge -->
              <span
                class="flex-shrink-0 h-6 w-6 rounded-lg flex items-center justify-center text-[11px] font-bold transition-colors duration-150"
                :class="
                  day.sectionIdx === currentSectionIdx && day.dayIdx === currentDayIdx
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-100 text-gray-600 group-hover/day:bg-teal-500 group-hover/day:text-white'
                "
              >
                {{ day.dayNumber }}
              </span>

              <!-- Day title -->
              <span
                class="flex-1 text-[13px] font-medium truncate transition-colors duration-150"
                :class="
                  day.sectionIdx === currentSectionIdx && day.dayIdx === currentDayIdx
                    ? 'text-gray-400'
                    : 'text-gray-700 group-hover/day:text-teal-700'
                "
              >
                {{ day.title }}
              </span>

              <!-- Current dot -->
              <span
                v-if="day.sectionIdx === currentSectionIdx && day.dayIdx === currentDayIdx"
                class="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-gray-300"
              />

              <!-- Arrow on hover -->
              <svg
                v-else
                viewBox="0 0 20 20"
                class="h-3 w-3 text-gray-300 group-hover/day:text-teal-500 transition-all duration-150 group-hover/day:translate-x-0.5 flex-shrink-0"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638l-3.96-4.158a.75.75 0 1 1 1.085-1.034l5.25 5.5a.75.75 0 0 1 0 1.034l-5.25 5.5a.75.75 0 0 1-1.084-1.034l3.96-4.158H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd" />
              </svg>
            </button>
          </template>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface DayOption {
  sectionIdx: number
  dayIdx: number
  dayNumber: number
  title: string
}

const props = defineProps<{
  isOpen: boolean
  allDays: DayOption[]
  currentSectionIdx: number
  currentDayIdx: number
}>()

const emit = defineEmits<{
  'close': []
  'select': [day: { sectionIdx: number; dayIdx: number }]
}>()

function selectDay(day: DayOption) {
  if (day.sectionIdx === props.currentSectionIdx && day.dayIdx === props.currentDayIdx) return
  emit('select', { sectionIdx: day.sectionIdx, dayIdx: day.dayIdx })
  emit('close')
}
</script>

<style scoped>
/* Thin scrollbar for the day list */
.max-h-48::-webkit-scrollbar {
  width: 4px;
}
.max-h-48::-webkit-scrollbar-track {
  background: transparent;
}
.max-h-48::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}
.max-h-48::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
