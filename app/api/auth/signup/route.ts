import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { createSession } from "@/lib/auth"
import { seedDefaultRooms } from "@/lib/rooms"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: "Invalid email or password (min 6 chars)" }, { status: 400 })
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await db.user.create({ data: { email, passwordHash } })

  await seedDefaultRooms(user.id)
  await createSession(user.id)

  return NextResponse.json({ ok: true })
}
