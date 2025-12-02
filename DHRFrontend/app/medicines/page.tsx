"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, Pill, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function MedicinesPage() {
  const [schedule, setSchedule] = useState<{
    [key: string]: {
      morning: boolean
      afternoon: boolean
      evening: boolean
    }
  }>({
    metformin: { morning: true, afternoon: false, evening: true },
    lisinopril: { morning: true, afternoon: false, evening: false }
  })

  const toggleTime = (medicine: string, time: string) => {
    setSchedule(prev => ({
      ...prev,
      [medicine]: {
        ...prev[medicine],
        [time]: !prev[medicine][time as keyof typeof prev[typeof medicine]]
      }
    }))
    setSchedule((prev) => {
      const currentMedicineSchedule = prev[medicine]
      const updatedMedicineSchedule = {
        ...currentMedicineSchedule,
        // The key 'time' is now safely applied to a specific schedule object
        [time]: !currentMedicineSchedule[time as keyof typeof currentMedicineSchedule],
      };
      return { ...prev, [medicine]: updatedMedicineSchedule }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Next Reminder Alert */}
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-400 rounded-full p-2">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Next Reminder</h3>
              <p className="text-gray-700">Metformin 500mg - Morning dose</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-orange-600 font-semibold">In 2 hours</p>
            <p className="text-sm text-gray-600">Push + SMS notification</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Prescriptions</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <div className="bg-blue-500 rounded-full p-2">
                  <Pill className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-gray-900">6/8</p>
                </div>
                <div className="bg-green-500 rounded-full p-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Doses</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <div className="bg-orange-500 rounded-full p-2">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Missed Doses</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
                <div className="bg-red-500 rounded-full p-2">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Medicines */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Today's Medicines</h2>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Mark All as Taken</Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Metformin */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500 rounded-lg p-3">
                      <Pill className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Metformin</h3>
                      <p className="text-gray-600">500mg • 30 days remaining</p>
                      <p className="text-sm text-gray-500">Prescribed by Dr. Sarah Johnson</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ Active</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Morning</p>
                      <p className="text-sm text-gray-600">8:00 AM</p>
                    </div>
                    <Switch
                      checked={schedule.metformin.morning}
                      onCheckedChange={() => toggleTime("metformin", "morning")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Afternoon</p>
                      <p className="text-sm text-gray-600">2:00 PM</p>
                    </div>
                    <Switch
                      checked={schedule.metformin.afternoon}
                      onCheckedChange={() => toggleTime("metformin", "afternoon")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Evening</p>
                      <p className="text-sm text-gray-600">8:00 PM</p>
                    </div>
                    <Switch
                      checked={schedule.metformin.evening}
                      onCheckedChange={() => toggleTime("metformin", "evening")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lisinopril */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500 rounded-lg p-3">
                      <Pill className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Lisinopril</h3>
                      <p className="text-gray-600">10mg • 45 days remaining</p>
                      <p className="text-sm text-gray-500">Prescribed by Dr. Michael Chen</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ Active</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Morning</p>
                      <p className="text-sm text-gray-600">9:00 AM</p>
                    </div>
                    <Switch
                      checked={schedule.lisinopril.morning}
                      onCheckedChange={() => toggleTime("lisinopril", "morning")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Evening</p>
                      <p className="text-sm text-gray-600">9:00 PM</p>
                    </div>
                    <Switch
                      checked={schedule.lisinopril.evening}
                      onCheckedChange={() => toggleTime("lisinopril", "evening")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
