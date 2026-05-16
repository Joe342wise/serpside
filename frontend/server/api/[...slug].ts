const API_BASE = process.env.API_BASE || 'http://127.0.0.1:8000'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug') || ''
  const query = getQuery(event)
  const qs = new URLSearchParams(query as Record<string, string>).toString()
  const url = `${API_BASE}/api/${slug}${qs ? `?${qs}` : ''}`

  const res = await fetch(url)
  return await res.json()
})
