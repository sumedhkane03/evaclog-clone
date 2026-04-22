import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/db"
import { AddItemForm } from "@/components/AddItemForm"

export default async function NewItemPage() {
  const { userId } = await requireAuth()
  const rooms = await db.room.findMany({ where: { userId }, orderBy: { name: "asc" } })
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Add Items</h1>
      <AddItemForm rooms={rooms.map((r) => ({ id: r.id, name: r.name }))} />
    </div>
  )
}
