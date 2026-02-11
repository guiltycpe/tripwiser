<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/60" @click="$emit('close')"></div>
      
        <!-- Main Container -->
        <div class="relative w-full max-w-7xl h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 dark:from-slate-800 to-white dark:to-slate-900 shadow-2xl flex flex-col border border-gray-200/60 dark:border-gray-700/60">
          
          <!-- Header (Always Visible) -->
          <div class="bg-white dark:bg-slate-900 p-8 border-b border-gray-200/50 dark:border-gray-700/50 z-20">
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1">
                 <div class="flex items-center gap-3 mb-2">
                   <h2 class="text-4xl font-black text-gray-900 dark:text-gray-100 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text">
                     {{ formatDestination(tripData.trip_summary.destination) }}
                   </h2>
                   <span class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white uppercase tracking-widest font-bold shadow-lg shadow-teal-500/30">
                     {{ getBudgetLabel(tripData.trip_summary.budget_tier) }}
                   </span>
                 </div>
                 <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2.5">
                   <Icon name="heroicons:calendar-20-solid" class="h-4 w-4 text-teal-500" />
                   {{ formatDate(props.trip.departure_date) }} - {{ formatDate(props.trip.return_date) }}
                   <span class="text-gray-300 dark:text-gray-600">•</span>
                   <span class="text-teal-600">{{ tripData.trip_summary.duration_days }} {{ t.tripDetails.days }}</span>
                 </p>
              </div>

              <div class="flex items-center gap-3">
                <!-- Share button -->
                <button 
                  @click="shareTripLink" 
                  class="p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-400 dark:text-gray-400 hover:text-indigo-600 transition-all duration-300 group cursor-pointer border border-transparent hover:border-indigo-200"
                  title="Share"
                >
                  <Icon v-if="!shareLoading" name="heroicons:share-20-solid" class="h-5 w-5" />
                  <Icon v-else name="heroicons:arrow-path-20-solid" class="h-5 w-5 animate-spin" />
                </button>

                <!-- Export PDF button -->
                <button
                  @click="exportPdf"
                  class="p-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-400 dark:text-gray-400 hover:text-teal-600 transition-all duration-300 group cursor-pointer border border-transparent hover:border-teal-200"
                  title="PDF"
                >
                  <Icon name="heroicons:arrow-down-tray-20-solid" class="h-5 w-5" />
                </button>

                <!-- Export Calendar button -->
                <button
                  @click="exportCalendar"
                  class="p-2.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/30 text-gray-400 dark:text-gray-400 hover:text-violet-600 transition-all duration-300 group cursor-pointer border border-transparent hover:border-violet-200"
                  :title="t.dashboard.trips.exportCalendar"
                >
                  <Icon name="heroicons:calendar-days-20-solid" class="h-5 w-5" />
                </button>

                <!-- Duplicate button -->
                <button
                  @click="duplicateTrip"
                  class="p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-400 hover:text-emerald-600 transition-all duration-300 group cursor-pointer border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                  :title="t.dashboard.trips.duplicate"
                >
                  <Icon v-if="!duplicateLoading" name="heroicons:document-duplicate-20-solid" class="h-5 w-5" />
                  <Icon v-else name="heroicons:arrow-path-20-solid" class="h-5 w-5 animate-spin" />
                </button>

                <!-- Delete button -->
                <button
                  @click="$emit('delete', props.trip.id)"
                  class="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 transition-all duration-300 group cursor-pointer border border-transparent hover:border-red-200 dark:hover:border-red-800"
                  :title="t.tripDetails.edit.deleteTrip"
                >
                  <Icon name="heroicons:trash-20-solid" class="h-5 w-5" />
                </button>

                <button @click="$emit('close')" class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                  <Icon name="heroicons:x-mark-20-solid" class="h-6 w-6" />
                </button>
              </div>
            </div>

            <!-- Tabs + Edit Toggle -->
            <div class="flex items-center gap-4">
              <div class="flex bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit shadow-inner">
               <button 
                 @click="activeTab = 'overview'"
                 class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer origin-center"
                 :class="activeTab === 'overview' ? 'bg-white dark:bg-slate-900 shadow-lg text-teal-600 scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
               >
                 <span class="flex items-center gap-2">
                   <Icon name="heroicons:squares-2x2-20-solid" class="h-4 w-4" />
                   {{ t.tripDetails.tabs.overview }}
                 </span>
               </button>
               <button 
                 @click="activeTab = 'itinerary'"
                 class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer origin-center"
                 :class="activeTab === 'itinerary' ? 'bg-white dark:bg-slate-900 shadow-lg text-teal-600 scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
               >
                 <span class="flex items-center gap-2">
                   <Icon name="heroicons:map-20-solid" class="h-4 w-4" />
                   {{ t.tripDetails.tabs.itinerary }}
                 </span>
               </button>
              </div>

              <!-- Edit Mode Toggle — next to tabs, only visible on itinerary tab -->
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 scale-90"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-90"
              >
                <button
                  v-if="activeTab === 'itinerary'"
                  @click="editMode = !editMode"
                  class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-[background,color,box-shadow] duration-200 cursor-pointer"
                  :class="editMode
                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 hover:bg-teal-600'
                    : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm'"
                >
                  <svg viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor" v-html="editMode ? ICON_CHECK : ICON_PENCIL" />
                  {{ editMode ? t.tripDetails.edit.finish : t.tripDetails.edit.modify }}
                </button>
              </Transition>
            </div>
          </div>

          <!-- Content Area -->
          <div class="flex-1 overflow-hidden relative flex flex-col md:flex-row">
            
            <!-- OVERVIEW TAB — Extracted to TripOverviewTab component -->
            <div v-show="activeTab === 'overview'" class="w-full h-full">
               <TripOverviewTab 
                 :trip-data="tripData"
                 :travelers="props.trip.travelers"
                 @open-budget-panel="budgetPanelOpen = true"
               />
            </div>

             <!-- ITINERARY TAB (v-show: keeps MapViewer alive) -->
            <div v-show="activeTab === 'itinerary'" class="flex w-full h-full flex-col md:flex-row animate-fade-in">
               
               <!-- Left: Map (Desktop) / Top (Mobile) -->
               <div class="w-full md:w-1/2 h-[300px] md:h-full relative border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-100 dark:from-slate-800 to-gray-50 dark:to-slate-900">
                  <MapViewer 
                    :activities="mapActivities"
                    :active="activeTab === 'itinerary'"
                  />
               </div>

               <!-- Right: Timeline -->
               <div ref="timelineRef" class="w-full md:w-1/2 h-full overflow-y-auto bg-white dark:bg-slate-900 p-8 relative">
                  
                  <div class="space-y-12">
                     
                     <div v-for="(section, sIdx) in (tripData.itinerary_sections as any[])" :key="sIdx" class="relative">
                        <!-- Section Header -->
                        <div class="mb-8 pb-4 border-b-2 border-gray-100 dark:border-gray-700">
                           <h3 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mb-2">{{ section.section_title }}</h3>
                           <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 font-semibold">
                              <span class="flex items-center gap-1.5">
                                 <Icon name="heroicons:map-pin-20-solid" class="h-4 w-4 text-teal-500" /> 
                                 {{ section.geographic_focus }}
                              </span>
                              <span class="flex items-center gap-1.5">
                                 <Icon name="heroicons:home-20-solid" class="h-4 w-4 text-indigo-500" /> 
                                 Base: {{ section.accommodation_base }}
                              </span>
                           </div>
                        </div>

                        <!-- Days in Section -->
                         <div class="space-y-10 pl-6 border-l-4 border-gradient-to-b from-teal-300 to-cyan-300 ml-4">
                            <div v-for="(day, dIdx) in (section.daily_plans as any[])" :key="day.day" class="relative">
                               <!-- Day Dot -->
                               <div class="absolute -left-[30px] top-0 h-5 w-5 rounded-full border-4 border-white bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg ring-2 ring-teal-100"></div>
                               
                               <div class="mb-5">
                                  <!-- Day Title — editable in edit mode -->
                                  <div class="flex items-baseline gap-2 mb-2">
                                    <span class="font-black text-gray-900 dark:text-gray-100 text-xl">{{ t.tripDetails.day }} {{ day.day }} :</span>
                                    <InlineEditField
                                      :model-value="day.title"
                                      :readonly="!editMode"
                                      display-class="font-black text-gray-900 text-xl"
                                      input-class="font-black text-gray-900 text-xl w-full"
                                      placeholder="Titre du jour..."
                                      @save="(v: string | number, prev: string | number) => handleSaveDayTitle(sIdx, dIdx, String(v), String(prev))"
                                    />
                                  </div>
                                  <div class="flex items-center gap-2">
                                    <p class="text-xs font-bold text-teal-700 bg-gradient-to-r from-teal-50 to-cyan-50 inline-block px-3 py-1.5 rounded-full border border-teal-200">{{ day.daily_pace }}</p>
                                    <!-- AI Day Modify — sparkles button, edit mode only -->
                                    <button
                                      v-if="editMode && !(aiDayTarget?.sectionIdx === sIdx && aiDayTarget?.dayIdx === dIdx)"
                                      @click="openAiDayPanel(sIdx, dIdx)"
                                      class="group/ai p-1.5 rounded-lg text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all cursor-pointer border border-transparent hover:border-violet-200 hover:shadow-sm"
                                      title="Modifier ce jour avec l'IA"
                                    >
                                      <svg viewBox="0 0 20 20" class="h-3.5 w-3.5 group-hover/ai:scale-110 transition-transform" fill="currentColor" v-html="ICON_SPARKLES" />
                                    </button>
                                  </div>
                               </div>

                               <!-- AI Day Modification Panel -->
                               <AiDayModifyPanel
                                 v-if="aiDayTarget?.sectionIdx === sIdx && aiDayTarget?.dayIdx === dIdx"
                                 :status="aiDayStatus"
                                 :preview="aiDayPreview"
                                 :error-message="aiDayError"
                                 @submit="handleAiDaySubmit"
                                 @accept="handleAiDayAccept"
                                 @discard="handleAiDayDiscard"
                                 @close="handleAiDayClose"
                               />

                               <!-- Activities list -->
                               <div class="space-y-4 rounded-xl">
                                  <div
                                    v-for="(act, aIdx) in (day.activities as any[])"
                                    :key="`${sIdx}-${dIdx}-${aIdx}-${act.time_flexible}`"
                                    class="relative"
                                  >
                                    <ViewportRender :placeholder-height="140">
                                      <ActivityCard
                                        :activity="act"
                                        :activity-type="act.activity_type || 'default'"
                                        :section-idx="sIdx"
                                        :day-idx="dIdx"
                                        :activity-idx="aIdx"
                                        :ai-loading="isAiLoading(sIdx, dIdx, aIdx)"
                                        :is-active="isCardAiActive(sIdx, dIdx, aIdx)"
                                        :edit-mode="editMode"
                                        @save-field="(field: string, value: any, prev: any) => handleSaveField(sIdx, dIdx, aIdx, field, value, prev)"
                                        @delete="handleDelete(sIdx, dIdx, aIdx)"
                                        @request-move="openMovePopover(sIdx, dIdx, aIdx, $event)"
                                      />
                                    </ViewportRender>

                                    <!-- Move Activity Popover -->
                                    <MoveActivityPopover
                                      :is-open="isMovePopoverOpen(sIdx, dIdx, aIdx)"
                                      :all-days="allDaysList"
                                      :current-section-idx="sIdx"
                                      :current-day-idx="dIdx"
                                      @select="(day: { sectionIdx: number; dayIdx: number }) => handleMoveToDay(sIdx, dIdx, aIdx, day.sectionIdx, day.dayIdx)"
                                      @close="closeMovePopover"
                                    />
                                  </div>

                                  <!-- Empty day hint -->
                                  <div
                                    v-if="editMode && day.activities.length === 0"
                                    class="py-6 border-2 border-dashed rounded-xl text-center text-sm font-medium border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
                                  >
                                    Aucune activité
                                  </div>
                               </div>

                            </div>
                         </div>

                     </div>

                  </div>

                  <!-- Undo Button — inside panel, sticky bottom -->
                  <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-2"
                  >
                    <button
                      v-if="editMode && canUndo"
                      @click="undo(); scheduleMapUpdate()"
                      class="sticky bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900 text-white text-xs font-semibold shadow-xl hover:bg-gray-800 transition-all cursor-pointer mx-auto mt-6"
                    >
                      <Icon name="heroicons:arrow-uturn-left-20-solid" class="h-4 w-4" />
                      {{ t.tripDetails.edit.undo }}
                    </button>
                  </Transition>
               </div>
            </div>

          </div>
        </div>

        <!-- Budget Detail Panel -->
        <BudgetDetailPanel 
          :is-open="budgetPanelOpen"
          :trip-data="tripData"
          :travelers="props.trip.travelers"
          @close="budgetPanelOpen = false"
        />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { useItineraryEdit } from '~/composables/useItineraryEdit'
import type { ActivityIdentifier, DayIdentifier } from '~/composables/useItineraryEdit'
import { ICON_PENCIL, ICON_CHECK, ICON_SPARKLES } from '~/utils/cardIcons'

const props = defineProps({
  isOpen: Boolean,
  trip: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'delete', 'duplicate'])

const { t, locale } = useTranslations()
const toast = useToast()

const activeTab = ref('overview')
const budgetPanelOpen = ref(false)
const editMode = ref(false)
const timelineRef = ref<HTMLElement | null>(null)

// Helper to access the correct root property structure
const tripData = computed(() => {
  if (props.trip.itinerary && props.trip.itinerary.itinerary_sections) {
    return props.trip.itinerary
  }
  return null
})

const currentTripId = computed(() => props.trip?.id ?? null)

// ─── Itinerary Editing ───
const {
  saveField,
  saveDayTitle,
  deleteActivity,
  moveActivityToDay,
  replaceDayActivities,
  aiModification,
  startAiModification,
  cancelAiModification,
  submitAiModification,
  acceptAiModification,
  discardAiModification,
  aiDayModification,
  startAiDayModification,
  cancelAiDayModification,
  submitAiDayModification,
  acceptAiDayModification,
  discardAiDayModification,
  undo,
  canUndo,
} = useItineraryEdit(tripData, currentTripId)

function makeId(sIdx: number, dIdx: number, aIdx: number): ActivityIdentifier {
  return { sectionIdx: sIdx, dayIdx: dIdx, activityIdx: aIdx }
}

// ─── Save handlers ───
function handleSaveField(sIdx: number, dIdx: number, aIdx: number, field: string, value: any, previousValue: any) {
  saveField(makeId(sIdx, dIdx, aIdx), field, value, previousValue)
  if (field === 'lat' || field === 'lng' || field === 'description' || field === 'time_flexible') {
    scheduleMapUpdate()
  }
  if (field === 'estimated_cost_usd' && tripData.value?.trip_summary) {
    const diff = Number(value) - Number(previousValue)
    tripData.value.trip_summary.total_estimated_cost_usd = 
      Math.round((tripData.value.trip_summary.total_estimated_cost_usd + diff) * 100) / 100
  }
}

function handleSaveDayTitle(sIdx: number, dIdx: number, newTitle: string, prevTitle: string) {
  saveDayTitle({ sectionIdx: sIdx, dayIdx: dIdx }, newTitle, prevTitle)
}

function handleDelete(sIdx: number, dIdx: number, aIdx: number) {
  deleteActivity(makeId(sIdx, dIdx, aIdx))
  scheduleMapUpdate()
}

// ─── Move Activity Popover ───
const movePopoverTarget = ref<ActivityIdentifier | null>(null)

/** Flat list of all days for the popover picker */
const allDaysList = computed(() => {
  if (!tripData.value?.itinerary_sections) return []
  const days: { sectionIdx: number; dayIdx: number; dayNumber: number; title: string }[] = []
  tripData.value.itinerary_sections.forEach((section: any, sIdx: number) => {
    section.daily_plans.forEach((day: any, dIdx: number) => {
      days.push({ sectionIdx: sIdx, dayIdx: dIdx, dayNumber: day.day, title: day.title })
    })
  })
  return days
})

function openMovePopover(sIdx: number, dIdx: number, aIdx: number, _event?: Event) {
  movePopoverTarget.value = makeId(sIdx, dIdx, aIdx)
}

function closeMovePopover() {
  movePopoverTarget.value = null
}

function isMovePopoverOpen(sIdx: number, dIdx: number, aIdx: number): boolean {
  const t = movePopoverTarget.value
  if (!t) return false
  return t.sectionIdx === sIdx && t.dayIdx === dIdx && t.activityIdx === aIdx
}

function handleMoveToDay(fromSIdx: number, fromDIdx: number, fromAIdx: number, toSIdx: number, toDIdx: number) {
  moveActivityToDay(makeId(fromSIdx, fromDIdx, fromAIdx), toSIdx, toDIdx)
  closeMovePopover()
  scheduleMapUpdate()
}

// ─── AI Popover (kept for future use, wired but no button triggers it from ActivityCard) ───
const aiPopoverTarget = ref<ActivityIdentifier | null>(null)
const showAiPopover = computed(() => aiPopoverTarget.value !== null)

function handleAiOpen(sIdx: number, dIdx: number, aIdx: number) {
  aiPopoverTarget.value = makeId(sIdx, dIdx, aIdx)
  startAiModification(makeId(sIdx, dIdx, aIdx))
}

function handleAiClose() {
  aiPopoverTarget.value = null
  cancelAiModification()
}

function handleAiSubmit(prompt: string) {
  submitAiModification(prompt)
}

function handleAiAccept() {
  acceptAiModification()
  aiPopoverTarget.value = null
  scheduleMapUpdate()
}

function handleAiDiscard() {
  discardAiModification()
  aiPopoverTarget.value = null
}

function isCardAiActive(sIdx: number, dIdx: number, aIdx: number): boolean {
  const t = aiPopoverTarget.value
  if (!t) return false
  return t.sectionIdx === sIdx && t.dayIdx === dIdx && t.activityIdx === aIdx
}

function isAiLoading(sIdx: number, dIdx: number, aIdx: number): boolean {
  const mod = aiModification.value
  if (!mod) return false
  const t = mod.target
  return t.sectionIdx === sIdx && t.dayIdx === dIdx && t.activityIdx === aIdx && mod.status === 'loading'
}

const currentAiStatus = computed(() => aiModification.value?.status ?? 'idle')
const currentAiPreview = computed(() => aiModification.value?.preview ?? null)
const currentAiError = computed(() => aiModification.value?.error ?? '')

// ─── AI Day-Level Modification ───
const aiDayTarget = computed(() => aiDayModification.value?.target ?? null)
const aiDayStatus = computed(() => aiDayModification.value?.status ?? 'idle')
const aiDayPreview = computed(() => aiDayModification.value?.preview ?? null)
const aiDayError = computed(() => aiDayModification.value?.error ?? '')

function openAiDayPanel(sIdx: number, dIdx: number) {
  startAiDayModification({ sectionIdx: sIdx, dayIdx: dIdx })
}

function handleAiDayClose() {
  cancelAiDayModification()
}

function handleAiDaySubmit(prompt: string) {
  submitAiDayModification(prompt)
}

function handleAiDayAccept() {
  acceptAiDayModification()
  scheduleMapUpdate()
}

function handleAiDayDiscard() {
  discardAiDayModification()
}

// ─── Decoupled Map Data (shallowRef + debounced update) ───
// The map ONLY updates on save/delete/undo events — NOT during typing.
// This eliminates map re-renders as a source of lag.
function buildMapActivities(): any[] {
  if (!tripData.value?.itinerary_sections) return []
  const allActs: any[] = []
  
  tripData.value.itinerary_sections.forEach((section: any) => {
    section.daily_plans.forEach((day: any) => {
      day.activities.forEach((act: any) => {
        if (act.has_physical_location && act.lat && act.lng) {
          allActs.push({
             lat: act.lat,
             lng: act.lng,
             description: act.description,
             time: act.time_flexible || act.time,
             day: day.day
          })
        }
      })
    })
  })
  return allActs
}

const mapActivities = shallowRef<any[]>(buildMapActivities())

// Rebuild map data only on structural changes (save, delete, undo, AI accept)
// Uses a 300ms debounce to batch rapid saves (e.g., undo spam)
let mapDebounceTimer: ReturnType<typeof setTimeout> | null = null
function scheduleMapUpdate() {
  if (mapDebounceTimer) clearTimeout(mapDebounceTimer)
  mapDebounceTimer = setTimeout(() => {
    mapActivities.value = buildMapActivities()
  }, 300)
}

// Map updates are now triggered EXPLICITLY from handleSaveField/handleDelete/handleAiAccept/undo.
// No deep watcher — avoids traversing the entire activity tree synchronously.

// Rebuild map data when tripData first becomes available (handles async load)
watch(tripData, (newData) => {
  if (newData) {
    mapActivities.value = buildMapActivities()
  }
})

// Also trigger map resize when switching to itinerary tab
watch(activeTab, (tab) => {
  if (tab === 'itinerary') {
    scheduleMapUpdate()
  }
})


function getBudgetLabel(tier: string) {
  if (!tier) return ''
  const key = tier.toLowerCase()
  const budgetOptions = t.value.plan?.form?.budgetOptions
  if (budgetOptions) {
    const map: Record<string, string> = {
      'low': budgetOptions.budget,
      'budget': budgetOptions.budget,
      'medium': budgetOptions.moderate,
      'moderate': budgetOptions.moderate,
      'balanced': budgetOptions.moderate,
      'high': budgetOptions.luxury,
      'luxury': budgetOptions.luxury
    }
    return map[key] || tier
  }
  return tier
}

// Utilities
function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const localeStr = locale.value === 'fr' ? 'fr-FR' : 'en-US'
  return new Date(dateStr).toLocaleDateString(localeStr, { day: 'numeric', month: 'short' })
}

// ─── Duplicate Trip ───
const duplicateLoading = ref(false)
const supabase = useSupabaseClient()

async function duplicateTrip() {
  if (!props.trip) return
  duplicateLoading.value = true
  try {
    const { id, created_at, share_token, ...tripData } = props.trip
    const { error } = await (supabase
      .from('trips' as any)
      .insert([{ ...tripData, share_token: null, destination_image_url: tripData.destination_image_url || null }] as any) as any)

    if (error) throw error

    toast.add({ title: t.value.dashboard.trips.duplicateSuccess, color: 'success' })
    emit('duplicate')
  } catch {
    toast.add({ title: t.value.common.error, description: t.value.dashboard.trips.duplicateError, color: 'error' })
  } finally {
    duplicateLoading.value = false
  }
}

// ─── Share Trip ───
const shareLoading = ref(false)

async function shareTripLink() {
  if (!props.trip?.id) return
  shareLoading.value = true
  try {
    const { shareToken } = await $fetch<{ shareToken: string }>('/api/share-trip', {
      method: 'POST',
      body: { tripId: props.trip.id },
    })
    const shareUrl = `${window.location.origin}/shared/${shareToken}`
    await navigator.clipboard.writeText(shareUrl)
    toast.add({ title: t.value.dashboard.trips.shareCopied, color: 'success' })
  } catch {
    toast.add({ title: t.value.common.error, description: t.value.dashboard.trips.shareError, color: 'error' })
  } finally {
    shareLoading.value = false
  }
}

// ─── Export PDF (opens printable HTML in new tab) ───
async function exportPdf() {
  if (!tripData.value) return
  try {
    const html = await $fetch('/api/export-pdf', {
      method: 'POST',
      body: {
        tripData: tripData.value,
        tripMeta: {
          departureDate: formatDate(props.trip.departure_date),
          returnDate: formatDate(props.trip.return_date),
          travelers: props.trip.travelers,
        },
      },
      responseType: 'text',
    })
    const blob = new Blob([html as string], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    if (win) {
      win.onload = () => {
        win.print()
      }
    }
  } catch {
    toast.add({ title: t.value.common.error, description: locale.value === 'fr' ? 'Échec de l\'export.' : 'Export failed.', color: 'error' })
  }
}



// ─── Export Calendar (ICS) ───
function exportCalendar() {
  if (!tripData.value?.itinerary_sections || !props.trip) return

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TripWiser//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  const startDate = new Date(props.trip.departure_date)

  tripData.value.itinerary_sections.forEach((section: any) => {
    section.daily_plans.forEach((day: any) => {
      const dayDate = new Date(startDate)
      dayDate.setDate(startDate.getDate() + (day.day - 1))
      const dateStr = dayDate.toISOString().replace(/[-:]/g, '').split('T')[0]

      day.activities.forEach((act: any) => {
        const time = act.time_flexible || act.time || '09:00'
        const [hours, minutes] = time.split(':').map(Number)
        const startDt = new Date(dayDate)
        startDt.setHours(hours || 9, minutes || 0, 0)
        const endDt = new Date(startDt)
        endDt.setHours(startDt.getHours() + 1)

        const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

        lines.push('BEGIN:VEVENT')
        lines.push(`DTSTART:${fmt(startDt)}`)
        lines.push(`DTEND:${fmt(endDt)}`)
        lines.push(`SUMMARY:${(act.description || 'Activity').replace(/[,;\\]/g, ' ')}`)
        if (act.address) lines.push(`LOCATION:${act.address.replace(/[,;\\]/g, ' ')}`)
        lines.push(`DESCRIPTION:${(act.tips || '').replace(/[,;\\]/g, ' ').replace(/\n/g, '\\n')}`)
        lines.push(`UID:${dateStr}-${Math.random().toString(36).slice(2, 8)}@tripwiser`)
        lines.push('END:VEVENT')
      })
    })
  })

  lines.push('END:VCALENDAR')

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${tripData.value.trip_summary?.destination || 'trip'}.ics`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border, #e5e7eb);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted, #d1d5db);
}
</style>
