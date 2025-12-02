"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DynamicHeader } from "@/components/dynamic-header"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === "/" || pathname.startsWith("/dashboard/govt") || pathname.startsWith("/dashboard/doctor") || pathname.startsWith("/dashboard/worker")) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full">
        <DynamicHeader />
        <AppSidebar />
        <div className="flex flex-1 overflow-hidden w-full">
          <AppSidebar />
          <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
