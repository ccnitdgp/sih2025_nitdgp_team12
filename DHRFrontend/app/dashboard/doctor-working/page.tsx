"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"
import {
    Search,
    Stethoscope,
    Plus,
    Trash2,
    Save,
    CheckCircle,
    Loader2,
} from "lucide-react"

export default function DoctorDashboardWorking() {
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

    // Hardcoded doctor ID for now (in real app, this would come from authentication)
    const DOCTOR_ID = "dc9e8b5a-3f2c-4d1b-9e8a-1f5b7c9d4e2a" // You'll get this from your database

    // Load patient by Health ID
    const loadPatient = async () => {
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
                response = await api.medicalRecord.update(medicalRecord.id, recordData)
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
        if (!patient || !medicalRecord) {
            toast({ title: "Error", description: "Please load patient and create medical record first", variant: "destructive" })
            return
        }

        setLoading(true)
        try {
            const prescriptionData = prescriptions.map(p => ({
                medicine_name: p.medicine,
                dosage: p.dosage,
                frequency: p.frequency,
                duration: p.duration,
                instructions: p.instructions
            })).filter((p: any) => p.medicine_name) // Only save non-empty prescriptions

            if (prescriptionData.length === 0) {
                setLoading(false)
                toast({ title: "Warning", description: "No prescriptions to save", variant: "destructive" })
                return
            }

            await api.prescription.createBulk(patient.id, DOCTOR_ID, medicalRecord.id, prescriptionData)
            toast({ title: "Success", description: `Saved ${prescriptionData.length} prescriptions` })
        } catch (error: any) {
            console.error("Error saving prescriptions:", error)
            toast({ title: "Error", description: error?.message || "Failed to save prescriptions", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
            <div className="container mx-auto space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Stethoscope className="h-6 w-6 text-teal-600" />
                            Doctor Dashboard - Working Demo
                        </CardTitle>
                    </CardHeader>
                </Card>

                {/* Patient Search */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-blue-600" />
                            Load Patient by Health ID
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Enter Patient Health ID (e.g., 14-1234-5678-9012)"
                                value={healthId}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHealthId(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                onClick={loadPatient} className="bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                                Load Patient
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Patient Info */}
                {patient && (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold">{patient.name}</h3>
                                    <div className="flex gap-4 text-sm text-gray-600 mt-2">
                                        <span>Age: {patient.age}</span>
                                        <span>Gender: {patient.gender}</span>
                                        <span>Health ID: {patient.health_id}</span>
                                    </div>
                                </div>
                                <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Loaded from API
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Symptoms & Diagnosis */}
                {patient && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Symptoms & Diagnosis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Symptoms</Label>
                                <Textarea
                                    value={symptoms}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSymptoms(e.target.value)}
                                    placeholder="Enter patient symptoms..."
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label>Diagnosis</Label>
                                <Input
                                    value={diagnosis}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiagnosis(e.target.value)}
                                    placeholder="Enter diagnosis..."
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label>Clinical Notes</Label>
                                <Textarea
                                    value={clinicalNotes}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setClinicalNotes(e.target.value)}
                                    placeholder="Enter clinical notes..."
                                    className="mt-2"
                                />
                            </div>
                            <Button onClick={saveMedicalRecord} className="bg-green-600 hover:bg-green-700" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Medical Record
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Vitals */}
                {patient && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Record Vitals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>BP Systolic</Label>
                                    <Input value={vitalsSystolic} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVitalsSystolic(e.target.value)} placeholder="120" />
                                </div>
                                <div>
                                    <Label>BP Diastolic</Label>
                                    <Input value={vitalsDiastolic} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVitalsDiastolic(e.target.value)} placeholder="80" />
                                </div>
                                <div>
                                    <Label>Temperature (°F)</Label>
                                    <Input value={temperature} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemperature(e.target.value)} placeholder="98.6" />
                                </div>
                                <div>
                                    <Label>Heart Rate</Label>
                                    <Input value={heartRate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeartRate(e.target.value)} placeholder="72" />
                                </div>
                                <div>
                                    <Label>O2 Saturation</Label>
                                    <Input value={o2Saturation} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setO2Saturation(e.target.value)} placeholder="98" />
                                </div>
                            </div>
                            <Button onClick={saveVitals} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Vitals
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Prescriptions */}
                {patient && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Prescriptions</CardTitle>
                                <Button onClick={addPrescription} className="bg-green-600 hover:bg-green-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Medicine
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {prescriptions.map((prescription, index) => (
                                <div key={prescription.id} className="border p-4 rounded-lg space-y-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Medicine Name"
                                            value={prescription.medicine}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const updated = [...prescriptions]
                                                updated[index] = { ...updated[index], medicine: e.target.value }
                                                setPrescriptions(updated)
                                            }}
                                        />
                                        <Input
                                            placeholder="Dosage"
                                            value={prescription.dosage}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const updated = [...prescriptions]
                                                updated[index] = { ...updated[index], dosage: e.target.value }
                                                setPrescriptions(updated)
                                            }}
                                        />
                                        <Input
                                            placeholder="Frequency"
                                            value={prescription.frequency}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const updated = [...prescriptions]
                                                updated[index] = { ...updated[index], frequency: e.target.value }
                                                setPrescriptions(updated)
                                            }}
                                        />
                                        <Input
                                            placeholder="Duration"
                                            value={prescription.duration}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const updated = [...prescriptions]
                                                updated[index] = { ...updated[index], duration: e.target.value }
                                                setPrescriptions(updated)
                                            }}
                                        />
                                    </div>
                                    <Input
                                        placeholder="Instructions"
                                        value={prescription.instructions}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const updated = [...prescriptions]
                                            updated[index] = { ...updated[index], instructions: e.target.value }
                                            setPrescriptions(updated)
                                        }}
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removePrescription(prescription.id)}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button onClick={savePrescriptions} className="bg-green-600 hover:bg-green-700 w-full" disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                Save All Prescriptions
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
