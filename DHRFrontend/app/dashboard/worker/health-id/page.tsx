"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { 
  Shield, 
  CheckCircle, 
  User, 
  Calendar, 
  Download, 
  RefreshCw, 
  MapPin,
  Fingerprint
} from "lucide-react"


// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 100, damping: 20 } 
  },
}

export default function HealthSetuID() {
  const [healthId, setHealthId] = useState<string>("")
  const [cardData, setCardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem("healthCard_v2") // changed key to avoid conflict
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData)
        if (parsed) {
          setCardData(parsed)
        }
      } catch (e) {
        console.error("Data parse error", e)
      }
    }
  }, [])

  const handleGenerateCard = async () => {
    setIsLoading(true);
    try {
      const generatedData = await api.patient.getHealthCard(healthId);
      updateCardState(generatedData.healthCard.data);
    } catch (err) {
      console.error("Error generating card", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCardState = (data: any) => {
    localStorage.setItem("healthCard_v2", JSON.stringify(data))
    setCardData(data)
  }

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center p-4 bg-slate-50">
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-3xl space-y-8"
      >
        {/* Header Section */}
        <div className="text-center space-y-3">
          <Badge variant="outline" className="px-3 py-1 text-slate-500 border-slate-300 bg-white shadow-sm">
             National Health Authority
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            <span className="text-indigo-600">Health</span>Setu
          </h1>
          <p className="text-slate-600 max-w-md mx-auto text-sm md:text-base">
            Unified Digital Health Interface for Kerala Migrant Workers & Citizens.
          </p>
        </div>

        {/* Action Area */}
        <div className="flex justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            
            {/* STATE 1: No Card (Button) */}
            {!cardData && !isLoading && (
              <motion.div
                key="action-button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center w-full"
              >
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white w-full max-w-md text-center shadow-sm">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Initialize HealthSetu ID</h3>
                  <p className="text-sm text-slate-500 mb-6">Enter the Health ID to fetch records from the Kerala State Database.</p>
                  <div className="flex flex-col gap-4">
                    <Input
                      type="text"
                      placeholder="Enter Health ID"
                      value={healthId}
                      onChange={(e) => setHealthId(e.target.value)}
                      className="text-center"
                    />
                    <Button
                      onClick={handleGenerateCard}
                      size="lg"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all rounded-full px-8 w-full md:w-auto"
                      disabled={!healthId}
                    >
                      Generate Digital ID
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STATE 2: Loading */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-12"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <p className="text-slate-600 font-medium animate-pulse">Syncing with HealthSetu Servers...</p>
              </motion.div>
            )}

            {/* STATE 3: Card Display */}
            {cardData && !isLoading && (
              <motion.div
                key="card-display"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                {/* --- THE ID CARD --- */}
                <Card className="relative overflow-hidden border-0 shadow-2xl rounded-2xl bg-white max-w-2xl mx-auto ring-1 ring-slate-100">
                  
                  {/* Decorative Background & Header */}
                  <div className="absolute top-0 left-0 w-full h-36 bg-indigo-900" />
                  {/* Tricolor Strip for Indian Context */}
                  <div className="absolute top-36 left-0 w-full h-1.5 flex z-20">
                    <div className="w-1/3 bg-[#FF9933]"></div> {/* Saffron */}
                    <div className="w-1/3 bg-white"></div>    {/* White */}
                    <div className="w-1/3 bg-[#138808]"></div> {/* Green */}
                  </div>
                  
                  {/* Abstract shapes */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
                  <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />

                  <CardContent className="relative p-0">
                    
                    {/* Card Header Content */}
                    <div className="px-6 py-6 flex items-start justify-between text-white z-10 relative">
                        <div>
                            <div className="flex items-center gap-2 opacity-90 mb-1">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className="h-8 invert brightness-0 grayscale-0" />
                                <div className="border-l border-white/30 pl-2">
                                  <p className="text-[10px] font-bold tracking-widest uppercase leading-tight">Government of India</p>
                                  <p className="text-[10px] font-medium tracking-wide uppercase leading-tight">Ministry of Health & Family Welfare</p>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold mt-2 tracking-tight">HealthSetu <span className="font-light opacity-80">Card</span></h2>
                        </div>
                        {/* Status Badge */}
                        <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                           <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                           <span className="text-xs font-semibold text-emerald-50 tracking-wide">Active</span>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 md:p-8 pt-12 mt-2 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 md:gap-8 items-start">
                        
                        {/* 1. Photo Section */}
                        <div className="flex flex-col items-center md:items-start space-y-3">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-slate-200">
                                    <img src={cardData.avatar_url} alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Biometric Verified">
                                    <Fingerprint className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Details Section */}
                        <div className="space-y-5 text-center md:text-left pt-1">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">{cardData.name}</h3>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-500 text-sm mt-1 font-medium">
                                    <User className="w-3.5 h-3.5" />
                                    <span>{cardData.gender}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>{cardData.age} Years</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-y-3 text-sm">
                                {/* Health ID Box */}
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-colors">
                                    <div>
                                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">HealthSetu ID</p>
                                      <p className="text-indigo-700 font-mono font-bold text-lg">{cardData.health_id}</p>
                                    </div>
                                    <Shield className="w-5 h-5 text-indigo-200 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                
                                {/* Location Box */}
                                <div className="flex items-center gap-2 text-slate-700">
                                   <MapPin className="w-4 h-4 text-orange-500" /> 
                                   <span className="font-medium">{cardData.origin_city}, {cardData.origin_state}</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. QR Section */}
                        <div className="flex flex-col items-center justify-center space-y-2 pt-4 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
                            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                {/* REAL Dynamic QR Code */}
                                <img src={cardData.qrCodeUrl} alt="QR" className="w-24 h-24 mix-blend-multiply" />
                            </div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">Scan for History</p>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Valid until: <span className="font-semibold text-slate-700">{cardData.validUntil}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <CheckCircle className="w-3 h-3" />
                            <span className="font-medium">Digitally Signed</span>
                        </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Secondary Actions */}
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}
                    className="flex justify-center gap-4 mt-8"
                >
                    <Button 
                      variant="outline" 
                      className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900" 
                      onClick={() => window.print()}
                    >
                        <Download className="w-4 h-4" /> Download Digital Card
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900" 
                      onClick={() => setCardData(null)}
                    >
                        <RefreshCw className="w-4 h-4" /> Generate New
                    </Button>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}