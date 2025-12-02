"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Users, CheckCircle, Filter, MoreVertical, MessageCircle, X, Download, TrendingUp, RefreshCcw, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton" // Assuming you have this, if not I use a fallback div
import KeralaHeatmap from "./components/KeralaHeatmap";

// --- 1. DATA INTERFACES (The contract for your Backend) ---
interface DashboardStats {
  totalWorkers: number
  workersTrend: number
  statesCount: number
  highRiskCount: number
  activeRegistrations: number
}

interface OriginStateData {
  state: string
  count: number
  percentage: number
}

// --- 2. MAIN COMPONENT ---
export default function SehatSetuDashboard() {
  const [isBotOpen, setIsBotOpen] = useState(false)
  
  // State for Data
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [stateDistribution, setStateDistribution] = useState<OriginStateData[]>([])
  
  // State for Filters
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts")
  const [selectedOrigin, setSelectedOrigin] = useState("All Origin States")

  // --- 3. DATA FETCHING SIMULATION (Replace this with real API call later) ---
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // SIMULATING NETWORK REQUEST (Remove setTimeout when connecting to backend)
      await new Promise(resolve => setTimeout(resolve, 1500))

      // MOCK RESPONSE
      setStats({
        totalWorkers: 48247,
        workersTrend: 12.5,
        statesCount: 14,
        highRiskCount: 1847,
        activeRegistrations: 342
      })

      setStateDistribution([
        { state: "West Bengal", count: 15000, percentage: 100 },
        { state: "Assam", count: 12000, percentage: 80 },
        { state: "Odisha", count: 10500, percentage: 70 },
        { state: "Bihar", count: 9000, percentage: 60 },
      ])

    } catch (error) {
      console.error("Failed to fetch dashboard data", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchData()
  }, [selectedDistrict, selectedOrigin])

  // Helper for Skeleton Loading
  const LoadingCard = () => (
    <Card className="border-l-4 border-gray-200">
      <CardContent className="p-5">
        <div className="flex justify-between">
          <div className="space-y-3 w-full">
            <Skeleton className="h-4 w-24 bg-gray-200" />
            <Skeleton className="h-8 w-32 bg-gray-200" />
            <Skeleton className="h-4 w-20 bg-gray-200" />
          </div>
          <Skeleton className="h-12 w-12 rounded-xl bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. CONTENT TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border shadow-sm sticky top-0 z-10">
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-md">
            <Filter className="h-4 w-4 text-blue-600" />
            Active Filters:
          </div>
          
          <select 
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 w-[150px] bg-white h-9 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option>All Districts</option>
            <option>Ernakulam</option>
            <option>Thiruvananthapuram</option>
            <option>Kozhikode</option>
          </select>

          <select 
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 w-[150px] bg-white h-9 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option>All Origin States</option>
            <option>West Bengal</option>
            <option>Assam</option>
            <option>Odisha</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" className="h-9" onClick={fetchData} disabled={isLoading}>
              <RefreshCcw className={`h-3.5 w-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-9 shadow-md transition-transform active:scale-95">
              <Download className="h-3.5 w-3.5 mr-2" />
              Export
            </Button>
        </div>
      </div>

      {/* 2. KEY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : (
          <>
            {/* Card 1: Total Workers */}
            <Card className="border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Migrant Workers</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
                        {/* Adding Indian Locale formatting */}
                        {stats?.totalWorkers.toLocaleString('en-IN')}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Registered in Kerala</p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                      <TrendingUp className="h-3 w-3" />
                      +{stats?.workersTrend}% this week
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: States Count */}
            <Card className="border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Workers by State</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{stats?.statesCount}</h3>
                    <p className="text-sm text-gray-600 mt-1">Origin states tracked</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded font-medium">Diverse Demographics</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: High Risk */}
            <Card className="border-l-4 border-red-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">High-Risk Workers</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-2 text-red-600">
                        {stats?.highRiskCount.toLocaleString('en-IN')}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Require immediate attention</p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full w-fit">
                      <AlertTriangle className="h-3 w-3" />
                      Critical Alert
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50 text-red-600">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Active Registrations */}
            <Card className="border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Registrations</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-2">{stats?.activeRegistrations}</h3>
                    <p className="text-sm text-gray-600 mt-1">Updated recently</p>
                    <div className="flex items-center gap-1 mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                      <CheckCircle className="h-3 w-3" />
                      Live Tracking
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-green-50 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* 3. MAP SECTION (KEPT EXACTLY AS REQUESTED) */}
      <Card className="shadow-md border-0">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
              <h3 className="text-xl font-bold text-gray-900">Kerala State Health & Worker Distribution Map</h3>
              <p className="text-sm text-gray-500">Real-time worker density and health status by district</p>
              </div>
              <div className="flex gap-2">
              <input type="date" className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700" />
              </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* 🚀 NEW INTEGRATION POINT */}
          <div className="h-96">
              <KeralaHeatmap />
          </div>
          {/* ... rest of the legend and divs ... */}
          <div className="mt-6 flex gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Rising Cases</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">High-Risk</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Worker Population</span>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. DYNAMIC CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Workers by Origin State */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">Workers by Origin State</h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {isLoading ? (
                 // Simple loading skeleton for the list
                 [1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between"><Skeleton className="h-4 w-20 bg-gray-100"/><Skeleton className="h-4 w-10 bg-gray-100"/></div>
                        <Skeleton className="h-2 w-full bg-gray-100" />
                    </div>
                 ))
              ) : (
                stateDistribution.map((item, index) => (
                  <div key={item.state} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{item.state}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {item.count >= 1000 ? `${(item.count / 1000).toFixed(1)}k` : item.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            index % 2 === 0 ? 'bg-blue-600' : 'bg-blue-400'
                        }`} 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Occupation Distribution (Static SVG preserved as requested but containerized) */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">Occupation Distribution</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-6">
              <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-md hover:scale-105 transition-transform duration-300">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#2563eb" strokeWidth="40" strokeDasharray="211 503" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f97316" strokeWidth="40" strokeDasharray="115 503" strokeDashoffset="-211" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#a855f7" strokeWidth="40" strokeDasharray="86 503" strokeDashoffset="-326" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" strokeWidth="40" strokeDasharray="91 503" strokeDashoffset="-412" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="50" fill="white" />
              </svg>
            </div>
            <div className="space-y-3">
              {[
                  { label: "Construction", val: "42%", color: "bg-blue-600" },
                  { label: "Manufacturing", val: "23%", color: "bg-orange-500" },
                  { label: "Services", val: "17%", color: "bg-purple-500" },
                  { label: "Hospitality", val: "18%", color: "bg-green-500" }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                    <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900 ml-auto">{item.val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend (Static SVG preserved) */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">Monthly Registration Trend</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <svg viewBox="0 0 400 180" className="w-full h-40">
              <line x1="40" y1="30" x2="380" y2="30" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="40" y1="60" x2="380" y2="60" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="40" y1="90" x2="380" y2="90" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="40" y1="120" x2="380" y2="120" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="40" y1="150" x2="380" y2="150" stroke="#e5e7eb" strokeWidth="1" />

              <path
                d="M 50 135 L 80 110 L 110 85 L 140 60 L 170 50 L 200 35 L 230 50 L 260 70 L 290 85 L 320 95 L 350 105 L 370 115 L 380 150 L 40 150 Z"
                fill="#3b82f6"
                opacity="0.1"
              />

              <polyline
                points="50,135 80,110 110,85 140,60 170,50 200,35 230,50 260,70 290,85 320,95 350,105 370,115"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <text x="50" y="170" fontSize="11" fill="#6b7280" textAnchor="middle">Jan</text>
              <text x="110" y="170" fontSize="11" fill="#6b7280" textAnchor="middle">Mar</text>
              <text x="170" y="170" fontSize="11" fill="#6b7280" textAnchor="middle">May</text>
              <text x="230" y="170" fontSize="11" fill="#6b7280" textAnchor="middle">Jul</text>
              <text x="290" y="170" fontSize="11" fill="#6b7280" textAnchor="middle">Sep</text>
              <text x="350" y="170" fontSize="11" fill="#6b7280" textAnchor="middle">Nov</text>
            </svg>
          </CardContent>
        </Card>
      </div>

      {/* 5. AI Bot Floating Button (Kept as is for overlay) */}
      <button
        onClick={() => setIsBotOpen(!isBotOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-purple-800 flex items-center justify-center transition-all z-40 transform hover:scale-110 active:scale-95"
        aria-label="Toggle AI Bot"
      >
        {isBotOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* AI Bot Window */}
      {isBotOpen && (
        <div className="fixed bottom-20 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col max-h-[500px] z-40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-t-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">🤖</div>
              <div>
                <h3 className="font-bold">SehatSetu GovBot</h3>
                <p className="text-xs text-purple-100">AI Analytics Assistant</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 h-64">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm flex-shrink-0">
                  🤖
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Welcome!</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    I am connected to the live Kerala Migrant Worker database. Ask me about district statistics, health alerts, or registration trends.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 bg-white rounded-b-xl">
             <div className="relative">
                <input
                type="text"
                placeholder="Ask e.g., 'Show Ernakulam stats'..."
                className="w-full bg-gray-100 text-sm text-gray-700 placeholder-gray-400 outline-none border border-transparent focus:border-purple-300 focus:ring-2 focus:ring-purple-100 rounded-lg pl-4 pr-10 py-3 transition-all"
                />
                <button className="absolute right-2 top-2 bg-purple-600 hover:bg-purple-700 text-white p-1.5 rounded-md transition-colors">
                <ArrowRight size={14} />
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}