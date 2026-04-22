import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/db"
import { RoomsClient } from "@/components/RoomsClient"

export default async function RoomsPage() {
  const { userId } = await requireAuth()
  const rooms = await db.room.findMany({
    where: { userId },
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
      <RoomsClient rooms={rooms.map((r) => ({ id: r.id, name: r.name, itemCount: r._count.items }))} />
    </div>
  )
}
