import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: "📷",
    title: "AI Photo Detection",
    desc: "Upload a room photo. AI identifies every item, categorizes it, and estimates its replacement value — in seconds.",
  },
  {
    icon: "🏠",
    title: "Automatic Inventory",
    desc: "Your household catalog builds itself. Track items by room, category, and value without tedious manual entry.",
  },
  {
    icon: "🚨",
    title: "Evacuation Mode",
    desc: "One tap activates a prioritized grab-list. Know exactly what to take first when every second counts.",
  },
  {
    icon: "📄",
    title: "Insurance Documentation",
    desc: "Generate a complete inventory report with photos and values. Exactly what insurers need after a loss.",
  },
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "Your data stays on your device by default. Optional encrypted cloud backup keeps it safe and recoverable.",
  },
  {
    icon: "📱",
    title: "Mobile Ready",
    desc: "Full-featured on any device. Add items on the go, snap photos in each room, access your list anywhere.",
  },
]

const steps = [
  {
    step: "1",
    title: "Photograph your rooms",
    desc: "Walk through your home snapping photos. Our AI does the heavy lifting — it spots items, names them, and assigns values automatically.",
  },
  {
    step: "2",
    title: "Review & organize",
    desc: "Confirm detected items, add a few of your own, group them by room. Your inventory is built in minutes, not hours.",
  },
  {
    step: "3",
    title: "Stay protected",
    desc: "Generate insurance reports instantly. Activate evacuation mode during emergencies. Your entire household — documented.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-teal-600">EvacLog</span>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium">Log In</Link>
            <Link href="/signup">
              <Button className="bg-teal-600 hover:bg-teal-700 text-sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <Badge className="mb-6 bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50">
          AI-Powered Home Inventory
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight max-w-3xl mx-auto">
          Know exactly what you own — before disaster strikes
        </h1>
        <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          EvacLog auto-catalogs your household through AI photo analysis. Generate insurance claims in minutes, build your evacuation grab-list, and rest easy knowing every item is documented.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-base px-8 py-6">
              Start Your Free Inventory
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline" className="text-base px-8 py-6 border-slate-200">
              See How It Works
            </Button>
          </a>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 shadow-lg overflow-hidden">
          <div className="bg-white border-b border-slate-100 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-yellow-300" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
            <div className="flex-1 text-center text-xs text-slate-400">evaclog.app</div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400">Estimated Value</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">$53,310</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400">Total Items</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">247</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400">Protection Coverage</p>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-3xl font-bold text-slate-900">96%</p>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "96%" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Recently Added</span>
                <span className="text-xs text-teal-600">View all</span>
              </div>
              {[
                { name: "65\" LG OLED TV", room: "Living Room", value: "$1,800" },
                { name: "MacBook Pro 16\"", room: "Office", value: "$2,499" },
                { name: "KitchenAid Stand Mixer", room: "Kitchen", value: "$399" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.room}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-4 text-lg">From zero to fully documented in under 30 minutes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.step} className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-teal-600 text-white text-xl font-bold flex items-center justify-center mx-auto">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Everything you need</h2>
            <p className="text-slate-500 mt-4 text-lg">Built for homeowners who want peace of mind without the paperwork</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-6 space-y-3">
                  <div className="text-3xl">{f.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Detection section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 py-24 text-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/20">
              AI Powered
            </Badge>
            <h2 className="text-4xl font-bold">AI sees your stuff — so you don&apos;t have to list it</h2>
            <p className="text-teal-100 text-lg leading-relaxed">
              Point your camera at a room. Our AI identifies furniture, electronics, appliances, artwork, and more — then estimates current replacement values automatically.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 font-semibold">
                Try It Free
              </Button>
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-6 space-y-3">
            <p className="text-sm font-medium text-teal-200">Detected in Living Room photo:</p>
            {[
              { name: "Samsung 75\" QLED TV", value: "$1,200", conf: "98%" },
              { name: "3-seat leather sofa", value: "$2,100", conf: "95%" },
              { name: "Glass coffee table", value: "$450", conf: "91%" },
              { name: "Floor lamp", value: "$180", conf: "87%" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-teal-300">{item.conf} confidence</p>
                </div>
                <span className="text-sm font-bold text-teal-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Mode section */}
      <section id="privacy" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-red-50 border-b border-red-100 px-4 py-3 flex items-center gap-2">
              <span className="text-red-500">🚨</span>
              <span className="text-sm font-semibold text-red-700">Evacuation Mode Active</span>
              <span className="ml-auto text-xs text-red-400">3 of 10 secured</span>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { name: "Important documents", priority: "High", done: true },
                { name: "Laptop + charger", priority: "High", done: true },
                { name: "Family photos (USB)", priority: "High", done: true },
                { name: "Camera + lenses", priority: "Medium", done: false },
                { name: "Jewelry box", priority: "Medium", done: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${item.done ? "opacity-50" : ""}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${item.done ? "bg-green-500 border-green-500" : "border-slate-300"}`}>
                    {item.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm flex-1 ${item.done ? "line-through text-slate-400" : "font-medium text-slate-800"}`}>{item.name}</span>
                  <Badge variant={item.priority === "High" ? "destructive" : "secondary"} className="text-xs">{item.priority}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-slate-900">When seconds count, you need a plan</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Evacuation mode turns your inventory into a prioritized grab-list. High-value, irreplaceable items rise to the top. Tick items off as you go. Never wonder what to save first.
            </p>
            <div className="space-y-3 text-slate-600">
              {["Items sorted by priority you set ahead of time", "Visual progress as you secure each item", "Works offline — no signal needed in an emergency"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <span className="text-teal-500">✓</span>
                  <span className="text-sm">{t}</span>
                </div>
              ))}
            </div>
            <Link href="/signup">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Sign Up Now — It&apos;s Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <h2 className="text-4xl font-bold text-slate-900">Start protecting your home today</h2>
          <p className="text-slate-500 text-lg">Free to use. No credit card. Takes under 30 minutes to document your whole house.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-base px-10 py-6">
              Create Your Free Inventory
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <span className="font-bold text-teal-600">EvacLog</span>
          <span>© {new Date().getFullYear()} EvacLog. Built for peace of mind.</span>
          <div className="flex gap-6">
            <a href="#privacy" className="hover:text-slate-600">Privacy</a>
            <Link href="/login" className="hover:text-slate-600">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
