import { ref, readonly } from 'vue'

export interface StreamPhase {
    id: string
    status: 'pending' | 'active' | 'completed'
    messageKey: string
}

export interface StreamState {
    isStreaming: boolean
    phases: StreamPhase[]
    currentPhase: string | null
    overallProgress: number
    validatedPlaces: number
    totalPlaces: number
    funFacts: string[]
    currentFact: string | null
    result: any | null
    error: string | null
}

function createInitialPhases(): StreamPhase[] {
    return [
        { id: 'geographic_clustering', status: 'pending', messageKey: 'plan.generation.phases.clustering' },
        { id: 'accommodation_planning', status: 'pending', messageKey: 'plan.generation.phases.accommodation' },
        { id: 'activity_validation', status: 'pending', messageKey: 'plan.generation.phases.validation' },
        { id: 'day_distribution', status: 'pending', messageKey: 'plan.generation.phases.distribution' },
        { id: 'finalizing', status: 'pending', messageKey: 'plan.generation.phases.finalizing' },
    ]
}

export function useItineraryStream() {
    const state = ref<StreamState>({
        isStreaming: false,
        phases: createInitialPhases(),
        currentPhase: null,
        overallProgress: 0,
        validatedPlaces: 0,
        totalPlaces: 0,
        funFacts: [],
        currentFact: null,
        result: null,
        error: null,
    })

    let abortController: AbortController | null = null
    let factRotationInterval: ReturnType<typeof setInterval> | null = null

    function startStream(body: object): Promise<any> {
        return new Promise((resolve, reject) => {
            // Reset state
            state.value = {
                isStreaming: true,
                phases: createInitialPhases(),
                currentPhase: null,
                overallProgress: 0,
                validatedPlaces: 0,
                totalPlaces: 0,
                funFacts: [],
                currentFact: null,
                result: null,
                error: null,
            }

            startPostSSE(body, resolve, reject)
        })
    }

    async function startPostSSE(body: object, resolve: (value: any) => void, reject: (reason: any) => void) {
        abortController = new AbortController()

        try {
            const response = await fetch('/api/generate-itinerary-stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: abortController.signal,
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const reader = response.body!.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            startFactRotation()

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })

                // Parse SSE events from buffer
                const parts = buffer.split('\n\n')
                buffer = parts.pop() || ''

                for (const part of parts) {
                    if (!part.trim() || part.startsWith(':')) continue

                    let eventType = ''
                    let eventData = ''

                    for (const line of part.split('\n')) {
                        if (line.startsWith('event:')) {
                            eventType = line.slice(6).trim()
                        } else if (line.startsWith('data:')) {
                            eventData = line.slice(5).trim()
                        }
                    }

                    if (eventType && eventData) {
                        try {
                            handleEvent(eventType, JSON.parse(eventData), resolve, reject)
                        } catch {
                            // Ignore parse errors for individual events
                        }
                    }
                }
            }

            // If stream ended without result or error, reject
            if (!state.value.result && !state.value.error) {
                state.value.isStreaming = false
                stopFactRotation()
                reject(new Error('Stream ended without result'))
            }
        } catch (err: any) {
            if (err.name === 'AbortError') return
            state.value.error = err.message
            state.value.isStreaming = false
            stopFactRotation()
            reject(err)
        }
    }

    function handleEvent(eventType: string, data: any, resolve: (value: any) => void, reject: (reason: any) => void) {
        switch (eventType) {
            case 'phase_start':
                state.value.currentPhase = data.phase
                state.value.overallProgress = data.progress
                updatePhaseStatus(data.phase, 'active')
                break

            case 'phase_complete':
                state.value.overallProgress = data.progress
                updatePhaseStatus(data.phase, 'completed')
                break

            case 'validation_progress':
                state.value.validatedPlaces = data.validated
                state.value.totalPlaces = data.total
                state.value.overallProgress = data.progress
                break

            case 'fun_fact':
                state.value.funFacts.push(data.fact)
                if (!state.value.currentFact) {
                    state.value.currentFact = data.fact
                }
                break

            case 'result':
                state.value.result = data.result
                state.value.overallProgress = 100
                state.value.isStreaming = false
                stopFactRotation()
                resolve(data.result)
                break

            case 'error':
                state.value.error = data.error
                state.value.isStreaming = false
                stopFactRotation()
                reject(new Error(data.error))
                break
        }
    }

    function updatePhaseStatus(phaseId: string, status: 'active' | 'completed') {
        const phase = state.value.phases.find(p => p.id === phaseId)
        if (phase) phase.status = status
    }

    function startFactRotation() {
        factRotationInterval = setInterval(() => {
            const facts = state.value.funFacts
            if (facts.length > 1) {
                const currentIdx = facts.indexOf(state.value.currentFact || '')
                state.value.currentFact = facts[(currentIdx + 1) % facts.length] ?? null
            }
        }, 8000)
    }

    function stopFactRotation() {
        if (factRotationInterval) {
            clearInterval(factRotationInterval)
            factRotationInterval = null
        }
    }

    function abort() {
        abortController?.abort()
        state.value.isStreaming = false
        stopFactRotation()
    }

    return {
        state: readonly(state),
        startStream,
        abort,
    }
}
