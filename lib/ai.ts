import OpenAI from "openai"

export interface DetectedItem {
  name: string
  category: string
  estimatedValue: number // dollars
  confidence: number // 0-1
}

const client = new OpenAI()

const ITEM_SCHEMA = {
  type: "object" as const,
  properties: {
    items: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          name: { type: "string" as const },
          category: {
            type: "string" as const,
            enum: ["Electronics", "Furniture", "Appliances", "Clothing", "Jewelry", "Art", "Sports", "Tools", "Books", "Kitchen", "Other"],
          },
          estimatedValue: { type: "number" as const },
          confidence: { type: "number" as const },
        },
        required: ["name", "category", "estimatedValue", "confidence"],
        additionalProperties: false,
      },
    },
  },
  required: ["items"],
  additionalProperties: false,
}

export async function analyzeRoomPhoto(imageBuffer: Buffer, mediaType: string): Promise<DetectedItem[]> {
  const base64 = imageBuffer.toString("base64")
  const dataUrl = `data:${mediaType};base64,${base64}`

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "catalog_items",
        schema: ITEM_SCHEMA,
        strict: true,
      },
    },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: dataUrl, detail: "high" },
          },
          {
            type: "text",
            text: "Identify household items visible in this photo for home inventory purposes. Include electronics, furniture, appliances, and other valuable items. Estimate current USD replacement values.",
          },
        ],
      },
    ],
    max_tokens: 1024,
  })

  const text = response.choices[0]?.message?.content
  if (!text) return []

  const parsed = JSON.parse(text) as { items: DetectedItem[] }
  return parsed.items ?? []
}
