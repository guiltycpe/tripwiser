import en from '../locales/en.json'
import fr from '../locales/fr.json'

const translations = {
    en,
    fr
} as const

export type Locale = 'en' | 'fr'

export function useTranslations() {
    // useState is SSR-safe: one instance per request on server, shared on client
    const globalLocale = useState<Locale>('locale', () => 'en')

    const locale = computed({
        get: () => globalLocale.value,
        set: (val: Locale) => { globalLocale.value = val }
    })

    const t = computed(() => translations[globalLocale.value])

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
