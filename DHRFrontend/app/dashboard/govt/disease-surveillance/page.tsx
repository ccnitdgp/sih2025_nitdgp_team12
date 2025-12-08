"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, Users, Activity, AlertTriangle, CheckCircle, Search, Filter, Download, X, ChevronRight, BarChart3, MapPin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSpring, animated, config } from "@react-spring/web"

export default function DiseaseSurveillanceDashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])

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
        type: "spring" as const,
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
        type: "spring" as const,
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      y: -8,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 15
      }
    }
  } as const

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
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">
            Disease Surveillance Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1">Real-time monitoring & predictive analytics across districts</p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm"
        >
          <span>Last updated: Just now</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </motion.div>
      </motion.div>

      {/* Stats Cards Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            custom={idx}
            whileHover="hover"
            className="relative group"
          >
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-lg ${
                    stat.badge === 'Live' ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-600' :
                    stat.badge === 'Active' ? 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600' :
                    stat.badge === 'AI' ? 'bg-gradient-to-br from-purple-50 to-violet-50 text-purple-600' :
                    'bg-gradient-to-br from-orange-50 to-amber-50 text-orange-600'
                  }`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <motion.span 
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.badgeColor} flex items-center gap-1`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: idx * 0.3
                    }}
                  >
                    {stat.badge}
                    {stat.badge === "Live" && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                  </motion.span>
                </div>
                
                <div className="space-y-1">
                  <motion.h3 
                    className="text-2xl sm:text-3xl font-bold text-slate-900"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    {stat.value}
                  </motion.h3>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 ${
                    stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-xs text-slate-400">vs last month</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Alerts & Risk Trend Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
              <h3 className="font-semibold text-slate-900">Active Alerts</h3>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="h-3 w-3" />
            </motion.button>
          </div>
          
          <div className="p-6 space-y-4">
            {alerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                whileHover={{ x: 4 }}
                className={`p-4 rounded-lg border-l-4 ${alert.bgColor} ${alert.borderColor} flex items-start gap-4 transition-all duration-200 cursor-pointer`}
              >
                <alert.icon className={`h-5 w-5 mt-0.5 ${alert.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-900">{alert.title}</h4>
                    <motion.span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ 
                        backgroundColor: alert.severity === 'critical' ? '#ef4444' : 
                                       alert.severity === 'warning' ? '#f59e0b' : 
                                       alert.severity === 'info' ? '#3b82f6' : '#10b981' 
                      }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {alert.severity.toUpperCase()}
                    </motion.span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alert.description}</p>
                  <div className="mt-3 flex gap-3">
                    {alert.actions.map((action, i) => (
                      <motion.button 
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {action}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{alert.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Risk Trend Chart */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-slate-900">Risk Trend Analysis</h3>
              <p className="text-xs text-slate-400">Live vs Predicted risk</p>
            </div>
            <motion.button 
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="text-slate-400 hover:text-slate-600"
            >
              <Filter className="h-4 w-4" />
            </motion.button>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative">
            <svg width="100%" height="180" viewBox="0 0 280 150" className="overflow-visible">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 37.5, 75, 112.5, 150].map((y, i) => (
                <motion.line 
                  key={i} 
                  x1="0" y1={y} x2="280" y2={y} 
                  stroke="#f1f5f9" 
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              ))}

              {/* Live Risk Line */}
              <motion.path 
                d="M0,120 Q70,90 140,60 T280,20" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="3" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Prediction Line */}
              <motion.path 
                d="M0,130 Q70,100 140,70 T280,30" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
              />
              
              {/* Fill Area */}
              <motion.path 
                d="M0,120 Q70,90 140,60 T280,20 V150 H0 Z" 
                fill="url(#areaGradient)" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Animated Points */}
              {[120, 85, 50, 20].map((y, i) => (
                <motion.circle 
                  key={i} 
                  cx={i * 93} 
                  cy={y} 
                  r="4" 
                  fill="white" 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + i * 0.2, type: "spring" }}
                />
              ))}
            </svg>
          </div>
          
          <div className="flex justify-between text-xs text-slate-400 mt-4 px-2">
            {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }}
              >
                {week}
              </motion.span>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-red-500"></div>
              <span className="text-xs text-slate-500">Live Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 border-b-2 border-dashed border-blue-500"></div>
              <span className="text-xs text-slate-500">Predicted</span>
            </div>
          </div>
        </motion.div>
      </div>

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
                <th className="px-6 py-4 font-semibold">Live Risk Score</th>
                <th className="px-6 py-4 font-semibold">AI Prediction</th>
                <th className="px-6 py-4 font-semibold">High Risk Sites</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {districts.map((item, idx) => (
                <motion.tr
                  key={item.id}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={tableRowVariants}
                  whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.5)" }}
                  onClick={() => setSelectedDistrict(item)}
                  className="cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold">{item.district}</div>
                        <div className="text-xs text-slate-400">Active monitoring</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="font-medium">{item.workers}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                          className={`absolute h-full ${
                            item.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-400' : 
                            item.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-400' : 
                            item.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 
                            'bg-gradient-to-r from-green-500 to-green-400'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.riskLevel}%` }}
                          transition={{ delay: 0.7 + idx * 0.05, duration: 0.8 }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-700">{item.liveRisk.split('-')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div 
                          className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${parseInt(item.predictedRisk.split('-')[1]) * 10}%` }}
                          transition={{ delay: 0.8 + idx * 0.05, duration: 0.8 }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{item.predictedRisk.split('-')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{item.highRisk}</span>
                      <span className="text-xs text-slate-400">sites</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <motion.button 
                      whileHover={{ scale: 1.05, x: 4 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs hover:underline flex items-center gap-1 justify-end"
                    >
                      View Details <ChevronRight className="h-3 w-3" />
                    </motion.button>
                  </td>
                </motion.tr>
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