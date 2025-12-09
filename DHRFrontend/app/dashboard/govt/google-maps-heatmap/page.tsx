"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, Filter, Heart, Package, Truck, Users, X, Zap, Check } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// --- Interfaces (Kept exactly the same) ---
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
  details: string
  date: string
  status: "In Progress" | "Completed"
  resources?: {
    medicinekits?: number
    ashaworkers?: number
    mobileclinic?: boolean
    rapidteam?: number
    doctors?: number
    ambulances?: number
  }
  location?: string
  district?: string
}

interface Resource {
  name: string
  available: number
  total: number
  status: "good" | "medium" | "low"
  icon: React.ElementType
  key: string
}

interface OutbreakLocation {
  id: number
  location: string
  district: string
  diagnosis: { name: string; count: number }[]
  disease: string
  severity: "high" | "medium" | "low"
}

interface RecentAlert {
  id: number
  location: string
  district: string
  status: "pending" | "done"
  resources: {
    medicinekits: number | null
    ashaworkers: number | null
    mobileclinic: boolean
    rapidteam: number | null
    doctors: number | null
    ambulances: number | null
  }
  date: string
}

// --- Mock Data (Kept exactly the same) ---
const outbreakAlertsData: OutbreakAlert[] = [
  { id: 1, disease: "Dengue", location: "Kochi Central Camp", date: "Sept 21, 2024", status: "Pending", cases: 12, severity: "high" },
  { id: 2, disease: "TB", location: "Thrissur Main Camp", date: "Sept 20, 2024", status: "Action Taken", cases: 3, severity: "medium" },
  { id: 3, disease: "Malaria", location: "Kozhikode Riverside Camp", date: "Sept 19, 2024", status: "Pending", cases: 8, severity: "high" },
  { id: 4, disease: "Flu", location: "Palakkad Hill Camp", date: "Sept 18, 2024", status: "Action Taken", cases: 15, severity: "low" },
  { id: 5, disease: "Dengue", location: "Kochi Central Camp", date: "Sept 21, 2024", status: "Pending", cases: 3, severity: "high" },
]

const initialActionLogData: ActionLogEntry[] = [
  { id: 1, action: "ASHA workers sent to Perumbavoor Camp", details: "3 ASHA workers dispatched", date: "Sept 21, 10:30 AM", status: "Completed" },
  { id: 2, action: "Mobile Clinic Deployed", details: "Mobile clinic to Kochi Central Camp", date: "Sept 21, 02:00 PM", status: "Completed" },
  { id: 3, action: "Emergency Medicine Kit Dispatched", details: "5 kits to Thrissur Main Camp", date: "Sept 20, 04:15 PM", status: "Completed" },
  { id: 4, action: "Rapid Response Team Activated", details: "2 teams deployed", date: "Sept 20, 11:45 AM", status: "Completed" },
  { id: 5, action: "Contact Tracing Initiated", details: "Kozhikode Riverside Camp", date: "Sept 19, 09:20 AM", status: "Completed" },
]

const initialResourcesData: Resource[] = [
  { name: "Ambulances", available: 12, total: 15, status: "good", icon: Truck, key: "ambulances" },
  { name: "Doctors on Call", available: 8, total: 10, status: "good", icon: Heart, key: "doctors" },
  { name: "Rapid Response Teams", available: 3, total: 5, status: "medium", icon: Users, key: "rapidteam" },
  { name: "Emergency Kits", available: 45, total: 100, status: "low", icon: Package, key: "medicinekits" },
  { name: "ASHA Workers", available: 25, total: 30, status: "good", icon: Users, key: "ashaworkers" },
]

const outbreakLocationsData: OutbreakLocation[] = [
  {
    id: 1,
    location: "Kochi Central Camp",
    district: "Kochi",
    diagnosis: [{ name: "Dengue", count: 12 }, { name: "Malaria", count: 5 }, { name: "TB", count: 3 }],
    disease: "Dengue",
    severity: "high",
  },
  {
    id: 2,
    location: "Thrissur Main Camp",
    district: "Thrissur",
    diagnosis: [{ name: "TB", count: 8 }, { name: "Flu", count: 4 }, { name: "Dengue", count: 2 }],
    disease: "TB",
    severity: "medium",
  },
  {
    id: 3,
    location: "Kozhikode Riverside Camp",
    district: "Kozhikode",
    diagnosis: [{ name: "Malaria", count: 10 }, { name: "Dengue", count: 6 }, { name: "TB", count: 1 }],
    disease: "Malaria",
    severity: "high",
  },
  {
    id: 4,
    location: "Palakkad Hill Camp",
    district: "Palakkad",
    diagnosis: [{ name: "Flu", count: 15 }, { name: "Dengue", count: 3 }, { name: "TB", count: 1 }],
    disease: "Flu",
    severity: "low",
  },
]

// --- Helper Functions ---
const getDiagnosisColorClasses = (percentage: number) => {
  if (percentage > 80) return "bg-red-500"
  if (percentage >= 40) return "bg-yellow-500"
  return "bg-green-500"
}

const formatResourceDetails = (resources: any) => {
  const details = []
  if (resources.medicinekits) details.push(`Medicine Kits: ${resources.medicinekits}`)
  if (resources.ashaworkers) details.push(`ASHA Workers: ${resources.ashaworkers}`)
  if (resources.mobileclinic) details.push(`Mobile Clinic: Yes`)
  if (resources.rapidteam) details.push(`Rapid Teams: ${resources.rapidteam}`)
  if (resources.doctors) details.push(`Doctors: ${resources.doctors}`)
  if (resources.ambulances) details.push(`Ambulances: ${resources.ambulances}`)
  return details.join(", ")
}

export default function EmergencyResponsePage() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [filterDisease, setFilterDisease] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<OutbreakLocation | null>(null)
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)
  const [recentAlerts, setRecentAlerts] = useState<RecentAlert[]>([])
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([])
  const [showAlertNotification, setShowAlertNotification] = useState(true)
  const [resources, setResources] = useState(initialResourcesData)

  const [deploymentResources, setDeploymentResources] = useState({
    medicinekits: false,
    medicinenumber: "",
    ashaworkers: false,
    ashanumber: "",
    mobileclinic: false,
    rapidteam: false,
    rapidnumber: "",
    doctors: false,
    doctornumber: "",
    ambulances: false,
    ambulancenumber: "",
  })

  // Handlers
  const handleLocationClick = (location: OutbreakLocation) => {
    setSelectedLocation(location)
    setIsResourceModalOpen(true)
  }

  const handleResourceChange = (field: string, value: string | boolean) => {
    setDeploymentResources((prev) => ({ ...prev, [field]: value }))
  }

  const updateResourceCount = (key: string, deployedCount: number) => {
    setResources(prev => prev.map(resource => {
      if (resource.key === key) {
        const newAvailable = Math.max(0, resource.available - deployedCount)
        let newStatus: "good" | "medium" | "low" = "good"
        const percentage = (newAvailable / resource.total) * 100
        
        if (percentage <= 20) newStatus = "low"
        else if (percentage <= 50) newStatus = "medium"
        else newStatus = "good"
        
        return { ...resource, available: newAvailable, status: newStatus }
      }
      return resource
    }))
  }

  const handleConfirmResources = () => {
    if (!selectedLocation) return

    // Validation
    const selectedResourcesCount = [
      deploymentResources.medicinekits,
      deploymentResources.ashaworkers,
      deploymentResources.mobileclinic,
      deploymentResources.rapidteam,
      deploymentResources.doctors,
      deploymentResources.ambulances,
    ].filter(Boolean).length

    if (selectedResourcesCount === 0) {
      alert("Please select at least one resource to deploy")
      return
    }

    const resourcesToDeploy = {
      medicinekits: deploymentResources.medicinekits ? parseInt(deploymentResources.medicinenumber) || 0 : 0,
      ashaworkers: deploymentResources.ashaworkers ? parseInt(deploymentResources.ashanumber) || 0 : 0,
      mobileclinic: deploymentResources.mobileclinic || false,
      rapidteam: deploymentResources.rapidteam ? parseInt(deploymentResources.rapidnumber) || 0 : 0,
      doctors: deploymentResources.doctors ? parseInt(deploymentResources.doctornumber) || 0 : 0,
      ambulances: deploymentResources.ambulances ? parseInt(deploymentResources.ambulancenumber) || 0 : 0,
    }

    const insufficientResources = []
    for (const [key, count] of Object.entries(resourcesToDeploy)) {
      // Handle numeric resources only (skip boolean ones like mobileclinic)
      if (typeof count === 'number' && count > 0) {
        const resource = resources.find(r => r.key === key)
        if (!resource) {
          console.warn(`Resource with key '${key}' not found in inventory`)
          continue
        }
        if (resource.available < count) {
          insufficientResources.push(`${resource.name} (Available: ${resource.available}, Requested: ${count})`)
        }
      }
    }

    if (insufficientResources.length > 0) {
      alert(`Insufficient resources:\n${insufficientResources.join('\n')}`)
      return
    }

    const newAlert: RecentAlert = {
      id: Date.now(),
      location: selectedLocation.location,
      district: selectedLocation.district,
      status: "pending",
      resources: {
        medicinekits: resourcesToDeploy.medicinekits > 0 ? resourcesToDeploy.medicinekits : null,
        ashaworkers: resourcesToDeploy.ashaworkers > 0 ? resourcesToDeploy.ashaworkers : null,
        mobileclinic: resourcesToDeploy.mobileclinic,
        rapidteam: resourcesToDeploy.rapidteam > 0 ? resourcesToDeploy.rapidteam : null,
        doctors: resourcesToDeploy.doctors > 0 ? resourcesToDeploy.doctors : null,
        ambulances: resourcesToDeploy.ambulances > 0 ? resourcesToDeploy.ambulances : null,
      },
      date: new Date().toLocaleString(),
    }

    const actionDetails = formatResourceDetails(resourcesToDeploy)
    
    // Add sequential numbering to actions
    const actionNumber = actionLog.length + 1
    const getNumberSuffix = (num: number) => {
      if (num % 10 === 1 && num % 100 !== 11) return 'st'
      if (num % 10 === 2 && num % 100 !== 12) return 'nd'
      if (num % 10 === 3 && num % 100 !== 13) return 'rd'
      return 'th'
    }
    
    const numberSuffix = getNumberSuffix(actionNumber)
    const newActionLogEntry: ActionLogEntry = {
      id: newAlert.id,
      action: `${actionNumber}${numberSuffix} Action: Deploying to ${selectedLocation.location}`,
      details: actionDetails,
      date: new Date().toLocaleString(),
      status: "In Progress",
      resources: resourcesToDeploy,
      location: selectedLocation.location,
      district: selectedLocation.district,
    }

    setActionLog(prev => [newActionLogEntry, ...prev])
    setRecentAlerts(prev => [newAlert, ...prev])

    Object.entries(resourcesToDeploy).forEach(([key, count]) => {
      if (typeof count === 'number' && count > 0) updateResourceCount(key, count)
    })

    setTimeout(() => {
      setActionLog(prev => prev.map(entry => 
        entry.id === newActionLogEntry.id ? { ...entry, status: "Completed", action: `Deployed to ${selectedLocation.location}` } : entry
      ))
      setRecentAlerts(prev => prev.map(alert => 
        alert.id === newAlert.id ? { ...alert, status: "done" } : alert
      ))
    }, 3000)

    setIsResourceModalOpen(false)
    setDeploymentResources({
      medicinekits: false, medicinenumber: "", ashaworkers: false, ashanumber: "",
      mobileclinic: false, rapidteam: false, rapidnumber: "", doctors: false,
      doctornumber: "", ambulances: false, ambulancenumber: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.5); border-color: rgb(239, 68, 68); }
          50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4); border-color: rgb(220, 38, 38); }
        }
        @keyframes gentle-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        @keyframes icon-bounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }
        .urgent-alert { animation: pulse-glow 2s ease-in-out infinite, gentle-shake 4s ease-in-out infinite; }
        .urgent-alert .alert-icon { animation: icon-bounce 1.5s ease-in-out infinite; }
        .urgent-alert:hover { animation: none; transform: scale(1.01); transition: all 0.3s ease; }
      `}</style>
      
      {/* Alert Banner - Responsive Flex */}
      {showAlertNotification && (
        <div className="urgent-alert bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-100/50 to-red-50/50 animate-pulse"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="alert-icon p-1 bg-red-500 rounded-full shrink-0">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <span className="text-red-800 font-bold text-sm sm:text-base">
                ⚠ IMMEDIATE ATTENTION: 15 Dengue cases in Kochi Central Camp – resources need deployment.
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="self-end sm:self-auto text-red-600 hover:text-red-800 hover:bg-red-100 transition-colors"
              onClick={() => setShowAlertNotification(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 via-red-500 to-red-400 animate-pulse"></div>
        </div>
      )}

      {/* Main Grid: Single column on mobile, 12 on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar - Locations */}
        <div className="col-span-1 lg:col-span-3">
          <Card className="h-full flex flex-col max-h-[500px] lg:max-h-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Outbreak Locations</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-4">
                {outbreakLocationsData.map((location) => (
                  <div
                    key={location.id}
                    onClick={() => handleLocationClick(location)}
                    className="border rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-400 transition-all active:scale-95"
                  >
                    <p className="font-semibold text-sm text-gray-900">{location.location}</p>
                    <p className="text-xs text-gray-600 mb-3">{location.district} District</p>
                    <div className="space-y-2">
                      {location.diagnosis.slice(0, 3).map((diag, idx) => {
                        const maxCount = Math.max(...location.diagnosis.map((d) => d.count))
                        const percentage = (diag.count / maxCount) * 100
                        return (
                          <div key={idx}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-700">{diag.name}</span>
                              <span className="text-xs font-bold text-gray-900">{percentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className={`h-2 rounded-full transition-all ${getDiagnosisColorClasses(percentage)}`} style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content Area */}
        <div className="col-span-1 lg:col-span-9">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            
            {/* Risk Chart */}
            <div className="col-span-1 lg:col-span-8">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Risk Level Scoring System</CardTitle>
                </CardHeader>
                {/* Changed h-[600px] to flexible h-auto with padding for mobile, fixed for desktop */}
                <CardContent className="flex items-center justify-center h-auto py-8 lg:py-0 lg:h-[600px]">
                  <div className="flex flex-col items-center justify-center gap-8 lg:gap-12 w-full">
                    {/* Wrap circles on small screens */}
                    <div className="flex gap-6 sm:gap-12 items-center lg:items-end justify-center flex-wrap">
                      
                      {/* Green */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-green-500 shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center">
                          <span className="text-white font-bold text-base sm:text-lg">0-40%</span>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-green-700">Low Risk</p>
                          <p className="text-xs text-gray-600">Safe Zone</p>
                        </div>
                      </div>

                      {/* Yellow */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-yellow-500 shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center">
                          <span className="text-white font-bold text-sm sm:text-base">40-80%</span>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-yellow-700">Medium Risk</p>
                          <p className="text-xs text-gray-600">At Risk Zone</p>
                        </div>
                      </div>

                      {/* Red */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-red-500 shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center justify-center">
                          <span className="text-white font-bold text-sm sm:text-base">80-100%</span>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-red-700">High Risk</p>
                          <p className="text-xs text-gray-600">Outbreak Zone</p>
                        </div>
                      </div>
                    </div>

                    {/* Legend below */}
                    <div className="mt-4 pt-6 border-t border-gray-200 w-full">
                      <p className="text-sm font-semibold text-gray-700 mb-4 text-center sm:text-left">Diagnosis Severity Indicator</p>
                      <div className="flex gap-4 sm:gap-8 justify-center flex-wrap">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm text-gray-700">Low (5-40%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm text-gray-700">Med (40-80%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-xs sm:text-sm text-gray-700">High (80%+)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Log */}
            <div className="col-span-1 lg:col-span-4">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" /> Action Log
                  </CardTitle>
                </CardHeader>
                {/* Constrain height on mobile, flexible on desktop */}
                <CardContent className="space-y-5 max-h-[400px] lg:max-h-[600px] overflow-y-auto flex-1">
                  {actionLog.length > 0 ? (
                    actionLog.map((action, index) => (
                      <div key={action.id} className="flex gap-3">
                        <div className="flex flex-col items-center pt-1">
                          <div className={`w-3 h-3 rounded-full shrink-0 ${action.status === "Completed" ? "bg-green-500" : "bg-blue-500"} shadow-md`} />
                          {index < actionLog.length - 1 && <div className="w-px h-10 bg-gray-200 mt-1" />}
                        </div>
                        <div className="flex-1 -mt-1">
                          <p className="text-sm font-semibold text-gray-900">{action.action}</p>
                          {action.details && <p className="text-xs text-gray-700 mt-1">{action.details}</p>}
                          {action.location && action.district && (
                            <p className="text-xs text-gray-600 mt-1">{action.location}, {action.district}</p>
                          )}
                          <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                            <p className="text-[10px] sm:text-xs text-gray-500">{action.date}</p>
                            <Badge variant="default" className={`text-[10px] sm:text-xs font-medium ${action.status === "Completed" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
                              {action.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-8">No actions logged yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Inventory */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-600" /> Essential Resources Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Grid adjustments: 1 col mobile, 2 cols tablet, 5 cols desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
              {resources.map((resource) => {
                const Icon = resource.icon
                const colorClass = resource.status === "good" ? "text-green-600" : resource.status === "medium" ? "text-yellow-600" : "text-red-600"
                const bgClass = resource.status === "good" ? "bg-green-100" : resource.status === "medium" ? "bg-yellow-100" : "bg-red-100"

                return (
                  <div key={resource.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${bgClass}`}>
                        <Icon className={`h-6 w-6 ${colorClass}`} />
                      </div>
                      <div className="flex-1 min-w-0"> {/* min-w-0 handles text overflow */}
                        <h4 className="font-medium text-base sm:text-lg text-gray-900 truncate">{resource.name}</h4>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{resource.available}</p>
                        <p className="text-xs text-gray-600">of {resource.total} available</p>
                        {resource.status === "low" && (
                          <Badge variant="destructive" className="text-xs mt-2 bg-red-600 hover:bg-red-700">Low Stock Alert</Badge>
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

      {/* Recent Alerts Scroll */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Outbreak Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAlerts.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className={`flex-shrink-0 w-72 sm:w-80 border rounded-lg p-4 shadow-sm transition-all ${alert.status === "done" ? "bg-green-50 border-green-300" : "bg-yellow-50 border-yellow-300"}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{alert.location}</p>
                        <p className="text-xs text-gray-600">{alert.district} District</p>
                      </div>
                      <Badge variant={alert.status === "pending" ? "secondary" : "default"} className={`text-xs whitespace-nowrap font-bold ${alert.status === "pending" ? "bg-yellow-500 text-white hover:bg-yellow-600" : "bg-green-500 text-white hover:bg-green-600"}`}>
                        {alert.status === "pending" ? "Pending" : "Done"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{alert.date}</p>
                    <div className="mt-3 pt-3 border-t text-xs text-gray-700 space-y-1.5">
                      {alert.resources.medicinekits !== null && <p className="flex items-center gap-2"><span className="font-semibold">🏥</span> Medicine Kits: {alert.resources.medicinekits}</p>}
                      {alert.resources.ashaworkers !== null && <p className="flex items-center gap-2"><span className="font-semibold">👥</span> ASHA Workers: {alert.resources.ashaworkers}</p>}
                      {alert.resources.mobileclinic && <p className="flex items-center gap-2"><span className="font-semibold">🚐</span> Mobile Clinic: Deployed</p>}
                      {alert.resources.rapidteam !== null && <p className="flex items-center gap-2"><span className="font-semibold">⚡</span> Rapid Teams: {alert.resources.rapidteam}</p>}
                      {alert.resources.doctors !== null && <p className="flex items-center gap-2"><span className="font-semibold">👨‍⚕️</span> Doctors: {alert.resources.doctors}</p>}
                      {alert.resources.ambulances !== null && <p className="flex items-center gap-2"><span className="font-semibold">🚑</span> Ambulances: {alert.resources.ambulances}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm py-8">No recent alerts submitted yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Modal */}
      <Dialog open={isResourceModalOpen} onOpenChange={setIsResourceModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl pr-6">
              {selectedLocation && `Deploy Resources - ${selectedLocation.location}`}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">Select resources to deploy and enter quantities</p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Medical Supplies */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" /> Medical Supplies
              </h3>
              <div className="space-y-3 pl-2 sm:pl-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="medicinekits" checked={deploymentResources.medicinekits} onCheckedChange={(checked) => handleResourceChange("medicinekits", checked)} />
                    <Label htmlFor="medicinekits" className="font-medium cursor-pointer">Emergency Medicine Kit</Label>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">Available: {resources.find(r => r.key === "medicinekits")?.available || 0}</span>
                </div>
                {deploymentResources.medicinekits && (
                  <Input type="number" placeholder="Number of kits" value={deploymentResources.medicinenumber} onChange={(e) => handleResourceChange("medicinenumber", e.target.value)} className="ml-0 sm:ml-6 mt-2 sm:mt-0" min="1" max={resources.find(r => r.key === "medicinekits")?.available} />
                )}
              </div>
            </div>

            {/* Personnel */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" /> Personnel
              </h3>
              <div className="space-y-3 pl-2 sm:pl-6">
                {/* ASHA */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="ashaworkers" checked={deploymentResources.ashaworkers} onCheckedChange={(checked) => handleResourceChange("ashaworkers", checked)} />
                    <Label htmlFor="ashaworkers" className="font-medium cursor-pointer">ASHA Workers</Label>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">Available: {resources.find(r => r.key === "ashaworkers")?.available || 0}</span>
                </div>
                {deploymentResources.ashaworkers && (
                  <Input type="number" placeholder="Number of workers" value={deploymentResources.ashanumber} onChange={(e) => handleResourceChange("ashanumber", e.target.value)} className="ml-0 sm:ml-6" min="1" max={resources.find(r => r.key === "ashaworkers")?.available} />
                )}

                {/* Doctors */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="doctors" checked={deploymentResources.doctors} onCheckedChange={(checked) => handleResourceChange("doctors", checked)} />
                    <Label htmlFor="doctors" className="font-medium cursor-pointer">Doctors on Call</Label>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">Available: {resources.find(r => r.key === "doctors")?.available || 0}</span>
                </div>
                {deploymentResources.doctors && (
                  <Input type="number" placeholder="Number of doctors" value={deploymentResources.doctornumber} onChange={(e) => handleResourceChange("doctornumber", e.target.value)} className="ml-0 sm:ml-6" min="1" max={resources.find(r => r.key === "doctors")?.available} />
                )}
              </div>
            </div>

            {/* Transport */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange-600" /> Transport & Services
              </h3>
              <div className="space-y-3 pl-2 sm:pl-6">
                 {/* Ambulances */}
                 <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="ambulances" checked={deploymentResources.ambulances} onCheckedChange={(checked) => handleResourceChange("ambulances", checked)} />
                    <Label htmlFor="ambulances" className="font-medium cursor-pointer">Ambulances</Label>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">Available: {resources.find(r => r.key === "ambulances")?.available || 0}</span>
                </div>
                {deploymentResources.ambulances && (
                  <Input type="number" placeholder="Number of ambulances" value={deploymentResources.ambulancenumber} onChange={(e) => handleResourceChange("ambulancenumber", e.target.value)} className="ml-0 sm:ml-6" min="1" max={resources.find(r => r.key === "ambulances")?.available} />
                )}
                
                {/* Mobile Clinic */}
                <div className="flex items-center space-x-3">
                  <Checkbox id="mobileclinic" checked={deploymentResources.mobileclinic} onCheckedChange={(checked) => handleResourceChange("mobileclinic", checked)} />
                  <Label htmlFor="mobileclinic" className="font-medium cursor-pointer">Mobile Clinic Deployed</Label>
                </div>
              </div>
            </div>

             {/* Emergency */}
             <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                <Zap className="h-4 w-4 text-red-600" /> Emergency Response
              </h3>
              <div className="space-y-3 pl-2 sm:pl-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="rapidteam" checked={deploymentResources.rapidteam} onCheckedChange={(checked) => handleResourceChange("rapidteam", checked)} />
                    <Label htmlFor="rapidteam" className="font-medium cursor-pointer">Rapid Response Team</Label>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">Available: {resources.find(r => r.key === "rapidteam")?.available || 0}</span>
                </div>
                {deploymentResources.rapidteam && (
                  <Input type="number" placeholder="Number of teams" value={deploymentResources.rapidnumber} onChange={(e) => handleResourceChange("rapidnumber", e.target.value)} className="ml-0 sm:ml-6" min="1" max={resources.find(r => r.key === "rapidteam")?.available} />
                )}
              </div>
            </div>

            {/* Summary Box */}
            {[deploymentResources.medicinekits, deploymentResources.ashaworkers, deploymentResources.mobileclinic, deploymentResources.rapidteam, deploymentResources.doctors, deploymentResources.ambulances].some(Boolean) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-sm text-blue-900 mb-2">Selected Resources Summary:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  {deploymentResources.medicinekits && <li>✓ Emergency Medicine Kits: {deploymentResources.medicinenumber || 0}</li>}
                  {deploymentResources.ashaworkers && <li>✓ ASHA Workers: {deploymentResources.ashanumber || 0}</li>}
                  {deploymentResources.doctors && <li>✓ Doctors on Call: {deploymentResources.doctornumber || 0}</li>}
                  {deploymentResources.ambulances && <li>✓ Ambulances: {deploymentResources.ambulancenumber || 0}</li>}
                  {deploymentResources.mobileclinic && <li>✓ Mobile Clinic: Deployed</li>}
                  {deploymentResources.rapidteam && <li>✓ Rapid Response Teams: {deploymentResources.rapidnumber || 0}</li>}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsResourceModalOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button onClick={handleConfirmResources} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <Check className="h-4 w-4 mr-2" /> Confirm Deployment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
