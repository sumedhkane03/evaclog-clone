import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatMoney } from "@/lib/money"
import { EvacuationClient } from "@/components/EvacuationClient"

export default async function EvacuationPage() {
  const { userId } = await requireAuth()

  const items = await db.item.findMany({
    where: { userId, priority: { gt: 0 } },
    include: { room: { select: { name: true } } },
    orderBy: [{ priority: "asc" }, { estimatedValue: "desc" }],
  })

  const allItems = await db.item.count({ where: { userId } })

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Evacuation Mode</h1>
        <p className="text-slate-500 text-sm mt-1">
          Your prioritized grab-list — {items.length} items flagged out of {allItems} total.
          Set priorities in the item editor.
        </p>
      </div>

      <EvacuationClient
        items={items.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          estimatedValue: formatMoney(item.estimatedValue),
          priority: item.priority,
          room: item.room?.name ?? "No room",
          photoPath: item.photoPath ?? null,
        }))}
      />
    </div>
  )
}
