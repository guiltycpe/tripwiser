<template>
  <div class="relative h-full w-full overflow-hidden rounded-2xl shadow-inner bg-gray-100 min-h-[400px]">
    <!-- Map Container with Ref -->
    <div ref="mapContainer" class="h-full w-full"></div>
    
    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 z-[200] flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <Icon name="heroicons:arrow-path-20-solid" class="h-10 w-10 animate-spin text-teal-500" />
    </div>

    <!-- Map Legend/Overlay -->
    <div v-if="!loading" class="absolute bottom-6 left-6 z-[200] glass p-4 rounded-2xl shadow-2xl border border-white/40 max-w-[220px] animate-fade-in">
      <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Vue d'ensemble</h4>
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <div class="h-5 w-5 rounded-full bg-teal-500 flex items-center justify-center text-[10px] text-white font-bold border-2 border-white shadow-sm">1</div>
          <span class="text-xs font-semibold text-gray-700">Activités du jour</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center">
            <div class="h-[3px] w-2 bg-teal-500/60 rounded-full"></div>
            <div class="h-[3px] w-1"></div>
            <div class="h-[3px] w-2 bg-teal-500/60 rounded-full"></div>
          </div>
          <span class="text-xs font-semibold text-gray-700">Itinéraire prévu</span>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="mt-4 pt-3 border-t border-gray-100/50">
        <button 
          @click="recenterMap"
          class="flex items-center gap-2 text-[11px] font-bold text-teal-600 hover:text-teal-700 transition-colors"
        >
          <Icon name="heroicons:arrows-pointing-out-20-solid" class="h-3.5 w-3.5" />
          Recentrer la vue
        </button>
      </div>
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
  const initialCenter = props.activities.length > 0 
    ? [props.activities[0].lat, props.activities[0].lng] 
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
  L.control.zoom({ position: 'topright' }).addTo(map)

  updateMarkers()
  
  // Force size recalculation (common fix for hidden maps)
  setTimeout(() => {
    if (map) map.invalidateSize()
  }, 200)
}

function updateMarkers() {
  if (!map || !L) return

  // Clear existing markers/lines
  map.eachLayer((layer: any) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer)
    }
  })

  if (!props.activities.length) return

  const points: [number, number][] = []
  
  props.activities.forEach((activity, index) => {
    if (activity.lat && activity.lng) {
      const latlng: [number, number] = [activity.lat, activity.lng]
      points.push(latlng)

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white font-bold shadow-lg border-2 border-white">
            ${index + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      L.marker(latlng, { icon })
        .addTo(map)
        .bindPopup(`<b class="text-teal-600">${activity.time}</b><br>${activity.description}`)
    }
  })

  if (points.length > 1) {
    L.polyline(points, {
      color: '#14b8a6',
      weight: 3,
      opacity: 0.6,
      dashArray: '5, 10'
    }).addTo(map)

    map.fitBounds(L.latLngBounds(points), { padding: [50, 50] })
  } else if (points.length === 1) {
    map.setView(points[0], props.zoom)
  }
}

watch(() => props.activities, () => {
  updateMarkers()
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
