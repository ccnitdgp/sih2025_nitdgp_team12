"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DynamicHeader } from "@/components/dynamic-header"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Stethoscope,
  Calendar,
  Download,
  Share,
  CheckCircle,
  User,
  Heart,
  MapPin,
  Pill,
  Syringe,
  AlertTriangle,
  FileText,
  Bell,
  Building2,
  Phone,
  Gift,
  Video,
  LogOut,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function WorkerDashboard() {
  const router = useRouter()
  const isMobile = useIsMobile()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <DynamicHeader leftChildren={isMobile ? <SidebarTrigger className="-ml-1" /> : null}>
          <Button variant="outline" size="sm" onClick={handleLogout} className="bg-transparent">
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </DynamicHeader>

        <div className="p-4 space-y-8">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Profile Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-600" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">Rajesh Kumar Singh</h1>
                  <div className="flex flex-wrap gap-4 text-sm opacity-90">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Age: 32
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Male
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      B+
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Mumbai, Maharashtra
                    </span>
                  </div>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="flex-1 flex justify-center">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verified by Government of India
                </Badge>
              </div>

              {/* Health ID Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-90">Health ID</span>
                  <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                    <div className="w-6 h-6 bg-white/40 rounded-sm"></div>
                  </div>
                </div>
                <div className="text-lg font-mono mb-3">91-2847-5639-1234</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Share className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Overview Cards */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Health Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-pink-400 to-pink-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Stethoscope className="h-8 w-8" />
                  <FileText className="h-6 w-6 opacity-70" />
                </div>
                <h3 className="font-semibold mb-2">Last Check-up</h3>
                <p className="text-sm opacity-90 mb-1">15 Dec 2024</p>
                <p className="text-xs opacity-80">Dr. Priya Sharma</p>
                <p className="text-xs opacity-80">General Health Check</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Pill className="h-8 w-8" />
                  <FileText className="h-6 w-6 opacity-70" />
                </div>
                <h3 className="font-semibold mb-2">Current Medicine</h3>
                <p className="text-sm opacity-90 mb-1">Paracetamol 500mg</p>
                <p className="text-xs opacity-80">2 times daily</p>
                <p className="text-xs opacity-80">After meals - 7 days</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-400 to-emerald-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Syringe className="h-8 w-8" />
                  <CheckCircle className="h-6 w-6 opacity-70" />
                </div>
                <h3 className="font-semibold mb-2">Vaccination</h3>
                <p className="text-sm opacity-90 mb-1">✓ COVID-19 Booster</p>
                <p className="text-xs opacity-80">Completed: 20 Nov 2024</p>
                <p className="text-xs opacity-80">Next due: Flu Shot</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-400 to-red-500 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <AlertTriangle className="h-8 w-8" />
                  <Bell className="h-6 w-6 opacity-70" />
                </div>
                <h3 className="font-semibold mb-2">Health Alerts</h3>
                <p className="text-sm opacity-90 mb-1">1 Hypertension</p>
                <p className="text-xs opacity-80">Monitor BP daily</p>
                <p className="text-xs opacity-80">Next check: 25 Dec</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Government Announcements */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Government Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="h-4 w-4 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Free Health Camp</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Complete health check-up at Bandra Community Center</p>
                <p className="text-xs text-gray-500 mb-3">25 Dec 2024 • 9:00 AM - 5:00 PM</p>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full">
                  Register Now
                </Button>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Telemedicine Service</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">24/7 doctor consultation now available</p>
                <p className="text-xs text-gray-500 mb-3">Call 104 for immediate assistance</p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full">
                  Learn More
                </Button>
              </div>

              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Gift className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Reward Program</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">Earn points for health compliance</p>
                <p className="text-xs text-gray-500 mb-3">Redeem for medicines & services</p>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 w-full">
                  View Rewards
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-sm">Book Appointment</h3>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-green-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-sm">Download Reports</h3>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-purple-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-sm">Video Consult</h3>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-yellow-50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Pill className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-medium text-sm">Medicine Reminder</h3>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-red-50 border-red-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-medium text-sm">Health Monitor</h3>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-indigo-50 border-indigo-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Share className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-medium text-sm">Share Health ID</h3>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
