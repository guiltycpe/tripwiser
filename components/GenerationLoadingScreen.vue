<script setup lang="ts">
interface Phase {
    readonly id: string
    readonly status: 'pending' | 'active' | 'completed'
    readonly messageKey: string
}

const props = defineProps<{
    visible: boolean
    destination: string
    overallProgress: number
    phases: readonly Phase[]
    currentPhase: string | null
    validatedPlaces: number
    totalPlaces: number
    currentFact: string | null
    isFallback: boolean
    fallbackMessage?: string
}>()

const { t, locale } = useTranslations()

const phaseLabels = computed(() => ({
    geographic_clustering: locale.value === 'fr' ? 'Cartographie des quartiers' : 'Mapping destination neighborhoods',
    accommodation_planning: locale.value === 'fr' ? 'Recherche des hébergements' : 'Finding the best places to stay',
    activity_validation: locale.value === 'fr' ? 'Vérification des lieux' : 'Verifying real places & hours',
    day_distribution: locale.value === 'fr' ? 'Organisation du planning' : 'Organizing your daily schedule',
    finalizing: locale.value === 'fr' ? 'Dernières retouches' : 'Adding finishing touches',
}))

const validationSubtext = computed(() => {
    if (props.validatedPlaces > 0 && props.totalPlaces > 0) {
        return locale.value === 'fr'
            ? `${props.validatedPlaces}/${props.totalPlaces} lieux vérifiés`
            : `${props.validatedPlaces}/${props.totalPlaces} places verified`
    }
    return null
})

const title = computed(() =>
    locale.value === 'fr' ? 'Création de votre aventure' : 'Crafting Your Adventure'
)

const funFactPrefix = computed(() =>
    locale.value === 'fr' ? 'Le saviez-vous ?' : 'Did you know?'
)
</script>

<template>
    <Transition
        enter-active-class="transition duration-400 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="visible"
            class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm"
        >
            <div class="max-w-md w-full px-8 text-center">
                <!-- Animated travel icon -->
                <div class="relative mb-8 flex justify-center">
                    <div class="relative rounded-2xl bg-teal-600 p-5 shadow-lg">
                        <Icon
                            name="heroicons:paper-airplane-20-solid"
                            class="h-10 w-10 text-white animate-float"
                        />
                    </div>
                </div>

                <!-- Title -->
                <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {{ title }}
                </h2>
                <p class="text-sm text-teal-600 dark:text-teal-400 mb-8 font-medium">
                    {{ destination }}
                </p>

                <!-- Phase timeline (SSE mode) -->
                <div v-if="!isFallback" class="mb-8 text-left space-y-3">
                    <div
                        v-for="phase in phases"
                        :key="phase.id"
                        class="flex items-start gap-3 transition-opacity duration-300"
                        :class="phase.status === 'pending' ? 'opacity-40' : 'opacity-100'"
                    >
                        <!-- Status indicator -->
                        <div class="mt-0.5 flex-shrink-0">
                            <div
                                v-if="phase.status === 'completed'"
                                class="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center"
                            >
                                <Icon name="heroicons:check-20-solid" class="h-3.5 w-3.5 text-white" />
                            </div>
                            <div
                                v-else-if="phase.status === 'active'"
                                class="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center animate-progress-pulse"
                            >
                                <Icon name="heroicons:arrow-path-20-solid" class="h-3.5 w-3.5 text-white animate-spin" />
                            </div>
                            <div
                                v-else
                                class="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600"
                            />
                        </div>

                        <!-- Phase label -->
                        <div class="flex-1 min-w-0">
                            <p
                                class="text-sm leading-5"
                                :class="phase.status === 'active'
                                    ? 'text-slate-900 dark:text-slate-100 font-medium'
                                    : phase.status === 'completed'
                                        ? 'text-slate-500 dark:text-slate-400'
                                        : 'text-slate-400 dark:text-slate-500'"
                            >
                                {{ (phaseLabels as any)[phase.id] || phase.id }}
                            </p>
                            <p
                                v-if="phase.id === 'activity_validation' && phase.status === 'active' && validationSubtext"
                                class="text-xs text-teal-600 dark:text-teal-400 mt-0.5"
                            >
                                {{ validationSubtext }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Fallback message (when SSE fails) -->
                <p v-if="isFallback" class="text-slate-500 dark:text-slate-400 mb-8 h-6 text-sm">
                    {{ fallbackMessage }}
                </p>

                <!-- Progress bar -->
                <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
                    <div
                        class="bg-teal-500 h-full transition-all duration-700 ease-out rounded-full"
                        :style="{ width: overallProgress + '%' }"
                    />
                </div>

                <p class="text-xs text-slate-400 font-medium tracking-widest uppercase mb-6">
                    {{ Math.round(overallProgress) }}%
                </p>

                <!-- Fun fact carousel -->
                <Transition
                    mode="out-in"
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div
                        v-if="currentFact"
                        :key="currentFact"
                        class="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-left"
                    >
                        <p class="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
                            {{ funFactPrefix }}
                        </p>
                        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {{ currentFact }}
                        </p>
                    </div>
                </Transition>
            </div>
        </div>
    </Transition>
</template>
