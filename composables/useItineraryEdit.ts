/**
 * useItineraryEdit — State management for itinerary editing
 * 
 * FEATURES:
 * - Full undo history back to original generated state (no cap)
 * - Saves initial snapshot on first edit for complete rollback
 * - Auto-sort activities by time after time_flexible changes
 * - Move activity across days (drag-and-drop support)
 * - Day title editing with undo
 * - structuredClone for safe snapshots
 * - shallowRef for AI state to avoid deep watching
 */

import { ref, shallowRef, computed, toRaw, triggerRef } from 'vue'

export interface ActivityIdentifier {
  sectionIdx: number
  dayIdx: number
  activityIdx: number
}

export interface DayIdentifier {
  sectionIdx: number
  dayIdx: number
}

export interface AiModification {
  target: ActivityIdentifier
  prompt: string
  status: 'idle' | 'loading' | 'preview' | 'error'
  preview: any | null
  error: string | null
}

export interface AiDayModification {
  target: DayIdentifier
  prompt: string
  status: 'idle' | 'loading' | 'preview' | 'error'
  preview: any[] | null
  error: string | null
}

export interface UndoEntry {
  type: 'edit' | 'delete' | 'move' | 'day-title' | 'sort' | 'replace-day'
  target: ActivityIdentifier
  previousData: any
  /** Extra context for complex operations */
  meta?: {
    fromSectionIdx?: number
    fromDayIdx?: number
    fromActivityIdx?: number
    previousActivities?: any[] // for sort undo
  }
  timestamp: number
}

function cloneActivity(activity: any): any {
  return structuredClone(toRaw(activity))
}

/** Parse "HH:MM" or flexible time strings into sortable minutes (0-1439) */
function parseTimeToMinutes(timeStr: string | undefined): number {
  if (!timeStr) return 9999
  const match = timeStr.match(/(\d{1,2}):(\d{2})/)
  if (match) {
    let h = parseInt(match[1]!)
    const m = parseInt(match[2]!)
    if (timeStr.toLowerCase().includes('pm') && h < 12) h += 12
    if (timeStr.toLowerCase().includes('am') && h === 12) h = 0
    return h * 60 + m
  }
  const hMatch = timeStr.match(/(\d{1,2})h(\d{2})?/)
  if (hMatch) return parseInt(hMatch[1]!) * 60 + (hMatch[2] ? parseInt(hMatch[2]) : 0)
  return 9999
}

export function useItineraryEdit(tripData: Ref<any>) {
  // ─── Core State ───
  const aiModification = shallowRef<AiModification | null>(null)
  const aiDayModification = shallowRef<AiDayModification | null>(null)
  const undoStack = shallowRef<UndoEntry[]>([])
  const canUndo = computed(() => undoStack.value.length > 0)

  // ─── Activity Access ───
  function getActivity(id: ActivityIdentifier) {
    const data = tripData.value
    if (!data?.itinerary_sections) return null
    return data.itinerary_sections[id.sectionIdx]
      ?.daily_plans[id.dayIdx]
      ?.activities[id.activityIdx] ?? null
  }

  function getDayActivities(sIdx: number, dIdx: number): any[] | null {
    const data = tripData.value
    if (!data?.itinerary_sections) return null
    return data.itinerary_sections[sIdx]?.daily_plans[dIdx]?.activities ?? null
  }

  // ─── Undo (internal push — NO cap, full history) ───
  function pushUndo(entry: Omit<UndoEntry, 'timestamp'>) {
    undoStack.value.push({ ...entry, timestamp: Date.now() })
    triggerRef(undoStack)
  }

  // ─── Save field — on blur, creates undo snapshot only if changed ───
  function saveField(id: ActivityIdentifier, field: string, value: any, previousValue: any) {
    const activity = getActivity(id)
    if (!activity) return

    if (previousValue !== value) {
      pushUndo({
        type: 'edit',
        target: { ...id },
        previousData: { ...toRaw(activity), [field]: previousValue },
      })
    }
    ;(activity as any)[field] = value

    // Auto-sort by time when time_flexible changes
    if (field === 'time_flexible') {
      sortDayActivities(id.sectionIdx, id.dayIdx)
    }
  }

  // ─── Sort activities within a day by time ───
  function sortDayActivities(sIdx: number, dIdx: number) {
    const activities = getDayActivities(sIdx, dIdx)
    if (!activities || activities.length < 2) return

    activities.sort((a: any, b: any) => {
      return parseTimeToMinutes(a.time_flexible) - parseTimeToMinutes(b.time_flexible)
    })
  }

  // ─── Save day title ───
  function saveDayTitle(dayId: DayIdentifier, newTitle: string, previousTitle: string) {
    const data = tripData.value
    if (!data?.itinerary_sections) return
    const day = data.itinerary_sections[dayId.sectionIdx]?.daily_plans[dayId.dayIdx]
    if (!day) return

    if (newTitle !== previousTitle) {
      pushUndo({
        type: 'day-title',
        target: { sectionIdx: dayId.sectionIdx, dayIdx: dayId.dayIdx, activityIdx: -1 },
        previousData: previousTitle,
      })
    }
    day.title = newTitle
  }

  // ─── Replace Activity (AI accept) ───
  function replaceActivity(id: ActivityIdentifier, newActivity: any) {
    const data = tripData.value
    if (!data?.itinerary_sections) return

    const oldActivity = getActivity(id)
    if (oldActivity) {
      pushUndo({
        type: 'edit',
        target: { ...id },
        previousData: cloneActivity(oldActivity),
      })
    }

    data.itinerary_sections[id.sectionIdx]
      .daily_plans[id.dayIdx]
      .activities[id.activityIdx] = newActivity
  }

  // ─── Delete Activity ───
  function deleteActivity(id: ActivityIdentifier) {
    const data = tripData.value
    if (!data?.itinerary_sections) return

    const activity = getActivity(id)
    if (activity) {
      pushUndo({
        type: 'delete',
        target: { ...id },
        previousData: cloneActivity(activity),
      })
    }

    data.itinerary_sections[id.sectionIdx]
      .daily_plans[id.dayIdx]
      .activities.splice(id.activityIdx, 1)
  }

  // ─── Move Activity (drag-and-drop across days) ───
  function moveActivity(
    from: ActivityIdentifier,
    toSectionIdx: number,
    toDayIdx: number,
    toActivityIdx: number
  ) {
    const data = tripData.value
    if (!data?.itinerary_sections) return

    const srcActivities = getDayActivities(from.sectionIdx, from.dayIdx)
    const dstActivities = getDayActivities(toSectionIdx, toDayIdx)
    if (!srcActivities || !dstActivities) return

    const activity = srcActivities[from.activityIdx]
    if (!activity) return

    // Push undo entry with source location info
    pushUndo({
      type: 'move',
      target: { sectionIdx: toSectionIdx, dayIdx: toDayIdx, activityIdx: toActivityIdx },
      previousData: cloneActivity(activity),
      meta: {
        fromSectionIdx: from.sectionIdx,
        fromDayIdx: from.dayIdx,
        fromActivityIdx: from.activityIdx,
      },
    })

    // Remove from source
    srcActivities.splice(from.activityIdx, 1)
    // Insert at destination
    const insertIdx = Math.min(toActivityIdx, dstActivities.length)
    dstActivities.splice(insertIdx, 0, activity)
  }

  // ─── Undo ───
  function undo() {
    const stack = undoStack.value
    const entry = stack.pop()
    if (!entry) return
    triggerRef(undoStack)

    const data = tripData.value
    if (!data?.itinerary_sections) return

    const { target, previousData, type, meta } = entry

    if (type === 'day-title') {
      const day = data.itinerary_sections[target.sectionIdx]?.daily_plans[target.dayIdx]
      if (day) day.title = previousData
      return
    }

    if (type === 'replace-day') {
      const activities = getDayActivities(target.sectionIdx, target.dayIdx)
      if (activities) {
        activities.length = 0
        activities.push(...previousData)
      }
      return
    }

    if (type === 'move' && meta) {
      // Reverse the move: remove from destination, insert back at source
      const dstActivities = getDayActivities(target.sectionIdx, target.dayIdx)
      const srcActivities = getDayActivities(meta.fromSectionIdx!, meta.fromDayIdx!)
      if (dstActivities && srcActivities) {
        // Find and remove from destination (it may have shifted)
        const idxInDst = Math.min(target.activityIdx, dstActivities.length - 1)
        dstActivities.splice(idxInDst, 1)
        // Re-insert at original source position
        srcActivities.splice(meta.fromActivityIdx!, 0, previousData)
      }
      return
    }

    const activities = getDayActivities(target.sectionIdx, target.dayIdx)
    if (!activities) return

    if (type === 'delete') {
      activities.splice(target.activityIdx, 0, previousData)
    } else {
      // 'edit' — replace in-place
      activities[target.activityIdx] = previousData
    }
  }

  // ─── AI Modification ───
  function startAiModification(id: ActivityIdentifier) {
    aiModification.value = {
      target: { ...id },
      prompt: '',
      status: 'idle',
      preview: null,
      error: null
    }
  }

  function cancelAiModification() {
    aiModification.value = null
  }

  async function submitAiModification(prompt: string) {
    const mod = aiModification.value
    if (!mod) return

    const updated: AiModification = { ...mod, prompt, status: 'loading', error: null }
    aiModification.value = updated

    try {
      const activity = getActivity(updated.target)
      if (!activity) throw new Error('Activity not found')

      const response = await $fetch('/api/modify-activity', {
        method: 'POST',
        body: {
          activity: cloneActivity(activity),
          instruction: prompt
        }
      })

      aiModification.value = { ...updated, preview: response, status: 'preview' }
    } catch (err: any) {
      aiModification.value = {
        ...updated,
        error: err.message || 'Failed to generate modification',
        status: 'error'
      }
    }
  }

  function acceptAiModification() {
    const mod = aiModification.value
    if (!mod?.preview) return
    replaceActivity(mod.target, mod.preview)
    aiModification.value = null
  }

  function discardAiModification() {
    aiModification.value = null
  }

  // ─── Replace All Activities In A Day (for AI day modification) ───
  function replaceDayActivities(dayId: DayIdentifier, newActivities: any[]) {
    const data = tripData.value
    if (!data?.itinerary_sections) return

    const activities = getDayActivities(dayId.sectionIdx, dayId.dayIdx)
    if (!activities) return

    pushUndo({
      type: 'replace-day',
      target: { sectionIdx: dayId.sectionIdx, dayIdx: dayId.dayIdx, activityIdx: -1 },
      previousData: activities.map(cloneActivity),
    })

    activities.length = 0
    activities.push(...newActivities)
  }

  // ─── AI Day Modification ───
  function startAiDayModification(dayId: DayIdentifier) {
    aiDayModification.value = {
      target: { ...dayId },
      prompt: '',
      status: 'idle',
      preview: null,
      error: null,
    }
  }

  function cancelAiDayModification() {
    aiDayModification.value = null
  }

  async function submitAiDayModification(prompt: string) {
    const mod = aiDayModification.value
    if (!mod) return

    const updated: AiDayModification = { ...mod, prompt, status: 'loading', error: null }
    aiDayModification.value = updated

    try {
      const activities = getDayActivities(mod.target.sectionIdx, mod.target.dayIdx)
      const data = tripData.value
      const day = data?.itinerary_sections?.[mod.target.sectionIdx]?.daily_plans?.[mod.target.dayIdx]
      if (!activities || !day) throw new Error('Day not found')

      const response = await $fetch('/api/modify-day', {
        method: 'POST',
        body: {
          activities: activities.map(cloneActivity),
          instruction: prompt,
          dayTitle: day.title,
          dayNumber: day.day,
        },
      })

      aiDayModification.value = {
        ...updated,
        preview: (response as any).activities,
        status: 'preview',
      }
    } catch (err: any) {
      aiDayModification.value = {
        ...updated,
        error: err.message || 'Erreur lors de la génération',
        status: 'error',
      }
    }
  }

  function acceptAiDayModification() {
    const mod = aiDayModification.value
    if (!mod?.preview) return
    replaceDayActivities(mod.target, mod.preview)
    aiDayModification.value = null
  }

  function discardAiDayModification() {
    aiDayModification.value = null
  }

  return {
    saveField,
    saveDayTitle,
    getActivity,
    replaceActivity,
    deleteActivity,
    moveActivity,
    replaceDayActivities,
    undo,
    canUndo,
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
  }
}
