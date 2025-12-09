"use client"

import {
  Phone,
  Headphones,
  Truck,
  MessageCircle,
  Shield,
  Building2,
  Pill,
  PhoneCall,
  AlertTriangle,
  MapPin,
  Users,
  Download,
  Gift,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
  Briefcase,
  Heart,
  User,
  Stethoscope,
  Building,
  Mail,
  HelpCircle,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

export default function HealthPortal() {
  const [activeUserType, setActiveUserType] = useState<"worker" | "doctor" | "govt">("worker")
  const [otp,setOtp]=useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [workAuthValue, setWorkAuthValue] = useState("")
  const [doctorId, setDoctorId] = useState("")
  const [doctorPassword, setDoctorPassword] = useState("")
  const router = useRouter()

  const handleOtpSend = async () => {
    try {
      const response = await api.auth.otpSend({ phone: workAuthValue });
      console.log("OTP sent successfully", response);
      // Handle success - show toast notification, etc.
    } catch (error) {
      console.error("Failed to send OTP", error);
      // Handle error - show error notification
    }
  }
  const verifyOtp = async () => {
    try {
      console.log("Verifying OTP for", workAuthValue, otp);
      
         const response = await api.auth.verifyOtp(workAuthValue, otp);
      console.log("OTP verified successfully", response);
      if(response.success){
        alert("loggin successfull");
        router.push("/dashboard/worker")
      }
      // Handle success - show toast notification, etc. or error if not successful
    } catch (error) {
      alert("invalid creadintial")
      console.error("Failed to send OTP", error);
      console.error("OTP error:", (error as any)?.response?.data || (error as any).message);

      // Handle error - show error notification
    }
  }

  
  useEffect(() => {
    // Make callback global for Google script
    ;(window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,bn,or,as,te",
            layout: (window as any).google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          },
          "google_translate_element"
        )
      }
    }

    // Avoid loading script multiple times
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
    )

    if (!existingScript) {
      const script = document.createElement("script")
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      script.async = true
      document.body.appendChild(script)
    }

    // No cleanup required for evaluation case
  }, [])


    const handleLogin = async () => {
    try {
      if (activeUserType === "doctor") {
        const response = await api.auth.doctorLogin(doctorId, doctorPassword)
        if(response.success){
          alert("Login successful")
          router.push("/dashboard/doctor")
        }
        
      } else if (activeUserType === "govt") {
        // TODO: Implement government login logic
        // const response = await api.auth.governmentLogin()
        // if(response.success){
        //   alert("Login successful")
        // router.push("/dashboard/govt")
        // }
         router.push("/dashboard/govt")
      }
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.")
      console.error("Login failed", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom CSS for animations, Google widget and responsive design */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(220, 38, 38, 0);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: inline-block;
          white-space: nowrap;
          padding-left: 100%;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-emergency {
          animation: pulse 2s infinite;
        }

        /* Responsive design utilities */
        @media (max-width: 768px) {
          .mobile-stagger > * {
            opacity: 0;
            animation: fadeInUp 0.4s ease-out forwards;
          }

          .mobile-stagger > *:nth-child(1) {
            animation-delay: 100ms;
          }
          .mobile-stagger > *:nth-child(2) {
            animation-delay: 200ms;
          }
          .mobile-stagger > *:nth-child(3) {
            animation-delay: 300ms;
          }
          .mobile-stagger > *:nth-child(4) {
            animation-delay: 400ms;
          }
          .mobile-stagger > *:nth-child(5) {
            animation-delay: 500ms;
          }
          .mobile-stagger > *:nth-child(6) {
            animation-delay: 600ms;
          }
        }

        /* Smooth transitions */
        .transition-all-smooth {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Hide scrollbar but allow scrolling */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Google Translate widget styling */
        #google_translate_element {
          display: inline-block;
          transform: scale(0.9);
          transform-origin: right center;
          white-space: nowrap;
        }

        .goog-te-gadget img {
          display: none;
        }

        .goog-te-gadget {
          font-size: 0;
        }

        .goog-te-combo {
          font-size: 12px;
          padding: 4px 6px;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
        }
      `}</style>

      {/* Header - Responsive */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-3 p-2 rounded-md hover:bg-gray-100 transition-all-smooth"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <img
                src="/migrant-worker-health-logo.jpg"
                alt="Migrant Worker Digital Health Record"
                className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full border-2 border-blue-100 animate-fade-in-up transition-transform hover:scale-105 transition-all-smooth"
              />
            </div>
            <div className="animate-fade-in-up">
              <h1 className="text-sm sm:text-lg font-semibold text-gray-900 leading-tight">
                Health Portal for Migrant Workers
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">प्रवासी श्रमिकों के लिए स्वास्थ्य पोर्टल</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Google Translate dropdown will render inside this div */}
            <div id="google_translate_element" className="min-w-[160px]" />

            <Button
              variant="outline"
              size="sm"
              className="transition-all-smooth hover:scale-105 hover:shadow-sm"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Help</span>
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white animate-pulse-emergency transition-all-smooth hover:scale-105">
              <Phone className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Emergency: </span>102
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 transition-all-smooth"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white h-9 px-3 animate-pulse-emergency transition-all-smooth">
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t animate-fade-in-up">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <div className="flex flex-col space-y-2">
                {/* Mobile can still scroll to top and use the same header widget */}
                <div className="text-xs text-gray-500">
                  Change language using the selector in the top header.
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" className="justify-center transition-all-smooth">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white justify-center transition-all-smooth">
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Red Notice Bar with Marquee Animation - Responsive */}
      <div className="bg-red-600 text-white py-2 px-4 text-sm overflow-hidden relative">
        <div className="container mx-auto">
          <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm">
            🚨 महत्वपूर्ण अधिसूचना है | Important Notice: COVID-19 vaccination is mandatory for all migrant workers | टोल फ्री
            हेल्पलाइन: 1800-XXX-XXXX | Toll Free Helpline: 1800-XXX-XXXX | Emergency Services Available 24/7 | आपातकालीन
            सेवाएं 24/7 उपलब्ध
          </div>
        </div>
      </div>

      {/* Hero Section - Responsive */}
      <section className="relative py-8 sm:py-12 md:py-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-green-50">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="healthcare-pattern"
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="20" cy="20" r="2" fill="#FF6B35" opacity="0.3" />
                  <rect x="40" y="15" width="10" height="2" fill="#138808" opacity="0.3" />
                  <rect x="44" y="11" width="2" height="10" fill="#138808" opacity="0.3" />
                  <circle cx="70" cy="70" r="3" fill="#000080" opacity="0.2" />
                  <polygon points="80,30 85,40 75,40" fill="#FF6B35" opacity="0.2" />
                </pattern>
                <pattern id="ashoka-wheel" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                  <circle
                    cx="100"
                    cy="100"
                    r="30"
                    fill="none"
                    stroke="#000080"
                    strokeWidth="1"
                    opacity="0.1"
                  />
                  <g transform="translate(100,100)">
                    <line x1="0" y1="-30" x2="0" y2="30" stroke="#000080" strokeWidth="0.5" opacity="0.1" />
                    <line x1="-30" y1="0" x2="30" y2="0" stroke="#000080" strokeWidth="0.5" opacity="0.1" />
                    <line x1="-21" y1="-21" x2="21" y2="21" stroke="#000080" strokeWidth="0.5" opacity="0.1" />
                    <line x1="21" y1="-21" x2="-21" y2="21" stroke="#000080" strokeWidth="0.5" opacity="0.1" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#healthcare-pattern)" />
              <rect width="100%" height="100%" fill="url(#ashoka-wheel)" />
            </svg>
          </div>

          {/* Animated Floating Elements */}
          <div className="absolute top-10 left-5 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 border-2 border-orange-200 rounded-full opacity-20 animate-float" />
          <div
            className="absolute top-32 right-5 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 border-2 border-green-200 rounded-full opacity-20 animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-20 left-10 sm:left-32 w-16 h-16 sm:w-24 sm:h-24 border-2 border-blue-200 rounded-full opacity-20 animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-40 right-5 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 rounded-full opacity-30 animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center relative z-10">
          {/* Hero Content */}
          <div className="animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-2">डिजिटल स्वास्थ्य पहचान</h2>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4 leading-tight">
              Digital Health Identity -{" "}
              <span className="bg-green-600 px-2 sm:px-3 py-1 rounded text-white ml-2 inline-block mt-1 sm:mt-0 animate-fade-in-up">
                Portable
              </span>
              <br className="sm:hidden" />
              <span className="hidden sm:inline">&nbsp;&</span>
              <span
                className="bg-green-600 px-2 sm:px-3 py-1 rounded text-white ml-0 sm:ml-2 inline-block mt-1 sm:mt-0 animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                Secure
              </span>
            </div>
            <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
              Digital health identity for every migrant worker in India. Secure, portable, and accessible across all
              states and languages.
            </p>

            {/* CTA Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Button
                className="bg-blue-800 hover:bg-blue-900 text-white px-4 sm:px-6 py-3 transition-all-smooth hover:scale-[1.02] hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <Download className="h-5 w-5 mr-2" />
                <span className="text-sm sm:text-base">Download Health Report</span>
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 transition-all-smooth hover:scale-[1.02] hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: "300ms" }}
              >
                <Gift className="h-5 w-5 mr-2" />
                <span className="text-sm sm:text-base">Check Rewards / Benefits</span>
              </Button>
            </div>

            {/* Stats - Responsive */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mobile-stagger">
              <div className="bg-white/80 p-3 sm:p-4 rounded-lg text-center backdrop-blur-sm border border-white/20 transition-all-smooth hover:scale-[1.03] hover:shadow-md">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">2.5M+</div>
                <div className="text-xs sm:text-sm text-gray-600">Registered Workers</div>
              </div>
              <div className="bg-white/80 p-3 sm:p-4 rounded-lg text-center backdrop-blur-sm border border-white/20 transition-all-smooth hover:scale-[1.03] hover:shadow-md">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">28</div>
                <div className="text-xs sm:text-sm text-gray-600">States Covered</div>
              </div>
              <div className="bg-white/80 p-3 sm:p-4 rounded-lg text-center backdrop-blur-sm border border-white/20 transition-all-smooth hover:scale-[1.03] hover:shadow-md">
                <div className="text-xl sm:text-2xl font-bold text-gray-800">12</div>
                <div className="text-xs sm:text-sm text-gray-600">Languages</div>
              </div>
            </div>
          </div>

          {/* Login Form - Responsive */}
          <div
            className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border border-white/20 transition-all-smooth hover:shadow-xl animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium animate-fade-in-up">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                Government Secured & Verified
              </div>
            </div>

            {/* User Type Selector - Responsive */}
            <div className="flex mb-4 sm:mb-6 overflow-x-auto hide-scrollbar">
              <Button
                className={`flex-1 min-w-[100px] rounded-r-none text-xs sm:text-sm ${
                  activeUserType === "worker"
                    ? "bg-blue-800 text-white"
                    : "bg-transparent border border-gray-300 text-gray-700"
                }`}
                onClick={() => setActiveUserType("worker")}
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Worker
              </Button>
              <Button
                className={`flex-1 min-w-[100px] rounded-none border-l-0 text-xs sm:text-sm ${
                  activeUserType === "doctor"
                    ? "bg-blue-800 text-white"
                    : "bg-transparent border border-gray-300 text-gray-700"
                }`}
                onClick={() => setActiveUserType("doctor")}
              >
                <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Doctor
              </Button>
              <Button
                className={`flex-1 min-w-[100px] rounded-l-none border-l-0 text-xs sm:text-sm ${
                  activeUserType === "govt"
                    ? "bg-blue-800 text-white"
                    : "bg-transparent border border-gray-300 text-gray-700"
                }`}
                onClick={() => setActiveUserType("govt")}
              >
                <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Govt
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Login Form Fields */}
              {activeUserType === "worker" && (
                <>
                  <div>
                    <Label htmlFor="workerAuth" className="text-xs sm:text-sm font-medium">
                      Mobile Number / Aadhaar Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="workerAuth"
                      placeholder="Enter mobile number or Aadhaar number"
                      className="mt-1 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500"
                      value={workAuthValue}
                      onChange={(e) => setWorkAuthValue(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="otp" className="text-xs sm:text-sm font-medium">
                      Enter OTP <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="otp"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="flex-1 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 sm:h-11 whitespace-nowrap transition-all-smooth"
                        onClick={handleOtpSend}
                      >
                        Send OTP
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Other user type forms */}
              {activeUserType === "doctor" && (
                <>
                  <div>
                    <Label htmlFor="doctorId" className="text-xs sm:text-sm font-medium">
                      Doctor ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="doctorId"
                      placeholder="Enter your Doctor ID"
                      className="mt-1 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500"
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="doctorPassword" className="text-xs sm:text-sm font-medium">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="doctorPassword"
                      type="password"
                      placeholder="Enter your password"
                      className="mt-1 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500"
                      value={doctorPassword}
                      onChange={(e) => setDoctorPassword(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeUserType === "govt" && (
                <>
                  <div>
                    <Label htmlFor="govtEmail" className="text-xs sm:text-sm font-medium">
                      Official Government Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="govtEmail"
                      type="email"
                      placeholder="yourname@kerala.gov.in"
                      className="mt-1 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="govtPassword" className="text-xs sm:text-sm font-medium">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="govtPassword"
                      type="password"
                      placeholder="Enter your password"
                      className="mt-1 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              {/* CAPTCHA */}
              <div>
                <Label htmlFor="captcha" className="text-xs sm:text-sm font-medium">
                  Security Code (CAPTCHA) <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 mt-1">
                  <div className="bg-gray-100 px-3 py-2 rounded border font-mono text-sm flex-1 flex items-center justify-center">
                    7K9P2X
                  </div>
                  <Button variant="outline" size="sm" className="h-10 sm:h-11 transition-all-smooth">
                    🔄
                  </Button>
                </div>
                <Input
                  id="captcha"
                  placeholder="Enter the code above"
                  className="mt-2 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-xs sm:text-sm">
                  Remember me
                </Label>
                <div className="ml-auto">
                  <a
                    href="#"
                    className="text-blue-600 text-xs sm:text-sm hover:underline transition-all-smooth"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* Login Button */}
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-sm sm:text-base transition-all-smooth hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                onClick={activeUserType === 'worker' ? verifyOtp : handleLogin}
              >
                <Shield className="h-4 w-4 mr-2" />
                सुरक्षित प्रवेश / Secure Login
              </Button>

              {/* Registration Link */}
              <div className="text-center text-xs sm:text-sm">
                {"Don't have an account? "}
                <a href="#" className="text-blue-600 hover:underline transition-all-smooth">
                  Register Now
                </a>
              </div>

              {/* Terms */}
              <div className="text-xs text-gray-500 text-center">
                {"By logging in, you agree to our "}
                <a href="#" className="text-blue-600 hover:underline transition-all-smooth">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline transition-all-smooth">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Facilities - Responsive */}
      <section className="py-8 sm:py-12 md:py-16 bg-white animate-fade-in-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              सेवाएं और सुविधाएं / Services & Facilities
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base">
              Comprehensive healthcare services designed specifically for migrant workers across India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 md:mb-16 mobile-stagger">
            <Card className="bg-blue-50 border-blue-200 text-center p-4 sm:p-6 transition-all-smooth hover:scale-[1.03] hover:shadow-lg">
              <div className="bg-blue-800 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-fade-in-up">
                <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Digital Health ID</h3>
              <p className="text-xs sm:text-sm text-gray-600">Unique health identifier for seamless access</p>
            </Card>

            <Card className="bg-green-50 border-green-200 text-center p-4 sm:p-6 transition-all-smooth hover:scale-[1.03] hover:shadow-lg">
              <div
                className="bg-green-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Hospital Network</h3>
              <p className="text-xs sm:text-sm text-gray-600">Access to 5000+ empaneled hospitals</p>
            </Card>

            <Card className="bg-purple-50 border-purple-200 text-center p-4 sm:p-6 transition-all-smooth hover:scale-[1.03] hover:shadow-lg">
              <div
                className="bg-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <Pill className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Medicine Delivery</h3>
              <p className="text-xs sm:text-sm text-gray-600">Free home delivery of prescribed medicines</p>
            </Card>

            <Card className="bg-orange-50 border-orange-200 text-center p-4 sm:p-6 transition-all-smooth hover:scale-[1.03] hover:shadow-lg">
              <div
                className="bg-orange-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-fade-in-up"
                style={{ animationDelay: "300ms" }}
              >
                <PhoneCall className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">24/7 Helpline</h3>
              <p className="text-xs sm:text-sm text-gray-600">Round-the-clock medical assistance</p>
            </Card>
          </div>

          {/* Health Records Dashboard - Responsive */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              स्वास्थ्य रिकॉर्ड डैशबोर्ड / Health Records Dashboard
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Complete overview of your health journey and medical history</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mobile-stagger">
            <Card className="p-4 sm:p-6 transition-all-smooth hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Health Summary</h3>
                <Heart className="h-5 w-5 text-green-600 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Overall Health Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 sm:w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="w-10 sm:w-14 h-2 bg-green-500 rounded-full animate-pulse"
                        style={{ width: "85%" }}
                      />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Last Checkup</span>
                  <span className="text-xs sm:text-sm font-medium">15 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Vaccinations</span>
                  <span className="text-xs sm:text-sm font-medium text-green-600">Up to date</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 transition-all-smooth hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Recent Activities</h3>
                <Clock
                  className="h-5 w-5 text-blue-600 animate-pulse"
                  style={{ animationDelay: "500ms" }}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium truncate">Health checkup completed</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Eye className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium truncate">Prescription refilled</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Pill className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium truncate">COVID-19 booster shot</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 transition-all-smooth hover:scale-[1.02] hover:shadow-lg">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Upcoming</h3>
                <Briefcase
                  className="h-5 w-5 text-orange-600 animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
              </div>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-2 sm:pl-3">
                  <p className="text-xs sm:text-sm font-medium">Annual Health Checkup</p>
                  <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                  <p className="text-xs text-gray-500">Dr. Sharma • General Medicine</p>
                </div>
                <div className="border-l-4 border-green-500 pl-2 sm:pl-3">
                  <p className="text-xs sm:text-sm font-medium">Dental Checkup</p>
                  <p className="text-xs text-gray-500">Next week, 2:00 PM</p>
                  <p className="text-xs text-gray-500">Dr. Patel • Dentist</p>
                </div>
                <a
                  href="#"
                  className="text-blue-600 text-xs sm:text-sm hover:underline block transition-all-smooth"
                >
                  View all appointments →
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits & Schemes - Responsive */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50 animate-fade-in-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              लाभ और योजनाएं / Benefits & Schemes
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Government welfare programs and benefits available for migrant workers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mobile-stagger">
            {[
              {
                bg: "bg-blue-50",
                border: "border-blue-200",
                iconBg: "bg-blue-800",
                icon: <Shield className="h-6 w-6 text-white" />,
                title: "Ayushman Bharat",
                subtitle: "PM-JAY Scheme",
                desc: "Free healthcare coverage up to ₹5 lakhs per family per year for eligible families.",
                status: "Active",
                statusColor: "bg-green-100 text-green-800",
                linkColor: "text-blue-600",
              },
              {
                bg: "bg-green-50",
                border: "border-green-200",
                iconBg: "bg-green-600",
                icon: <Calendar className="h-6 w-6 text-white" />,
                title: "ESIC Benefits",
                subtitle: "Medical & Cash Benefits",
                desc: "Medical care and cash benefits during sickness, maternity, disability and employment injury.",
                status: "Eligible",
                statusColor: "bg-blue-100 text-blue-800",
                linkColor: "text-green-600",
              },
              {
                bg: "bg-purple-50",
                border: "border-purple-200",
                iconBg: "bg-purple-600",
                icon: <CreditCard className="h-6 w-6 text-white" />,
                title: "Shramik Card",
                subtitle: "Labour Registration",
                desc: "Official registration for construction workers with access to various welfare schemes.",
                status: "Pending",
                statusColor: "bg-orange-100 text-orange-800",
                linkColor: "text-purple-600",
              },
              {
                bg: "bg-orange-50",
                border: "border-orange-200",
                iconBg: "bg-orange-600",
                icon: <Pill className="h-6 w-6 text-white" />,
                title: "Jan Aushadhi",
                subtitle: "Generic Medicines",
                desc: "Access to affordable generic medicines at Jan Aushadhi stores across India.",
                status: "Available",
                statusColor: "bg-green-100 text-green-800",
                linkColor: "text-orange-600",
              },
              {
                bg: "bg-indigo-50",
                border: "border-indigo-200",
                iconBg: "bg-indigo-600",
                icon: <MapPin className="h-6 w-6 text-white" />,
                title: "State Schemes",
                subtitle: "Regional Benefits",
                desc: "State-specific health and welfare schemes available in your current location.",
                status: "Location Based",
                statusColor: "bg-blue-100 text-blue-800",
                linkColor: "text-indigo-600",
              },
              {
                bg: "bg-red-50",
                border: "border-red-200",
                iconBg: "bg-red-600",
                icon: <Heart className="h-6 w-6 text-white" />,
                title: "Emergency Fund",
                subtitle: "Financial Assistance",
                desc: "Emergency financial assistance for medical emergencies and critical health conditions.",
                status: "Emergency Only",
                statusColor: "bg-red-100 text-red-800",
                linkColor: "text-red-600",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className={`${benefit.bg} ${benefit.border} p-4 sm:p-6 transition-all-smooth hover:scale-[1.02] hover:shadow-lg animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className={`${benefit.iconBg} p-2 rounded transition-all-smooth hover:scale-110`}>
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{benefit.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{benefit.subtitle}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">{benefit.desc}</p>
                <div className="flex items-center justify-between">
                  <span className={`${benefit.statusColor} px-2 py-1 rounded text-xs font-medium`}>
                    {benefit.status}
                  </span>
                  <a
                    href="#"
                    className={`${benefit.linkColor} text-xs sm:text-sm hover:underline transition-all-smooth`}
                  >
                    Learn More →
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services - Responsive */}
      <section className="py-8 sm:py-12 md:py-16 bg-white animate-fade-in-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              आपातकालीन सेवाएं / Emergency Services
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              24/7 emergency medical assistance and helpline numbers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 mobile-stagger">
            <Card className="bg-red-50 border-red-200 text-center p-4 sm:p-6 transition-all-smooth hover:scale-[1.05] hover:shadow-lg">
              <div className="bg-red-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-fade-in-up">
                <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Emergency</h3>
              <div className="text-xl sm:text-2xl font-bold text-red-600 mb-2">108</div>
              <p className="text-xs sm:text-sm text-gray-600">24/7 Medical Emergency</p>
            </Card>

            <Card className="bg-blue-50 border-blue-200 text-center p-4 sm:p-6 transition-all-smooth hover:scale-[1.05] hover:shadow-lg">
              <div
                className="bg-blue-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                <Headphones className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Health Helpline</h3>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">104</div>
              <p className="text-xs sm:text-sm text-gray-600">Medical Consultation</p>
            </Card>

            <Card className="bg-green-50 border-green-200 text-center p-4 sm:p-6 transition-all-smooth hover:scale-[1.05] hover:shadow-lg">
              <div
                className="bg-green-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Ambulance</h3>
              <div className="text-xl sm:text-2xl font-bold text-green-600 mb-2">102</div>
              <p className="text-xs sm:text-sm text-gray-600">Free Ambulance Service</p>
            </Card>

            <Card className="bg-purple-50 border-purple-200 text-center p-4 sm:p-6 transition-all-smooth hover:scale-[1.05] hover:shadow-lg">
              <div
                className="bg-purple-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-fade-in-up"
                style={{ animationDelay: "300ms" }}
              >
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Mental Health</h3>
              <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-2">1800-XXX</div>
              <p className="text-xs sm:text-sm text-gray-600">Counseling Support</p>
            </Card>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Quick Emergency Actions / त्वरित आपातकालीन कार्य
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Button className="bg-red-600 hover:bg-red-700 text-white p-4 sm:p-6 h-auto flex-col gap-2 sm:gap-3 transition-all-smooth hover:scale-[1.02] hover:shadow-lg animate-fade-in-up">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8" />
              <div>
                <div className="font-semibold text-sm sm:text-base">Report Emergency</div>
                <div className="text-xs sm:text-sm opacity-90">Immediate medical emergency</div>
              </div>
            </Button>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 sm:p-6 h-auto flex-col gap-2 sm:gap-3 transition-all-smooth hover:scale-[1.02] hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8" />
              <div>
                <div className="font-semibold text-sm sm:text-base">Share Location</div>
                <div className="text-xs sm:text-sm opacity-90">
                  Send current location to emergency services
                </div>
              </div>
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700 text-white p-4 sm:p-6 h-auto flex-col gap-2 sm:gap-3 transition-all-smooth hover:scale-[1.02] hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <Users className="h-6 w-6 sm:h-8 sm:w-8" />
              <div>
                <div className="font-semibold text-sm sm:text-base">Contact Family</div>
                <div className="text-xs sm:text-sm opacity-90">Notify emergency contacts</div>
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Support & Contact - Responsive */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50 animate-fade-in-up">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              सहायता और संपर्क / Support & Contact
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Get help and support for all your health portal needs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Form - Responsive */}
            <Card className="p-4 sm:p-6 transition-all-smooth hover:shadow-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Send us a Message</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-xs sm:text-sm">
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      className="mt-1 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-xs sm:text-sm">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      className="mt-1 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="emailAddress" className="text-xs sm:text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    className="mt-1 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="issueCategory" className="text-xs sm:text-sm">
                    Issue Category *
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-1 text-sm sm:text-base h-10 sm:h-11 transition-all-smooth focus:border-blue-500">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="account">Account Related</SelectItem>
                      <SelectItem value="benefits">Benefits & Schemes</SelectItem>
                      <SelectItem value="emergency">Emergency Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message" className="text-xs sm:text-sm">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    className="mt-1 text-sm sm:text-base min-h-[100px] sm:min-h-[120px] transition-all-smooth focus:border-blue-500"
                  />
                </div>
                <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white text-sm sm:text-base py-3 transition-all-smooth hover:scale-[1.02] hover:shadow-lg">
                  Send Message
                </Button>
              </div>
            </Card>

            {/* Office Hours & Regional Offices - Responsive */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6 transition-all-smooth hover:shadow-lg">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Office Hours</h3>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="text-red-600">Closed</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Emergency Support:</span>
                    <span className="text-green-600">24/7 Available</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4 sm:p-6 transition-all-smooth hover:shadow-lg">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Building
                    className="h-5 w-5 text-blue-600 animate-pulse"
                    style={{ animationDelay: "500ms" }}
                  />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Regional Offices</h3>
                </div>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="border-l-4 border-red-500 pl-2 sm:pl-3">
                    <div className="font-medium">Northern Region</div>
                    <div className="text-gray-600">Delhi, Punjab, Haryana, UP</div>
                    <div className="text-gray-600">Phone: 011-XXXX-XXXX</div>
                  </div>
                  <div className="border-l-4 border-green-500 pl-2 sm:pl-3">
                    <div className="font-medium">Western Region</div>
                    <div className="text-gray-600">Mumbai, Gujarat, Rajasthan</div>
                    <div className="text-gray-600">Phone: 022-XXXX-XXXX</div>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-2 sm:pl-3">
                    <div className="font-medium">Southern Region</div>
                    <div className="text-gray-600">Bangalore, Chennai, Hyderabad</div>
                    <div className="text-gray-600">Phone: 080-XXXX-XXXX</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-green-600 text-white p-4 sm:p-6 transition-all-smooth hover:scale-[1.02] hover:shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="h-5 w-5" />
                  <h3 className="text-base sm:text-lg font-semibold">Frequently Asked Questions</h3>
                </div>
                <p className="text-xs sm:text-sm mb-3 sm:mb-4">
                  Find quick answers to common questions about the health portal and services.
                </p>
                <Button
                  variant="secondary"
                  className="bg-white text-green-600 hover:bg-gray-100 text-xs sm:text-sm transition-all-smooth hover:scale-105"
                >
                  View FAQ →
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Responsive */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 animate-fade-in-up">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Health Portal</h4>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                Digital health identity and comprehensive healthcare services for migrant workers across India.
              </p>
              <div className="flex gap-2 sm:gap-3">
                {["f", "t", "y"].map((icon, index) => (
                  <div
                    key={index}
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded flex items-center justify-center transition-all-smooth hover:bg-gray-600 hover:scale-110 cursor-pointer"
                  >
                    <span className="text-xs">{icon}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                {["Register Now", "Find Hospitals", "Book Appointment", "Download Reports", "Emergency Services"].map(
                  (link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="hover:text-white transition-all-smooth hover:pl-1 block"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                {[
                  "Ayushman Bharat",
                  "ESIC Benefits",
                  "Telemedicine",
                  "Health Education",
                  "Mental Health Support",
                ].map((service, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="hover:text-white transition-all-smooth hover:pl-1 block"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Info</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>support@healthportal.gov.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>1800-XXX-XXXX (Toll Free)</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Ministry of Health & Family Welfare
                    <br />
                    Government of India, New Delhi
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 Government of India. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-blue-800 text-white p-3 rounded-full shadow-lg hover:bg-blue-900 transition-all-smooth hover:scale-110 z-40 animate-fade-in-up"
        aria-label="Back to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          ></path>
        </svg>
      </button>
    </div>
  )
}