// User Profile Types for TripWiser

export interface TravelPreferences {
    budget_default?: 'Low' | 'Medium' | 'High'
    travel_style_default?: 'adventure' | 'relaxation' | 'cultural' | 'foodie' | 'nature' | 'urban'
    preferred_pace?: 'slow' | 'moderate' | 'fast'
    food_preferences?: string[]
    accessibility_needs?: string[]
    interests?: string[]
    avoid?: string[]
}

export interface UserProfile {
    id: string
    user_id: string
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    travel_preferences?: TravelPreferences
    dietary_restrictions?: string[] | null
    preferred_languages?: string[] | null
    currency_preference?: string
    created_at: string
    updated_at: string
}

export interface UpdateProfilePayload {
    full_name?: string
    bio?: string
    travel_preferences?: TravelPreferences
    dietary_restrictions?: string[]
    preferred_languages?: string[]
    currency_preference?: string
}
