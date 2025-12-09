"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProfessionalLogin() {
  const [activeUserType, setActiveUserType] = useState<"worker" | "doctor" | "govt">("worker")
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("otp")
  const [workAuthValue, setWorkAuthValue] = useState("")
  const [otp, setOtp] = useState("")
  const [doctorId, setDoctorId] = useState("")
  const [doctorPassword, setDoctorPassword] = useState("")
  const [govtEmail, setGovtEmail] = useState("")
  const [govtPassword, setGovtPassword] = useState("")
  const [captcha, setCaptcha] = useState("")
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleOtpSend = async () => {
    if (!workAuthValue) {
      alert("Please enter mobile number or Aadhaar number")
      return
    }
    
    setLoading(true)
    try {
      const response = await api.auth.otpSend({ phone: workAuthValue })
      console.log("OTP sent successfully", response)
      alert("OTP sent successfully!")
    } catch (error) {
      console.error("Failed to send OTP", error)
      alert("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (!workAuthValue || !otp) {
      alert("Please enter mobile number and OTP")
      return
    }
    
    setLoading(true)
    try {
      const response = await api.auth.verifyOtp(workAuthValue, otp)
      console.log("OTP verified successfully", response)
      if (response.success) {
        router.push("/dashboard/worker")
      }
    } catch (error) {
      console.error("Failed to verify OTP", error)
      alert("Failed to verify OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
      if (activeUserType === "doctor") {
        if (!doctorId || !doctorPassword) {
          alert("Please enter Doctor ID and password")
          return
        }
        const response = await api.auth.doctorLogin(doctorId, doctorPassword)
        if (response.success) {
          alert("Login successful")
          router.push("/dashboard/doctor")
        }
      } else if (activeUserType === "govt") {
        if (!govtEmail || !govtPassword) {
          alert("Please enter email and password")
          return
        }
        router.push("/dashboard/govt")
      }
    } catch (error) {
      alert("Login failed. Please check your credentials and try again.")
      console.error("Login failed", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (activeUserType === "worker" && authMethod === "otp") {
      verifyOtp()
    } else {
      handleLogin()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 sm:p-6 border border-white/20 transition-all duration-300 hover:shadow-xl">
        
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
                    disabled={loading || !workAuthValue}
                  >
                    {loading ? "Sending..." : "Send OTP"}
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
                  value={govtEmail}
                  onChange={(e) => setGovtEmail(e.target.value)}
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
                  value={govtPassword}
                  onChange={(e) => setGovtPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Login Button */}
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-sm sm:text-base transition-all-smooth hover:scale-[1.02] hover:shadow-lg cursor-pointer"
            onClick={handleSubmit}
            disabled={loading}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}