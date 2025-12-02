"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, Filter, Heart, MapPin, Package, Truck, Users, X, Zap } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface OutbreakAlert {
  id: number
  disease: string
  location: string
  date: string
  status: "Pending" | "Action Taken"
  cases: number
  severity: "high" | "medium" | "low"
}

interface Hotspot {
  id: number
  name: string
  cases: number
  workers: number
  risk: "high" | "medium" | "low"
  x: number
  y: number
}

interface ActionLogEntry {
  id: number
  action: string
  date: string
  status: "In Progress" | "Completed"
}

interface Resource {
  name: string
  available: number
  total: number
  status: "good" | "medium" | "low"
  icon: React.ElementType
}

const outbreakAlertsData: OutbreakAlert[] = [
  { id: 1, disease: "Dengue", location: "Kochi Camp Alpha", date: "Sept 21, 2024", status: "Pending", cases: 12, severity: "high" },
  { id: 2, disease: "TB", location: "Thrissur Camp Beta", date: "Sept 20, 2024", status: "Action Taken", cases: 3, severity: "medium" },
  { id: 3, disease: "Malaria", location: "Kozhikode Camp Gamma", date: "Sept 19, 2024", status: "Pending", cases: 8, severity: "high" },
  { id: 4, disease: "Flu", location: "Palakkad Camp Delta", date: "Sept 18, 2024", status: "Action Taken", cases: 15, severity: "low" },
  { id: 5, disease: "Dengue", location: "Kochi Camp Alpha", date: "Sept 21, 2024", status: "Pending", cases: 3, severity: "high" },
]

const actionLogData: ActionLogEntry[] = [
  { id: 1, action: "ASHA worker sent to Perumbavoor Camp", date: "Sept 21, 10:30 AM", status: "In Progress" },
  { id: 2, action: "Mobile Clinic Deployed to Kochi Alpha", date: "Sept 21, 02:00 PM", status: "Completed" },
  { id: 3, action: "Emergency Medicine Kit Dispatched", date: "Sept 20, 04:15 PM", status: "Completed" },
  { id: 4, action: "Rapid Response Team Activated", date: "Sept 20, 11:45 AM", status: "In Progress" },
  { id: 5, action: "Contact Tracing Initiated", date: "Sept 19, 09:20 AM", status: "Completed" },
]

const hotspotsData: Hotspot[] = [
  { id: 1, name: "Kochi Camp Alpha", cases: 15, workers: 3, risk: "high", x: 45, y: 60 },
  { id: 2, name: "Thrissur Camp Beta", cases: 3, workers: 2, risk: "medium", x: 35, y: 45 },
  { id: 3, name: "Kozhikode Camp Gamma", cases: 8, workers: 4, risk: "high", x: 25, y: 25 },
  { id: 4, name: "Palakkad Camp Delta", cases: 15, workers: 2, risk: "low", x: 40, y: 50 },
]

const emergencyResourcesData: Resource[] = [
  { name: "Ambulances", available: 12, total: 15, status: "good", icon: Truck },
  { name: "Doctors on Call", available: 8, total: 10, status: "good", icon: Heart },
  { name: "Rapid Response Teams", available: 3, total: 5, status: "medium", icon: Users },
  { name: "Emergency Kits", available: 45, total: 100, status: "low", icon: Package },
]

const getSeverityColorClasses = (severity: string) => {
  switch (severity) {
    case "high": return "bg-red-100 text-red-800 border-red-300"
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300"
    default: return "bg-green-100 text-green-800 border-green-300"
  }
}

const getStatusColorClasses = (status: string) => {
  switch(status) {
    case "Pending": return "bg-red-500 hover:bg-red-600"
    case "In Progress": return "bg-blue-500"
    case "Completed": return "bg-green-500"
    default: return "bg-gray-400"
  }
}

export default function EmergencyResponsePage() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [filterDisease, setFilterDisease] = useState<string | null>(null)

  const filteredAlerts = useMemo(() => {
    let alerts = outbreakAlertsData
    if (selectedHotspot) alerts = alerts.filter(alert => alert.location === selectedHotspot.name)
    if (filterDisease) alerts = alerts.filter(alert => alert.disease === filterDisease)
    return alerts
  }, [selectedHotspot, filterDisease])

  const uniqueDiseases = useMemo(() => Array.from(new Set(outbreakAlertsData.map(a => a.disease))), [])

  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    setSelectedHotspot(prev => (prev && prev.id === hotspot.id ? null : hotspot))
  }, [])

  const handleDiseaseFilterClick = useCallback((disease: string) => {
    setFilterDisease(prev => (prev === disease ? null : disease))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Critical Alert Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">
              ⚠ IMMEDIATE ATTENTION: 15 Dengue cases in Kochi Camp Alpha – resources need deployment.
            </span>
          </div>
          <Button variant="ghost" size="sm" className="text-red-600">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* Outbreak Alerts Panel */}
        <div className="col-span-12 md:col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Outbreak Alerts {selectedHotspot ? `(${selectedHotspot.name})` : ''}</CardTitle>
                <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {uniqueDiseases.map(disease => (
                  <Badge
                    key={disease}
                    variant={filterDisease === disease ? 'default' : 'outline'}
                    className={`text-xs cursor-pointer transition-colors ${filterDisease === disease ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-100'}`}
                    onClick={() => handleDiseaseFilterClick(disease)}
                  >
                    {disease}
                  </Badge>
                ))}
                {filterDisease && (
                  <Button variant="ghost" size="sm" onClick={() => setFilterDisease(null)} className="h-6 px-2 text-xs text-red-500 hover:bg-red-50">
                    Clear <X className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
              {selectedHotspot && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Showing Alerts for {selectedHotspot.name}</span>
                  <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto text-blue-600 hover:bg-blue-100" onClick={() => setSelectedHotspot(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map(alert => (
                  <div key={alert.id} className="border rounded-lg p-3 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-xs uppercase font-semibold border ${getSeverityColorClasses(alert.severity)}`}>
                        {alert.disease}
                      </Badge>
                      <Badge variant={alert.status === "Pending" ? "destructive" : "default"} className="text-xs">
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="font-semibold text-sm text-gray-900">{alert.location}</p>
                    <p className="text-xs text-gray-600">
                      <span className="font-bold">{alert.cases}</span> cases reported • {alert.date}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No active alerts for these filters.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hotspot Map */}
        <div className="col-span-12 md:col-span-6">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Kerala Outbreak Map</CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Low Risk (Safe)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Medium Risk (At Risk)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>High Risk (Outbreak Zone)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative bg-blue-50 rounded-lg h-[600px] overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M20 20 L80 20 L85 30 L80 40 L75 50 L70 60 L65 70 L60 75 L50 80 L40 82 L30 80 L25 75 L20 70 L18 60 L15 50 L18 40 L20 30 Z" fill="#e0f2fe" stroke="#0369a1" strokeWidth="0.5"/>
                </svg>

                {hotspotsData.map(hotspot => {
                  const isSelected = selectedHotspot?.id === hotspot.id
                  return (
                    <Popover key={hotspot.id} open={isSelected} onOpenChange={open => open ? handleHotspotClick(hotspot) : setSelectedHotspot(null)}>
                      <PopoverTrigger asChild>
                        <div
                          className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 ring-2 ${
                            hotspot.risk === "high" ? "bg-red-500 ring-red-300" :
                            hotspot.risk === "medium" ? "bg-yellow-500 ring-yellow-300" :
                            "bg-green-500 ring-green-300"
                          } transition-all duration-300 ${isSelected ? 'scale-150 ring-4' : 'hover:scale-125'}`}
                          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-lg text-gray-900">{hotspot.name}</h4>
                          <Zap className={`h-5 w-5 ${hotspot.risk === 'high' ? 'text-red-500' : 'text-yellow-500'}`} />
                        </div>
                        <p className="text-sm text-gray-700">Total Cases: <span className="font-semibold">{hotspot.cases}</span></p>
                        <p className="text-sm text-gray-700">Response Team: <span className="font-semibold">{hotspot.workers} Workers</span></p>
                        <Badge className={`mt-2 text-xs uppercase font-bold ${getSeverityColorClasses(hotspot.risk)}`}>
                          {hotspot.risk} Risk Zone
                        </Badge>
                        <Button variant="default" size="sm" className="mt-3 w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleHotspotClick(hotspot)}>
                          View Alerts
                        </Button>
                      </PopoverContent>
                    </Popover>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Log Timeline */}
        <div className="col-span-12 md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600"/> Action Log Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 max-h-[600px] overflow-y-auto">
              {actionLogData.map((action, index) => (
                <div key={action.id} className="flex gap-3">
                  <div className="flex flex-col items-center pt-1">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${getStatusColorClasses(action.status)} shadow-md`} />
                    {index < actionLogData.length - 1 && <div className="w-px h-10 bg-gray-200 mt-1" />}
                  </div>
                  <div className="flex-1 -mt-1">
                    <p className="text-sm font-semibold text-gray-900">{action.action}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">{action.date}</p>
                    <Badge variant={action.status === "Completed" ? "default" : "secondary"} className={`text-xs mt-1 ${action.status === "Completed" ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
                      {action.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Emergency Resources Panel */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-600" /> Essential Resources Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {emergencyResourcesData.map(resource => {
                const Icon = resource.icon
                const colorClass = resource.status === "good" ? "text-green-600" : resource.status === "medium" ? "text-yellow-600" : "text-red-600"
                const bgClass = resource.status === "good" ? "bg-green-100" : resource.status === "medium" ? "bg-yellow-100" : "bg-red-100"

                return (
                  <div key={resource.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${bgClass}`}>
                            <Icon className={`h-6 w-6 ${colorClass}`} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-lg text-gray-900">{resource.name}</h4>
                            <p className="text-2xl font-bold text-gray-900">{resource.available}</p>
                            <p className="text-xs text-gray-600">of {resource.total} available</p>
                            {resource.status === "low" && (
                              <Badge variant="destructive" className="text-xs mt-2 bg-red-600 hover:bg-red-700">
                                Low Stock Alert
                              </Badge>
                            )}
                        </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}