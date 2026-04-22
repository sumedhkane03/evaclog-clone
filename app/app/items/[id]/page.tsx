import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { EditItemForm } from "@/components/EditItemForm"

export default async function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await requireAuth()
  const { id } = await params

  const [item, rooms] = await Promise.all([
    db.item.findUnique({ where: { id, userId }, include: { room: { select: { name: true } } } }),
    db.room.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ])

  if (!item) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit Item</h1>
      <EditItemForm
        item={{
          id: item.id,
          name: item.name,
          category: item.category,
          estimatedValue: item.estimatedValue,
          roomId: item.roomId ?? "",
          priority: item.priority,
          notes: item.notes ?? "",
          photoPath: item.photoPath ?? "",
        }}
        rooms={rooms.map((r) => ({ id: r.id, name: r.name }))}
      />
    </div>
  )
}
