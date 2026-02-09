/**
 * formatDestination — Smart destination title formatter
 * 
 * Handles both single and multi-destination trips.
 * Extracts city names from full geocoding strings and produces clean titles.
 * 
 * Examples:
 *   "Los Angeles, CA, États-Unis d'Amérique" → "Los Angeles"
 *   "Los Angeles, CA, États-Unis d'Amérique, New York, NY, États-Unis d'Amérique" → "Los Angeles · New York"
 *   "Paris, France, Tokyo, Japan" → "Paris · Tokyo"
 *   "Barcelona, Spain" → "Barcelona"
 *   "Thailand" → "Thailand"
 */

/** Common country names and patterns to strip when extracting cities */
const COUNTRY_PATTERNS = [
  // Full country names (common ones)
  /états-unis d'amérique/i, /united states of america/i, /united states/i,
  /united kingdom/i, /royaume-uni/i,
  /france/i, /germany/i, /allemagne/i, /spain/i, /espagne/i,
  /italy/i, /italie/i, /japan/i, /japon/i, /china/i, /chine/i,
  /australia/i, /australie/i, /canada/i, /brazil/i, /brésil/i,
  /mexico/i, /mexique/i, /india/i, /inde/i, /indonesia/i, /indonésie/i,
  /thailand/i, /thaïlande/i, /vietnam/i, /viêt nam/i,
  /portugal/i, /netherlands/i, /pays-bas/i, /belgium/i, /belgique/i,
  /switzerland/i, /suisse/i, /austria/i, /autriche/i,
  /greece/i, /grèce/i, /turkey/i, /turquie/i, /morocco/i, /maroc/i,
  /south korea/i, /corée du sud/i, /south africa/i, /afrique du sud/i,
  /new zealand/i, /nouvelle-zélande/i, /ireland/i, /irlande/i,
  /poland/i, /pologne/i, /czech republic/i, /république tchèque/i,
  /norway/i, /norvège/i, /sweden/i, /suède/i, /denmark/i, /danemark/i,
  /finland/i, /finlande/i, /iceland/i, /islande/i,
  /argentina/i, /argentine/i, /colombia/i, /colombie/i, /chile/i, /chili/i,
  /peru/i, /pérou/i, /egypt/i, /égypte/i, /kenya/i, /tanzania/i, /tanzanie/i,
  /croatia/i, /croatie/i, /hungary/i, /hongrie/i, /romania/i, /roumanie/i,
]

/** US state abbreviations */
const US_STATE_ABBR = /^[A-Z]{2}$/

/** Common region/state/province patterns */
const REGION_PATTERNS = [
  /^île-de-france$/i, /^provence-alpes/i, /^occitanie$/i, /^auvergne/i,
  /^nouvelle-aquitaine$/i, /^hauts-de-france$/i, /^grand est$/i, /^bretagne$/i,
  /^normandie$/i, /^bourgogne/i, /^pays de la loire$/i, /^centre-val/i,
  /^catalonia$/i, /^catalogne$/i, /^andalusia$/i, /^andalousie$/i,
  /^lombardy$/i, /^lombardie$/i, /^tuscany$/i, /^toscane$/i, /^lazio$/i,
  /^bavaria$/i, /^bavière$/i, /^north rhine/i,
  /^england$/i, /^angleterre$/i, /^scotland$/i, /^écosse$/i, /^wales$/i,
  /^queensland$/i, /^new south wales$/i, /^victoria$/i,
  /^ontario$/i, /^québec$/i, /^british columbia$/i, /^alberta$/i,
]

/**
 * Check if a segment looks like a country name, state abbreviation, or region
 */
function isNonCitySegment(segment: string): boolean {
  const trimmed = segment.trim()
  if (!trimmed) return true

  // US state abbreviations (CA, NY, NV, TX, etc.)
  if (US_STATE_ABBR.test(trimmed)) return true

  // Known country patterns
  if (COUNTRY_PATTERNS.some(p => p.test(trimmed))) return true

  // Known region patterns
  if (REGION_PATTERNS.some(p => p.test(trimmed))) return true

  return false
}

/**
 * Extract city names from a raw destination string.
 * 
 * Strategy: Split by comma, filter out countries/states/regions,
 * then deduplicate.
 */
function extractCities(raw: string): string[] {
  if (!raw) return []

  const segments = raw.split(',').map(s => s.trim()).filter(Boolean)

  // If only 1 segment, return as-is (it's probably just a city or country name)
  if (segments.length <= 1) return segments

  // Filter: keep segments that don't match country/state/region patterns
  const cities = segments.filter(s => !isNonCitySegment(s))

  // Deduplicate (case-insensitive)
  const seen = new Set<string>()
  const unique: string[] = []
  for (const city of cities) {
    const key = city.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(city)
    }
  }

  // If filtering removed everything (e.g., input was just "France"),
  // fall back to the first segment
  return unique.length > 0 ? unique : [segments[0] || raw]
}

/**
 * Format a raw destination string into a clean, readable title.
 * 
 * @param destination - Raw destination string from the database
 * @returns Formatted title like "Los Angeles · New York · Las Vegas"
 */
export function formatDestination(destination: string): string {
  if (!destination) return 'Unknown'

  const cities = extractCities(destination)

  // If more than 3 cities, show first 3 + count
  if (cities.length > 3) {
    return `${cities.slice(0, 3).join(' · ')} +${cities.length - 3}`
  }

  return cities.join(' · ')
}

/**
 * Get a short version (just the primary city) for compact displays.
 */
export function formatDestinationShort(destination: string): string {
  if (!destination) return 'Unknown'
  const cities = extractCities(destination)
  return cities[0] || 'Unknown'
}
