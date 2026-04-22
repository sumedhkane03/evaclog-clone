import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatMoney } from "@/lib/money"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default async function DashboardPage() {
  const { userId } = await requireAuth()

  const [items, rooms] = await Promise.all([
    db.item.findMany({
      where: { userId },
      include: { room: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.room.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ])

  const totalValue = items.reduce((sum, i) => sum + i.estimatedValue, 0)
  const protectedCount = items.filter((i) => i.photoPath && i.estimatedValue > 0).length
  const protectionPct = items.length === 0 ? 0 : Math.round((protectedCount / items.length) * 100)
  const recentItems = items.slice(0, 5)

  const roomSummary = rooms.map((r) => ({
    ...r,
    itemCount: items.filter((i) => i.roomId === r.id).length,
    value: items.filter((i) => i.roomId === r.id).reduce((s, i) => s + i.estimatedValue, 0),
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Home Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">Your household items, documented and protected</p>
        </div>
        <Link
          href="/app/items/new"
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Items
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Estimated Value</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{formatMoney(totalValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Total Items</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{items.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Protection Coverage</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-3xl font-bold text-slate-900">{protectionPct}%</p>
              <Progress value={protectionPct} className="flex-1 h-2" />
            </div>
            <p className="text-xs text-slate-400 mt-1">{protectedCount} of {items.length} items with photos + values</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Recently Added</CardTitle>
            <Link href="/app/items" className="text-xs text-teal-600 hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {recentItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">No items yet.</p>
                <Link href="/app/items/new" className="text-teal-600 text-sm hover:underline mt-1 inline-block">
                  Add your first item →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentItems.map((item) => (
                  <Link key={item.id} href={`/app/items/${item.id}`} className="flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.room?.name ?? "No room"} · {item.category}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{formatMoney(item.estimatedValue)}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rooms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">By Room</CardTitle>
            <Link href="/app/rooms" className="text-xs text-teal-600 hover:underline">Manage rooms</Link>
          </CardHeader>
          <CardContent>
            {roomSummary.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No rooms yet.</p>
            ) : (
              <div className="space-y-2">
                {roomSummary.map((room) => (
                  <div key={room.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 font-medium">{room.name}</span>
                      <Badge variant="secondary" className="text-xs">{room.itemCount}</Badge>
                    </div>
                    <span className="text-slate-600">{formatMoney(room.value)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
