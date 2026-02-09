/**
 * Itinerary Types — Shared TypeScript interfaces for itinerary data
 * Used across components, composables, and server API routes
 */

// ─── Activity ───
export interface TravelTime {
  minutes: string | number
  method: string
}

export interface ItineraryActivity {
  time_flexible: string
  activity_type: string
  description: string
  has_physical_location: boolean
  place_id?: string
  name?: string
  location?: string
  lat?: number
  lng?: number
  address?: string
  google_maps_link?: string
  rating?: number
  opening_hours?: Record<string, string[]> | null
  estimated_travel_time_from_previous?: TravelTime
  duration_minutes: number | null
  estimated_cost_usd: number
  notes?: string
  type?: string
}

// ─── Daily Plan ───
export interface DailyPlan {
  day: number
  date: string
  title: string
  daily_pace: string
  activities: ItineraryActivity[]
}

// ─── Itinerary Section ───
export interface ItinerarySection {
  section_title: string
  days: number[]
  geographic_focus: string
  accommodation_base: string
  daily_plans: DailyPlan[]
}

// ─── Accommodation ───
export interface AccommodationBase {
  neighborhood: string
  check_in: string
  check_out: string
  nights: number
  booking_link: string
  estimated_cost_per_night_usd: number
  total_cost_usd: number
  why_here: string
}

export interface AccommodationStrategy {
  total_bases: number
  reasoning: string
  bases: AccommodationBase[]
}

// ─── Transport ───
export interface FlightDetails {
  kayak_link: string
  google_flights_link?: string
  skyscanner_link?: string
  date?: string
  departure_date?: string
  return_date?: string
  estimated_cost_range_usd: string
}

export interface ItineraryTransport {
  outbound_flight: FlightDetails
  return_flight: FlightDetails
}

// ─── Cost Breakdown ───
export interface CostBreakdown {
  accommodation_total: number
  food_total: number
  activities_total: number
  souvenirs_budget: number
  per_person_total: number
}

// ─── Trip Summary ───
export interface TripSummary {
  destination: string
  duration_days: number
  budget_tier: string
  total_estimated_cost_usd: number
  cost_breakdown: CostBreakdown
}

// ─── Full Itinerary Response ───
export interface Itinerary {
  trip_summary: TripSummary
  transport: ItineraryTransport
  accommodation_strategy: AccommodationStrategy
  itinerary_sections: ItinerarySection[]
}

// ─── Trip (DB row with typed itinerary) ───
export interface Trip {
  id: string
  created_at: string
  user_id: string
  destination: string
  departure: string
  departure_date: string | null
  return_date: string | null
  budget: 'Low' | 'Medium' | 'High' | string | null
  travel_style: 'adventure' | 'relaxation' | 'culture' | 'food' | 'nature' | string | null
  road_trip: boolean
  travelers: number
  itinerary: Itinerary | null
  destination_image_url?: string | null
}

// ─── Map Activity (for MapViewer) ───
export interface MapActivity {
  lat: number
  lng: number
  description: string
  time?: string
  day?: number
}

// ─── Budget Analysis ───
export interface BudgetDayBreakdown {
  day: number
  date: string
  title: string
  activitiesCount: number
  total: number
  activities: { name: string; type: string; cost: number }[]
}

export interface BudgetAnalysis {
  total: number
  perPerson: number
  perDay: number
  accommodation: {
    total: number
    nights: number
    perNight: number
    bases: { neighborhood: string; nights: number; total: number }[]
  }
  food: {
    total: number
    perDay: number
    mealsCount: number
  }
  activities: {
    total: number
    count: number
    average: number
  }
  dailyBreakdown: BudgetDayBreakdown[]
}
