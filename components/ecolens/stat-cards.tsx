"use client"

import { Leaf, ScanLine, ShieldAlert, Recycle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { getHistory, type ScanResult } from "@/lib/ecolens-store"

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  subtext: string
  accentColor?: "emerald" | "amber" | "red" | "blue"
}

const accentMap = {
  emerald: {
    bg: "bg-primary/10",
    text: "text-primary",
    glow: "hover:emerald-glow",
  },
  amber: {
    bg: "bg-warning/10",
    text: "text-warning",
    glow: "",
  },
  red: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    glow: "",
  },
  blue: {
    bg: "bg-chart-3/15",
    text: "text-chart-2",
    glow: "",
  },
}

function StatCard({ icon: Icon, label, value, subtext, accentColor = "emerald" }: StatCardProps) {
  const accent = accentMap[accentColor]
  return (
    <div
      className={cn(
        "glass-card rounded-xl p-5 transition-all duration-300 hover:border-primary/20",
        accent.glow
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("flex items-center justify-center size-10 rounded-xl", accent.bg)}>
          <Icon className={cn("size-5", accent.text)} />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold font-mono text-foreground">{value}</p>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">{subtext}</p>
    </div>
  )
}

export function StatCards() {
  const [history, setHistory] = useState<ScanResult[]>([])

  const loadHistory = () => {
    setHistory(getHistory())
  }

  useEffect(() => {
    loadHistory()
    window.addEventListener("ecolens_history_updated", loadHistory)
    return () => window.removeEventListener("ecolens_history_updated", loadHistory)
  }, [])

  const scansCount = history.length;
  // Calculate average score safely
  const avgScore = scansCount > 0
    ? Math.round(history.reduce((a, b) => a + (b.ecoScore || 0), 0) / scansCount)
    : 0;
  // Calculate total red flags safely
  const redFlagsCount = history.reduce((a, b) => a + (b.redFlags ? b.redFlags.length : 0), 0);
  // Calculate total green swaps safely
  const swapsMade = history.reduce((a, b) => a + (b.greenSwaps ? b.greenSwaps.length : 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        icon={ScanLine}
        label="Scans"
        value={scansCount.toString()}
        subtext={scansCount === 1 ? "1 total scan" : `${scansCount} total scans`}
        accentColor="emerald"
      />
      <StatCard
        icon={Leaf}
        label="Avg. Score"
        value={avgScore.toString()}
        subtext="Across all scans"
        accentColor="emerald"
      />
      <StatCard
        icon={ShieldAlert}
        label="Red Flags"
        value={redFlagsCount.toString()}
        subtext="Found in past scans"
        accentColor="red"
      />
      <StatCard
        icon={Recycle}
        label="Swaps Found"
        value={swapsMade.toString()}
        subtext="Greener alternatives"
        accentColor="blue"
      />
    </div>
  )
}
