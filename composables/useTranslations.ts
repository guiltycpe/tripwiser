import en from '../locales/en.json'
import fr from '../locales/fr.json'

const globalLocale = ref('en')

const translations = {
    en,
    fr
} as const

export type Locale = 'en' | 'fr'

export function useTranslations() {
    const locale = computed({
        get: () => globalLocale.value as Locale,
        set: (val: Locale) => { globalLocale.value = val }
    })

    const t = computed(() => translations[globalLocale.value as Locale])

    function setLocale(newLocale: Locale) {
        globalLocale.value = newLocale
    }

    return {
        locale,
        t,
        setLocale,
        translations
    }
}
