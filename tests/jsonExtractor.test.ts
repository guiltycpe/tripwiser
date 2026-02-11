import { describe, it, expect } from 'vitest'
import { extractJSON, parseAIResponse } from '~/server/utils/jsonExtractor'

describe('extractJSON', () => {
  it('extracts JSON from clean text', () => {
    const input = '{"name": "test"}'
    expect(extractJSON(input)).toBe('{"name": "test"}')
  })

  it('extracts JSON from markdown code fences', () => {
    const input = '```json\n{"name": "test"}\n```'
    expect(extractJSON(input)).toBe('{"name": "test"}')
  })

  it('extracts JSON surrounded by text', () => {
    const input = 'Here is the result:\n{"name": "test"}\nDone!'
    expect(extractJSON(input)).toBe('{"name": "test"}')
  })

  it('removes trailing commas before } or ]', () => {
    const input = '{"items": ["a", "b",], "name": "test",}'
    const result = extractJSON(input)
    expect(JSON.parse(result)).toEqual({ items: ['a', 'b'], name: 'test' })
  })

  it('handles nested objects', () => {
    const input = '```json\n{"trip": {"days": [{"day": 1}]}}\n```'
    const result = extractJSON(input)
    expect(JSON.parse(result)).toEqual({ trip: { days: [{ day: 1 }] } })
  })

  it('throws when no JSON object found', () => {
    expect(() => extractJSON('no json here')).toThrow('No valid JSON object found')
  })

  it('throws for empty input', () => {
    expect(() => extractJSON('')).toThrow('No valid JSON object found')
  })
})

describe('parseAIResponse', () => {
  it('parses valid AI response', () => {
    const input = '```json\n{"destination": "Paris"}\n```'
    expect(parseAIResponse(input)).toEqual({ destination: 'Paris' })
  })

  it('throws on invalid JSON after extraction', () => {
    const input = '{"broken: json}'
    expect(() => parseAIResponse(input)).toThrow('Failed to parse AI JSON')
  })
})
