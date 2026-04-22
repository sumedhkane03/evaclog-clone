import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { dollarsToCents } from "@/lib/money"

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const roomId = searchParams.get("roomId") ?? undefined

  const items = await db.item.findMany({
    where: { userId: session.userId, ...(roomId ? { roomId } : {}) },
    include: { room: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, category, estimatedValue, roomId, purchaseDate, photoPath, priority, notes } = body

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })

  const item = await db.item.create({
    data: {
      userId: session.userId,
      name,
      category: category ?? "Other",
      estimatedValue: dollarsToCents(estimatedValue ?? 0),
      roomId: roomId || null,
      purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
      photoPath: photoPath ?? null,
      priority: priority ?? 0,
      notes: notes ?? null,
    },
    include: { room: { select: { name: true } } },
  })

  return NextResponse.json(item, { status: 201 })
}
