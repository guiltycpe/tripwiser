
<template>
  <div class="travel-card group" @click="$emit('click')">
    <!-- Layer 1: Image de fond (toute la hauteur) -->
    <img 
      v-if="imageUrl && !imageError"
      :src="imageUrl" 
      :alt="title"
      class="card-background transition-transform duration-700 group-hover:scale-110"
      @error="handleImageError"
    />
    <div 
      v-else
      class="card-background transition-transform duration-700 group-hover:scale-110"
      :style="gradientStyle"
    ></div>
    
    <!-- Layer 2: Gradient overlay pour le titre -->
    <div class="title-overlay">
      <h2>{{ title }}</h2>
    </div>

    <div class="actions-group">
      <!-- Refresh Image Button -->
      <button
        @click.stop="$emit('refresh-image', trip.id)"
        class="action-btn group-hover:opacity-100"
        title="Change Image"
      >
        <Icon name="heroicons:arrow-path-20-solid" class="h-4 w-4" />
      </button>

      <!-- Delete Button -->
      <button
        @click.stop="$emit('delete', trip.id)"
        class="action-btn delete-btn group-hover:opacity-100"
        title="Delete trip"
      >
        <Icon name="heroicons:trash-20-solid" class="h-4 w-4" />
      </button>
    </div>
    
    <!-- Layer 3: Card glassmorphique pour les infos -->
    <div class="info-glass-card group-hover:bg-white/20 transition-colors duration-300">
      <div class="badges">
        <span v-if="budget" class="badge comfort">{{ budget }}</span>
        <span v-if="style" class="badge relaxation">{{ style }}</span>
      </div>
      
      <div class="details">
        <div class="date">
          <Icon name="heroicons:calendar-20-solid" class="h-4 w-4" />
          <span>{{ dateRange }}</span>
        </div>
        <div class="travelers">
          <Icon name="heroicons:users-20-solid" class="h-4 w-4" />
          <span>{{ travelers }} {{ travelers > 1 ? 'voyageurs' : 'voyageur' }}</span>
        </div>
      </div>
      
      <div 
        class="status-badge" 
        :class="statusClass"
      >
        {{ statusLabel }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  trip: any
}>()

defineEmits(['click', 'delete', 'refresh-image'])

// Image handling
const imageError = ref(false)

const imageUrl = computed(() => {
  if (!imageError.value && props.trip.destination_image_url) {
    return props.trip.destination_image_url
  }
  return null
})

const gradientStyle = computed(() => {
  const dest = props.trip.destination || 'trip'
  let hash = 0
  for (let i = 0; i < dest.length; i++) {
    hash = dest.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h1 = Math.abs(hash % 360)
  const h2 = (h1 + 40) % 360
  return {
    background: `linear-gradient(135deg, hsl(${h1}, 70%, 60%), hsl(${h2}, 70%, 50%))`
  }
})

function handleImageError() {
  imageError.value = true
}

// Data formatting
const title = computed(() => formatDestination(props.trip.destination))
const budget = computed(() => getBudgetLabel(props.trip.budget))
const style = computed(() => props.trip.travel_style)
const travelers = computed(() => props.trip.travelers || 1)

// Status Logic
const statusInfo = computed(() => {
  const now = new Date()
  const start = props.trip.departure_date ? new Date(props.trip.departure_date) : null
  const end = props.trip.return_date ? new Date(props.trip.return_date) : null
  
  // Default (Upcoming)
  let status = 'UPCOMING'
  
  if (start && end) {
    if (now >= start && now <= end) {
      status = 'ONGOING'
    } else if (now < start) {
      status = 'UPCOMING'
    } else {
      status = 'COMPLETED'
    }
  } else if (start && now > start) {
      status = 'COMPLETED'
  }

  return status
})

const statusLabel = computed(() => {
  switch (statusInfo.value) {
    case 'ONGOING': return 'EN COURS'
    case 'UPCOMING': return 'À VENIR'
    case 'COMPLETED': return 'TERMINÉ'
    default: return 'À VENIR'
  }
})

const statusClass = computed(() => {
  switch (statusInfo.value) {
    case 'ONGOING': return 'status-ongoing'
    case 'UPCOMING': return 'status-upcoming'
    case 'COMPLETED': return 'status-completed'
    default: return 'status-upcoming'
  }
})

// Helpers (reused logic)
function formatDestination(dest: string) {
  if (!dest) return 'Unknown'
  return dest.split(',')[0].trim()
}

function getBudgetLabel(tier: string) {
  if (!tier) return ''
  const t = tier.toLowerCase()
  const map: Record<string, string> = {
    'low': 'Budget Friendly',
    'medium': 'Balanced Comfort',
    'high': 'Luxury Experience'
  }
  return map[t] || tier
}

// Date formatting
const dateRange = computed(() => {
  return formatCompactDateRange(props.trip.departure_date, props.trip.return_date)
})

function formatCompactDateRange(start: string, end?: string) {
   if (!start) return ''
   const dateStart = new Date(start)
   const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
   const locale = 'fr-FR' // Or make dynamic if needed
   
   const s = dateStart.toLocaleDateString(locale, options)
   
   if (!end) return `${s} ${dateStart.getFullYear()}`
   
   const dateEnd = new Date(end)
   // If same year
   if (dateStart.getFullYear() === dateEnd.getFullYear()) {
       // If same month
       if (dateStart.getMonth() === dateEnd.getMonth()) {
           return `${dateStart.getDate()}-${dateEnd.getDate()} ${dateStart.toLocaleDateString(locale, { month: 'short' })} ${dateStart.getFullYear()}`
       }
       // Different month: 4 févr. - 2 mars 2026
        return `${s} - ${dateEnd.toLocaleDateString(locale, options)} ${dateEnd.getFullYear()}`
   }
   
   // Different years
   return `${s} ${dateStart.getFullYear()} - ${dateEnd.toLocaleDateString(locale, options)} ${dateEnd.getFullYear()}`
}

</script>

<style scoped>
.travel-card {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  /* box-shadow provided in container usually, but let's add some base */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.travel-card:hover {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
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
  height: 50%;
  background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
  z-index: 2;
  padding: 24px;
}

.actions-group {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 4;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.8);
}

.title-overlay h2 {
  color: white;
  font-size: 32px; /* Slightly smaller for mobile safety, prompt said 36 */
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.info-glass-card {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 24px;
  z-index: 3;
  
  /* Glassmorphism */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px 16px 0 0;
  
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
}

.info-glass-card .badges {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.badges .badge {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.details > div {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: 500;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.status-badge {
  backdrop-filter: blur(8px);
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  display: inline-block;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-ongoing {
  background: rgba(74, 222, 128, 0.3);
  border: 1px solid rgba(74, 222, 128, 0.5);
  color: #dcfce7;
}

.status-upcoming {
  background: rgba(59, 130, 246, 0.3);
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: #dbeafe;
}

.status-completed {
  background: rgba(156, 163, 175, 0.3);
  border: 1px solid rgba(156, 163, 175, 0.5);
  color: #f3f4f6;
}

@media (max-width: 768px) {
  .travel-card {
    height: 350px;
  }
  
  .title-overlay h2 {
    font-size: 28px;
  }
  
  .info-glass-card {
    padding: 16px;
  }
}
</style>
