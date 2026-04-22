import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import path from "path"
import fs from "fs/promises"

type Params = { params: Promise<{ filename: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getSession()
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  const { filename } = await params

  // Sanitize — prevent path traversal
  const safeName = path.basename(filename)
  if (safeName !== filename) return new NextResponse("Bad request", { status: 400 })

  const filepath = path.join(process.cwd(), "uploads", safeName)

  try {
    const data = await fs.readFile(filepath)
    const ext = safeName.split(".").pop()?.toLowerCase() ?? ""
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
      gif: "image/gif", webp: "image/webp",
    }
    return new NextResponse(data, {
      headers: { "Content-Type": mimeMap[ext] ?? "application/octet-stream" },
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
