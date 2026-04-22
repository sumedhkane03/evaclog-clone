"use client"

import { useState } from "react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "High Priority", color: "text-red-600 bg-red-50 border-red-200" },
  2: { label: "Medium Priority", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  3: { label: "Low Priority", color: "text-slate-600 bg-slate-50 border-slate-200" },
}

interface EvacItem {
  id: string; name: string; category: string; estimatedValue: string
  priority: number; room: string; photoPath: string | null
}

export function EvacuationClient({ items }: { items: EvacItem[] }) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function reset() {
    if (confirm("Clear all checkmarks and start over?")) setChecked(new Set())
  }

  const progress = items.length === 0 ? 0 : Math.round((checked.size / items.length) * 100)

  const byPriority: Record<number, EvacItem[]> = { 1: [], 2: [], 3: [] }
  items.forEach((item) => { byPriority[item.priority]?.push(item) })

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 space-y-2">
        <p className="text-lg">No items flagged for evacuation yet.</p>
        <p className="text-sm">Edit an item and set its Evacuation Priority to include it here.</p>
        <Link href="/app/items" className="text-teal-600 hover:underline inline-block mt-2">
          Browse your items →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800">Evacuation Progress</p>
            <p className="text-sm text-slate-500">{checked.size} of {items.length} items secured</p>
          </div>
          <div className="text-2xl font-bold text-teal-600">{progress}%</div>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="flex gap-2">
          <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Reset checklist
          </button>
        </div>
      </div>

      {/* Items grouped by priority */}
      {[1, 2, 3].map((p) => {
        const group = byPriority[p]
        if (!group || group.length === 0) return null
        const { label, color } = PRIORITY_LABELS[p]

        return (
          <div key={p} className="space-y-2">
            <h3 className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>{label}</h3>
            <div className="space-y-2">
              {group.map((item) => {
                const done = checked.has(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${done ? "bg-green-50 border-green-200 opacity-70" : "bg-white border-slate-200 hover:border-teal-200"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${done ? "bg-green-500 border-green-500" : "border-slate-300"}`}>
                      {done && <span className="text-white text-xs">✓</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${done ? "line-through text-slate-400" : "text-slate-800"}`}>{item.name}</p>
                      <p className="text-xs text-slate-400">{item.room} · {item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">{item.estimatedValue}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {checked.size === items.length && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700 font-medium">
          All items secured! Stay safe.
        </div>
      )}
    </div>
  )
}
