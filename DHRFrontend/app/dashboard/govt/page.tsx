"use client"

import { useState, useEffect, useRef } from "react"
import { AlertTriangle, Users, CheckCircle, MoreVertical, MessageCircle, X, TrendingUp, MapPin, Activity, Calendar, ChevronRight } from "lucide-react"
import { FaUsers, FaExclamationTriangle, FaCampground, FaMap } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import KeralaMap from './components/map/KeralaMap'
import "../../../styles/animations.css"

export default function SehatSetuDashboard() {
  const [isBotOpen, setIsBotOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // State for Chart Tooltips
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null)

  // Refs for scroll animations
  const statsRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const chartsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Trigger entrance animations
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // --- Data for Interactive Charts ---
  const lineChartData = [50, 110, 85, 60, 50, 35, 50, 70, 85, 95, 105, 115]
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  const barChartData = [
    { label: "West Bengal", value: 15000, color: "bg-gradient-to-r from-blue-600 to-blue-400" },
    { label: "Assam", value: 12000, color: "bg-gradient-to-r from-blue-500 to-blue-300" },
    { label: "Odisha", value: 10500, color: "bg-gradient-to-r from-blue-400 to-blue-200" },
    { label: "Bihar", value: 9000, color: "bg-gradient-to-r from-blue-300 to-blue-100" },
  ]

  const stats = [
    { 
      label: "Total Workers", 
      val: "2.8M", 
      icon: <FaUsers size={24} />, 
      color: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600",
      change: "+12.5%"
    },
    { 
      label: "High-Risk Zones", 
      val: "487K", 
      icon: <FaExclamationTriangle size={24} />, 
      color: "bg-gradient-to-br from-red-50 to-red-100 text-red-600",
      change: "+8.2%"
    },
    { 
      label: "Active Camps", 
      val: "12K", 
      icon: <FaCampground size={24} />, 
      color: "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600",
      change: "+3.4%"
    },
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
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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
    hidden: {
      scale: 0.8,
      opacity: 0,
      rotateX: -10
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.03,
      y: -10,
      rotateX: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    tap: {
      scale: 0.98
    }
  }

  // Floating particles for map
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.8) 50%, 
            rgba(255,255,255,0) 100%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .gradient-border {
          border: double 2px transparent;
          background-image: linear-gradient(white, white), 
                            linear-gradient(to right, #3b82f6, #8b5cf6);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        .message-enter {
          opacity: 0;
          transform: translateX(-20px);
        }
        .message-enter-active {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 300ms, transform 300ms;
        }
        .message-exit {
          opacity: 1;
        }
        .message-exit-active {
          opacity: 0;
          transform: translateX(20px);
          transition: opacity 300ms, transform 300ms;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-900 overflow-x-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-px h-px bg-blue-200/30 rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3 + p.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Header with animated gradient */}
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 p-6 rounded-2xl bg-gradient-to-r from-white to-blue-50/50 shadow-lg border border-white/50 backdrop-blur-sm"
            >
              <div className="mb-4 sm:mb-0">
                <motion.h1 
                  className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  SehatSetu Dashboard
                </motion.h1>
                <motion.p 
                  className="text-slate-600 text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Real-time monitoring of migrant worker health & status across Kerala
                </motion.p>
              </div>
              <motion.div 
                className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Today, Dec 03</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </motion.div>
            </motion.div>

            {/* Metrics Cards with Staggered Animation */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8"
            >
              {[
                { 
                  icon: <Users size={24} />, 
                  label: "Total Migrants", 
                  value: 48247,
                  color: "from-blue-500 to-blue-400",
                  badge: "+12.5%",
                  badgeColor: "bg-gradient-to-r from-green-500 to-emerald-400",
                  delay: 0
                },
                { 
                  icon: <MapPin size={24} />, 
                  label: "Origin States", 
                  value: 14,
                  color: "from-purple-500 to-purple-400",
                  badge: "14 States",
                  badgeColor: "bg-gradient-to-r from-purple-500 to-purple-400",
                  delay: 0.1
                },
                { 
                  icon: <AlertTriangle size={24} />, 
                  label: "High Risk", 
                  value: 1847,
                  color: "from-red-500 to-red-400",
                  badge: "Action Req.",
                  badgeColor: "bg-gradient-to-r from-red-500 to-red-400",
                  delay: 0.2
                },
                { 
                  icon: <CheckCircle size={24} />, 
                  label: "Active Checkups", 
                  value: 342,
                  color: "from-green-500 to-green-400",
                  badge: "Live",
                  badgeColor: "bg-gradient-to-r from-green-500 to-emerald-400",
                  delay: 0.3
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden">
                    {/* Animated gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="shimmer absolute inset-0" />
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.color} bg-opacity-10`}>
                          <div className={`text-gradient bg-gradient-to-br ${card.color} bg-clip-text text-transparent`}>
                            {card.icon}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.badgeColor} text-white shadow-sm`}>
                          {card.badge}
                        </span>
                      </div>
                      
                      <motion.p 
                        className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: card.delay + 0.5 }}
                      >
                        {card.value.toLocaleString()}
                      </motion.p>
                      <p className="text-sm text-slate-600 mb-2">{card.label}</p>
                      
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs">
                          <Activity size={12} className="text-slate-400" />
                          <span className="text-slate-500">Updated 5 mins ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Glowing border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-500 rounded-2xl" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Map & Stats Section with Scroll Trigger */}
            <motion.div 
              ref={mapRef}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border border-white/50 p-4 sm:p-6 mb-8 shadow-xl overflow-hidden"
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" className="text-blue-200"/>
                </svg>
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row gap-6 sm:gap-8">
                {/* Stats Sidebar */}
                <div className="w-full lg:w-72 flex-shrink-0">
                  <motion.h3 
                    className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Kerala Overview
                  </motion.h3>

                  <div className="space-y-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        className="group relative"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, type: "spring" }}
                      >
                        <motion.div
                          className="flex items-center justify-between p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-100 hover:border-blue-200 transition-all duration-300 cursor-pointer"
                          whileHover={{ x: 10, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">
                              {stat.label}
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-900">
                              {stat.val}
                            </p>
                            <span className="text-xs text-slate-400 mt-1">
                              {stat.change}
                            </span>
                          </div>
                          <motion.div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${stat.color} shadow-lg`}
                            whileHover={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            {stat.icon}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div 
                    className="mt-6 pt-4 border-t border-slate-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <motion.div 
                        className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span>Live data • Updated 2 mins ago</span>
                    </div>
                  </motion.div>
                </div>

                {/* Interactive Kerala Map */}
                <div className="flex-1">
                  <motion.div
                    className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 shadow-inner overflow-hidden"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    <KeralaMap />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Charts Grid with Staggered Animation */}
            <motion.div 
              ref={chartsRef}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {/* Bar Chart */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-300 h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Workers by Origin</h3>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical size={18} className="text-slate-400 hover:text-slate-600 transition-colors" />
                    </motion.button>
                  </div>
                  
                  <div className="space-y-5">
                    {barChartData.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group/bar relative"
                        onMouseEnter={() => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-slate-700">{item.label}</span>
                          <span className="font-bold text-slate-900">{item.value.toLocaleString()}</span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${item.color} shadow-md`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.value / 20000) * 100}%` }}
                            transition={{ 
                              duration: 1,
                              delay: index * 0.2,
                              type: "spring",
                              stiffness: 100
                            }}
                            whileHover={{ scaleY: 1.5 }}
                          />
                        </div>
                        
                        {/* Animated Tooltip */}
                        <AnimatePresence>
                          {hoveredBar === index && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute -top-8 right-0 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl"
                            >
                              {Math.round((item.value / 48247) * 100)}% of total
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Line Chart with Interactive Points */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-300 h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Registration Trend</h3>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical size={18} className="text-slate-400 hover:text-slate-600 transition-colors" />
                    </motion.button>
                  </div>
                  
                  <div className="relative h-48 w-full">
                    {/* Interactive Line Chart */}
                    <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      {[30, 60, 90, 120].map((y, i) => (
                        <motion.line
                          key={y}
                          x1="0"
                          y1={y}
                          x2="400"
                          y2={y}
                          stroke="#f1f5f9"
                          strokeWidth="1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        />
                      ))}

                      {/* Animated Line */}
                      <motion.path
                        d={`M 0,${150 - lineChartData[0]} ${lineChartData.map((d, i) => `L ${(i / (lineChartData.length - 1)) * 400},${150 - d}`).join(' ')}`}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                      
                      {/* Gradient Definition */}
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>

                      {/* Animated Dots */}
                      {lineChartData.map((d, i) => {
                        const x = (i / (lineChartData.length - 1)) * 400
                        return (
                          <motion.g
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 + 0.5 }}
                            onMouseEnter={() => setHoveredLineIndex(i)}
                            onMouseLeave={() => setHoveredLineIndex(null)}
                            className="cursor-pointer"
                          >
                            {/* Hover Circle */}
                            <motion.circle
                              cx={x}
                              cy={150 - d}
                              r="6"
                              fill="white"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              className="opacity-0 hover:opacity-100 transition-opacity"
                              whileHover={{ scale: 1.5 }}
                            />
                            {/* Main Dot */}
                            <circle
                              cx={x}
                              cy={150 - d}
                              r="4"
                              fill="#3b82f6"
                              className={`transition-all ${hoveredLineIndex === i ? 'opacity-100 scale-125' : 'opacity-70'}`}
                            />
                          </motion.g>
                        )
                      })}
                    </svg>
                    
                    {/* Animated Tooltip */}
                    <AnimatePresence>
                      {hoveredLineIndex !== null && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -20 }}
                          className="absolute bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl px-4 py-2 rounded-lg pointer-events-none z-20"
                          style={{
                            left: `${(hoveredLineIndex / (lineChartData.length - 1)) * 100}%`,
                            top: `${100 - (lineChartData[hoveredLineIndex] / 150) * 100}%`,
                            transform: 'translate(-50%, -150%)'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                            <div>
                              <p className="font-bold text-slate-900 text-sm">
                                {lineChartData[hoveredLineIndex]} registrations
                              </p>
                              <p className="text-xs text-slate-500">
                                {months[hoveredLineIndex]} 2024
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* X Axis Labels */}
                  <motion.div 
                    className="flex justify-between mt-4 px-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    {months.filter((_, i) => i % 2 === 0).map((m, i) => (
                      <span key={i} className="text-xs text-slate-400 font-medium">
                        {m}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Donut Chart Card */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] transition-all duration-300 h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Occupation Distribution</h3>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical size={18} className="text-slate-400 hover:text-slate-600 transition-colors" />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-center mb-8">
                    <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-lg">
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#2563eb" strokeWidth="40" strokeDasharray="211 503" transform="rotate(-90 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#f97316" strokeWidth="40" strokeDasharray="115 503" strokeDashoffset="-211" transform="rotate(-90 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#a855f7" strokeWidth="40" strokeDasharray="86 503" strokeDashoffset="-326" transform="rotate(-90 100 100)" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" strokeWidth="40" strokeDasharray="91 503" strokeDashoffset="-412" transform="rotate(-90 100 100)" />
                      <circle cx="100" cy="100" r="50" fill="white" />
                    </svg>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Construction", val: "42%", color: "bg-blue-600" },
                      { label: "Manufacturing", val: "23%", color: "bg-orange-500" },
                      { label: "Services", val: "17%", color: "bg-purple-500" },
                      { label: "Hospitality", val: "18%", color: "bg-green-500" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-colors"
                      >
                        <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                        <span className="text-sm text-slate-600 font-medium">{item.label}</span>
                        <span className="text-sm font-bold text-slate-900 ml-auto">{item.val}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </main>

          {/* AI Chat Bot with Framer Motion */}
          <AnimatePresence>
            {/* Floating Action Button */}
            <motion.button
              onClick={() => setIsBotOpen(!isBotOpen)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                y: [0, -10, 0],
                rotate: isBotOpen ? 90 : 0
              }}
              transition={{
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                rotate: {
                  duration: 0.3
                }
              }}
            >
              {isBotOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>

            {/* Chat Window */}
            {isBotOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-40"
                style={{ maxHeight: 'calc(100vh - 120px)' }}
              >
                {/* Animated Header */}
                <motion.div 
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30 text-xl"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      🤖
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-white text-sm">SehatSetu AI Assistant</h3>
                      <motion.div 
                        className="flex items-center gap-1.5"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <p className="text-xs text-blue-100">Analyzing data in real-time</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Chat Messages */}
                <motion.div 
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white h-64"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 text-xs flex-shrink-0 shadow-sm">
                      AI
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-sm text-slate-600 max-w-[80%]">
                      <p>Hello! I can help analyze worker data, flag health risks, or generate reports. What do you need?</p>
                      <motion.div 
                        className="mt-2 flex gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {['Health Trends', 'Risk Analysis', 'Generate Report'].map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div 
                  className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {['High Risk Alert', 'District Report', 'Add Worker', 'Export Data'].map((action, i) => (
                    <motion.button
                      key={i}
                      className="flex-shrink-0 px-3 py-1.5 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100 border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:text-blue-600 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {action}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Input Area */}
                <motion.div 
                  className="p-3 bg-white border-t border-slate-100 flex gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.input 
                    type="text" 
                    placeholder="Ask about worker health trends..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.button 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <TrendingUp size={16} />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}