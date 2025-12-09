"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, Users, Activity, AlertTriangle, CheckCircle, Search, Filter, Download, X, ChevronRight, BarChart3, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSpring, animated, config } from "@react-spring/web"

export default function DiseaseSurveillanceDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [diseaseData, setDiseaseData] = useState<any[] | null>(null);
useEffect(() => {

  type DashboardItem = {
    District: string;
    "Workers Monitored": number | string;
    "Top Disease Name": string;
    "Top Disease %": number | string;
  };

  const fetchData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/dashboard");
      const json = await res.json();

      // Keep backend fields exactly as they are
      setDiseaseData(json.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  fetchData();
}, []);


  // React Spring animations
  const fadeIn = useSpring({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: config.molasses,
    delay: 200
  })

  const statsSpring = useSpring({
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    config: config.wobbly
  })

  // Data
  const districts = [
    { id: 1, district: "Ernakulam", icon: "🔴", workers: "8,247", liveRisk: "Critical - 8.9", predictedRisk: "High - 8.7", highRisk: "23", color: "red", riskLevel: 89 },
    { id: 2, district: "Thrissur", icon: "🟠", workers: "6,891", liveRisk: "High - 8.1", predictedRisk: "Moderate - 6.4", highRisk: "19", color: "orange", riskLevel: 81 },
    { id: 3, district: "Kozhikode", icon: "🟡", workers: "4,523", liveRisk: "Moderate - 6.8", predictedRisk: "High - 8.2", highRisk: "12", color: "yellow", riskLevel: 68 },
    { id: 4, district: "Palakkad", icon: "🟡", workers: "3,847", liveRisk: "Moderate - 5.9", predictedRisk: "Low - 3.8", highRisk: "9", color: "yellow", riskLevel: 59 },
    { id: 5, district: "Kottayam", icon: "🟢", workers: "2,156", liveRisk: "Low - 3.4", predictedRisk: "Low - 2.9", highRisk: "4", color: "green", riskLevel: 34 },
    { id: 6, district: "Thiruvananthapuram", icon: "🟢", workers: "1,892", liveRisk: "Low - 2.8", predictedRisk: "Low - 2.3", highRisk: "3", color: "green", riskLevel: 28 },
    { id: 7, district: "Kannur", icon: "🟡", workers: "3,412", liveRisk: "Moderate - 6.2", predictedRisk: "Moderate - 5.7", highRisk: "8", color: "yellow", riskLevel: 62 },
    { id: 8, district: "Alappuzha", icon: "🟢", workers: "2,634", liveRisk: "Low - 4.1", predictedRisk: "Low - 3.6", highRisk: "5", color: "green", riskLevel: 41 },
  ]
  
  const alerts = [
    { id: 1, type: "critical", title: "Critical Safety Violation - Ernakulam", description: "Major construction site reported unsafe scaffolding. Immediate inspection required.", actions: ["Assign Inspector", "View Details"], time: "5 mins ago", icon: AlertTriangle, bgColor: "bg-red-50", borderColor: "border-red-200", iconColor: "text-red-600", severity: "critical" },
    { id: 2, type: "warning", title: "Health Complaint Spike - Kozhikode", description: "Fish processing zone reports 12 new respiratory complaints in the last 24 hours.", actions: ["Schedule Inspection", "View Details"], time: "23 mins ago", icon: Activity, bgColor: "bg-amber-50", borderColor: "border-amber-200", iconColor: "text-amber-600", severity: "warning" },
    { id: 3, type: "info", title: "AI Prediction Alert - Thrissur", description: "AI model predicts 70% probability of safety incident in industrial zone within 48 hours.", actions: ["Deploy Prevention Team", "View Details"], time: "1 hour ago", icon: Search, bgColor: "bg-blue-50", borderColor: "border-blue-200", iconColor: "text-blue-600", severity: "info" },
    { id: 4, type: "success", title: "Compliance Improvement - Palakkad", description: "Manufacturing belt achieved 98% safety compliance rate, up from 87% last month.", actions: ["View Report", "Share Success"], time: "3 hours ago", icon: CheckCircle, bgColor: "bg-green-50", borderColor: "border-green-200", iconColor: "text-green-600", severity: "success" },
  ]

  const stats = [
    { value: "99.7%", label: "System Uptime", badge: "Live", badgeColor: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700", icon: Activity, change: "+0.3%", trend: "up", delay: 0 },
    { value: "1,247", label: "Active Monitors", badge: "Active", badgeColor: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700", icon: Users, change: "+12%", trend: "up", delay: 100 },
    { value: "847", label: "Predictions Made", badge: "AI", badgeColor: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700", icon: Search, change: "+91.4%", trend: "up", delay: 200 },
    { value: "2.3 hrs", label: "Response Time", badge: "Avg", badgeColor: "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700", icon: ArrowDown, change: "-18%", trend: "down", delay: 300 },
  ]

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      y: -8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  }

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  }

  return (
    <animated.div style={fadeIn} className="space-y-6 p-4 sm:p-6">


      {/* District Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="text-lg font-bold text-slate-900">District Surveillance Summary</h2>
            <p className="text-sm text-slate-500">Live monitoring of high-risk zones</p>
          </div>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
            >
              <Filter className="h-4 w-4" /> Filter
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-sm font-medium text-white shadow-sm shadow-blue-200 transition-all"
            >
              <Download className="h-4 w-4" /> Export Report
            </motion.button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">District</th>
                <th className="px-6 py-4 font-semibold">Workers Monitored</th>
                <th className="px-6 py-4 font-semibold">Live spreading disease</th>
                <th className="px-6 py-4 font-semibold">AI Prediction</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
   {diseaseData?.map((item, idx) => (
  <tr
    key={idx}
    className="cursor-pointer transition-colors hover:bg-slate-100"
    onClick={() => setSelectedDistrict(districts.find(d => d.district === item["District"]))}
  >
    {/* District */}
    <td className="px-6 py-4 font-medium text-slate-900">
      {item["District"]}
    </td>

    {/* Workers Monitored */}
    <td className="px-6 py-4 text-slate-600">
      {item["Workers Monitored"]}
    </td>

    {/* Disease + AI Prediction */}
    <td className="px-6 py-4 text-slate-600">
      <div className="flex flex-col">
        <span>{item["Top Disease Name"]}</span>
      </div>
    </td>
    
    <td className="px-6 py-4 text-slate-600">
      {item["Top Disease %"]}%
    </td>

    {/* Action Button */}
    <td className="px-6 py-4 text-right">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline"
        onClick={() => setSelectedDistrict(districts.find(d => d.district === item["District"]))}
      >
        View Details <ChevronRight className="h-3 w-3 inline" />
      </motion.button>
    </td>
  </tr>
))}



            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Showing 8 of 14 districts</span>
          <div className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 border border-slate-300 rounded bg-white text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Previous
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 border border-slate-300 rounded bg-white text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Next
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal - District Details */}
      <AnimatePresence>
        {selectedDistrict && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedDistrict(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedDistrict.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedDistrict.district}
                    </h2>
                    <p className="text-sm text-slate-500">Detailed Surveillance Report</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedDistrict(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </motion.button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                  >
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Total Workers</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{selectedDistrict.workers}</p>
                    <p className="text-xs text-blue-500 mt-1">Active registrations</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-4 rounded-xl border ${
                      selectedDistrict.color === 'red' ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100' : 
                      selectedDistrict.color === 'orange' ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100' : 
                      selectedDistrict.color === 'yellow' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100' : 
                      'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
                    }`}
                  >
                    <p className={`text-xs font-semibold uppercase tracking-wider ${
                      selectedDistrict.color === 'red' ? 'text-red-600' : 
                      selectedDistrict.color === 'orange' ? 'text-orange-600' : 
                      selectedDistrict.color === 'yellow' ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      Risk Status
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{selectedDistrict.liveRisk.split('-')[0]}</p>
                    <p className="text-xs text-slate-500 mt-1">Score: {selectedDistrict.liveRisk.split('-')[1]}</p>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-50 rounded-xl p-5 border border-slate-200"
                >
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Activity Timeline
                  </h3>
                  <div className="space-y-4">
                    {[
                      { title: "Routine Inspection Completed", time: "2 hours ago", status: "success" },
                      { title: "Health Complaint Registered", time: "4 hours ago", status: "warning" },
                      { title: "AI Risk Assessment Updated", time: "6 hours ago", status: "info" }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'success' ? 'bg-green-500' : 
                            item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          {i !== 2 && <div className="w-0.5 h-full bg-slate-200 my-1"></div>}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm font-medium text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Reported • {item.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDistrict(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Close
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-sm transition-colors"
                >
                  Download Full Report
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </animated.div>
  )
}