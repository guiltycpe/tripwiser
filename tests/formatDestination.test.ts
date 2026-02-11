import { describe, it, expect } from 'vitest'
import { formatDestination, formatDestinationShort } from '~/utils/formatDestination'

describe('formatDestination', () => {
  it('returns "Unknown" for empty input', () => {
    expect(formatDestination('')).toBe('Unknown')
  })

  it('returns a single city as-is', () => {
    expect(formatDestination('Barcelona')).toBe('Barcelona')
  })

  it('strips country names and returns city', () => {
    expect(formatDestination('Barcelona, Spain')).toBe('Barcelona')
  })

  it('strips US state abbreviations', () => {
    expect(formatDestination('Los Angeles, CA, United States')).toBe('Los Angeles')
  })

  it('handles multi-destination with countries', () => {
    const result = formatDestination('Paris, France, Tokyo, Japan')
    expect(result).toBe('Paris · Tokyo')
  })

  it('handles multi-city in same country', () => {
    const result = formatDestination('Los Angeles, CA, United States of America, New York, NY, United States of America')
    expect(result).toBe('Los Angeles · New York')
  })

  it('deduplicates cities', () => {
    const result = formatDestination('Paris, paris, PARIS')
    expect(result).toBe('Paris')
  })

  it('shows +N for more than 3 cities', () => {
    const result = formatDestination('Paris, London, Tokyo, Berlin, Rome')
    expect(result).toContain('+')
    expect(result).toContain('Paris')
  })

  it('falls back to first segment if all are filtered', () => {
    expect(formatDestination('France')).toBe('France')
  })

  it('strips French region names', () => {
    expect(formatDestination('Paris, Île-de-France, France')).toBe('Paris')
  })
})

describe('formatDestinationShort', () => {
  it('returns "Unknown" for empty input', () => {
    expect(formatDestinationShort('')).toBe('Unknown')
  })

  it('returns only the primary city', () => {
    expect(formatDestinationShort('Paris, France, Tokyo, Japan')).toBe('Paris')
  })

  it('returns the single city', () => {
    expect(formatDestinationShort('Barcelona, Spain')).toBe('Barcelona')
  })
})
