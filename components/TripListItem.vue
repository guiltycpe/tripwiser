<template>
  <div
    class="trip-list-item group"
    @click="$emit('click')"
  >
    <!-- Thumbnail -->
    <div class="thumbnail">
      <img
        v-if="imageUrl && !imageError"
        :src="imageUrl"
        :alt="title"
        class="h-full w-full object-cover"
        @error="handleImageError"
      />
      <div
        v-else
        class="h-full w-full"
        :style="gradientStyle"
      ></div>
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{{ title }}</h3>
      <div class="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
        <div class="flex items-center gap-1">
          <Icon name="heroicons:calendar-20-solid" class="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <span>{{ dateRange }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="heroicons:users-20-solid" class="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          <span>{{ travelers }}</span>
        </div>
      </div>
    </div>

    <!-- Badges -->
    <div class="hidden sm:flex items-center gap-2">
      <span v-if="budget" class="badge">{{ budget }}</span>
      <span v-if="style" class="badge">{{ style }}</span>
    </div>

    <!-- Status -->
    <div class="flex items-center gap-1.5 min-w-[90px]">
      <span class="status-dot" :class="statusDotClass"></span>
      <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ statusLabel }}</span>
    </div>

    <!-- Delete -->
    <button
      @click.stop="$emit('delete', trip.id)"
      class="action-btn opacity-0 group-hover:opacity-100"
      title="Delete"
    >
      <Icon name="heroicons:trash-20-solid" class="h-3.5 w-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const { t, locale } = useTranslations()

const props = defineProps<{
  trip: any
}>()

defineEmits(['click', 'delete'])

const imageError = ref(false)
const fetchedUrl = ref<string | null>(null)

const imageUrl = computed(() => {
  if (imageError.value) return null
  if (props.trip.destination_image_url) return props.trip.destination_image_url
  return fetchedUrl.value
})

// Fetch Mapbox image for trips that have no image
const fetchAttempted = ref(false)
watch(() => props.trip.destination, async () => {
  if (!props.trip.destination_image_url && props.trip.destination && !fetchAttempted.value) {
    fetchAttempted.value = true
    try {
      const res = await $fetch<{ url: string | null }>('/api/get-destination-image', {
        params: { destination: props.trip.destination.split(',')[0].trim() }
      })
      if (res?.url) {
        fetchedUrl.value = res.url
      }
    } catch {
      // Gradient fallback is fine
    }
  }
}, { immediate: true })

const gradientStyle = computed(() => {
  const dest = props.trip.destination || 'trip'
  let hash = 0
  for (let i = 0; i < dest.length; i++) {
    hash = dest.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h1 = Math.abs(hash % 360)
  const h2 = (h1 + 40) % 360
  return {
    background: `linear-gradient(135deg, hsl(${h1}, 60%, 55%), hsl(${h2}, 60%, 45%))`
  }
})

function handleImageError() {
  imageError.value = true
}

const title = computed(() => formatDestination(props.trip.destination))
const budget = computed(() => getBudgetLabel(props.trip.budget))
const style = computed(() => props.trip.travel_style)
const travelers = computed(() => props.trip.travelers || 1)

const statusInfo = computed(() => {
  const now = new Date()
  const start = props.trip.departure_date ? new Date(props.trip.departure_date) : null
  const end = props.trip.return_date ? new Date(props.trip.return_date) : null

  if (start && end) {
    if (now >= start && now <= end) return 'ONGOING'
    if (now < start) return 'UPCOMING'
    return 'COMPLETED'
  }
  if (start && now > start) return 'COMPLETED'
  return 'UPCOMING'
})

const statusLabel = computed(() => {
  switch (statusInfo.value) {
    case 'ONGOING': return t.value.tripCard.status.ongoing
    case 'UPCOMING': return t.value.tripCard.status.upcoming
    case 'COMPLETED': return t.value.tripCard.status.completed
    default: return t.value.tripCard.status.upcoming
  }
})

const statusDotClass = computed(() => {
  switch (statusInfo.value) {
    case 'ONGOING': return 'bg-emerald-400'
    case 'UPCOMING': return 'bg-blue-400'
    case 'COMPLETED': return 'bg-slate-400'
    default: return 'bg-blue-400'
  }
})

function getBudgetLabel(tier: string) {
  if (!tier) return ''
  const key = tier.toLowerCase()
  const budgetOptions = t.value.plan?.form?.budgetOptions
  if (budgetOptions) {
    const map: Record<string, string> = {
      'low': budgetOptions.budget,
      'medium': budgetOptions.moderate,
      'high': budgetOptions.luxury
    }
    return map[key] || tier
  }
  return tier
}

const dateRange = computed(() => {
  return formatCompactDateRange(props.trip.departure_date, props.trip.return_date)
})

function formatCompactDateRange(start: string, end?: string) {
  if (!start) return ''
  const dateStart = new Date(start)
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  const { locale: currentLocale } = useTranslations()
  const localeStr = currentLocale.value === 'fr' ? 'fr-FR' : 'en-US'

  const s = dateStart.toLocaleDateString(localeStr, options)

  if (!end) return `${s} ${dateStart.getFullYear()}`

  const dateEnd = new Date(end)
  if (dateStart.getFullYear() === dateEnd.getFullYear()) {
    if (dateStart.getMonth() === dateEnd.getMonth()) {
      return `${dateStart.getDate()}-${dateEnd.getDate()} ${dateStart.toLocaleDateString(localeStr, { month: 'short' })} ${dateStart.getFullYear()}`
    }
    return `${s} - ${dateEnd.toLocaleDateString(localeStr, options)} ${dateEnd.getFullYear()}`
  }

  return `${s} ${dateStart.getFullYear()} - ${dateEnd.toLocaleDateString(localeStr, options)} ${dateEnd.getFullYear()}`
}
</script>

<style scoped>
.trip-list-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface, white);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border, #e2e8f0);
  cursor: pointer;
  transition: all 0.15s ease;
}

.trip-list-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--color-text-muted, #cbd5e1);
}

.thumbnail {
  width: 64px;
  height: 64px;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
}

.badge {
  background: var(--color-surface-elevated, #f1f5f9);
  color: var(--color-text-secondary, #475569);
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted, #94a3b8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
  flex-shrink: 0;
}

.action-btn:hover {
  background: #fef2f2;
  color: #ef4444;
}

@media (max-width: 640px) {
  .trip-list-item {
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
  }

  .thumbnail {
    width: 48px;
    height: 48px;
  }
}
</style>
