"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { centsToDollars } from "@/lib/money"

const CATEGORIES = ["Electronics", "Furniture", "Appliances", "Clothing", "Jewelry", "Art", "Sports", "Tools", "Books", "Kitchen", "Other"]

interface Room { id: string; name: string }

interface EditItemFormProps {
  item: {
    id: string; name: string; category: string; estimatedValue: number
    roomId: string; priority: number; notes: string; photoPath: string
  }
  rooms: Room[]
}

export function EditItemForm({ item, rooms }: EditItemFormProps) {
  const router = useRouter()
  const [name, setName] = useState(item.name)
  const [category, setCategory] = useState(item.category)
  const [value, setValue] = useState(centsToDollars(item.estimatedValue))
  const [roomId, setRoomId] = useState(item.roomId)
  const [priority, setPriority] = useState(String(item.priority))
  const [notes, setNotes] = useState(item.notes)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)

    const res = await fetch(`/api/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, estimatedValue: value, roomId: roomId || null, priority: Number(priority), notes }),
    })

    setSaving(false)
    if (res.ok) {
      router.push("/app/items")
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error ?? "Failed to save")
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return
    setDeleting(true)
    await fetch(`/api/items/${item.id}`, { method: "DELETE" })
    router.push("/app/items")
    router.refresh()
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {item.photoPath && (
          <div className="mb-4 rounded-lg overflow-hidden border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.photoPath} alt={item.name} className="w-full max-h-64 object-cover" />
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Item name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? "Other")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estimated Value ($)</Label>
              <Input type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <Select value={roomId} onValueChange={(v) => setRoomId(v ?? "")}>
                <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No room</SelectItem>
                  {rooms.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Evacuation Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v ?? "0")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="1">High — grab first</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">Low — if time permits</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleting} size="sm">
              {deleting ? "Deleting…" : "Delete Item"}
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
