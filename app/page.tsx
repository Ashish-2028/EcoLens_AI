"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/ecolens/sidebar"
import { DashboardView } from "@/components/ecolens/dashboard-view"
import { HistoryPanel } from "@/components/ecolens/history-panel"
import { ImpactPanel } from "@/components/ecolens/impact-panel"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export default function EcoLensPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const pageTitle = {
    dashboard: "Dashboard",
    history: "Scan History",
    impact: "Environmental Impact",
  }[activeTab]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <div className="hidden lg:block">
        <AppSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Sidebar - mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AppSidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
            setMobileOpen(false)
          }}
          collapsed={false}
          onToggleCollapse={() => setMobileOpen(false)}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-20 glass px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
            <p className="text-xs text-muted-foreground">
              {activeTab === "dashboard" && "Scan and analyze product sustainability"}
              {activeTab === "history" && "Review your previous scans and trends"}
              {activeTab === "impact" && "Track your environmental contributions"}
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "history" && <HistoryPanel />}
          {activeTab === "impact" && <ImpactPanel />}
        </div>
      </main>
    </div>
  )
}
