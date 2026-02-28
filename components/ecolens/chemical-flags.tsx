"use client"

import { AlertTriangle, Info, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

export interface ChemicalFlag {
  name: string
  severity: "high" | "medium" | "low"
  description: string
  category: string
}

interface ChemicalFlagsProps {
  flags: ChemicalFlag[]
  className?: string
}

const severityConfig = {
  high: {
    icon: ShieldAlert,
    bgClass: "bg-destructive/10",
    textClass: "text-destructive",
    borderClass: "border-destructive/20",
    badge: "destructive" as const,
    label: "High Risk",
  },
  medium: {
    icon: AlertTriangle,
    bgClass: "bg-warning/10",
    textClass: "text-warning",
    borderClass: "border-warning/20",
    badge: "secondary" as const,
    label: "Moderate",
  },
  low: {
    icon: Info,
    bgClass: "bg-muted",
    textClass: "text-muted-foreground",
    borderClass: "border-border",
    badge: "outline" as const,
    label: "Low Risk",
  },
}

export function ChemicalFlags({ flags, className }: ChemicalFlagsProps) {
  return (
    <div className={cn("glass-card rounded-2xl p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-destructive" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-foreground">
            Chemical Red Flags
          </h2>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono border-border/60 text-muted-foreground">
          {flags.length} found
        </Badge>
      </div>

      {flags.length > 0 ? (
        <div className="flex flex-col gap-2">
          {flags.map((flag, i) => {
            const config = severityConfig[flag.severity]
          const Icon = config.icon
          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 border transition-all duration-200 hover:scale-[1.01] cursor-default",
                    config.bgClass,
                    config.borderClass
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center size-8 rounded-lg shrink-0",
                      config.bgClass
                    )}
                  >
                    <Icon className={cn("size-4", config.textClass)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {flag.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{flag.category}</p>
                  </div>
                  <Badge
                    variant={config.badge}
                    className={cn(
                      "text-[10px] shrink-0",
                      flag.severity === "medium" && "bg-warning/15 text-warning border-warning/20"
                    )}
                  >
                    {config.label}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p>{flag.description}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-8 opacity-60 bg-secondary/10 rounded-xl border border-dashed border-border/50">
          <ShieldAlert className="size-8 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">No alerts</p>
          <p className="text-xs text-muted-foreground mt-1">Scan a product to check for chemical hazards.</p>
        </div>
      )}
    </div>
  )
}
