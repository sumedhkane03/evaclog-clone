import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { createSession } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  await createSession(user.id)
  return NextResponse.json({ ok: true })
}
