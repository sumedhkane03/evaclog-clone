import { db } from "./db"

const DEFAULT_ROOMS = [
  "Living Room",
  "Kitchen",
  "Master Bedroom",
  "Bedroom",
  "Office",
  "Bathroom",
  "Garage",
  "Basement",
]

export async function seedDefaultRooms(userId: string) {
  const existing = await db.room.count({ where: { userId } })
  if (existing > 0) return

  await db.room.createMany({
    data: DEFAULT_ROOMS.map((name) => ({ userId, name })),
  })
}
