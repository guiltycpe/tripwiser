<template>
  <div class="relative h-full w-full overflow-hidden rounded-2xl shadow-inner bg-gray-100 min-h-[400px]">
    <!-- Map Container with Ref -->
    <div ref="mapContainer" class="h-full w-full"></div>
    
    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 z-[200] flex items-center justify-center bg-white/60 backdrop-blur-sm transition-opacity duration-300">
      <div class="flex flex-col items-center gap-3">
        <Icon name="heroicons:arrow-path-20-solid" class="h-10 w-10 animate-spin text-teal-500" />
      </div>
    </div>

    <!-- Quick Actions -->
    <div v-if="!loading" class="absolute bottom-6 left-6 z-[200]">
        <button 
          @click="recenterMap"
          class="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur shadow-lg rounded-full text-xs font-bold text-teal-700 hover:bg-white transition-all transform hover:scale-105"
        >
          <Icon name="heroicons:arrows-pointing-out-20-solid" class="h-4 w-4" />
          Recentrer
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'

interface Activity {
  lat: number
  lng: number
  description: string
  time: string
}

interface Props {
  activities: Activity[]
  center?: [number, number]
  zoom?: number
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 13
})

const mapContainer = ref<HTMLElement | null>(null)
const loading = ref(true)
let map: any = null
let L: any = null

function recenterMap() {
  if (!map || !L) return
  const points = props.activities
    .filter(a => a.lat && a.lng)
    .map(a => [a.lat, a.lng] as [number, number])
    
  if (points.length > 0) {
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [50, 50] })
    } else {
      map.setView(points[0], props.zoom)
    }
  }
}

onMounted(async () => {
  if (process.client) {
    try {
      // Import Leaflet only on client side
      const leaflet = await import('leaflet')
      L = leaflet.default
      
      // Wait for next tick to ensure ref is populated and transitions finished
      await nextTick()
      initMap()
    } catch (error) {
      console.error('Error loading Leaflet:', error)
    } finally {
      loading.value = false
    }
  }
})

function initMap() {
  if (!L || !mapContainer.value) return

  // Fix Leaflet marker icons paths
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  // Set initial view
  const firstActivity = props.activities.find(a => a && a.lat && a.lng)
  const initialCenter = firstActivity 
    ? [firstActivity.lat, firstActivity.lng] as [number, number]
    : (props.center || [48.8566, 2.3522])

  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false
  }).setView(initialCenter, props.zoom)

  // Add Light Modern Tiles
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

  // Add zoom control manually
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  updateMap()
  
  // Force size recalculation (common fix for hidden maps)
  setTimeout(() => {
    if (map) map.invalidateSize()
  }, 200)
}

function updateMap() {
  if (!map || !L) return

  // Clear existing markers
  map.eachLayer((layer: any) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer)
    }
  })

  const validActivities = props.activities.filter(a => a && a.lat && a.lng)
  if (!validActivities.length) return

  const points: [number, number][] = []
  
  validActivities.forEach((activity, index) => {
    const latlng: [number, number] = [activity.lat, activity.lng]
    points.push(latlng)

    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white font-bold shadow-lg border-2 border-white transform transition-transform hover:scale-110">
          ${index + 1}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })

    L.marker(latlng, { icon })
      .addTo(map)
      .bindPopup(`<b class="text-teal-600">${activity.time}</b><br>${activity.description}`)
  })

  if (points.length > 0) {
     map.fitBounds(L.latLngBounds(points), { padding: [50, 50] })
  }
}

watch(() => props.activities, () => {
  updateMap()
}, { deep: true })

onUnmounted(() => {
  if (map) map.remove()
})
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';

:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  background: #f8fafc;
}

:deep(.custom-div-icon) {
  background: transparent !important;
  border: none !important;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  padding: 4px;
}
</style>
