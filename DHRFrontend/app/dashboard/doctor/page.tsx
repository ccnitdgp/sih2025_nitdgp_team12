"use client"

import { useState ,useEffect} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import DoctorProfileSidebar from "@/components/doctor-profile-sidebar"
import { useToast } from "@/components/ui/use-toast"


import api, { doctorAPI } from "@/lib/api"

import {
  Search,
  QrCode,
  User,
  Calendar,
  Stethoscope,
  Plus,
  Trash2,
  Upload,
  X,
  Save,
  Cloud,
  Share,
  MessageSquare,
  Phone,
  FileText,
  Video,
  Volume2,
  Clock,
  TrendingUp,
  Activity,
  Users,
  AlertCircle,
  CheckCircle,
  Bell,
  Settings,
  Loader2,
} from "lucide-react"



//Interface for when doctor will search patient record through id
interface Visit {
  id: number;
  notes: string;
  symptoms: string;
  diagnosis: string;
  doctor_id: number;
  worker_id: number;
  created_at: string;
  visit_date: string; 
}
interface Patient {
  name: string;
  age: number; 
  gender: string;
  "origin-state": string;
  health_id: string; // matches abhaId field
  photo_url: string; // matches avatar field
  "current-location": string;
  workplace: string;
  visits: Visit[];
  
}
const DOCTOR_ID = "e8c77882-60d6-4d6c-b629-657ef384d251" // Mocked logged-in doctor ID
const PATIENT_ID = "000257d2-ce99-4ea4-8a15-38185a8c9621" // Mocked patient ID for testing
export default function DoctorDashboard() {
  // const [currentSection, setCurrentSection] = useState("patient-search")
  const [searchHealthId,setSearchHealthId]=useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const [patientSummary, setPatientSummary] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [visitHistory, setVisitHistory] = useState([
    {
      date: "December 15, 2024",
      status: "Completed",
      diagnosis: "Upper Respiratory Infection",
      medications: 3,
      vitals: "Fever: 101°F",
      doctor: "Dr. Sharma",
      borderColor: "border-green-500",
      badgeColor: "bg-green-100 text-green-800"
    },
    {
      date: "November 28, 2024",
      status: "Follow-up",
      diagnosis: "Routine Health Check",
      medications: 0,
      vitals: "BP: 120/80, 65 kg",
      doctor: "Dr. Patel",
      borderColor: "border-blue-500",
      badgeColor: "bg-blue-100 text-blue-800"
    }
  ])

  const { toast } = useToast()
    // State management (typed to avoid TS errors)
    const [loading, setLoading] = useState<boolean>(false)
    const [patient, setPatient] = useState<any | null>(null)
    const [medicalRecord, setMedicalRecord] = useState<any | null>(null)
    const [prescriptions, setPrescriptions] = useState<any[]>([])
    const [vitals, setVitals] = useState<any | null>(null)

    // Form states
    const [healthId, setHealthId] = useState<string>("14-1234-5678-9012") // Default for testing
    const [symptoms, setSymptoms] = useState<string>("")
    const [diagnosis, setDiagnosis] = useState<string>("")
    const [diseaseStatus, setDiseaseStatus] = useState<string>("ongoing")
    const [clinicalNotes, setClinicalNotes] = useState<string>("")

    // Vitals form
    const [vitalsSystolic, setVitalsSystolic] = useState<string>("")
    const [vitalsDiastolic, setVitalsDiastolic] = useState<string>("")
    const [temperature, setTemperature] = useState<string>("")
    const [heartRate, setHeartRate] = useState<string>("")
    const [o2Saturation, setO2Saturation] = useState<string>("")



  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "chest_xray_report.pdf", type: "pdf" },
    { name: "blood_test_results.jpg", type: "image" },
  ])
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false)

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== fileName));
  };



  // Sync UI with backend when data arrives
  useEffect(() => {
    if (!medicalRecord) {
      setSymptoms("")
      setDiagnosis("")
      setClinicalNotes("")
      return
    }

    setSymptoms(medicalRecord.symptoms || "")
    setDiagnosis(medicalRecord.diagnosis || "")
    setClinicalNotes(medicalRecord.clinical_notes || "")
  }, [medicalRecord])

  useEffect(() => {
    if (!vitals) {
      setVitalsSystolic("")
      setVitalsDiastolic("")
      setTemperature("")
      setHeartRate("")
      setO2Saturation("")
      return
    }

    setVitalsSystolic(vitals.blood_pressure_systolic?.toString() || "")
    setVitalsDiastolic(vitals.blood_pressure_diastolic?.toString() || "")
    setTemperature(vitals.temperature?.toString() || "")
    setHeartRate(vitals.heart_rate?.toString() || "")
    setO2Saturation(vitals.oxygen_saturation?.toString() || "")
  }, [vitals])

  const fetchPatientData = async () => {
    if (!healthId) {
            toast({ title: "Error", description: "Please enter a Health ID", variant: "destructive" })
            return
        }

        setLoading(true)
        try {
            const response: any = await api.patient.getByHealthId(healthId)
            setPatient(response?.patient ?? null)

            // Load patient history
            const historyResponse: any = await api.patient.getHistory(response?.patient?.id)

            // Set latest medical record if exists
            const medicalRecords = historyResponse?.history?.medical_records ?? []
            if (medicalRecords.length > 0) {
                const latestRecord = medicalRecords[0]
                setMedicalRecord(latestRecord)
                setSymptoms(latestRecord.symptoms || "")
                setDiagnosis(latestRecord.diagnosis || "")
                setDiseaseStatus(latestRecord.disease_status || "ongoing")
                setClinicalNotes(latestRecord.clinical_notes || "")
            }

            // Set prescriptions
            const historyPrescriptions = historyResponse?.history?.prescriptions ?? []
            if (historyPrescriptions.length > 0) {
                setPrescriptions(historyPrescriptions.map((p: any) => ({
                    id: p.id,
                    medicine: p.medicine_name,
                    dosage: p.dosage,
                    frequency: p.frequency,
                    duration: p.duration,
                    instructions: p.instructions
                })))
            }

            // Set latest vitals
            const vitalsArr = historyResponse?.history?.vitals ?? []
            if (vitalsArr.length > 0) {
                const latestVitals = vitalsArr[0]
                setVitals(latestVitals)
                setVitalsSystolic(latestVitals.blood_pressure_systolic?.toString() || "")
                setVitalsDiastolic(latestVitals.blood_pressure_diastolic?.toString() || "")
                setTemperature(latestVitals.temperature?.toString() || "")
                setHeartRate(latestVitals.heart_rate?.toString() || "")
                setO2Saturation(latestVitals.oxygen_saturation?.toString() || "")
            }

            toast({ title: "Success", description: `Loaded patient: ${response?.patient?.name ?? "Unknown"}` })
        } catch (error: any) {
            console.error("Error loading patient:", error)
            toast({ title: "Error", description: error?.message || "Failed to load patient", variant: "destructive" })
        } finally {
            setLoading(false)
        }
  }

    
    // Create or update medical record
    const saveMedicalRecord = async () => {
        if (!patient) {
            toast({ title: "Error", description: "Please load a patient first", variant: "destructive" })
            return
        }

        setLoading(true)
        try {
            const recordData = {
                patient_id: patient.id,
                doctor_id: DOCTOR_ID,
                visit_type: "consultation",
                symptoms,
                diagnosis,
                disease_status: diseaseStatus,
                clinical_notes: clinicalNotes,
                preferred_language: "hindi"
            }

            let response: any
            if (medicalRecord) {
                // Update existing record
                response = await api.medicalRecord.create( recordData);
                setMedicalRecord(response?.medical_record ?? null)
                

            } else {
                // Create new record
                response = await api.medicalRecord.create(recordData)
                setMedicalRecord(response?.medical_record ?? null)
            }



            toast({ title: "Success", description: "Medical record saved successfully" })
        } catch (error: any) {
            console.error("Error saving medical record:", error)
            toast({ title: "Error", description: error?.message || "Failed to save medical record", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    // Save vitals
    const saveVitals = async () => {
        if (!patient || !medicalRecord) {
            toast({ title: "Error", description: "Please load patient and create medical record first", variant: "destructive" })
            return
        }

        setLoading(true)
        try {
            const vitalsData = {
                patient_id: patient.id,
                doctor_id: DOCTOR_ID,
                medical_record_id: medicalRecord.id,
                blood_pressure_systolic: vitalsSystolic ? parseInt(vitalsSystolic, 10) : null,
                blood_pressure_diastolic: vitalsDiastolic ? parseInt(vitalsDiastolic, 10) : null,
                temperature: temperature ? parseFloat(temperature) : null,
                heart_rate: heartRate ? parseInt(heartRate, 10) : null,
                oxygen_saturation: o2Saturation ? parseInt(o2Saturation, 10) : null
            }

            const response: any = await api.vitals.record(vitalsData)
            setVitals(response?.vitals ?? null)
            toast({ title: "Success", description: "Vitals recorded successfully" })
        } catch (error: any) {
            console.error("Error saving vitals:", error)
            toast({ title: "Error", description: error?.message || "Failed to save vitals", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    // Add prescription
    const addPrescription = () => {
        setPrescriptions(prev => [...prev, {
            id: Date.now(),
            medicine: "",
            dosage: "",
            frequency: "",
            duration: "",
            instructions: ""
        }])
    }

    // Remove prescription
    const removePrescription = (id: number | string) => {
        setPrescriptions(prev => prev.filter(p => p.id !== id))
    }

    // Save all prescriptions
    const savePrescriptions = async () => {
    if (!patient?.id || !medicalRecord?.id || !DOCTOR_ID) {
        toast({
            title: "Error",
            description: "Please load patient and create medical record first",
            variant: "destructive"
        });
        return;
    }

    setLoading(true);

    try {
        const prescriptionData = prescriptions
            .filter(p => p.medicine)
            .map(p => ({
                medicine_name: p.medicine,
                dosage: p.dosage,
                frequency: p.frequency,
                duration: p.duration,
                instructions: p.instructions
            }));

        if (prescriptionData.length === 0) {
            toast({
                title: "Warning",
                description: "No prescriptions to save",
                variant: "destructive"
            });
            return;
        }

      

        toast({
            title: "Success",
            description: `Saved ${prescriptionData.length} prescriptions`
        });
          }  catch (error) {
          const message = error instanceof Error ? error.message : "Something went wrong";
          toast({
              title: "Error",
              description: message,
              variant: "destructive",
          });
      }
      finally {
              setLoading(false);
          }
};


    

  

  

  const generatePatientSummary = () => {
    setIsSaving(true)

    // Simulate API call delay
    setTimeout(() => {
      // Generate mock patient summary
      const summary =  patient && `
        PATIENT MEDICAL SUMMARY
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        Patient Information:
        • Name: ${patient.name}
        • Age: ${patient.age}
        • Gender: ${patient.gender}
        • Health ID: ${patient.abhaId}
        • Location: ${patient.location}
        • Workplace: ${patient.workplace}

        Visit Date: ${new Date().toLocaleDateString()}
        Disease Status: ${diseaseStatus.charAt(0).toUpperCase() + diseaseStatus.slice(1)}

        Prescriptions (${prescriptions.length} medications):
        ${prescriptions.map((p, i) => `${i + 1}. ${p.medicine}
        Dosage: ${p.dosage}
        Frequency: ${p.frequency}
        Duration: ${p.duration}
        Instructions: ${p.instructions}`).join('\n\n')}

        Uploaded Test Results:
        ${uploadedFiles.map((f, i) => `${i + 1}. ${f.name}`).join('\n')}

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Generated: ${new Date().toLocaleString()}
        Doctor: Dr. Ramesh Kumar
        Digitally Generated - National Digital Health Mission
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `.trim()

      setPatientSummary(summary)

      // Add new visit to history
      const newVisit = {
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: diseaseStatus === 'resolved' ? 'Completed' : 'Ongoing Treatment',
        diagnosis: `Current Visit - ${diseaseStatus.charAt(0).toUpperCase() + diseaseStatus.slice(1)}`,
        medications: prescriptions.length,
        vitals: uploadedFiles.length > 0 ? `${uploadedFiles.length} Test Results Uploaded` : 'Vitals Recorded',
        doctor: 'Dr. Ramesh Kumar',
        borderColor: diseaseStatus === 'resolved' ? 'border-green-500' : diseaseStatus === 'infectious' ? 'border-red-500' : 'border-blue-500',
        badgeColor: diseaseStatus === 'resolved' ? 'bg-green-100 text-green-800' : diseaseStatus === 'infectious' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      }

      // Add to beginning of history array
      setVisitHistory([newVisit, ...visitHistory])

      setIsSaving(false)

      // Show success message
      alert('✅ Patient Summary Generated Successfully!\n\nSummary has been saved and will be distributed via SMS and WhatsApp.\n\n✨ Visit History has been updated!')
    }, 1500)
    saveMedicalRecord();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-teal-600 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Migrant Worker Digital Health</h1>
                <p className="text-sm text-gray-600">Doctor Dashboard - Government of India</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified Doctor
              </Badge>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <button
                onClick={() => setIsProfileSidebarOpen(true)}
                className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white text-sm">DR</AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Dr. Ramesh Kumar</p>
                  <p className="text-xs text-gray-600">General Physician</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      <DoctorProfileSidebar isOpen={isProfileSidebarOpen} onClose={() => setIsProfileSidebarOpen(false)} />

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Patient Search & QR Scan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Patient Search & QR Scan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input placeholder="Enter Patient ID, Aadhaar, or ABHA ID..." className="flex-1" value={healthId} onChange={(e)=>setHealthId(e.target.value)} />
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6" onClick={fetchPatientData}>
                <Search className="h-4 w-4 mr-2" />
                Search Patient
              </Button>
            </div>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>Quick Search:</span>
              <button className="text-blue-600 hover:underline">Patient ID</button>
              <button className="text-blue-600 hover:underline">Aadhaar Number</button>
              <button className="text-blue-600 hover:underline">ABHA Health ID</button>
            </div>
          </CardContent>
        </Card>

        {/* Patient Profile Card */}
        {patient && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={patient.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>RK</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Government Verified
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Age</span>
                      <div className="font-medium">{patient.age}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Gender</span>
                      <div className="font-medium">{patient.gender}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Origin State</span>
                      <div className="font-medium">{patient.origin_state}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Location</span>
                      <div className="font-medium"> {patient.current_address} {patient.current_city} {patient.current_state}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-gray-500">Last Visit</span>
                      <div className="font-medium text-green-600">{patient.medical_records?.[patient.medical_records.length - 1]?.visit_date || "No data"}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">ABHA ID</span>
                      <div className="font-medium text-blue-600">{patient.health_id}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Workplace</span>
                      <div className="font-medium text-purple-600">{patient.workplace}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Symptoms & Diagnosis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-red-600" />
              Symptoms & Diagnosis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="symptoms" className="text-sm font-medium mb-2 block">
                  Current Symptoms
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Persistent cough for 3 weeks, mild fever, chest pain, fatigue"
                  className="min-h-[100px]"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="diagnosis" className="text-sm font-medium mb-2 block">
                  Diagnosis
                </Label>
                <Select value={diagnosis} onValueChange={setDiagnosis}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Primary Diagnosis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="respiratory-infection">Respiratory Infection</SelectItem>
                    <SelectItem value="tuberculosis">Tuberculosis</SelectItem>
                    <SelectItem value="pneumonia">Pneumonia</SelectItem>
                    <SelectItem value="bronchitis">Bronchitis</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder="Additional diagnosis notes..." className="mt-3 min-h-[60px]" value={clinicalNotes} onChange={(e) => setClinicalNotes(e.target.value)} />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Disease Status</Label>
              <div className="flex gap-6">
                <label
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setDiseaseStatus("resolved")}
                >
                  <input
                    type="radio"
                    name="status"
                    value="resolved"
                    checked={diseaseStatus === "resolved"}
                    onChange={() => setDiseaseStatus("resolved")}
                    className="w-4 h-4 text-green-600"
                  />
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 font-medium">Resolved</span>
                </label>
                <label
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setDiseaseStatus("ongoing")}
                >
                  <input
                    type="radio"
                    name="status"
                    value="ongoing"
                    checked={diseaseStatus === "ongoing"}
                    onChange={() => setDiseaseStatus("ongoing")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">Ongoing Treatment</span>
                </label>
                <label
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setDiseaseStatus("infectious")}
                >
                  <input
                    type="radio"
                    name="status"
                    value="infectious"
                    checked={diseaseStatus === "infectious"}
                    onChange={() => setDiseaseStatus("infectious")}
                    className="w-4 h-4 text-red-600"
                  />
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 font-medium">Infectious Disease</span>
                </label>
              </div>
            </div>
            {/* <Button onClick={saveMedicalRecord} className="bg-green-600 hover:bg-green-700" disabled={loading}>
                                            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                            Save Medical Record
            </Button> */}
          </CardContent>
        </Card>

        {/* Prescription Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Prescription Management
              </CardTitle>
              <Button onClick={addPrescription} className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Medicine</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Dosage</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Frequency</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Duration</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Instructions</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription, index) => (
                    <tr key={prescription.id} className="border-b">
                      <td className="py-3 px-2">
                        <Input
                          value={prescription.medicine}
                          onChange={(e) => {
                            const updated = [...prescriptions]
                            updated[index].medicine = e.target.value
                            setPrescriptions(updated)
                          }}
                          placeholder="Medicine name"
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={prescription.dosage}
                          onChange={(e) => {
                            const updated = [...prescriptions]
                            updated[index].dosage = e.target.value
                            setPrescriptions(updated)
                          }}
                          placeholder="Dosage"
                          className="min-w-[100px]"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={prescription.frequency}
                          onChange={(e) => {
                            const updated = [...prescriptions]
                            updated[index].frequency = e.target.value
                            setPrescriptions(updated)
                          }}
                          placeholder="Frequency"
                          className="min-w-[100px]"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={prescription.duration}
                          onChange={(e) => {
                            const updated = [...prescriptions]
                            updated[index].duration = e.target.value
                            setPrescriptions(updated)
                          }}
                          placeholder="Duration"
                          className="min-w-[80px]"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={prescription.instructions}
                          onChange={(e) => {
                            const updated = [...prescriptions]
                            updated[index].instructions = e.target.value
                            setPrescriptions(updated)
                          }}
                          placeholder="Instructions"
                          className="min-w-[120px]"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePrescription(prescription.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             {/* <Button onClick={savePrescriptions} className="bg-green-600 hover:bg-green-700 w-full" disabled={loading}>
             {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save All Prescriptions
            </Button> */}
          </CardContent>
        </Card>

        {/* Vitals & Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              Vitals & Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Vital Signs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Blood Pressure</Label>
                    <div className="flex gap-2 mt-1">
                      <Input placeholder="120" className="w-16" value={vitalsSystolic} onChange={(e) => setVitalsSystolic(e.target.value)} />
                      <span className="self-center text-gray-500">/</span>
                      <Input placeholder="80" className="w-16" value={vitalsDiastolic} onChange={(e) => setVitalsDiastolic(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Temperature (°F)</Label>
                    <Input placeholder="98.6" className="mt-1" value={temperature} onChange={(e) => setTemperature(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Blood Sugar</Label>
                    <Input placeholder="110" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Weight (kg)</Label>
                    <Input placeholder="65" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Heart Rate (bpm)</Label>
                    <Input placeholder="72" className="mt-1" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Oxygen Saturation</Label>
                    <Input placeholder="98" className="mt-1" value={o2Saturation} onChange={(e) => setO2Saturation(e.target.value)} />
                  </div>
                </div>
                {/* <Button onClick={saveVitals} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                     {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Vitals
                </Button> */}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Test Results & Reports</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload Lab Reports, X-rays, or Test Results</p>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files).map(file => ({
                          name: file.name,
                          type: file.name.endsWith('.pdf') ? 'pdf' : 'image'
                        }))
                        setUploadedFiles([...uploadedFiles, ...newFiles])
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-600" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <Label className="text-sm text-gray-600">Patient Progress</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Progress Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="improving">Improving</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="deteriorating">Deteriorating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Follow-up & Clinical Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Follow-up & Clinical Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Next Appointment</h4>
                <div>
                  <Label className="text-sm text-gray-600">Follow-up Date</Label>
                  <Input type="date" className="mt-1" />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Clinical Notes</h4>
                <Textarea
                  placeholder="Patient shows signs of respiratory infection. Prescribed antibiotics and advised complete rest. Must revisit in 2 weeks or earlier if symptoms worsen. Advised to avoid crowded places and maintain isolation until..."
                  className="min-h-[120px]"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Education & Patient Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Health Education & Patient Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Educational Materials</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-medium text-sm">TB Prevention Guide</div>
                      <div className="text-xs text-gray-600">Available in Hindi, English</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Video className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">Medication Instructions</div>
                      <div className="text-xs text-gray-600">Video in local language</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Volume2 className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Audio Instructions</div>
                      <div className="text-xs text-gray-600">Voice message in Hindi</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Communication Preferences</h4>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600">Preferred Language</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Hindi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">Contact Method</Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">SMS Messages</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">WhatsApp</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">Voice Calls</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
                    <Share className="h-4 w-4 mr-2" />
                    Send Care Instructions
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Schedule Follow-up SMS
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Notify Family/Contacts
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save & Generate Patient Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Save & Generate Patient Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Auto-Generated Summary</h4>
                {!patientSummary ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Patient summary will be generated after saving</p>
                    <p className="text-sm text-gray-500">Available in patient's preferred language</p>
                  </div>
                ) : (
                  <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Summary Generated Successfully</span>
                    </div>
                    <pre className="text-xs bg-white p-4 rounded border overflow-x-auto whitespace-pre-wrap font-mono">
                      {patientSummary}
                    </pre>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Distribution Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">SMS Summary</div>
                        <div className="text-xs text-gray-600">Send prescription and instructions via SMS</div>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-sm">WhatsApp Message</div>
                        <div className="text-xs text-gray-600">Send detailed summary with images via WhatsApp</div>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save & Sync Patient Record */}
        <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <CardContent className="p-6 text-center">
            <Button
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium"
              onClick={generatePatientSummary}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save & Sync Patient Record
                  <Cloud className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
            <p className="text-sm mt-3 opacity-90">
              Record will be automatically synced with the National Digital Health Mission (NDHM)
            </p>
          </CardContent>
        </Card>

        {/* Recent Patient History & Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Patient History & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Visit History</h4>
                <div className="space-y-4">
                  {visitHistory.map((visit, index) => (
                    <div key={index} className={`border-l-4 ${visit.borderColor} pl-4 py-2`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{visit.date}</span>
                        <Badge variant="secondary" className={visit.badgeColor}>
                          {visit.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Diagnosis: {visit.diagnosis}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {visit.medications > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />{visit.medications} Medications
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {visit.vitals}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {visit.doctor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Health Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Visits</span>
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-gray-500">Last 12 months</div>
                  </Card>

                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Medications Prescribed</span>
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">28</div>
                    <div className="text-xs text-gray-500">Total prescriptions</div>
                  </Card>

                  <Card className="p-4 bg-orange-50 border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Missed Appointments</span>
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">2</div>
                    <div className="text-xs text-gray-500">Last 6 months</div>
                  </Card>

                  <Card className="p-4 bg-purple-50 border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Health Score</span>
                      <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">85%</div>
                    <div className="text-xs text-gray-500">Overall health rating</div>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    )
}