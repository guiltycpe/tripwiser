<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: string | Date | null
  minDate?: string | Date
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const isOpen = ref(false)

// Formatting
const formatDate = (d: Date) => {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const d = new Date(props.modelValue)
  if (isNaN(d.getTime())) return ''
  return formatDate(d)
})

// Calendar Logic
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

// Sync header with selected date if present
watch(() => props.modelValue, (val) => {
  if (val) {
    const d = new Date(val)
    if (!isNaN(d.getTime())) {
      currentMonth.value = d.getMonth()
      currentYear.value = d.getFullYear()
    }
  }
}, { immediate: true })

const monthName = computed(() => {
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(currentYear.value, currentMonth.value))
})

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  let day = new Date(currentYear.value, currentMonth.value, 1).getDay()
  return day === 0 ? 6 : day - 1 // Adjust for Monday start (0=Mon, 6=Sun)
})

const days = computed(() => {
  const res = []
  // Empty slots for previous month
  for (let i = 0; i < firstDayOfMonth.value; i++) {
    res.push(null)
  }
  // Days
  for (let i = 1; i <= daysInMonth.value; i++) {
    res.push(new Date(currentYear.value, currentMonth.value, i))
  }
  return res
})

const weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const isSelected = (date: Date) => {
  if (!props.modelValue) return false
  const d = new Date(props.modelValue)
  return d.getDate() === date.getDate() && 
         d.getMonth() === date.getMonth() && 
         d.getFullYear() === date.getFullYear()
}

const isToday = (date: Date) => {
  const today = new Date()
  return today.getDate() === date.getDate() && 
         today.getMonth() === date.getMonth() && 
         today.getFullYear() === date.getFullYear()
}

const isDisabled = (date: Date) => {
  if (!props.minDate) return false
  const min = new Date(props.minDate)
  // Set min to start of day
  min.setHours(0, 0, 0, 0)
  return date < min
}

const selectDate = (date: Date) => {
  // Format YYYY-MM-DD
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  emit('update:modelValue', `${yyyy}-${mm}-${dd}`)
  isOpen.value = false
}

const togglePopover = () => {
  isOpen.value = !isOpen.value
}

const closePopover = () => {
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <!-- Trigger -->
    <button
      type="button"
      @click="togglePopover"
      class="flex w-full items-center justify-between gap-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-900 transition-all duration-300 hover:border-teal-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
      :class="{ 'text-gray-400': !modelValue }"
    >
      <span v-if="modelValue" class="text-gray-900 font-medium">{{ displayValue }}</span>
      <span v-else>{{ placeholder || 'Select date' }}</span>
      <UIcon name="i-heroicons-calendar-20-solid" class="h-5 w-5 text-teal-500" />
    </button>

    <!-- Overlay -->
    <div v-if="isOpen" class="fixed inset-0 z-40" @click="closePopover"></div>

    <!-- Panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="isOpen" class="absolute z-50 mt-2 w-72 rounded-xl bg-white p-4 shadow-xl border border-gray-100">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <button @click="prevMonth" type="button" class="p-1 hover:bg-gray-100 rounded-lg text-gray-600">
            <UIcon name="i-heroicons-chevron-left-20-solid" class="h-5 w-5" />
          </button>
          <span class="font-bold text-gray-900 capitalize">{{ monthName }}</span>
          <button @click="nextMonth" type="button" class="p-1 hover:bg-gray-100 rounded-lg text-gray-600">
            <UIcon name="i-heroicons-chevron-right-20-solid" class="h-5 w-5" />
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div v-for="day in weekDays" :key="day" class="text-center text-xs font-semibold text-gray-400 py-1">
            {{ day }}
          </div>
        </div>
        <div class="grid grid-cols-7 gap-1">
          <template v-for="(day, index) in days" :key="index">
             <div v-if="!day" class="p-2"></div>
             <button 
                v-else 
                @click="!isDisabled(day) && selectDate(day)"
                type="button"
                :disabled="isDisabled(day)"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors"
                :class="[
                  isSelected(day) ? 'bg-teal-500 text-white shadow-md' : 'text-gray-700 hover:bg-teal-50',
                  isToday(day) && !isSelected(day) ? 'text-teal-600 font-bold bg-teal-50/50 ring-1 ring-teal-200' : '',
                  isDisabled(day) ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'
                ]"
             >
                {{ day.getDate() }}
             </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Custom overrides if needed */
</style>
