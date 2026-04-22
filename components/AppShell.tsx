"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/app", icon: "🏠" },
  { label: "Items", href: "/app/items", icon: "📦" },
  { label: "Rooms", href: "/app/rooms", icon: "🏷️" },
  { label: "Evacuation", href: "/app/evacuation", icon: "🚨" },
]

export function AppShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-100">
          <span className="text-xl font-bold text-teal-600">EvacLog</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-100 space-y-1">
          <p className="text-xs text-slate-400 truncate px-2">{email}</p>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}
