"use client"

import { GoogleMapsHeatmap } from "@/components/GoogleMapsHeatmap"
import { GoogleMapsDistrictData } from "@/services/mock/googleMapsMockData"
import { AnimatePresence, motion } from "framer-motion"
import { Activity, AlertTriangle, Calendar, ChevronRight, MapPin, MessageCircle, MoreVertical, TrendingUp, Users, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { FaCampground, FaExclamationTriangle, FaMap, FaUsers } from "react-icons/fa"
import "../../../styles/animations.css"

export default function SehatSetuDashboard() {
  const [isBotOpen, setIsBotOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // State for Chart Tooltips
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null)

  // Refs for scroll animations
  const mapRef = useRef<HTMLDivElement>(null)
  const chartsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // --- Data ---
  const lineChartData = [50, 110, 85, 60, 50, 35, 50, 70, 85, 95, 105, 115]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  const barChartData = [
    { label: "West Bengal", value: 15000, color: "bg-gradient-to-r from-blue-600 to-blue-400" },
    { label: "Assam", value: 12000, color: "bg-gradient-to-r from-blue-500 to-blue-300" },
    { label: "Odisha", value: 10500, color: "bg-gradient-to-r from-blue-400 to-blue-200" },
    { label: "Bihar", value: 9000, color: "bg-gradient-to-r from-blue-300 to-blue-100" },
    { label: "Uttar Pradesh", value: 8500, color: "bg-gradient-to-r from-green-600 to-green-400" },
    { label: "Madhya Pradesh", value: 7800, color: "bg-gradient-to-r from-green-500 to-green-300" },
    { label: "Rajasthan", value: 7200, color: "bg-gradient-to-r from-green-400 to-green-200" },
    { label: "Maharashtra", value: 6800, color: "bg-gradient-to-r from-purple-600 to-purple-400" },
  ]

  const stats = [
    { 
      label: "Total Workers", 
      val: "11,573", 
      icon: <FaUsers size={24} />, 
      color: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600",
      change: "+12.5%"
    },
    { 
      label: "High-Risk Zones", 
      val: "3", 
      icon: <FaExclamationTriangle size={24} />, 
      color: "bg-gradient-to-br from-red-50 to-red-100 text-red-600",
      change: "+8.2%"
    },
    // REMOVED 'Active Camps' card here
    { 
      label: "Districts", 
      val: "14", 
      icon: <FaMap size={24} />, 
      color: "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600",
      change: "✓ Active"
    },
  ]

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  }

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
    hover: { scale: 1.02, y: -5, transition: { type: "spring", stiffness: 300 } },
    tap: { scale: 0.98 }
  }

  // Floating particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2
  }))

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-900 overflow-x-hidden relative">
        
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-px h-px bg-blue-400/30 rounded-full"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3 + p.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Main Content Wrapper */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* --- Section 1: Header --- */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">
                SehatSetu Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Real-time monitoring of migrant worker health & status</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:shadow-md transition-all"
            >
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Today, Dec 03</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.button>
          </motion.header>

          {/* --- Section 2: Key Metrics Cards (Grid) --- */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            // Adjusted grid layout to accommodate 3 cards nicely (using col-span-4 for the last one)
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" 
          >
            {[
              { icon: <Users size={24} />, label: "Total Migrants", value: 11+577, color: "from-blue-500 to-blue-400", badge: "+12.5%", badgeColor: "bg-emerald-500" },
              { icon: <MapPin size={24} />, label: "Origin States", value: 14, color: "from-purple-500 to-purple-400", badge: "14 States", badgeColor: "bg-purple-500" },
              { icon: <AlertTriangle size={24} />, label: "High Risk States", value: 3, color: "from-red-500 to-red-400", badge: "Action Req.", badgeColor: "bg-red-500" },
              // REMOVED 'Active Camps' card here
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={cardVariants as any}
                whileHover="hover"
                // Ensure the 3 cards fill the space on large screens (using col-span-1/2/3 is optional but keeps the grid balanced)
                className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group ${index === 2 ? 'lg:col-span-2 sm:col-span-1 md:col-span-2' : ''}`}
              >
                {/* Card Background Gradient & Shimmer */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="shimmer absolute inset-0" />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-10`}>
                      <div className="text-white">{card.icon}</div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full text-white ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">{card.value.toLocaleString()}</h3>
                  <p className="text-sm text-slate-500">{card.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* --- Section 3: Map & Sidebar (Grid Layout) --- */}
          <motion.div 
            ref={mapRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* 3a. Sidebar Stats */}
            <div className="lg:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 p-5 shadow-sm h-full flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Kerala Overview</h3>
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                      <p className="text-lg font-bold text-slate-900">{stat.val}</p>
                      <p className="text-[10px] text-slate-400">{stat.change}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-opacity-10" style={{backgroundColor: stat.color.split(' ')[3]}}>
                      {stat.icon}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Live data updates active</span>
                </div>
              </div>
            </div>

            {/* 3b. Map Container */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden min-h-[500px] relative">
              <div className="absolute inset-0 z-0">
                {/* The Heatmap component remains active */}
                <GoogleMapsHeatmap
                  onDistrictSelect={(district: GoogleMapsDistrictData) => console.log(district)}
                  className="w-full h-full"
                />
              </div>
              <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 shadow-lg border border-slate-200 pointer-events-none">
                Interactive Heatmap Active
              </div>
            </div>
          </motion.div>

          {/* --- Section 4: Analytics Charts (Grid Layout) --- */}
          <motion.div 
            ref={chartsRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            
            {/* Chart 1: Bar Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Workers by Origin</h3>
                <MoreVertical size={18} className="text-slate-400 cursor-pointer" />
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[300px]">
                {barChartData.map((item, index) => (
                  <div 
                    key={index} 
                    className="group relative"
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="font-bold text-slate-900">{item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.value / 20000) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                    <AnimatePresence>
                      {hoveredBar === index && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="absolute -top-6 right-0 bg-slate-800 text-white text-[10px] px-2 py-1 rounded"
                        >
                          {Math.round((item.value / 48247) * 100)}%
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Line Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Registration Trend</h3>
                <MoreVertical size={18} className="text-slate-400 cursor-pointer" />
              </div>
              <div className="relative flex-1 min-h-[200px] w-full flex items-end">
                <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  {[30, 60, 90, 120].map((y) => (
                    <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                  ))}
                  
                  {/* Gradient Def */}
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>

                  {/* The Line */}
                  <motion.path
                    d={`M 0,${150 - lineChartData[0]} ${lineChartData.map((d, i) => `L ${(i / (lineChartData.length - 1)) * 400},${150 - d}`).join(' ')}`}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                  />

                  {/* Interactive Points */}
                  {lineChartData.map((d, i) => {
                    const x = (i / (lineChartData.length - 1)) * 400;
                    return (
                      <g key={i} onMouseEnter={() => setHoveredLineIndex(i)} onMouseLeave={() => setHoveredLineIndex(null)} className="cursor-pointer">
                        <circle cx={x} cy={150 - d} r="4" fill="#3b82f6" className={`transition-opacity ${hoveredLineIndex === i ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`} />
                        <circle cx={x} cy={150 - d} r="12" fill="transparent" /> {/* Hit area */}
                      </g>
                    )
                  })}
                </svg>

                {/* Tooltip Overlay */}
                <AnimatePresence>
                  {hoveredLineIndex !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="absolute bg-white border border-slate-200 shadow-lg px-3 py-2 rounded-lg pointer-events-none z-10"
                      style={{
                        left: `${(hoveredLineIndex / (lineChartData.length - 1)) * 100}%`,
                        top: '10%',
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <p className="font-bold text-slate-900 text-sm">{lineChartData[hoveredLineIndex]} New</p>
                      <p className="text-xs text-slate-500">{months[hoveredLineIndex]}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-slate-400">
                {months.filter((_, i) => i % 2 === 0).map((m) => <span key={m}>{m}</span>)}
              </div>
            </div>

            {/* Chart 3: Donut Chart - Gender Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Gender Distribution</h3>
                <MoreVertical size={18} className="text-slate-400 cursor-pointer" />
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 mb-6">
                  {/* SVG Circles (Male 60%, Female 35%, Other 5%) */}
                  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                    {/* Male: 60% of 503 ≈ 302 */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#2563eb" strokeWidth="30" strokeDasharray="302 503" transform="rotate(-90 100 100)" className="opacity-90" />
                    {/* Female: 35% of 503 ≈ 176. Start offset -302 */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#ec4899" strokeWidth="30" strokeDasharray="176 503" strokeDashoffset="-302" transform="rotate(-90 100 100)" className="opacity-90" />
                    {/* Other: 5% of 503 ≈ 25. Start offset -478 */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#a855f7" strokeWidth="30" strokeDasharray="25 503" strokeDashoffset="-478" transform="rotate(-90 100 100)" className="opacity-90" />
                    {/* Inner Text */}
                    <text x="50%" y="50%" textAnchor="middle" dy=".3em" className="text-2xl font-bold fill-slate-700">100%</text>
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full px-4">
                  {[
                    { label: "Male", val: "60%", color: "bg-blue-600" },
                    { label: "Female", val: "35%", color: "bg-pink-500" },
                    { label: "Other", val: "5%", color: "bg-purple-500" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-xs text-slate-600 flex-1">{item.label}</span>
                      <span className="text-xs font-bold text-slate-900">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        </main>

        {/* --- Chat Bot Section --- */}
        <AnimatePresence>
          {/* FAB */}
          <motion.button
            onClick={() => setIsBotOpen(!isBotOpen)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center z-50 hover:shadow-2xl hover:scale-105 transition-all"
            whileTap={{ scale: 0.9 }}
          >
            {isBotOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </motion.button>

          {/* Chat Window */}
          {isBotOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed bottom-24 right-6 w-[90vw] sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-40 max-h-[600px] h-[70vh]"
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
                <div>
                  <h3 className="font-bold text-white text-sm">AI Assistant</h3>
                  <p className="text-[10px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/> Online
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs flex-shrink-0">AI</div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 text-sm text-slate-600 shadow-sm">
                    <p>Hello! I can help analyze worker data. Try one of these:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['Health Trends', 'Risk Analysis', 'Export'].map((t) => (
                        <button key={t} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 hover:bg-indigo-100">
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                <input type="text" placeholder="Type a message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                <button className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
                  <TrendingUp size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  )
}