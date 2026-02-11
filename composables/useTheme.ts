export function useTheme() {
  const colorMode = useColorMode()

  const isDark = computed(() => colorMode.value === 'dark')

  function toggleTheme() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(mode: 'light' | 'dark' | 'system') {
    colorMode.preference = mode
  }

  return {
    colorMode,
    isDark,
    toggleTheme,
    setTheme,
  }
}
