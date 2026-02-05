<template>
  <div class="relative" ref="dropdownRef">
    <!-- Current Language Button -->
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 border border-gray-200 hover:bg-white hover:border-teal-300 transition-all duration-300 shadow-sm cursor-pointer"
    >
      <span class="text-sm font-medium text-gray-700">{{ currentLanguage.shortName }}</span>
      <Icon 
        name="heroicons:chevron-down-20-solid" 
        class="h-4 w-4 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div 
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-gray-100 overflow-hidden z-50"
      >
        <div class="py-1">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="selectLanguage(lang.code)"
            class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
            :class="{ 'bg-teal-50': locale === lang.code }"
          >
            <span class="text-xl">{{ lang.flag }}</span>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ lang.name }}</p>
              <p class="text-xs text-gray-500">{{ lang.nativeName }}</p>
            </div>
            <Icon 
              v-if="locale === lang.code"
              name="heroicons:check-20-solid" 
              class="h-5 w-5 text-teal-500"
            />
          </button>
        </div>
        
        <!-- More languages coming soon -->
        <div class="border-t border-gray-100 px-4 py-3 bg-gray-50">
          <p class="text-xs text-gray-500 flex items-center gap-1">
            <Icon name="heroicons:globe-alt-20-solid" class="h-4 w-4" />
            {{ locale === 'fr' ? 'Plus de langues bientôt...' : 'More languages coming soon...' }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useTranslations()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Language definitions - easy to extend!
const languages = [
  { code: 'en', name: 'English', nativeName: 'English', shortName: 'EN', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', nativeName: 'French', shortName: 'FR', flag: '🇫🇷' },
  // Easy to add more:
  // { code: 'es', name: 'Español', nativeName: 'Spanish', shortName: 'ES', flag: '🇪🇸' },
  // { code: 'de', name: 'Deutsch', nativeName: 'German', shortName: 'DE', flag: '🇩🇪' },
  // { code: 'it', name: 'Italiano', nativeName: 'Italian', shortName: 'IT', flag: '🇮🇹' },
  // { code: 'pt', name: 'Português', nativeName: 'Portuguese', shortName: 'PT', flag: '🇵🇹' },
  // { code: 'ja', name: '日本語', nativeName: 'Japanese', shortName: 'JA', flag: '🇯🇵' },
  // { code: 'zh', name: '中文', nativeName: 'Chinese', shortName: 'ZH', flag: '🇨🇳' },
]

const currentLanguage = computed(() => {
  return languages.find(l => l.code === locale.value) || languages[0]
})

function selectLanguage(code: string) {
  setLocale(code as 'en' | 'fr')
  isOpen.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
