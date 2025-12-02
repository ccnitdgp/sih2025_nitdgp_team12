"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";

// Props interface for future backend integration
interface MapDataPoint {
  lat: number;
  lng: number;
  district: string;
  block: string;
  intensity: number;
}

interface HeatmapProps {
  data: MapDataPoint[];
  apiKey?: string;
}

export const KeralaHeatmapEnhanced = ({ data }: HeatmapProps) => {
  const [radius, setRadius] = useState(30);

  // Color mapping based on intensity
  const getDistrictColor = (intensity: number) => {
    if (intensity >= 80) return "bg-red-500";
    if (intensity >= 60) return "bg-orange-400";
    if (intensity >= 40) return "bg-yellow-400";
    return "bg-green-400";
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 80) return "High Risk";
    if (intensity >= 60) return "Moderate Risk";
    if (intensity >= 40) return "Rising Cases";
    return "Healthy";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Kerala Districts Overview</h3>
          <p className="text-sm text-gray-600">Worker health & density distribution</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-700">Sensitivity</div>
          <Slider
            value={[radius]}
            onValueChange={(v) => setRadius(v[0])}
            max={60}
            min={10}
            step={5}
            className="w-24"
          />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((district) => (
              <div
                key={district.district}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{district.district}</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getDistrictColor(district.intensity)}`}></div>
                    <span className="text-xs text-gray-600">{district.intensity}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-900">{getIntensityLabel(district.intensity)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Main Area:</span>
                    <span className="text-gray-900">{district.block}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getDistrictColor(district.intensity)}`}
                      style={{ width: `${district.intensity}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Districts:</span>
                <span className="font-semibold">{data.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">High Risk:</span>
                <span className="font-semibold text-red-600">
                  {data.filter(d => d.intensity >= 80).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Moderate Risk:</span>
                <span className="font-semibold text-orange-500">
                  {data.filter(d => d.intensity >= 60 && d.intensity < 80).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Healthy:</span>
                <span className="font-semibold text-green-600">
                  {data.filter(d => d.intensity < 60).length}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-700">High Risk (80%+)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 rounded"></div>
                <span className="text-sm text-gray-700">Moderate Risk (60-79%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span className="text-sm text-gray-700">Rising Cases (40-59%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span className="text-sm text-gray-700">Healthy (Below 40%)</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Recent Alerts</h4>
            <div className="space-y-2">
              <div className="text-sm text-red-600">• Ernakulam: Increased health screening required</div>
              <div className="text-sm text-orange-500">• Thiruvananthapuram: Monitor worker camps</div>
              <div className="text-sm text-gray-600">• Kozhikode: Routine health check completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export component that can be used without props
const KeralaHeatmap = () => {
  // Mock data for Kerala districts
  const defaultData: MapDataPoint[] = [
    { lat: 9.9312, lng: 76.2673, district: "Ernakulam", block: "Kochi", intensity: 85 },
    { lat: 8.5241, lng: 76.9366, district: "Thiruvananthapuram", block: "Thiruvananthapuram", intensity: 92 },
    { lat: 11.2588, lng: 75.7804, district: "Kozhikode", block: "Kozhikode", intensity: 78 },
    { lat: 10.5276, lng: 76.2144, district: "Thrissur", block: "Thrissur", intensity: 71 },
    { lat: 9.3731, lng: 76.5224, district: "Alappuzha", block: "Alappuzha", intensity: 65 },
    { lat: 11.8745, lng: 75.3704, district: "Kannur", block: "Kannur", intensity: 58 },
    { lat: 8.5100, lng: 76.8724, district: "Kollam", block: "Kollam", intensity: 62 },
    { lat: 9.7719, lng: 76.6417, district: "Kottayam", block: "Kottayam", intensity: 55 },
  ];

  return <KeralaHeatmapEnhanced data={defaultData} />;
};

export default KeralaHeatmap;
