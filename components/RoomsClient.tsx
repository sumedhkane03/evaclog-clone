"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Room { id: string; name: string; itemCount: number }

export function RoomsClient({ rooms: initialRooms }: { rooms: Room[] }) {
  const router = useRouter()
  const [rooms, setRooms] = useState(initialRooms)
  const [newName, setNewName] = useState("")
  const [adding, setAdding] = useState(false)

  async function addRoom(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)

    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    })

    if (res.ok) {
      const room = await res.json()
      setRooms((prev) => [...prev, { id: room.id, name: room.name, itemCount: 0 }].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName("")
      router.refresh()
    }
    setAdding(false)
  }

  async function deleteRoom(id: string, itemCount: number) {
    if (itemCount > 0) {
      const ok = confirm(`This room has ${itemCount} items. Items will be unassigned (not deleted). Continue?`)
      if (!ok) return
    }

    await fetch("/api/rooms", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    setRooms((prev) => prev.filter((r) => r.id !== id))
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Add Room</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addRoom} className="flex gap-2">
            <Input
              placeholder="e.g. Guest Bedroom"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <Button type="submit" disabled={adding} className="bg-teal-600 hover:bg-teal-700 shrink-0">
              {adding ? "Adding…" : "Add"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {rooms.length === 0 ? (
          <p className="text-sm text-slate-400 p-6 text-center">No rooms yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {rooms.map((room) => (
              <li key={room.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-800">{room.name}</span>
                  <Badge variant="secondary" className="text-xs">{room.itemCount} items</Badge>
                </div>
                <button
                  onClick={() => deleteRoom(room.id, room.itemCount)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
