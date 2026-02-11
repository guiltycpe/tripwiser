export function useSidebarState() {
  const collapsed = useState<boolean>('sidebar-collapsed', () => false)
  const mobileOpen = useState<boolean>('sidebar-mobile-open', () => false)

  // Detect mobile via VueUse (already installed via @vueuse/nuxt)
  const isMobile = useMediaQuery('(max-width: 768px)')

  function toggle() {
    if (isMobile.value) {
      mobileOpen.value = !mobileOpen.value
    } else {
      collapsed.value = !collapsed.value
    }
  }

  function expand() {
    collapsed.value = false
  }

  function collapse() {
    collapsed.value = true
  }

  function openMobile() {
    mobileOpen.value = true
  }

  function closeMobile() {
    mobileOpen.value = false
  }

  // Persist collapsed state in localStorage (client-only)
  if (import.meta.client) {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      collapsed.value = saved === 'true'
    }

    watch(collapsed, (val) => {
      localStorage.setItem('sidebar-collapsed', String(val))
    })
  }

  return {
    collapsed,
    mobileOpen,
    isMobile,
    toggle,
    expand,
    collapse,
    openMobile,
    closeMobile,
  }
}
