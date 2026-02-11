<template>
  <div class="travel-card group" @click="$emit('click')">
    <!-- Image -->
    <img
      v-if="imageUrl && !imageError"
      :src="imageUrl"
      :alt="title"
      class="card-background transition-transform duration-500 group-hover:scale-105"
      @error="handleImageError"
    />
    <div
      v-else
      class="card-background"
      :style="gradientStyle"
    ></div>

    <!-- Title overlay -->
    <div class="title-overlay">
      <h2>{{ title }}</h2>
    </div>

    <!-- Delete button -->
    <div class="actions-group">
      <button
        @click.stop="$emit('delete', trip.id)"
        class="action-btn group-hover:opacity-100"
        title="Delete"
      >
        <Icon name="heroicons:trash-20-solid" class="h-3.5 w-3.5" />
      </button>
    </div>

    <!-- Info card -->
    <div class="info-card">
      <div class="flex items-center gap-2 mb-2 flex-wrap">
        <span v-if="budget" class="badge">{{ budget }}</span>
        <span v-if="style" class="badge">{{ style }}</span>
      </div>

      <div class="flex items-center gap-4 text-xs text-white/90 mb-2">
        <div class="flex items-center gap-1.5">
          <Icon name="heroicons:calendar-20-solid" class="h-3.5 w-3.5" />
          <span>{{ dateRange }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <Icon name="heroicons:users-20-solid" class="h-3.5 w-3.5" />
          <span>{{ travelers }} {{ travelers > 1 ? t.tripCard.travelers : t.tripCard.traveler }}</span>
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <span class="status-dot" :class="statusDotClass"></span>
        <span class="text-[10px] font-medium text-white/80 uppercase tracking-wider">{{ statusLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const { t } = useTranslations()

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
.travel-card {
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--color-border, #e2e8f0);
  transition: all 0.2s ease;
}

.travel-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--color-border-hover, #cbd5e1);
}

:root {
  --color-border: #e2e8f0;
  --color-border-hover: #cbd5e1;
}

:root.dark {
  --color-border: #334155;
  --color-border-hover: #475569;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.title-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 45%;
  background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%);
  z-index: 2;
  padding: 20px;
}

.title-overlay h2 {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.actions-group {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 4;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s ease;
  border: none;
}

.action-btn:hover {
  background: rgba(239, 68, 68, 0.8);
}

.info-card {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px 20px;
  z-index: 3;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .travel-card {
    height: 280px;
  }

  .title-overlay h2 {
    font-size: 1.125rem;
  }

  .info-card {
    padding: 12px 16px;
  }
}
</style>
