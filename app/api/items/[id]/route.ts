import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { dollarsToCents } from "@/lib/money"

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const item = await db.item.findUnique({
    where: { id, userId: session.userId },
    include: { room: { select: { name: true } } },
  })

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { name, category, estimatedValue, roomId, purchaseDate, photoPath, priority, notes } = body

  const item = await db.item.update({
    where: { id, userId: session.userId },
    data: {
      ...(name !== undefined && { name }),
      ...(category !== undefined && { category }),
      ...(estimatedValue !== undefined && { estimatedValue: dollarsToCents(estimatedValue) }),
      ...(roomId !== undefined && { roomId: roomId || null }),
      ...(purchaseDate !== undefined && { purchaseDate: purchaseDate ? new Date(purchaseDate) : null }),
      ...(photoPath !== undefined && { photoPath }),
      ...(priority !== undefined && { priority }),
      ...(notes !== undefined && { notes }),
    },
    include: { room: { select: { name: true } } },
  })

  return NextResponse.json(item)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await db.item.delete({ where: { id, userId: session.userId } })
  return NextResponse.json({ ok: true })
}
