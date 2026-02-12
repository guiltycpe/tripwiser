<template>
  <!--
    LazyRender — IntersectionObserver-based deferred rendering.
    
    Replaces vue-virtual-scroller for timeline layouts where flat lists
    break the visual design (left border continuity, day dots, etc.).
    
    - Renders a lightweight placeholder until the element enters the viewport
    - Once rendered, stays rendered (no recycle/unmount on scroll-away)
    - 400px rootMargin pre-renders cards before they become visible
    - SSR fallback: renders immediately if IntersectionObserver unavailable
  -->
  <div ref="container">
    <slot v-if="shouldRender" />
    <div
      v-else
      class="rounded-2xl bg-gray-50/60 border border-gray-100/80"
      :style="{ height: `${placeholderHeight}px` }"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** Height of the placeholder skeleton (px) */
  placeholderHeight?: number
  /** IntersectionObserver rootMargin — how far ahead to pre-render */
  rootMargin?: string
  /** Force immediate render (bypasses lazy loading) */
  forceRender?: boolean
}>(), {
  placeholderHeight: 140,
  rootMargin: '400px 0px',
  forceRender: false
})

const container = ref<HTMLElement | null>(null)
const shouldRender = ref(false)
let observer: IntersectionObserver | null = null

// When forceRender becomes true, render immediately and disconnect observer
watch(() => props.forceRender, (force) => {
  if (force && !shouldRender.value) {
    shouldRender.value = true
    observer?.disconnect()
    observer = null
  }
})

onMounted(() => {
  if (props.forceRender) {
    shouldRender.value = true
    return
  }

  if (!container.value || typeof IntersectionObserver === 'undefined') {
    // SSR or no IntersectionObserver support — render immediately
    shouldRender.value = true
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        shouldRender.value = true
        // Once visible, disconnect — the card stays rendered forever
        observer?.disconnect()
        observer = null
      }
    },
    { rootMargin: props.rootMargin }
  )

  observer.observe(container.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>
