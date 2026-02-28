"use client"

import { ArrowRight, Leaf, Star, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface GreenSwap {
  name: string
  brand: string
  score: number
  improvement: number
  tags: string[]
  price?: string
}

interface GreenSwapsProps {
  swaps: GreenSwap[]
  className?: string
}

export function GreenSwaps({ swaps, className }: GreenSwapsProps) {
  return (
    <div className={cn("glass-card rounded-2xl p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Leaf className="size-5 text-primary" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Green Swaps
          </h2>
        </div>
        <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
          Eco Alternatives
        </Badge>
      </div>

      {swaps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {swaps.map((swap, i) => (
          <div
            key={i}
            className={cn(
              "group relative flex flex-col rounded-xl border border-border/40 bg-secondary/30 p-4 transition-all duration-300",
              "hover:border-primary/30 hover:bg-primary/5 hover:emerald-glow hover:scale-[1.02]"
            )}
          >
            {/* Score badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">{swap.brand}</span>
              <div className="flex items-center gap-1 text-xs font-mono">
                <Star className="size-3 text-primary fill-primary" />
                <span className="text-primary font-semibold">{swap.score}</span>
              </div>
            </div>

            {/* Name */}
            <h3 className="text-sm font-semibold text-foreground mb-2 text-pretty leading-snug">
              {swap.name}
            </h3>

            {/* Improvement */}
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingUp className="size-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">
                +{swap.improvement}% greener
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {swap.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
              {swap.price && (
                <span className="text-sm font-semibold text-foreground">{swap.price}</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary hover:text-primary hover:bg-primary/10 ml-auto"
              >
                View
                <ArrowRight className="size-3 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-10 opacity-60 bg-secondary/10 rounded-xl border border-dashed border-border/50 min-h-[200px]">
          <Leaf className="size-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">No alternatives</p>
          <p className="text-xs text-muted-foreground mt-1">Scan a product to discover eco-friendly swaps.</p>
        </div>
      )}
    </div>
  )
}
