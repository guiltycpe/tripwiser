<template>
  <div class="relative h-full w-full overflow-hidden rounded-2xl shadow-inner bg-gray-100 min-h-[400px]">
    <!-- Map Container with Ref -->
    <div ref="mapContainer" class="h-full w-full"></div>
    
    <!-- Loading overlay -->
    <div v-if="loading || fetchingRoute" class="absolute inset-0 z-[200] flex items-center justify-center bg-white/60 backdrop-blur-sm transition-opacity duration-300">
      <div class="flex flex-col items-center gap-3">
        <Icon name="heroicons:arrow-path-20-solid" class="h-10 w-10 animate-spin text-teal-500" />
        <span v-if="fetchingRoute && !loading" class="text-xs font-bold text-teal-600 animate-pulse">Calcul de l'itinéraire...</span>
      </div>
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
  transportMode?: 'driving' | 'walking' | 'cycling'
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 13,
  transportMode: 'driving'
})

const emit = defineEmits(['route-updated'])

const mapContainer = ref<HTMLElement | null>(null)
const loading = ref(true)
const fetchingRoute = ref(false)
let map: any = null
let L: any = null
let routeLayer: any = null

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

let lastRequestId = 0

async function fetchRoute(points: [number, number][]) {
  if (points.length < 2) return null
  
  const requestId = ++lastRequestId
  fetchingRoute.value = true
  try {
    const coords = points.map(p => `${p[1]},${p[0]}`).join(';')
    const profile = props.transportMode === 'driving' ? 'driving' : 
                   props.transportMode === 'walking' ? 'walking' : 'cycling'
    
    const response = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson`)
    const data = await response.json()
    
    // Ignore if a newer request has been started
    if (requestId !== lastRequestId) return null

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      return {
        coordinates: route.geometry.coordinates.map((c: any) => [c[1], c[0]]),
        duration: route.duration, // total seconds
        distance: route.distance,  // total meters
        legs: route.legs.map((l: any) => ({ 
          duration: l.duration, 
          distance: l.distance 
        }))
      }
    }
    return null
  } catch (error) {
    if (requestId === lastRequestId) {
      console.error('Error fetching route:', error)
    }
    return null
  } finally {
    if (requestId === lastRequestId) {
      fetchingRoute.value = false
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

async function updateMap() {
  if (!map || !L) return

  // Clear existing markers/lines
  map.eachLayer((layer: any) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
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
  })

  if (points.length > 1) {
    // Try to get real road path
    const routeData = await fetchRoute(points)
    
    if (routeData) {
      routeLayer = L.polyline(routeData.coordinates, {
        color: '#14b8a6',
        weight: 4,
        opacity: 0.8,
        lineJoin: 'round'
      }).addTo(map)

      emit('route-updated', {
        duration: routeData.duration,
        distance: routeData.distance,
        legs: routeData.legs
      })
    } else {
      // Fallback to straight line if OSRM fails
      routeLayer = L.polyline(points, {
        color: '#14b8a6',
        weight: 3,
        opacity: 0.6,
        dashArray: '5, 10'
      }).addTo(map)

      emit('route-updated', null)
    }

    map.fitBounds(L.latLngBounds(points), { padding: [50, 50] })
  } else if (points.length === 1) {
    map.setView(points[0], props.zoom)
    emit('route-updated', null)
  }
}

watch([() => props.activities, () => props.transportMode], () => {
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
