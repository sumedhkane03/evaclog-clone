import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatMoney } from "@/lib/money"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const PRIORITY_LABELS: Record<number, string> = { 1: "High", 2: "Medium", 3: "Low" }
const PRIORITY_COLORS: Record<number, string> = {
  1: "bg-red-100 text-red-700",
  2: "bg-yellow-100 text-yellow-700",
  3: "bg-slate-100 text-slate-600",
}

export default async function ItemsPage({ searchParams }: { searchParams: Promise<{ roomId?: string }> }) {
  const { userId } = await requireAuth()
  const { roomId } = await searchParams

  const [items, rooms] = await Promise.all([
    db.item.findMany({
      where: { userId, ...(roomId ? { roomId } : {}) },
      include: { room: { select: { name: true } } },
      orderBy: [{ priority: "asc" }, { estimatedValue: "desc" }],
    }),
    db.room.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Items</h1>
        <Link href="/app/items/new" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Add Items
        </Link>
      </div>

      {/* Room filter */}
      <div className="flex gap-2 flex-wrap">
        <Link
          href="/app/items"
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!roomId ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          All Rooms
        </Link>
        {rooms.map((r) => (
          <Link
            key={r.id}
            href={`/app/items?roomId=${r.id}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${roomId === r.id ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            {r.name}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg">No items yet.</p>
          <Link href="/app/items/new" className="text-teal-600 hover:underline mt-2 inline-block">Add your first item →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Item</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Room</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium">Priority</th>
                <th className="text-right px-4 py-3 text-slate-500 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/app/items/${item.id}`} className="font-medium text-slate-800 hover:text-teal-600">
                      {item.name}
                      {item.photoPath && <span className="ml-1 text-xs text-slate-400">📷</span>}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{item.category}</td>
                  <td className="px-4 py-3 text-slate-500">{item.room?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {item.priority > 0 ? (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[item.priority]}`}>
                        {PRIORITY_LABELS[item.priority]}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-700">{formatMoney(item.estimatedValue)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={4} className="px-4 py-3 text-sm font-medium text-slate-600">{items.length} items</td>
                <td className="px-4 py-3 text-right font-bold text-slate-800">
                  {formatMoney(items.reduce((s, i) => s + i.estimatedValue, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
