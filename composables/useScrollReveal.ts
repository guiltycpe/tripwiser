import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

/**
 * Composable for scroll-triggered reveal animations.
 * Uses IntersectionObserver for performant scroll detection.
 * Returns a ref to attach to elements and a reactive visibility state.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options
  const isVisible = ref(false)
  const elementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          isVisible.value = true
          if (once && observer && elementRef.value) {
            observer.unobserve(elementRef.value)
          }
        } else if (!once) {
          isVisible.value = false
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { elementRef, isVisible }
}

/**
 * Composable for staggered reveal of multiple items.
 * Each child element animates in sequence with configurable delay.
 */
export function useStaggerReveal(itemCount: Ref<number> | number, options: ScrollRevealOptions & { staggerDelay?: number } = {}) {
  const { staggerDelay = 100, ...revealOptions } = options
  const { elementRef, isVisible } = useScrollReveal(revealOptions)
  
  const getItemDelay = (index: number) => `${index * staggerDelay}ms`

  const getItemStyle = (index: number) => ({
    transitionDelay: isVisible.value ? getItemDelay(index) : '0ms',
    opacity: isVisible.value ? 1 : 0,
    transform: isVisible.value ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  })

  return { elementRef, isVisible, getItemStyle, getItemDelay }
}

/**
 * Composable for parallax scroll effects.
 * Returns a translateY value based on scroll position.
 */
export function useParallax(speed: number = 0.3) {
  const offset = ref(0)
  const elementRef = ref<HTMLElement | null>(null)

  let ticking = false

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (elementRef.value) {
          const rect = elementRef.value.getBoundingClientRect()
          const windowHeight = window.innerHeight
          // Calculate parallax only when element is in viewport
          if (rect.bottom > 0 && rect.top < windowHeight) {
            offset.value = (rect.top - windowHeight / 2) * speed
          }
        }
        ticking = false
      })
      ticking = true
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return { elementRef, offset }
}

/**
 * Composable for animated number counting.
 * Smoothly counts from 0 to target value when visible.
 */
export function useCountUp(target: number, duration: number = 2000) {
  const { elementRef, isVisible } = useScrollReveal({ threshold: 0.3 })
  const current = ref(0)
  let animationFrame: number | null = null

  watch(isVisible, (visible) => {
    if (visible && current.value === 0) {
      const startTime = performance.now()
      
      function animate(currentTime: number) {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        current.value = Math.round(eased * target)
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }
      
      animationFrame = requestAnimationFrame(animate)
    }
  })

  onUnmounted(() => {
    if (animationFrame) cancelAnimationFrame(animationFrame)
  })

  return { elementRef, current, isVisible }
}
