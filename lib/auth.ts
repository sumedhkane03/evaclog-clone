import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { db } from "./db"

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "evaclog-dev-secret-change-in-prod-32chars!!"
)

const COOKIE = "evaclog_session"
const TTL_MS = 7 * 24 * 60 * 60 * 1000

export async function createSession(userId: string) {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + TTL_MS)

  await db.session.create({ data: { id: sessionId, userId, expiresAt } })

  const token = await new SignJWT({ sub: userId, sid: sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET)

  const jar = await cookies()
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  })
}

export async function getSession(): Promise<{ userId: string; sessionId: string } | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SECRET)
    const userId = payload.sub as string
    const sessionId = payload.sid as string

    const session = await db.session.findUnique({
      where: { id: sessionId },
    })
    if (!session || session.expiresAt < new Date()) return null

    return { userId, sessionId }
  } catch {
    return null
  }
}

export async function destroySession() {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET)
      await db.session.delete({ where: { id: payload.sid as string } }).catch(() => {})
    } catch {
      // ignore invalid token
    }
  }
  jar.delete(COOKIE)
}

export async function requireAuth(): Promise<{ userId: string; sessionId: string }> {
  const session = await getSession()
  if (!session) {
    const { redirect } = await import("next/navigation")
    redirect("/login")
  }
  return session!
}
