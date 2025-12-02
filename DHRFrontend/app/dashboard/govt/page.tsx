"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Users,
  Heart,
  Flag,
  Activity,
  Download,
  Settings,
  Bell,
  LogOut,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  MapPin,
  User,
  Menu,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function GovernmentDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            KHM
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Kerala Health</h1>
            <h2 className="text-lg font-semibold text-gray-900">Monitor</h2>
            <p className="text-sm text-gray-600">Migrant Health Dashboard</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search dashboard..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute right-2 top-2 text-xs text-gray-400">⌘ K</div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2 flex-1">
          <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="font-medium text-sm">Population Overview</span>
            <Badge className="bg-green-600 text-white ml-auto">Active</Badge>
          </div>

          <div
            className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/dashboard/govt/disease-surveillance")}
          >
            <Activity className="h-4 w-4" />
            <span className="text-sm">Disease Surveillance</span>
            <Badge className="bg-red-500 text-white ml-auto text-xs">12</Badge>
            <span className="text-xs text-red-600 ml-1">Alerts</span>
          </div>

          <div
            className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/dashboard/govt/high-risk-camps")}
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">High-Risk Camps</span>
            <Badge className="bg-yellow-500 text-white ml-auto text-xs">8</Badge>
            <span className="text-xs text-yellow-600 ml-1">Flagged</span>
          </div>

          <div
            className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            onClick={() => {
              try {
                router.push("/dashboard/govt/health-records")
              } catch (error) {
                console.error("Navigation error:", error)
              }
            }}
          >
            <User className="h-4 w-4" />
            <span className="text-sm">Health Records</span>
          </div>

          <div
            className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/dashboard/govt/resource-planning")}
          >
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Resource Planning</span>
          </div>

          <div
            className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer relative"
            onClick={() => router.push("/dashboard/govt/emergency-response")}
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Emergency Response</span>
            <Badge className="bg-red-600 text-white ml-auto text-xs">LIVE</Badge>
          </div>

          <div className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Advanced Analytics</span>
          </div>

          <div className="text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
            <Users className="h-4 w-4" />
            <span className="text-sm">Incentives & Policy</span>
          </div>
        </div>

        {/* Bottom Profile */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Dr. Rajesh Kumar</p>
              <p className="text-xs text-gray-600">Health Officer</p>
            </div>
            <Settings className="h-4 w-4 text-gray-400 ml-auto cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white">
          <Menu className="h-5 w-5 text-gray-600 cursor-pointer" />
          <div className="flex items-center gap-3 flex-1">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Migrant Population Overview</h1>
              <p className="text-sm text-gray-600">Real-time health monitoring across Kerala migrant camps</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">System Online</span>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-1" />
              Export Report
            </Button>
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </div>
            <Settings className="h-5 w-5 text-gray-600 cursor-pointer" />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Registered Migrants</p>
                    <p className="text-3xl font-bold text-gray-900">2,47,892</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">+2.4% from last month</span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Healthy Camps</p>
                    <p className="text-3xl font-bold text-gray-900">156</p>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">87% of total camps</span>
                    </div>
                  </div>
                  <Heart className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Risk Flagged Camps</p>
                    <p className="text-3xl font-bold text-gray-900">23</p>
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs text-yellow-600">Requires attention</span>
                    </div>
                  </div>
                  <Flag className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Disease Cases</p>
                    <p className="text-3xl font-bold text-gray-900">1,247</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Activity className="h-3 w-3 text-red-600" />
                      <span className="text-xs text-red-600">Under treatment</span>
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kerala Health Status Map */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Kerala Health Status Map
                  <div className="flex items-center gap-4 ml-auto text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Healthy</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Rising Cases</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Outbreak</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img
                    src="/images/kerala-map.png"
                    alt="Kerala Health Status Map"
                    className="w-full h-96 object-contain"
                  />
                  {/* Map Legend */}
                  <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
                        <span>Infectious Disease Cluster</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                        <span>Small Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                        <span>Conditions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                        <span>Thriving</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                        <span>Excellent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                        <span>Healthy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        <span>Health Camp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filter and Quick Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filter by District</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      <SelectItem value="thiruvananthapuram">Thiruvananthapuram</SelectItem>
                      <SelectItem value="kochi">Kochi</SelectItem>
                      <SelectItem value="kozhikode">Kozhikode</SelectItem>
                      <SelectItem value="thrissur">Thrissur</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Origin State - All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="odisha">Odisha</SelectItem>
                      <SelectItem value="west-bengal">West Bengal</SelectItem>
                      <SelectItem value="bihar">Bihar</SelectItem>
                      <SelectItem value="jharkhand">Jharkhand</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="dd-mm-yyyy" />
                    <Input type="date" placeholder="dd-mm-yyyy" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Registrations Today</span>
                    <span className="font-semibold text-green-600">+127</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Health Checkups Today</span>
                    <span className="font-semibold text-blue-600">342</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Vaccination Coverage</span>
                    <span className="font-semibold text-purple-600">78.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Emergency Cases</span>
                    <span className="font-semibold text-red-600">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Medicine Distribution</span>
                    <span className="font-semibold text-orange-600">89.2%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs sm:text-sm text-gray-600">{label}</span>
      <span className={`font-semibold text-${color}-600 text-sm`}>{value}</span>
    </div>
  )
}
