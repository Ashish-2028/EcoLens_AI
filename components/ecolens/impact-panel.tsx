"use client"

import { Leaf, Droplets, Wind, Recycle, TreePine, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { getHistory, type ScanResult } from "@/lib/ecolens-store"

interface MetricCardProps {
  icon: React.ElementType
  label: string
  value: string
  unit: string
  trend: string
  positive: boolean
}

function MetricCard({ icon: Icon, label, value, unit, trend, positive }: MetricCardProps) {
  return (
    <div className="glass-card rounded-xl p-5 transition-all duration-300 hover:border-primary/20 hover:emerald-glow">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-2xl font-bold font-mono text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      <span
        className={cn(
          "text-xs font-medium",
          positive ? "text-primary" : "text-destructive"
        )}
      >
        {trend}
      </span>
    </div>
  )
}

const impactMetrics: MetricCardProps[] = [
  {
    icon: TreePine,
    label: "Carbon Saved",
    value: "12.4",
    unit: "kg CO2",
    trend: "+18% from last month",
    positive: true,
  },
  {
    icon: Droplets,
    label: "Water Saved",
    value: "340",
    unit: "liters",
    trend: "+22% from last month",
    positive: true,
  },
  {
    icon: Wind,
    label: "Air Quality",
    value: "94",
    unit: "AQI score",
    trend: "Excellent air impact",
    positive: true,
  },
  {
    icon: Recycle,
    label: "Waste Diverted",
    value: "5.2",
    unit: "kg",
    trend: "+8% from last month",
    positive: true,
  },
  {
    icon: Leaf,
    label: "Green Choices",
    value: "73",
    unit: "% of scans",
    trend: "+12% improvement",
    positive: true,
  },
  {
    icon: Globe,
    label: "Eco Score",
    value: "A+",
    unit: "rating",
    trend: "Top 5% of users",
    positive: true,
  },
]

export function ImpactPanel() {
  const [history, setHistory] = useState<ScanResult[]>([])

  const loadHistory = () => {
    setHistory(getHistory())
  }

  useEffect(() => {
    loadHistory()
    window.addEventListener("ecolens_history_updated", loadHistory)
    return () => window.removeEventListener("ecolens_history_updated", loadHistory)
  }, [])

  // Calculate dynamic metrics based on history
  const goodScans = history.filter(h => h.ecoScore >= 50).length

  // Fake multipliers for mock impact, but based on actual scan history length
  const carbonSaved = (goodScans * 2.5).toFixed(1)
  const waterSaved = (goodScans * 45).toString()
  const wasteDiverted = (goodScans * 0.8).toFixed(1)

  const greenChoicesPercent = history.length > 0
    ? Math.round((goodScans / history.length) * 100)
    : 0

  const totalScore = history.reduce((acc, curr) => acc + curr.ecoScore, 0)
  const avgScore = history.length > 0 ? totalScore / history.length : 0
  let ecoGrade = "N/A"
  if (history.length > 0) {
    if (avgScore >= 90) ecoGrade = "A+"
    else if (avgScore >= 80) ecoGrade = "A"
    else if (avgScore >= 70) ecoGrade = "B"
    else if (avgScore >= 60) ecoGrade = "C"
    else if (avgScore >= 50) ecoGrade = "D"
    else ecoGrade = "F"
  }

  const dynamicMetrics: MetricCardProps[] = [
    {
      icon: TreePine,
      label: "Carbon Saved",
      value: carbonSaved,
      unit: "kg CO2",
      trend: "Based on scans",
      positive: true,
    },
    {
      icon: Droplets,
      label: "Water Saved",
      value: waterSaved,
      unit: "liters",
      trend: "Based on scans",
      positive: true,
    },
    {
      icon: Wind,
      label: "Air Quality",
      value: "94", // Assuming static or generic
      unit: "AQI score",
      trend: "Excellent air impact",
      positive: true,
    },
    {
      icon: Recycle,
      label: "Waste Diverted",
      value: wasteDiverted,
      unit: "kg",
      trend: "Based on scans",
      positive: true,
    },
    {
      icon: Leaf,
      label: "Green Choices",
      value: Math.round(greenChoicesPercent).toString(),
      unit: "% of scans",
      trend: "Improvement",
      positive: greenChoicesPercent > 50,
    },
    {
      icon: Globe,
      label: "Eco Score",
      value: ecoGrade,
      unit: "rating",
      trend: "Average grade",
      positive: avgScore >= 70,
    },
  ]

  // Mock how many "flights worth" of carbon based on scans
  const flightsSaved = Math.max(1, Math.floor(parseInt(carbonSaved) / 10))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Leaf className="size-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Environmental Impact</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {dynamicMetrics.map((metric, i) => (
          <MetricCard key={i} {...metric} />
        ))}
      </div>

      {/* Impact summary */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Your Monthly Impact</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          By making greener product choices this month, you have helped offset the equivalent of
          <span className="text-primary font-semibold"> {flightsSaved} round-trip flights </span>
          worth of carbon emissions. Keep scanning products to grow your positive environmental impact.
        </p>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
          <div className="flex-1">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${greenChoicesPercent}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-primary">{Math.round(greenChoicesPercent)}%</span>
          <span className="text-[11px] text-muted-foreground">green choices</span>
        </div>
      </div>
    </div>
  )
}
