<template>
  <div class="h-full flex flex-col">
    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <Icon name="heroicons:arrow-path-20-solid" class="h-8 w-8 text-slate-400 animate-spin mx-auto mb-3" />
        <p class="text-sm text-slate-500">{{ locale === 'fr' ? 'Chargement...' : 'Loading...' }}</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="!trip || !tripData" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <Icon name="heroicons:exclamation-triangle-20-solid" class="h-7 w-7 text-slate-400" />
        </div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{{ locale === 'fr' ? 'Voyage introuvable' : 'Trip not found' }}</h3>
        <button @click="router.push('/dashboard')" class="mt-4 px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 cursor-pointer">
          {{ locale === 'fr' ? 'Retour au tableau de bord' : 'Back to dashboard' }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Header -->
      <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-5">
        <div class="max-w-7xl mx-auto">
          <!-- Top row: back + actions -->
          <div class="flex items-center justify-between mb-4">
            <button
              @click="router.push('/dashboard')"
              class="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              <Icon name="heroicons:arrow-left-20-solid" class="h-4 w-4" />
              {{ locale === 'fr' ? 'Tableau de bord' : 'Dashboard' }}
            </button>

            <div class="flex items-center gap-2">
              <button
                @click="shareTripLink"
                class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                title="Share"
              >
                <Icon v-if="!shareLoading" name="heroicons:share-20-solid" class="h-4.5 w-4.5" />
                <Icon v-else name="heroicons:arrow-path-20-solid" class="h-4.5 w-4.5 animate-spin" />
              </button>
              <button
                @click="exportPdf"
                class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                title="PDF"
              >
                <Icon name="heroicons:arrow-down-tray-20-solid" class="h-4.5 w-4.5" />
              </button>
              <button
                @click="exportCalendar"
                class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer"
                :title="t.dashboard.trips.exportCalendar"
              >
                <Icon name="heroicons:calendar-days-20-solid" class="h-4.5 w-4.5" />
              </button>
              <button
                @click="duplicateTrip"
                class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                :title="t.dashboard.trips.duplicate"
              >
                <Icon v-if="!duplicateLoading" name="heroicons:document-duplicate-20-solid" class="h-4.5 w-4.5" />
                <Icon v-else name="heroicons:arrow-path-20-solid" class="h-4.5 w-4.5 animate-spin" />
              </button>
              <button
                @click="confirmDelete"
                class="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                :title="t.tripDetails.edit.deleteTrip"
              >
                <Icon name="heroicons:trash-20-solid" class="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          <!-- Trip info -->
          <div class="mb-4">
            <div class="flex items-center gap-3 mb-1">
              <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {{ formatDestination(tripData.trip_summary.destination) }}
              </h1>
              <span class="text-xs px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-medium border border-teal-100 dark:border-teal-800">
                {{ getBudgetLabel(tripData.trip_summary.budget_tier) }}
              </span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Icon name="heroicons:calendar-20-solid" class="h-4 w-4 text-slate-400" />
              {{ formatDate(trip.departure_date) }} - {{ formatDate(trip.return_date) }}
              <span class="text-slate-300">·</span>
              <span>{{ tripData.trip_summary.duration_days }} {{ t.tripDetails.days }}</span>
              <span class="text-slate-300">·</span>
              <Icon name="heroicons:users-20-solid" class="h-4 w-4 text-slate-400" />
              {{ trip.travelers || 1 }}
            </p>
          </div>

          <!-- Tabs + Edit Toggle -->
          <div class="flex items-center gap-4">
            <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                @click="activeTab = 'overview'"
                class="px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                :class="activeTab === 'overview' ? 'bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
              >
                <span class="flex items-center gap-2">
                  <Icon name="heroicons:squares-2x2-20-solid" class="h-4 w-4" />
                  {{ t.tripDetails.tabs.overview }}
                </span>
              </button>
              <button
                @click="activeTab = 'itinerary'"
                class="px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                :class="activeTab === 'itinerary' ? 'bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
              >
                <span class="flex items-center gap-2">
                  <Icon name="heroicons:map-20-solid" class="h-4 w-4" />
                  {{ t.tripDetails.tabs.itinerary }}
                </span>
              </button>
            </div>

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
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                :class="editMode
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'"
              >
                <svg viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor" v-html="editMode ? ICON_CHECK : ICON_PENCIL" />
                {{ editMode ? t.tripDetails.edit.finish : t.tripDetails.edit.modify }}
              </button>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-hidden relative flex flex-col md:flex-row">
        <!-- OVERVIEW TAB -->
        <div v-show="activeTab === 'overview'" class="w-full h-full overflow-y-auto">
          <TripOverviewTab
            :trip-data="tripData"
            :travelers="trip.travelers"
            @open-budget-panel="budgetPanelOpen = true"
          />
        </div>

        <!-- ITINERARY TAB -->
        <div v-show="activeTab === 'itinerary'" class="flex w-full h-full flex-col md:flex-row">
          <!-- Map -->
          <div class="w-full md:w-1/2 h-[300px] md:h-full relative border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <MapViewer
              :activities="mapActivities"
              :active="activeTab === 'itinerary'"
            />
          </div>

          <!-- Timeline -->
          <div ref="timelineRef" class="w-full md:w-1/2 h-full overflow-y-auto bg-white dark:bg-slate-900 p-6 md:p-8 relative">
            <div class="space-y-10">
              <div v-for="(section, sIdx) in (tripData.itinerary_sections as any[])" :key="sIdx" class="relative">
                <!-- Section Header -->
                <div class="mb-6 pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{{ section.section_title }}</h3>
                  <div class="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span class="flex items-center gap-1.5">
                      <Icon name="heroicons:map-pin-20-solid" class="h-3.5 w-3.5 text-teal-500" />
                      {{ section.geographic_focus }}
                    </span>
                    <span class="flex items-center gap-1.5">
                      <Icon name="heroicons:home-20-solid" class="h-3.5 w-3.5 text-slate-400" />
                      {{ section.accommodation_base }}
                    </span>
                  </div>
                </div>

                <!-- Days -->
                <div class="space-y-8 pl-6 border-l-2 border-slate-200 dark:border-slate-700 ml-3">
                  <div v-for="(day, dIdx) in (section.daily_plans as any[])" :key="day.day" class="relative">
                    <!-- Day Dot -->
                    <div class="absolute -left-[25px] top-0.5 h-4 w-4 rounded-full border-[3px] border-white dark:border-slate-900 bg-teal-500 shadow-sm"></div>

                    <div class="mb-4">
                      <div class="flex items-baseline gap-2 mb-1.5">
                        <span class="font-semibold text-slate-900 dark:text-slate-100">{{ t.tripDetails.day }} {{ day.day }} :</span>
                        <InlineEditField
                          :model-value="day.title"
                          :readonly="!editMode"
                          display-class="font-semibold text-slate-900 dark:text-slate-100"
                          input-class="font-semibold text-slate-900 dark:text-slate-100 w-full"
                          placeholder="Day title..."
                          @save="(v: string | number, prev: string | number) => handleSaveDayTitle(sIdx, dIdx, String(v), String(prev))"
                        />
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">{{ day.daily_pace }}</span>
                        <button
                          v-if="editMode && !(aiDayTarget?.sectionIdx === sIdx && aiDayTarget?.dayIdx === dIdx)"
                          @click="openAiDayPanel(sIdx, dIdx)"
                          class="p-1.5 rounded-lg text-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all cursor-pointer"
                          :title="locale === 'fr' ? 'Modifier ce jour avec l\'IA' : 'Modify this day with AI'"
                        >
                          <svg viewBox="0 0 20 20" class="h-3.5 w-3.5" fill="currentColor" v-html="ICON_SPARKLES" />
                        </button>
                      </div>
                    </div>

                    <!-- AI Day Panel -->
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

                    <!-- Activities -->
                    <div class="space-y-3">
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
                            @delete="handleDeleteActivity(sIdx, dIdx, aIdx)"
                            @request-move="openMovePopover(sIdx, dIdx, aIdx, $event)"
                          />
                        </ViewportRender>

                        <MoveActivityPopover
                          :is-open="isMovePopoverOpen(sIdx, dIdx, aIdx)"
                          :all-days="allDaysList"
                          :current-section-idx="sIdx"
                          :current-day-idx="dIdx"
                          @select="(d: { sectionIdx: number; dayIdx: number }) => handleMoveToDay(sIdx, dIdx, aIdx, d.sectionIdx, d.dayIdx)"
                          @close="closeMovePopover"
                        />
                      </div>

                      <div
                        v-if="editMode && day.activities.length === 0"
                        class="py-6 border-2 border-dashed rounded-xl text-center text-sm font-medium border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                      >
                        {{ locale === 'fr' ? 'Aucune activité' : 'No activities' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Undo -->
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
                class="sticky bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xl hover:bg-slate-800 transition-all cursor-pointer mx-auto mt-6"
              >
                <Icon name="heroicons:arrow-uturn-left-20-solid" class="h-4 w-4" />
                {{ t.tripDetails.edit.undo }}
              </button>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Budget Panel -->
      <BudgetDetailPanel
        :is-open="budgetPanelOpen"
        :trip-data="tripData"
        :travelers="trip.travelers"
        @close="budgetPanelOpen = false"
      />

      <!-- Delete Confirmation Modal -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/40" @click="showDeleteConfirm = false"></div>
          <div class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-700">
            <div class="flex flex-col items-center text-center">
              <div class="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
                <Icon name="heroicons:exclamation-triangle-20-solid" class="h-6 w-6 text-rose-600" />
              </div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{{ t.common.delete }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">{{ t.dashboard.trips.deleteConfirm }}</p>
              <div class="flex gap-3 w-full">
                <button
                  @click="showDeleteConfirm = false"
                  class="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {{ t.common.cancel }}
                </button>
                <button
                  @click="executeDelete"
                  class="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-500 transition-colors cursor-pointer"
                >
                  {{ t.common.delete }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import { useItineraryEdit } from '~/composables/useItineraryEdit'
import type { ActivityIdentifier } from '~/composables/useItineraryEdit'
import { ICON_PENCIL, ICON_CHECK, ICON_SPARKLES } from '~/utils/cardIcons'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const { t, locale } = useTranslations()
const toast = useToast()

const trip = ref<any>(null)
const loading = ref(true)
const activeTab = ref('overview')
const budgetPanelOpen = ref(false)
const editMode = ref(false)
const timelineRef = ref<HTMLElement | null>(null)
const showDeleteConfirm = ref(false)

// Load trip data
onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error
    trip.value = data
  } catch {
    trip.value = null
  } finally {
    loading.value = false
  }
})

const tripData = computed(() => {
  if (trip.value?.itinerary?.itinerary_sections) {
    return trip.value.itinerary
  }
  return null
})

const currentTripId = computed(() => trip.value?.id ?? null)

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

function handleDeleteActivity(sIdx: number, dIdx: number, aIdx: number) {
  deleteActivity(makeId(sIdx, dIdx, aIdx))
  scheduleMapUpdate()
}

// ─── Move Activity Popover ───
const movePopoverTarget = ref<ActivityIdentifier | null>(null)

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

// ─── AI Activity-Level ───
const aiPopoverTarget = ref<ActivityIdentifier | null>(null)

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

// ─── AI Day-Level ───
const aiDayTarget = computed(() => aiDayModification.value?.target ?? null)
const aiDayStatus = computed(() => aiDayModification.value?.status ?? 'idle')
const aiDayPreview = computed(() => aiDayModification.value?.preview ?? null)
const aiDayError = computed(() => aiDayModification.value?.error ?? '')

function openAiDayPanel(sIdx: number, dIdx: number) {
  startAiDayModification({ sectionIdx: sIdx, dayIdx: dIdx })
}

function handleAiDayClose() { cancelAiDayModification() }
function handleAiDaySubmit(prompt: string) { submitAiDayModification(prompt) }
function handleAiDayAccept() { acceptAiDayModification(); scheduleMapUpdate() }
function handleAiDayDiscard() { discardAiDayModification() }

// ─── Map Data ───
function buildMapActivities(): any[] {
  if (!tripData.value?.itinerary_sections) return []
  const allActs: any[] = []
  tripData.value.itinerary_sections.forEach((section: any) => {
    section.daily_plans.forEach((day: any) => {
      day.activities.forEach((act: any) => {
        if (act.has_physical_location && act.lat && act.lng) {
          allActs.push({
            lat: act.lat, lng: act.lng,
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

const mapActivities = shallowRef<any[]>([])

let mapDebounceTimer: ReturnType<typeof setTimeout> | null = null
function scheduleMapUpdate() {
  if (mapDebounceTimer) clearTimeout(mapDebounceTimer)
  mapDebounceTimer = setTimeout(() => {
    mapActivities.value = buildMapActivities()
  }, 300)
}

watch(tripData, (newData) => {
  if (newData) mapActivities.value = buildMapActivities()
})

watch(activeTab, (tab) => {
  if (tab === 'itinerary') scheduleMapUpdate()
})

// ─── Helpers ───
function getBudgetLabel(tier: string) {
  if (!tier) return ''
  const key = tier.toLowerCase()
  const budgetOptions = t.value.plan?.form?.budgetOptions
  if (budgetOptions) {
    const map: Record<string, string> = {
      'low': budgetOptions.budget, 'budget': budgetOptions.budget,
      'medium': budgetOptions.moderate, 'moderate': budgetOptions.moderate, 'balanced': budgetOptions.moderate,
      'high': budgetOptions.luxury, 'luxury': budgetOptions.luxury
    }
    return map[key] || tier
  }
  return tier
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const localeStr = locale.value === 'fr' ? 'fr-FR' : 'en-US'
  return new Date(dateStr).toLocaleDateString(localeStr, { day: 'numeric', month: 'short' })
}

// ─── Delete ───
function confirmDelete() { showDeleteConfirm.value = true }

async function executeDelete() {
  if (!trip.value?.id) return
  showDeleteConfirm.value = false
  try {
    const { error } = await supabase.from('trips').delete().eq('id', trip.value.id)
    if (error) throw error
    toast.add({ title: t.value.dashboard.trips.deleteSuccess, color: 'success' })
    router.push('/dashboard')
  } catch {
    toast.add({ title: t.value.common.error, description: t.value.dashboard.trips.deleteError, color: 'error' })
  }
}

// ─── Duplicate ───
const duplicateLoading = ref(false)

async function duplicateTrip() {
  if (!trip.value) return
  duplicateLoading.value = true
  try {
    const { id, created_at, share_token, ...data } = trip.value
    const { error } = await (supabase
      .from('trips' as any)
      .insert([{ ...data, share_token: null }] as any) as any)
    if (error) throw error
    toast.add({ title: t.value.dashboard.trips.duplicateSuccess, color: 'success' })
  } catch {
    toast.add({ title: t.value.common.error, description: t.value.dashboard.trips.duplicateError, color: 'error' })
  } finally {
    duplicateLoading.value = false
  }
}

// ─── Share ───
const shareLoading = ref(false)

async function shareTripLink() {
  if (!trip.value?.id) return
  shareLoading.value = true
  try {
    const { shareToken } = await $fetch<{ shareToken: string }>('/api/share-trip', {
      method: 'POST',
      body: { tripId: trip.value.id },
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

// ─── Export PDF ───
async function exportPdf() {
  if (!tripData.value) return
  try {
    const html = await $fetch('/api/export-pdf', {
      method: 'POST',
      body: {
        tripData: tripData.value,
        tripMeta: {
          departureDate: formatDate(trip.value.departure_date),
          returnDate: formatDate(trip.value.return_date),
          travelers: trip.value.travelers,
        },
      },
      responseType: 'text',
    })
    const blob = new Blob([html as string], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    if (win) { win.onload = () => { win.print() } }
  } catch {
    toast.add({ title: t.value.common.error, description: locale.value === 'fr' ? 'Échec de l\'export.' : 'Export failed.', color: 'error' })
  }
}

// ─── Export Calendar ───
function exportCalendar() {
  if (!tripData.value?.itinerary_sections || !trip.value) return

  const lines: string[] = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TripWiser//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
  ]

  const startDate = new Date(trip.value.departure_date)

  tripData.value.itinerary_sections.forEach((section: any) => {
    section.daily_plans.forEach((day: any) => {
      const dayDate = new Date(startDate)
      dayDate.setDate(startDate.getDate() + (day.day - 1))

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
        lines.push(`UID:${dayDate.toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).slice(2, 8)}@tripwiser`)
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
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-hover);
}
</style>
