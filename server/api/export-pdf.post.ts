import type { H3Event } from 'h3'
import { requireAuth } from '~/server/utils/auth'

/**
 * POST /api/export-pdf
 * 
 * Generates a printable HTML document for a trip itinerary
 * that can be printed/saved as PDF from the browser.
 */
export default defineEventHandler(async (event: H3Event) => {
  await requireAuth(event)

  const body = await readBody(event)
  const { tripData, tripMeta } = body

  if (!tripData?.itinerary_sections || !tripData?.trip_summary) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing itinerary data',
    })
  }

  const summary = tripData.trip_summary
  const sections = tripData.itinerary_sections

  // Build printable HTML
  let activitiesHtml = ''
  for (const section of sections) {
    activitiesHtml += `<div class="section">
      <h2>${escapeHtml(section.section_title)}</h2>
      <p class="section-meta">${escapeHtml(section.geographic_focus)} • Base: ${escapeHtml(section.accommodation_base)}</p>`

    for (const day of section.daily_plans) {
      activitiesHtml += `<div class="day">
        <h3>Day ${day.day}: ${escapeHtml(day.title)}</h3>
        <span class="pace">${escapeHtml(day.daily_pace)}</span>
        <table class="activities">`

      for (const act of day.activities) {
        activitiesHtml += `<tr>
          <td class="time">${escapeHtml(act.time_flexible || '')}</td>
          <td class="desc">
            <strong>${escapeHtml(act.description)}</strong>
            ${act.notes ? `<br><em>${escapeHtml(act.notes)}</em>` : ''}
            ${act.google_maps_link ? `<br><a href="${escapeHtml(act.google_maps_link)}" target="_blank">📍 Maps</a>` : ''}
          </td>
          <td class="cost">$${act.estimated_cost_usd ?? 0}</td>
        </tr>`
      }

      activitiesHtml += '</table></div>'
    }
    activitiesHtml += '</div>'
  }

  // Accommodation info
  let accommodationHtml = ''
  if (tripData.accommodation_strategy?.bases) {
    accommodationHtml = '<div class="section"><h2>🏨 Accommodation</h2><div class="accom-grid">'
    for (const base of tripData.accommodation_strategy.bases) {
      accommodationHtml += `<div class="accom-card">
        <strong>${escapeHtml(base.neighborhood)}</strong>
        <p>${base.nights} nights • $${base.estimated_cost_per_night_usd}/night</p>
        ${base.booking_link ? `<a href="${escapeHtml(base.booking_link)}" target="_blank">Book here</a>` : ''}
      </div>`
    }
    accommodationHtml += '</div></div>'
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TripWiser - ${escapeHtml(summary.destination)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a2e; line-height: 1.6; padding: 40px; max-width: 900px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #14b8a6; }
    .header h1 { font-size: 2.5em; background: linear-gradient(135deg, #14b8a6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .header .meta { color: #6b7280; font-size: 0.9em; margin-top: 8px; }
    .budget-bar { display: flex; justify-content: space-around; background: #f0fdfa; padding: 16px; border-radius: 12px; margin-bottom: 30px; }
    .budget-bar .item { text-align: center; }
    .budget-bar .item .value { font-size: 1.5em; font-weight: 800; color: #0d9488; }
    .budget-bar .item .label { font-size: 0.8em; color: #6b7280; }
    .section { margin-bottom: 30px; }
    .section h2 { font-size: 1.4em; color: #0d9488; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb; }
    .section-meta { color: #6b7280; font-size: 0.85em; margin-bottom: 16px; }
    .day { margin-bottom: 20px; page-break-inside: avoid; }
    .day h3 { font-size: 1.1em; margin-bottom: 4px; }
    .pace { display: inline-block; background: #f0fdfa; color: #0d9488; font-size: 0.75em; font-weight: 600; padding: 2px 10px; border-radius: 999px; margin-bottom: 8px; }
    .activities { width: 100%; border-collapse: collapse; }
    .activities tr { border-bottom: 1px solid #f3f4f6; }
    .activities td { padding: 8px 6px; vertical-align: top; font-size: 0.9em; }
    .activities .time { width: 80px; color: #6b7280; font-weight: 600; white-space: nowrap; }
    .activities .cost { width: 70px; text-align: right; font-weight: 700; color: #0d9488; }
    .accom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .accom-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
    .accom-card strong { display: block; margin-bottom: 4px; }
    .accom-card a { color: #0d9488; font-size: 0.85em; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 0.8em; }
    @media print {
      body { padding: 20px; }
      .day { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✈️ ${escapeHtml(summary.destination)}</h1>
    <div class="meta">
      ${tripMeta?.departureDate || ''} — ${tripMeta?.returnDate || ''} • ${summary.duration_days} days • ${tripMeta?.travelers || 1} traveler(s)
    </div>
  </div>

  <div class="budget-bar">
    <div class="item"><div class="value">$${summary.total_estimated_cost_usd}</div><div class="label">Total Budget</div></div>
    <div class="item"><div class="value">$${Math.round(summary.total_estimated_cost_usd / (tripMeta?.travelers || 1))}</div><div class="label">Per Person</div></div>
    <div class="item"><div class="value">$${Math.round(summary.total_estimated_cost_usd / summary.duration_days)}</div><div class="label">Per Day</div></div>
  </div>

  ${accommodationHtml}
  ${activitiesHtml}

  <div class="footer">
    Generated by TripWiser • ${new Date().toLocaleDateString()}
  </div>
</body>
</html>`

  // Return as HTML content
  setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  setResponseHeader(event, 'Content-Disposition', `inline; filename="tripwiser-${summary.destination.replace(/\s+/g, '-').toLowerCase()}.html"`)
  return html
})

function escapeHtml(text: string): string {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
