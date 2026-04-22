import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { analyzeRoomPhoto } from "@/lib/ai"
import path from "path"
import fs from "fs/promises"

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured. Add it to .env to enable AI detection." },
      { status: 503 }
    )
  }

  const formData = await req.formData()
  const file = formData.get("photo") as File | null
  if (!file) return NextResponse.json({ error: "No photo provided" }, { status: 400 })

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Save photo to uploads dir
  const uploadsDir = path.join(process.cwd(), "uploads")
  await fs.mkdir(uploadsDir, { recursive: true })
  const filename = `${session.userId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
  const filepath = path.join(uploadsDir, filename)
  await fs.writeFile(filepath, buffer)

  try {
    const items = await analyzeRoomPhoto(buffer, file.type)
    return NextResponse.json({ items, photoPath: `/api/uploads/${filename}` })
  } catch (err) {
    return NextResponse.json(
      { error: `AI analysis failed: ${err instanceof Error ? err.message : "unknown error"}` },
      { status: 500 }
    )
  }
}
