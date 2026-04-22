"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DetectedItem } from "@/lib/ai"

const CATEGORIES = ["Electronics", "Furniture", "Appliances", "Clothing", "Jewelry", "Art", "Sports", "Tools", "Books", "Kitchen", "Other"]

interface Room { id: string; name: string }

interface AddItemFormProps { rooms: Room[] }

interface AIItem extends DetectedItem {
  selected: boolean
  roomId: string
}

export function AddItemForm({ rooms }: AddItemFormProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  // Manual form state
  const [name, setName] = useState("")
  const [category, setCategory] = useState("Other")
  const [value, setValue] = useState("")
  const [roomId, setRoomId] = useState("")
  const [priority, setPriority] = useState("0")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // AI detection state
  const [tab, setTab] = useState<"manual" | "ai">("manual")
  const [analyzing, setAnalyzing] = useState(false)
  const [aiError, setAiError] = useState("")
  const [aiPhoto, setAiPhoto] = useState("")
  const [aiItems, setAiItems] = useState<AIItem[]>([])
  const [aiSaving, setAiSaving] = useState(false)

  async function saveManual(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)

    const res = await fetch("/api/items", {
      method: "POST",
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

  async function analyzePhoto() {
    const file = fileRef.current?.files?.[0]
    if (!file) return
    setAnalyzing(true)
    setAiError("")
    setAiItems([])

    const form = new FormData()
    form.append("photo", file)

    const res = await fetch("/api/items/analyze", { method: "POST", body: form })
    const data = await res.json()

    setAnalyzing(false)
    if (!res.ok) {
      setAiError(data.error ?? "Analysis failed")
      return
    }

    setAiPhoto(data.photoPath)
    setAiItems((data.items as DetectedItem[]).map((item) => ({
      ...item,
      selected: true,
      roomId: "",
    })))
  }

  async function saveAiItems() {
    const selected = aiItems.filter((i) => i.selected)
    if (selected.length === 0) return
    setAiSaving(true)

    await Promise.all(
      selected.map((item) =>
        fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: item.name,
            category: item.category,
            estimatedValue: item.estimatedValue,
            roomId: item.roomId || null,
            photoPath: aiPhoto,
          }),
        })
      )
    )

    setAiSaving(false)
    router.push("/app/items")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setTab("manual")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "manual" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setTab("ai")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "ai" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
        >
          ✨ AI Photo Detection
        </button>
      </div>

      {tab === "manual" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add a single item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveManual} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Item name *</Label>
                  <Input placeholder="e.g. 65&quot; LG OLED TV" value={name} onChange={(e) => setName(e.target.value)} required />
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
                  <Input type="number" min="0" step="0.01" placeholder="0.00" value={value} onChange={(e) => setValue(e.target.value)} />
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
                  <Textarea placeholder="Serial number, model, purchase date…" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700">
                {saving ? "Saving…" : "Save Item"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {tab === "ai" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Room Photo Detection</CardTitle>
            <CardDescription>Upload a photo of a room — AI will identify and value items automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={analyzePhoto}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="text-teal-600 hover:text-teal-700 font-medium"
                disabled={analyzing}
              >
                {analyzing ? "Analyzing photo…" : "Click to upload room photo"}
              </button>
              <p className="text-sm text-slate-400 mt-1">JPEG, PNG, or WebP</p>
              {analyzing && (
                <div className="mt-3 flex justify-center">
                  <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {aiError && <p className="text-sm text-red-500">{aiError}</p>}

            {aiItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">{aiItems.filter((i) => i.selected).length} of {aiItems.length} items selected</p>
                  <button onClick={() => setAiItems((prev) => prev.map((i) => ({ ...i, selected: !prev.every((x) => x.selected) })))} className="text-xs text-teal-600 hover:underline">
                    Toggle all
                  </button>
                </div>

                {aiItems.map((item, idx) => (
                  <div key={idx} className={`border rounded-lg p-3 transition-colors ${item.selected ? "border-teal-200 bg-teal-50/50" : "border-slate-200 bg-white opacity-60"}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(e) => setAiItems((prev) => prev.map((x, i) => i === idx ? { ...x, selected: e.target.checked } : x))}
                        className="mt-1 accent-teal-600"
                      />
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">Name</p>
                          <p className="text-sm font-medium text-slate-800">{item.name}</p>
                          <span className="text-xs text-slate-500">{item.category}</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">Est. Value</p>
                          <p className="text-sm font-medium">${item.estimatedValue.toLocaleString()}</p>
                          <p className="text-xs text-slate-400">{Math.round(item.confidence * 100)}% confidence</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">Room</p>
                          <Select value={item.roomId} onValueChange={(v) => setAiItems((prev) => prev.map((x, i) => i === idx ? { ...x, roomId: v ?? "" } : x))}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Assign room" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">No room</SelectItem>
                              {rooms.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={saveAiItems}
                  disabled={aiSaving || aiItems.filter((i) => i.selected).length === 0}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  {aiSaving ? "Saving…" : `Add ${aiItems.filter((i) => i.selected).length} Items to Inventory`}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
