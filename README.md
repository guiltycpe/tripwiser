# ✈️ TripWiser: The Next-Gen Travel Planner

![Status](https://img.shields.io/badge/Status-Beta-brightgreen)
![Tech](https://img.shields.io/badge/Stack-Nuxt_4_|_Vue_3_|_Supabase_|_Leaflet-00C58E)
![I18n](https://img.shields.io/badge/Languages-EN_|_FR-blue)

**TripWiser** is a high-performance travel planning application built with Nuxt 4. It leverages advanced routing engines, multiple geolocation APIs, and AI-driven logic to generate optimized, ready-to-use travel itineraries.

> 🚧 **Personal Note:** This project is currently under active development. It represents my **professional playground** for mastering **Nuxt 4**, complex **API integrations**, and **Modern Headless Architecture**.

---

## 🎯 Project Vision & Goals

The main goal of TripWiser is to solve the **"fragmentation problem"** in travel planning. Instead of visiting dozens of different sites, users get a centralized, intelligent, and visually stunning plan.

From a technical perspective, this project serves as a showcase for:
- **Headless/API-centric Architecture**: Consuming and merging multiple external data sources (OSRM, Geoapify, Photon) efficiently.
- **Advanced Frontend State**: Implementing complex reactive logic for real-time map and timeline synchronization.
- **Premium UI/UX**: Creating a "Wow" effect using Glassmorphism and micro-animations with Tailwind CSS 4.

> 📂 **Deep Dive**: For detailed schemas and infrastructure details, check the [Technical Documentation](./docs/ARCHITECTURE.md).

---

## ✨ Key Features

### 🗺️ Intelligent Mapping & Routing
- **Real-Road Routing**: Integrated **OSRM (Open Source Routing Machine)** for real-time travel time and distance estimations.
- **Multi-Modal Transport**: Support for **Driving**, **Walking**, and **Cycling**, with dynamic UI recalculations.
- **Custom Map Engine**: Powered by **Leaflet**, featuring non-overlapping markers and optimized visual paths.

### 🔍 Smart Global Search
- **Hybrid Place Engine**: High-accuracy address autocomplete using **Geoapify** with a robust fallback to **Photon (OpenStreetMap)**.
- **Zero-Config UX**: Intelligent suggestions for trip origins.

### 🤖 Itinerary Logic
- **Geographic Spreading**: Smart logic to distribute activities across travel days to minimize travel fatigue.
- **Personalized Styles**: Tailored itineraries for "Luxury", "Comfort", or "Backpacker" budgets.
- **Travel Analytics**: Precision travel time and distance summary for every leg of the journey.

### 🌍 Localization (i18n)
- **Native Bilingual Support**: Fully translated in English and French.
- **Contextual Formatting**: Automatic unit conversion and duration strings.

---

## 🛠️ Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) & [Vue 3](https://vuejs.org/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Map engine**: [Leaflet](https://leafletjs.com/)
- **Tools**: [VueUse](https://vueuse.org/), `@nuxtjs/i18n`, `@nuxt/icon` (Heroicons)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- A Supabase project (URL & Secret Key)
- Geoapify API Key (Optional)

### Installation

1. **Clone & Enter**
   ```bash
   git clone https://github.com/guiltycpe/tripwiser.git
   cd tripwiser
   ```

2. **Environment**
   ```bash
   cp .env.example .env
   ```
   *Required variables:* `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_KEY`.

3. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

---

## 📜 Roadmap

- [x] **V1.0 Beta**: Advanced Map/Routing, Hybrid Search, I18n Core.
- [ ] **V1.1**: Itinerary export (PDF), Activity Drag-and-Drop.
- [ ] **V1.2**: Collaborative planning & live sharing.
- [ ] **V1.3**: Advanced AI generation via LLMs.

---

Made with ❤️ by [guiltycpe](https://github.com/guiltycpe)
