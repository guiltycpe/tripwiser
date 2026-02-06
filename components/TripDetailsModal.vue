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
        <div class="relative w-full max-w-7xl h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white shadow-2xl flex flex-col border border-gray-200/60">
          
          <!-- Header (Always Visible) -->
          <div class="bg-white p-8 border-b border-gray-200/50 z-20">
            <div class="flex items-start justify-between mb-6">
              <div class="flex-1">
                 <div class="flex items-center gap-3 mb-2">
                   <h2 class="text-4xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                     {{ tripData.trip_summary.destination }}
                   </h2>
                   <span class="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white uppercase tracking-widest font-bold shadow-lg shadow-teal-500/30">
                     {{ getBudgetLabel(tripData.trip_summary.budget_tier) }}
                   </span>
                 </div>
                 <p class="text-sm font-semibold text-gray-500 flex items-center gap-2.5">
                   <Icon name="heroicons:calendar-20-solid" class="h-4 w-4 text-teal-500" />
                   {{ formatDate(props.trip.departure_date) }} - {{ formatDate(props.trip.return_date) }}
                   <span class="text-gray-300">•</span>
                   <span class="text-teal-600">{{ tripData.trip_summary.duration_days }} Jours</span>
                 </p>
              </div>

              <div class="flex items-center gap-3">
                <!-- Delete button -->
                <button 
                  @click="$emit('delete', props.trip.id)" 
                  class="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all duration-300 group cursor-pointer border border-transparent hover:border-red-200"
                  title="Supprimer le voyage"
                >
                  <Icon name="heroicons:trash-20-solid" class="h-5 w-5" />
                </button>

                <button @click="$emit('close')" class="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-gray-300">
                  <Icon name="heroicons:x-mark-20-solid" class="h-6 w-6" />
                </button>
              </div>
            </div>

            <!-- Tabs + Edit Toggle -->
            <div class="flex items-center gap-4">
              <div class="flex bg-gray-100 p-1.5 rounded-2xl w-fit shadow-inner">
               <button 
                 @click="activeTab = 'overview'"
                 class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer origin-center"
                 :class="activeTab === 'overview' ? 'bg-white shadow-lg text-teal-600 scale-105' : 'text-gray-500 hover:text-gray-700'"
               >
                 <span class="flex items-center gap-2">
                   <Icon name="heroicons:squares-2x2-20-solid" class="h-4 w-4" />
                   Vue d'ensemble
                 </span>
               </button>
               <button 
                 @click="activeTab = 'itinerary'"
                 class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer origin-center"
                 :class="activeTab === 'itinerary' ? 'bg-white shadow-lg text-teal-600 scale-105' : 'text-gray-500 hover:text-gray-700'"
               >
                 <span class="flex items-center gap-2">
                   <Icon name="heroicons:map-20-solid" class="h-4 w-4" />
                   Itinéraire Détaillé
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
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'"
                >
                  <svg viewBox="0 0 20 20" class="h-4 w-4" fill="currentColor" v-html="editMode ? ICON_CHECK : ICON_PENCIL" />
                  {{ editMode ? 'Terminer' : 'Modifier' }}
                </button>
              </Transition>
            </div>
          </div>

          <!-- Content Area -->
          <div class="flex-1 overflow-hidden relative flex flex-col md:flex-row">
            
            <!-- OVERVIEW TAB (v-show: keeps DOM alive across tab switches) -->
            <div v-show="activeTab === 'overview'" class="w-full h-full overflow-y-auto p-8 space-y-6 animate-fade-in">
               
               <!-- Compact 2-Column Layout -->
               <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  
                  <!-- LEFT COLUMN: Budget Summary (1/3) -->
                  <div class="lg:col-span-1 space-y-6 flex flex-col">
                     
                     <!-- Budget Card - Compact -->
                     <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex-1 flex flex-col">
                        <div class="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 text-white">
                           <div class="flex items-center justify-between mb-2">
                              <h3 class="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                 <Icon name="heroicons:banknotes-20-solid" class="h-4 w-4" />
                                 Budget Total
                              </h3>
                              <span class="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                                 {{ props.trip.travelers }} pers.
                              </span>
                           </div>
                           <div class="text-4xl font-black tracking-tight">${{ tripData.trip_summary.total_estimated_cost_usd }}</div>
                        </div>
                        
                        <div class="p-4 space-y-3 flex-1 flex flex-col">
                           <!-- Quick Stats -->
                           <div class="flex gap-2">
                              <div class="flex-1 bg-teal-50 rounded-lg p-2.5 text-center border border-teal-100">
                                 <div class="text-xs text-teal-600 font-semibold mb-0.5">Par personne</div>
                                 <div class="text-lg font-black text-teal-700">${{ Math.round(tripData.trip_summary.total_estimated_cost_usd / props.trip.travelers) }}</div>
                              </div>
                              <div class="flex-1 bg-blue-50 rounded-lg p-2.5 text-center border border-blue-100">
                                 <div class="text-xs text-blue-600 font-semibold mb-0.5">Par jour</div>
                                 <div class="text-lg font-black text-blue-700">${{ Math.round(tripData.trip_summary.total_estimated_cost_usd / tripData.trip_summary.duration_days) }}</div>
                              </div>
                           </div>

                           <!-- Compact Breakdown -->
                           <div class="space-y-2.5 pt-2 border-t border-gray-100 flex-1">
                              <div class="flex items-center justify-between text-sm">
                                 <span class="flex items-center gap-2 text-gray-700 font-medium">
                                    <span class="h-2 w-2 rounded-full bg-indigo-500"></span>
                                    Hébergement
                                 </span>
                                 <span class="font-bold text-gray-900">${{ tripData.trip_summary.cost_breakdown?.accommodation_total || 0 }}</span>
                              </div>
                              <div class="w-full bg-gray-100 rounded-full h-1.5">
                                 <div class="bg-indigo-500 h-full rounded-full" :style="{ width: ((tripData.trip_summary.cost_breakdown?.accommodation_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100) + '%' }"></div>
                              </div>

                              <div class="flex items-center justify-between text-sm">
                                 <span class="flex items-center gap-2 text-gray-700 font-medium">
                                    <span class="h-2 w-2 rounded-full bg-teal-500"></span>
                                    Nourriture
                                 </span>
                                 <span class="font-bold text-gray-900">${{ tripData.trip_summary.cost_breakdown?.food_total || 0 }}</span>
                              </div>
                              <div class="w-full bg-gray-100 rounded-full h-1.5">
                                 <div class="bg-teal-500 h-full rounded-full" :style="{ width: ((tripData.trip_summary.cost_breakdown?.food_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100) + '%' }"></div>
                              </div>

                              <div class="flex items-center justify-between text-sm">
                                 <span class="flex items-center gap-2 text-gray-700 font-medium">
                                    <span class="h-2 w-2 rounded-full bg-orange-500"></span>
                                    Activités
                                 </span>
                                 <span class="font-bold text-gray-900">${{ tripData.trip_summary.cost_breakdown?.activities_total || 0 }}</span>
                              </div>
                              <div class="w-full bg-gray-100 rounded-full h-1.5">
                                 <div class="bg-orange-500 h-full rounded-full" :style="{ width: ((tripData.trip_summary.cost_breakdown?.activities_total || 0) / tripData.trip_summary.total_estimated_cost_usd * 100) + '%' }"></div>
                              </div>
                           </div>

                           <button 
                              @click="budgetPanelOpen = true"
                              class="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 group cursor-pointer mt-auto"
                           >
                              <Icon name="heroicons:calculator-20-solid" class="h-4 w-4" />
                              Détails Complets
                              <Icon name="heroicons:arrow-right-20-solid" class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                     </div>

                  </div>

                  <!-- RIGHT COLUMN: Flights + Accommodation (2/3) -->
                  <div class="lg:col-span-2 space-y-6">
                     
                     <!-- Flights - Priority -->
                     <div v-if="tripData.transport" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 overflow-hidden">
                        <div class="p-5">
                           <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Icon name="heroicons:paper-airplane-20-solid" class="h-4 w-4 text-blue-600" />
                              Vols Recommandés
                           </h3>
                           
                           <div class="grid md:grid-cols-2 gap-4">
                              <a :href="tripData.transport.outbound_flight.kayak_link || tripData.transport.outbound_flight.google_flights_link || tripData.transport.outbound_flight.skyscanner_link" target="_blank" class="group/flight bg-white rounded-xl p-4 hover:shadow-md transition-all border border-blue-100 hover:border-blue-300">
                                 <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow group-hover/flight:scale-110 transition-transform">
                                       <Icon name="heroicons:arrow-up-right-20-solid" class="h-5 w-5" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                       <p class="text-xs text-blue-600 uppercase font-bold tracking-wide">Aller</p>
                                       <p class="font-bold text-gray-900 truncate">{{ tripData.trip_summary.destination }}</p>
                                       <p class="text-xs text-gray-600 font-medium">{{ tripData.transport.outbound_flight.departure_date }}</p>
                                    </div>
                                 </div>
                              </a>
                              
                              <a :href="tripData.transport.return_flight.kayak_link || tripData.transport.return_flight.google_flights_link || tripData.transport.return_flight.skyscanner_link" target="_blank" class="group/flight bg-white rounded-xl p-4 hover:shadow-md transition-all border border-indigo-100 hover:border-indigo-300">
                                 <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow group-hover/flight:scale-110 transition-transform">
                                       <Icon name="heroicons:arrow-down-left-20-solid" class="h-5 w-5" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                       <p class="text-xs text-indigo-600 uppercase font-bold tracking-wide">Retour</p>
                                       <p class="font-bold text-gray-900 truncate">Vol de retour</p>
                                       <p class="text-xs text-gray-600 font-medium">{{ tripData.transport.return_flight.return_date }}</p>
                                    </div>
                                 </div>
                              </a>
                           </div>
                        </div>
                     </div>

                     <!-- Accommodation Strategy - Streamlined -->
                     <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div class="p-5">
                           <h3 class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Icon name="heroicons:home-modern-20-solid" class="h-4 w-4 text-purple-600" />
                              Où Dormir
                           </h3>
                           
                           <div class="mb-4 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border-l-4 border-teal-500">
                              <p class="text-sm text-gray-700 italic leading-relaxed">
                                "{{ tripData.accommodation_strategy?.reasoning }}"
                              </p>
                           </div>

                           <div class="grid md:grid-cols-2 gap-3">
                              <a v-for="(base, idx) in tripData.accommodation_strategy?.bases" :key="idx" :href="base.booking_link" target="_blank" class="block p-4 rounded-xl border-2 border-gray-200 hover:border-teal-400 transition-all bg-gray-50 hover:bg-white hover:shadow-md group/base cursor-pointer">
                                 <div class="flex items-start justify-between mb-2">
                                    <h4 class="font-bold text-gray-900 group-hover/base:text-teal-600 transition-colors">{{ base.neighborhood }}</h4>
                                    <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="h-4 w-4 text-gray-400 group-hover/base:text-teal-500 transition-colors flex-shrink-0" />
                                 </div>
                                 <div class="flex gap-2 mb-2">
                                    <span class="text-xs font-bold px-2 py-1 rounded-md bg-indigo-100 text-indigo-700">{{ base.nights }} Nuits</span>
                                    <span class="text-xs font-bold px-2 py-1 rounded-md bg-green-100 text-green-700">${{ base.estimated_cost_per_night_usd }}/nuit</span>
                                 </div>
                                 <p class="text-xs text-gray-600 leading-relaxed line-clamp-2">{{ base.why_here }}</p>
                              </a>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>

            </div>

             <!-- ITINERARY TAB (v-show: keeps MapViewer alive) -->
            <div v-show="activeTab === 'itinerary'" class="flex w-full h-full flex-col md:flex-row animate-fade-in">
               
               <!-- Left: Map (Desktop) / Top (Mobile) -->
               <div class="w-full md:w-1/2 h-[300px] md:h-full relative border-b md:border-b-0 md:border-r border-gray-200 bg-gradient-to-br from-gray-100 to-gray-50">
                  <MapViewer 
                    :activities="mapActivities"
                    :active="activeTab === 'itinerary'"
                  />
               </div>

               <!-- Right: Timeline -->
               <div ref="timelineRef" class="w-full md:w-1/2 h-full overflow-y-auto bg-white p-8 relative">
                  
                  <div class="space-y-12">
                     
                     <div v-for="(section, sIdx) in tripData.itinerary_sections" :key="sIdx" class="relative">
                        <!-- Section Header -->
                        <div class="mb-8 pb-4 border-b-2 border-gray-100">
                           <h3 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mb-2">{{ section.section_title }}</h3>
                           <div class="flex items-center gap-4 text-sm text-gray-600 font-semibold">
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
                            <div v-for="(day, dIdx) in section.daily_plans" :key="day.day" class="relative">
                               <!-- Day Dot -->
                               <div class="absolute -left-[30px] top-0 h-5 w-5 rounded-full border-4 border-white bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg ring-2 ring-teal-100"></div>
                               
                               <div class="mb-5">
                                  <!-- Day Title — editable in edit mode -->
                                  <div class="flex items-baseline gap-2 mb-2">
                                    <span class="font-black text-gray-900 text-xl">Jour {{ day.day }} :</span>
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
                                    v-for="(act, aIdx) in day.activities"
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
                                    class="py-6 border-2 border-dashed rounded-xl text-center text-sm font-medium border-gray-200 text-gray-400"
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
                      Annuler
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

defineEmits(['close', 'delete'])

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
} = useItineraryEdit(tripData)

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
  const t = tier.toLowerCase()
  const map: Record<string, string> = {
    'low': 'Budget Friendly',
    'budget': 'Budget Friendly',
    'medium': 'Balanced Comfort',
    'moderate': 'Balanced Comfort',
    'balanced': 'Balanced Comfort',
    'high': 'Luxury Experience',
    'luxury': 'Luxury Experience'
  }
  return map[t] || tier
}

// Utilities
function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}



// getActivityIcon removed — ActivityCard now resolves icons from utils/cardIcons.ts
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
  background: #e5e7eb;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
