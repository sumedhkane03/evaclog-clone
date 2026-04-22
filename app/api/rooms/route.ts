import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rooms = await db.room.findMany({
    where: { userId: session.userId },
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(rooms)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 })

  const room = await db.room.create({ data: { userId: session.userId, name } })
  return NextResponse.json(room, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await req.json()
  await db.room.delete({ where: { id, userId: session.userId } })
  return NextResponse.json({ ok: true })
}
