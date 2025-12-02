"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Bell,
  ChevronDown,
  Building2,
  Heart,
  Syringe,
  Pill,
  AlertTriangle,
  Medal,
  Mic,
  Cross,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProfileSidebar } from "@/components/profile-sidebar"

const featureConfig = {
  "/": {
    icon: BarChart3,
    title: "Dashboard",
    subtitle: "Government of India",
  },
  "/dashboard/worker": {
    icon: BarChart3,
    title: "Worker Health Dashboard",
    subtitle: "Government of India",
  },
  "/health-id": {
    icon: Heart,
    title: "Health ID",
    subtitle: "Government of India",
  },
  "/vaccinations": {
    icon: Syringe,
    title: "Vaccinations",
    subtitle: "Government of India",
  },
  "/medicines": {
    icon: Pill,
    title: "Medicines",
    subtitle: "Government of India",
  },
  "/alerts": {
    icon: AlertTriangle,
    title: "Disease Alerts",
    subtitle: "Government of India",
  },
  "/rewards": {
    icon: Medal,
    title: "Rewards",
    subtitle: "Government of India",
  },
  "/benefits": {
    icon: Building2,
    title: "Gov Benefits",
    subtitle: "Government of India",
  },
  "/voice-talk": {
    icon: Mic,
    title: "Voice Talk",
    subtitle: "Government of India",
  },
  "/emergency": {
    icon: Cross,
    title: "Emergency",
    subtitle: "Government of India",
  },
}

interface DynamicHeaderProps {
  children?: React.ReactNode
  leftChildren?: React.ReactNode
}

export function DynamicHeader({ children, leftChildren }: DynamicHeaderProps) {
  const pathname = usePathname()
  const rawPath = pathname ?? "/"
  // normalize: remove trailing slash except for root "/"
  const currentPath = rawPath !== "/" && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath
  // prefer the longest matching route key (most specific); normalize keys as well
  const sortedKeys = Object.keys(featureConfig).sort((a, b) => b.length - a.length)
  const matchedKey = sortedKeys.find((key) => {
    const k = key !== "/" && key.endsWith("/") ? key.slice(0, -1) : key
    return k === "/" ? currentPath === "/" : currentPath === k || currentPath.startsWith(k + "/")
  })
  const config = (matchedKey && featureConfig[matchedKey as keyof typeof featureConfig]) || featureConfig["/"]
  const IconComponent = config.icon
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <>
      <header className="bg-blue-900 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        {/* Left Side - Left Children and Feature Info */}
        <div className="flex items-center gap-3">
          {leftChildren}
          <div className="bg-white/10 p-2 rounded-lg">
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{config.title}</h1>
            <p className="text-blue-200 text-sm">{config.subtitle}</p>
          </div>
        </div>

        {/* Right Side - Controls */}
        <div className="flex items-center gap-4">
          {children}

          {/* Citizen Info - Now clickable */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
            onClick={() => setIsProfileOpen(true)}
          >
            <div className="text-right">
              <p className="text-white font-medium text-sm">Priya Sharma</p>
              <p className="text-blue-200 text-xs">Citizen ID: 123456789</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
              <img src="/professional-woman-doctor.png" alt="Priya Sharma" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Sidebar */}
      <ProfileSidebar isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}
