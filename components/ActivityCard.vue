<template>
  <!--
    ActivityCard — Progressive Disclosure Activity Card (ZERO-ICON)
    
    Modes:
    - editMode=false → Static display, no interactions
    - editMode=true  → Time picker, cost edit, delete on hover, move to day
    
    NOT editable: description, notes (view-only always)
  -->
  <div
    class="group/card relative rounded-2xl border bg-white"
    :class="[
      isActive
          ? 'border-blue-200 ring-2 ring-blue-500/10 shadow-lg z-10'
          : 'border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-lg',
      'transition-[border-color,box-shadow] duration-200',
    ]"
  >
    <!-- AI Loading Overlay -->
    <div v-if="aiLoading" class="absolute inset-0 z-20 bg-white/80 rounded-2xl flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <div class="relative">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <svg viewBox="0 0 20 20" class="h-5 w-5 text-white animate-pulse" v-html="ICON_SPARKLES" />
          </div>
        </div>
        <p class="text-xs font-medium text-violet-600">Regenerating...</p>
      </div>
    </div>

    <!-- Hover Action Bar — Move + Delete, edit mode only -->
    <div
      v-if="editMode"
      class="absolute -top-3 right-3 z-30 flex items-center gap-0.5 rounded-xl bg-white border border-gray-200 shadow-lg px-1 py-1 opacity-0 translate-y-1 pointer-events-none group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:pointer-events-auto transition-[opacity,transform] duration-150"
    >
      <button
        class="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
        title="Déplacer vers un autre jour"
        @click.stop="$emit('request-move')"
      >
        <svg viewBox="0 0 20 20" class="h-3.5 w-3.5" v-html="ICON_MOVE" />
      </button>
      <button
        class="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        title="Supprimer"
        @click.stop="$emit('delete')"
      >
        <svg viewBox="0 0 20 20" class="h-3.5 w-3.5" v-html="ICON_TRASH" />
      </button>
    </div>

    <!-- Card Content -->
    <div class="p-5">
      <div class="flex gap-4">
        <!-- Drag Handle / Activity Icon -->
        <div class="flex-shrink-0">
          <div
            class="h-11 w-11 rounded-xl flex items-center justify-center transition-colors duration-200 bg-gray-50 text-gray-400 border border-gray-100 group-hover/card:bg-gradient-to-br group-hover/card:from-teal-500 group-hover/card:to-cyan-500 group-hover/card:text-white group-hover/card:border-transparent group-hover/card:shadow-md"
          >
            <svg viewBox="0 0 20 20" class="h-5 w-5" v-html="activityIconSvg" />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 space-y-2">
          <!-- Row 1: Time + Cost -->
          <div class="flex items-center justify-between gap-3">
            <!-- Time Field — opens TimePicker in edit mode -->
            <div class="relative">
              <template v-if="editMode">
                <span
                  class="text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer select-none rounded-md hover:bg-gray-100/80 hover:ring-1 hover:ring-gray-200 px-1.5 py-0.5 -mx-1.5 -my-0.5 transition-colors duration-200 flex items-center gap-1"
                  role="button"
                  tabindex="0"
                  @click.stop="showTimePicker = !showTimePicker"
                  @keydown.enter.stop="showTimePicker = !showTimePicker"
                >
                  <svg viewBox="0 0 20 20" class="h-3 w-3" v-html="ICON_CLOCK" />
                  {{ activity.time_flexible || 'Heure...' }}
                </span>
                <template v-if="showTimePicker">
                  <div class="fixed inset-0 z-40" @click="showTimePicker = false"></div>
                  <TimePickerPopover
                    class="absolute top-full left-0 mt-2 z-50"
                    :initial-time="activity.time_flexible"
                    @confirm="onTimeConfirm"
                    @close="showTimePicker = false"
                  />
                </template>
              </template>
              <span v-else class="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <svg viewBox="0 0 20 20" class="h-3 w-3" v-html="ICON_CLOCK" />
                {{ activity.time_flexible }}
              </span>
            </div>

            <!-- Cost Field — editable in edit mode -->
            <InlineEditField
              v-if="activity.estimated_cost_usd > 0"
              :model-value="activity.estimated_cost_usd"
              :readonly="!editMode"
              type="number"
              display-class="text-xs font-bold text-green-700"
              input-class="text-xs font-bold text-green-700"
              prefix="$"
              min-width="3rem"
              @save="(v: string | number, prev: string | number) => $emit('save-field', 'estimated_cost_usd', v, prev)"
            >
              <span class="bg-green-50 px-2.5 py-1 rounded-full border border-green-200 text-green-700">${{ activity.estimated_cost_usd }}</span>
            </InlineEditField>
          </div>

          <!-- Row 2: Activity Name (always readonly — view only) -->
          <p class="text-gray-900 font-semibold leading-snug text-base">
            {{ activity.name || activity.description }}
          </p>

          <!-- Row 3: Description (always readonly) -->
          <p
            v-if="activity.name && activity.description"
            class="text-sm text-gray-500 leading-relaxed"
          >
            {{ activity.description }}
          </p>

          <!-- Row 4: Location badges -->
          <div v-if="activity.has_physical_location" class="flex flex-wrap items-center gap-2 pt-1">
            <a
              v-if="activity.google_maps_link"
              :href="activity.google_maps_link"
              target="_blank"
              class="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors"
            >
              <svg viewBox="0 0 20 20" class="h-3.5 w-3.5" v-html="ICON_MAP" />
              Maps
            </a>
            <span
              v-if="activity.rating"
              class="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100"
            >
              <svg viewBox="0 0 20 20" class="h-3.5 w-3.5" v-html="ICON_STAR" />
              {{ activity.rating }}
            </span>
            <span
              v-if="activity.duration_minutes"
              class="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full"
            >
              <svg viewBox="0 0 20 20" class="h-3.5 w-3.5" v-html="ICON_CLOCK" />
              {{ activity.duration_minutes }}min
            </span>
          </div>

          <!-- Row 5: Notes (always readonly) -->
          <div v-if="activity.notes" class="pt-1">
            <p class="text-xs text-gray-500 italic leading-relaxed bg-gray-50 border-l-3 border-gray-200 pl-3 py-1.5 rounded-r-lg">
              {{ activity.notes }}
            </p>
          </div>

          <!-- Travel time from previous -->
          <div
            v-if="activity.estimated_travel_time_from_previous?.minutes"
            class="flex items-center gap-1.5 text-xs text-gray-400 pt-1"
          >
            <svg viewBox="0 0 20 20" class="h-3.5 w-3.5" v-html="ICON_ARROW_RIGHT" />
            {{ activity.estimated_travel_time_from_previous.minutes }} min
            <span v-if="activity.estimated_travel_time_from_previous.method" class="text-gray-300">·</span>
            <span v-if="activity.estimated_travel_time_from_previous.method" class="capitalize">
              {{ activity.estimated_travel_time_from_previous.method }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ICON_SPARKLES,
  ICON_TRASH,
  ICON_MOVE,
  ICON_MAP,
  ICON_STAR,
  ICON_CLOCK,
  ICON_ARROW_RIGHT,
  getActivityIconSvg,
} from '~/utils/cardIcons'

const props = defineProps<{
  activity: any
  activityType: string
  sectionIdx: number
  dayIdx: number
  activityIdx: number
  aiLoading?: boolean
  isActive?: boolean
  editMode?: boolean
}>()

const emit = defineEmits<{
  'delete': []
  'save-field': [field: string, value: any, previousValue: any]
  'request-move': []
}>()

const activityIconSvg = getActivityIconSvg(props.activityType)

// ─── Time Picker State ───
const showTimePicker = ref(false)

function onTimeConfirm(time: string) {
  const prev = props.activity.time_flexible
  showTimePicker.value = false
  emit('save-field', 'time_flexible', time, prev)
}
</script>
