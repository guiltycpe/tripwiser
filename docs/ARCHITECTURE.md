# System Architecture

TripWiser is built on a modern, event-driven, and API-centric architecture using Nuxt 4. This document outlines the core components and how they interact.

## 🏗️ High-Level Perspective

The application follows a **BFF (Backend-for-Frontend)** pattern where the Nuxt Nitro server acts as a secure gateway to various external services.

```mermaid
graph TD
    User((User/Browser))
    
    subgraph "Nuxt 4 App"
        Vue[Vue 3 Components]
        Composables[Composables / Logic]
        Nitro[Nitro API Engine]
    end
    
    subgraph "External Services"
        Supabase[(Supabase Auth/DB)]
        OSRM[OSRM Routing API]
        Geoapify[Geoapify Places API]
        Photon[Photon/OSM Maps]
    end
    
    User <-->|HTTPS/Vue| Vue
    Vue <--> Composables
    Composables <--> Nitro
    
    Nitro <-->|API Keys| Geoapify
    Nitro <--> Photon
    Vue <-->|Direct Client| Supabase
    Vue <-->|Public API| OSRM
```

## 🧩 Core Components

### 1. Frontend Layer (Vue 3 / Nuxt)
- **Pages**: Structured routing using Nuxt's file-based system.
- **Components**: Atomic and modular UI elements (MapViewer, TripDetailsModal).
- **Glassmorphism UI**: Custom CSS/Tailwind system for a premium feel.

### 2. Server Engine (Nitro)
- **Places Proxy**: Standardizes results from different geocoding providers (Geoapify/Photon).
- **Itinerary Generator**: Complex logic that processes budget, travel style, and duration to produce a balanced schedule.

### 3. Data & Auth (Supabase)
- **PostgreSQL**: Stores user-saved trips and preferences (See [Database Schema](./DATABASE_SCHEMA.md)).
- **GoTrue**: Handles JWT-based authentication.

### 4. Special Engines
- **Leaflet**: Client-side rendering of geographic data.
- **OSRM**: Fetching actual road-based geometries for maps.
