"use client"

import { Home, CreditCard, Syringe, Pill, AlertTriangle, Wallet, Building2, Phone, Mic } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard/worker" },
  { icon: CreditCard, label: "Health ID", href: "/health-id" },
  { icon: Syringe, label: "Vaccinations", href: "/vaccinations", badge: "4", badgeColor: "bg-green-500" },
  { icon: Pill, label: "Medicines", href: "/medicines", badge: "2", badgeColor: "bg-green-500" },
  { icon: AlertTriangle, label: "Disease Alerts", href: "/alerts", badge: "1", badgeColor: "bg-red-500" },
  { icon: Wallet, label: "Rewards", href: "/rewards", badge: "850", badgeColor: "text-gray-600" },
  { icon: Building2, label: "Gov Benefits", href: "/benefits" },
  { icon: Mic, label: "Voice Talk", href: "/voice-talk" },
  { icon: Phone, label: "Emergency", href: "/emergency", badge: "SOS", badgeColor: "bg-red-500" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar side="left" variant="sidebar" className="w-64 min-w-64 max-w-64">
      <SidebarContent className="p-4 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href} className="mb-1">
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    className={`
                      h-11 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                      flex items-center justify-between w-full
                      ${
                        pathname === item.href && item.href === "/"
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                          : pathname === item.href
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Link href={item.href} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium text-sm leading-none">{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          className={`
                            flex-shrink-0 ml-2
                            ${
                              item.badgeColor === "text-gray-600"
                                ? "bg-transparent text-gray-500 border-0 p-0 font-semibold text-xs"
                                : `${item.badgeColor} text-white border-0 px-2 py-0.5 text-xs font-medium rounded-full`
                            }
                          `}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3 border-t border-gray-100">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="font-medium text-gray-900 text-sm">Health Score</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div className="bg-gray-800 h-1.5 rounded-full" style={{ width: "85%" }}></div>
            </div>
            <p className="text-xs text-gray-600">85/100 - Excellent Health</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="font-medium text-gray-900 text-sm">Next Checkup</span>
            </div>
            <p className="text-xs text-gray-600">March 15, 2024</p>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  )
}
