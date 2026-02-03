# Database Schema (Supabase)

TripWiser uses **Supabase (PostgreSQL)** to store user data and generated itineraries. The schema is designed for flexibility, storing the complex itinerary structure as a JSONB object.

## 🗄️ Tables

### `trips`
This is the primary table where all travel plans are stored.

| Column           | Type          | Description                                  |
| :--------------- | :------------ | :------------------------------------------- |
| `id`             | `uuid`        | Primary Key (auto-generated).                |
| `created_at`     | `timestamptz` | Timestamp of trip creation.                  |
| `user_id`        | `uuid`        | Foreign Key to `auth.users` (Supabase Auth). |
| `departure`      | `text`        | Starting city/location.                      |
| `destination`    | `text`        | Comma-separated list of destination cities.  |
| `departure_date` | `date`        | Expected start date.                         |
| `return_date`    | `date`        | Expected end date.                           |
| `budget`         | `text`        | Budget level (Low, Medium, High).            |
| `travel_style`   | `text`        | Chosen style (Adventure, Relaxation, etc.).  |
| `road_trip`      | `boolean`     | Whether the user requested a road trip.      |
| `travelers`      | `integer`     | Number of people traveling.                  |
| `itinerary`      | `jsonb`       | The core data structure (see below).         |

---

## 📄 Itinerary JSON Structure

The `itinerary` column stores an array of Day objects. This format allows the frontend to render the timeline dynamically without complex joins.

### Example Structure
```json
[
  {
    "day": 1,
    "title": "Arrival and Exploration",
    "activities": [
      {
        "time": "09:00",
        "description": "Visit the historic city center.",
        "location": "Central Square",
        "coordinates": [48.8566, 2.3522]
      },
      {
        "time": "14:00",
        "description": "Lunch at a local bistro.",
        "location": "Le Petit Bistro"
      }
    ]
  }
]
```

## 🔐 Security (RLS)

We use **Row Level Security (RLS)** to protect user data. Each user can only see and modify their own trips.

### SQL Policies Used:
- **SELECT**: `auth.uid() = user_id`
- **INSERT**: `auth.uid() = user_id`
- **DELETE**: `auth.uid() = user_id`
- **UPDATE**: `auth.uid() = user_id`

---

## 🚀 Performance
- **Index on `user_id`**: For fast dashboard queries.
- **JSONB format**: Efficiently handles diverse activity types without schema migrations.
