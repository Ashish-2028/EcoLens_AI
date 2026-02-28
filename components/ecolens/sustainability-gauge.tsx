"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SustainabilityGaugeProps {
  score: number
  label?: string
  className?: string
}

function getScoreColor(score: number) {
  if (score >= 75) return { stroke: "oklch(0.72 0.19 160)", label: "Excellent" }
  if (score >= 50) return { stroke: "oklch(0.80 0.18 80)", label: "Moderate" }
  if (score >= 25) return { stroke: "oklch(0.70 0.18 50)", label: "Poor" }
  return { stroke: "oklch(0.58 0.22 28)", label: "Critical" }
}

export function SustainabilityGauge({ score, label, className }: SustainabilityGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const { stroke, label: scoreLabel } = getScoreColor(score)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative size-40">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="oklch(0.22 0.008 260)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${stroke})`,
            }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold tracking-tight text-foreground font-mono">
            {animatedScore}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            / 100
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: stroke }}
        >
          {scoreLabel}
        </span>
        {label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  )
}
