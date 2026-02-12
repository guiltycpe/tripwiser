<template>
  <div class="relative h-full w-full overflow-hidden rounded-2xl shadow-inner bg-gray-100 dark:bg-gray-800 min-h-[400px]">
    <!-- Map Container with Ref -->
    <div ref="mapContainer" class="h-full w-full"></div>
    
    <!-- Loading overlay -->
    <div v-if="loading" class="absolute inset-0 z-[200] flex items-center justify-center bg-white/80 dark:bg-slate-900/80 transition-opacity duration-300">
      <div class="flex flex-col items-center gap-3">
        <Icon name="heroicons:arrow-path-20-solid" class="h-10 w-10 animate-spin text-teal-500" />
      </div>
    </div>

    <!-- Quick Actions -->
    <div v-if="!loading" class="absolute bottom-6 left-6 z-[200]">
        <button 
          @click="recenterMap"
          class="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-lg rounded-full text-xs font-bold text-teal-700 dark:text-teal-400 hover:bg-white dark:hover:bg-slate-800 transition-all transform hover:scale-105"
        >
          <Icon name="heroicons:arrows-pointing-out-20-solid" class="h-4 w-4" />
          Recenter
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
  active?: boolean
  selectedIndex?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 13,
  active: true,
  selectedIndex: null
})

const emit = defineEmits<{
  'marker-click': [index: number]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const loading = ref(true)
let map: any = null
let L: any = null
let markers: any[] = []

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
      const leaflet = await import('leaflet')
      L = leaflet.default
      await nextTick()
      // Only init if container is visible (active); otherwise wait for active watch
      if (props.active) {
        initMap()
      }
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

function createMarkerIcon(index: number, selected: boolean) {
  if (selected) {
    return L.divIcon({
      className: 'custom-div-icon selected-marker',
      html: `
        <div class="marker-ping"></div>
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white font-bold shadow-xl border-[3px] border-white scale-110" style="position:relative;z-index:10;">
          ${index + 1}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    })
  }
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white font-bold shadow-lg border-2 border-white transform transition-transform hover:scale-110">
        ${index + 1}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  })
}

function updateMarkerIcons() {
  markers.forEach((marker, index) => {
    marker.setIcon(createMarkerIcon(index, index === props.selectedIndex))
    if (index === props.selectedIndex) {
      marker.setZIndexOffset(1000)
    } else {
      marker.setZIndexOffset(0)
    }
  })
}

function updateMap() {
  if (!map || !L) return

  // Clear existing markers
  markers.forEach(m => map.removeLayer(m))
  markers = []

  const validActivities = props.activities.filter(a => a && a.lat && a.lng)
  if (!validActivities.length) return

  const points: [number, number][] = []

  validActivities.forEach((activity, index) => {
    const latlng: [number, number] = [activity.lat, activity.lng]
    points.push(latlng)

    const icon = createMarkerIcon(index, index === props.selectedIndex)
    const marker = L.marker(latlng, { icon })
      .addTo(map)

    marker.on('click', () => {
      emit('marker-click', index)
    })

    markers.push(marker)
  })

  if (points.length > 0) {
     map.fitBounds(L.latLngBounds(points), { padding: [50, 50] })
  }
}

function flyTo(index: number) {
  if (!map || !markers[index]) return
  const latlng = markers[index].getLatLng()
  map.flyTo(latlng, 16, { duration: 0.8 })
}

defineExpose({ flyTo })

// Map data is now a shallowRef from parent — only changes on save events.
// No need for deep watch; reference equality is sufficient.
watch(() => props.activities, () => {
  updateMap()
})

watch(() => props.selectedIndex, () => {
  updateMarkerIcons()
})

// Handle visibility: init map when first becoming visible, resize on re-show
watch(() => props.active, (isActive) => {
  if (isActive) {
    if (!map && L) {
      // First time becoming visible — create the map
      nextTick(() => initMap())
    } else if (map) {
      // Already created — resize to fill the now-visible container
      nextTick(() => {
        map.invalidateSize()
        updateMap()
      })
    }
  }
})

onUnmounted(() => {
  if (map) map.remove()
})
</script>

<style scoped>
@import 'leaflet/dist/leaflet.css';

:deep(.leaflet-container) {
  height: 100%;
  width: 100%;
  background: var(--color-surface, #f8fafc);
}

:deep(.custom-div-icon) {
  background: transparent !important;
  border: none !important;
}

:deep(.selected-marker) {
  z-index: 1000 !important;
}

:deep(.marker-ping) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(20, 184, 166, 0.3);
  animation: marker-pulse 2s ease-out infinite;
}

@keyframes marker-pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.2);
    opacity: 0;
  }
}
</style>
