// Supabase Database Types
// This file provides TypeScript type definitions for your Supabase database.
// You can generate this file automatically using:
// npx supabase gen types typescript --project-id qnmphtftiafljhjkzylw > types/database.types.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            trips: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string
                    destination: string
                    departure: string
                    departure_date: string | null
                    return_date: string | null
                    budget: string | null
                    travel_style: string | null
                    road_trip: boolean
                }
                Insert: {
                    id?: string
                    created_at?: string
                    user_id: string
                    destination: string
                    departure: string
                    departure_date?: string | null
                    return_date?: string | null
                    budget?: string | null
                    travel_style?: string | null
                    road_trip?: boolean
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string
                    destination?: string
                    departure?: string
                    departure_date?: string | null
                    return_date?: string | null
                    budget?: string | null
                    travel_style?: string | null
                    road_trip?: boolean
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
