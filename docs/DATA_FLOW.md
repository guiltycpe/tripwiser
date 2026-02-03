# Data Flow: Itinerary Generation

Understanding how a user input becomes a mapped itinerary.

## 🔄 The Generation Lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant P as Plan.vue (Frontend)
    participant N as Nitro API (Backend)
    participant A as External APIs (Places/Routing)

    U->>P: Enter Destination & Preferences
    P->>N: POST /api/generate-itinerary
    N->>N: Process Budget & Styles
    N->>N: Apply Geographic Spreading Algo
    N-->>P: Return Itinerary JSON
    P->>P: Display Timeline
    P->>A: Fetch OSRM Route (for display)
    A-->>P: Route Geometry (Coords)
    P->>P: Render Map Polyline
```

## 🛠️ Key Logic: Geographic Spreading
To avoid map clustering:
1. The generator receives activity coordinates.
2. An **Offset Algorithm** applies small random variances to markers if they are too close.
3. The **Leg Duration logic** calculates the time between `Activity(n)` and `Activity(n+1)` based on the selected transport mode.
