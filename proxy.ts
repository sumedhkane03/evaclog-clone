import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "evaclog-dev-secret-change-in-prod-32chars!!"
)

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith("/app")) return NextResponse.next()

  const token = req.cookies.get("evaclog_session")?.value
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  try {
    await jwtVerify(token, SECRET)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/app/:path*"],
}
