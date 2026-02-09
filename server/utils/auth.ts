/**
 * Server-side authentication helper
 * Verifies that the request comes from an authenticated Supabase user.
 * Use in all protected API endpoints.
 */
import { serverSupabaseClient } from '#supabase/server'
import type { H3Event } from 'h3'

export async function requireAuth(event: H3Event) {
  const supabase = await serverSupabaseClient(event)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user || !user.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized — Please log in'
    })
  }

  return { supabase, user }
}

/**
 * Simple in-memory rate limiter per user ID
 * Resets after the window expires.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(userId: string, options: { maxRequests: number; windowMs: number }) {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + options.windowMs })
    return
  }

  entry.count++
  if (entry.count > options.maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: `Too many requests. Please wait ${Math.ceil((entry.resetAt - now) / 1000)}s.`
    })
  }
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key)
  }
}, 5 * 60 * 1000)
