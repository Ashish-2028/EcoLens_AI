"use client"

import { Clock, Leaf, TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { useEffect, useState } from "react"
import { getHistory, type ScanResult } from "@/lib/ecolens-store"

function getScoreColor(score: number) {
  if (score >= 75) return "text-primary"
  if (score >= 50) return "text-warning"
  return "text-destructive"
}

export function HistoryPanel() {
  const [history, setHistory] = useState<ScanResult[]>([])

  const loadHistory = () => {
    setHistory(getHistory())
  }

  useEffect(() => {
    loadHistory()
    window.addEventListener("ecolens_history_updated", loadHistory)
    return () => window.removeEventListener("ecolens_history_updated", loadHistory)
  }, [])

  const averageScore = history.length > 0
    ? (history.reduce((acc, curr) => acc + curr.ecoScore, 0) / history.length).toFixed(1)
    : 0

  const ecoFriendlyCount = history.filter(h => h.ecoScore >= 75).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Clock className="size-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Scan History</h2>
      </div>

      <div className="grid gap-3">
        {history.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            No scans yet. Try scanning a product!
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="glass-card flex items-center gap-4 rounded-xl px-5 py-4 transition-all duration-200 hover:border-primary/20 cursor-default"
            >
              {/* Score */}
              <div className="flex items-center justify-center size-12 rounded-xl bg-secondary/50 shrink-0">
                <span className={cn("text-lg font-bold font-mono", getScoreColor(item.ecoScore))}>
                  {item.ecoScore}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
                <p className="text-xs text-muted-foreground">Scanned Product</p>
              </div>

              {/* Date */}
              <span className="text-[11px] text-muted-foreground shrink-0 hidden sm:block">
                {item.date}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Leaf className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Quick Stats</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-primary">{history.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Products Scanned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-foreground">{averageScore}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Average Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-primary">{ecoFriendlyCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Eco-Friendly</p>
          </div>
        </div>
      </div>
    </div>
  )
}
