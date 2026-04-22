"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    setLoading(false)
    if (res.ok) {
      router.push("/app")
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? "Signup failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 text-3xl font-bold text-teal-600">EvacLog</div>
          <CardTitle className="text-2xl">Create your inventory</CardTitle>
          <CardDescription>Free account — no credit card needed</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
              {loading ? "Creating account…" : "Start Your Free Inventory"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
