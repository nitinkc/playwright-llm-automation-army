import type { APIRequestContext } from '@playwright/test'

export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000'

export async function apiIsUp(request: APIRequestContext, apiBaseUrl = API_BASE_URL) {
  try {
    const res = await request.get(`${apiBaseUrl}/authUsers`)
    return res.ok()
  } catch {
    return false
  }
}

export async function getAuthUsersByEmail(
  request: APIRequestContext,
  email: string,
  apiBaseUrl = API_BASE_URL
) {
  const res = await request.get(`${apiBaseUrl}/authUsers?email=${encodeURIComponent(email)}`)
  if (!res.ok()) throw new Error(`API GET authUsers failed: ${res.status()} ${res.statusText()}`)
  return (await res.json()) as Array<{ id: number | string; email: string }>
}

export async function deleteAuthUsersByEmail(
  request: APIRequestContext,
  email: string,
  apiBaseUrl = API_BASE_URL
) {
  const users = await getAuthUsersByEmail(request, email, apiBaseUrl)
  for (const u of users) {
    const res = await request.delete(`${apiBaseUrl}/authUsers/${u.id}`)
    if (!res.ok()) throw new Error(`API DELETE authUsers/${u.id} failed: ${res.status()} ${res.statusText()}`)
  }
}

export async function createAuthUser(
  request: APIRequestContext,
  user: { id?: number | string; name: string; email: string; password: string },
  apiBaseUrl = API_BASE_URL
) {
  const payload = {
    id: user.id ?? Date.now(),
    name: user.name,
    email: user.email,
    password: user.password,
    createdAt: new Date().toISOString()
  }

  const res = await request.post(`${apiBaseUrl}/authUsers`, { data: payload })
  if (!res.ok()) throw new Error(`API POST authUsers failed: ${res.status()} ${res.statusText()}`)
  return (await res.json()) as { id: number | string; name: string; email: string }
}
