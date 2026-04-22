import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/db"
import { AppShell } from "@/components/AppShell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await requireAuth()
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } })

  return <AppShell email={user?.email ?? ""}>{children}</AppShell>
}
