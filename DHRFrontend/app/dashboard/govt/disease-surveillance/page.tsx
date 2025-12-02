"use client"
import { useState } from "react"

export default function Dashboard() {

  interface District {
  id: number;
  district: string;
  icon: string;
  workers: string;
  liveRisk: string;
  predictedRisk: string;
  highRisk: string;
  color: string;
  }
const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  
  const districts = [
    {
      id: 1,
      district: "Ernakulam",
      icon: "🔴",
      workers: "8,247",
      liveRisk: "Critical - 8.9",
      predictedRisk: "High - 8.7",
      highRisk: "23",
      color: "red",
    },
    {
      id: 2,
      district: "Thrissur",
      icon: "🟠",
      workers: "6,891",
      liveRisk: "High - 8.1",
      predictedRisk: "Moderate - 6.4",
      highRisk: "19",
      color: "orange",
    },
    {
      id: 3,
      district: "Kozhikode",
      icon: "🟡",
      workers: "4,523",
      liveRisk: "Moderate - 6.8",
      predictedRisk: "High - 8.2",
      highRisk: "12",
      color: "yellow",
    },
    {
      id: 4,
      district: "Palakkad",
      icon: "🟡",
      workers: "3,847",
      liveRisk: "Moderate - 5.9",
      predictedRisk: "Low - 3.8",
      highRisk: "9",
      color: "yellow",
    },
    {
      id: 5,
      district: "Kottayam",
      icon: "🟢",
      workers: "2,156",
      liveRisk: "Low - 3.4",
      predictedRisk: "Low - 2.9",
      highRisk: "4",
      color: "green",
    },
    {
      id: 6,
      district: "Thiruvananthapuram",
      icon: "🟢",
      workers: "1,892",
      liveRisk: "Low - 2.8",
      predictedRisk: "Low - 2.3",
      highRisk: "3",
      color: "green",
    },
    {
      id: 7,
      district: "Kannur",
      icon: "🟡",
      workers: "3,412",
      liveRisk: "Moderate - 6.2",
      predictedRisk: "Moderate - 5.7",
      highRisk: "8",
      color: "yellow",
    },
    {
      id: 8,
      district: "Alappuzha",
      icon: "🟢",
      workers: "2,634",
      liveRisk: "Low - 4.1",
      predictedRisk: "Low - 3.6",
      highRisk: "5",
      color: "green",
    },
  ]
  
  const alerts = [
    {
      id: 1,
      type: "critical",
      title: "Critical Safety Violation - Ernakulam",
      description: "Major construction site reported unsafe scaffolding. Immediate inspection required.",
      actions: ["Assign Inspector", "View Details"],
      time: "5 mins ago",
      icon: "⚠️",
      bgColor: "#fef2f2",
      borderColor: "#fca5a5",
    },
    {
      id: 2,
      type: "warning",
      title: "Health Complaint Spike - Kozhikode",
      description: "Fish processing zone reports 12 new respiratory complaints in the last 24 hours.",
      actions: ["Schedule Inspection", "View Details"],
      time: "23 mins ago",
      icon: "🔶",
      bgColor: "#fef3c7",
      borderColor: "#fcd34d",
    },
    {
      id: 3,
      type: "info",
      title: "AI Prediction Alert - Thrissur",
      description: "AI model predicts 70% probability of safety incident in industrial zone within 48 hours.",
      actions: ["Deploy Prevention Team", "View Details"],
      time: "1 hour ago",
      icon: "ℹ️",
      bgColor: "#eff6ff",
      borderColor: "#93c5fd",
    },
    {
      id: 4,
      type: "success",
      title: "Compliance Improvement - Palakkad",
      description: "Manufacturing belt achieved 98% safety compliance rate, up from 87% last month.",
      actions: ["View Report", "Share Success"],
      time: "3 hours ago",
      icon: "✓",
      bgColor: "#f0fdf4",
      borderColor: "#86efac",
    },
  ]
  const stats = [
    { value: "99.7%", label: "System Uptime", badge: "Live", bgColor: "#2563eb", change: "↑ 0.3% from last month" },
    { value: "1,247", label: "Active Monitors", badge: "Active", bgColor: "#16a34a", change: "↑ 12% increase" },
    { value: "847", label: "Predictions Made", badge: "AI", bgColor: "#a855f7", change: "↑ 91.4% accuracy" },
    { value: "2.3 hrs", label: "Response Time", badge: "Avg", bgColor: "#f97316", change: "↓ 18% faster" },
  ]

  const riskTrendData = [
    { week: "Week 1", liveRisk: 2.3, predictedRisk: 2.1 },
    { week: "Week 2", liveRisk: 4.5, predictedRisk: 3.8 },
    { week: "Week 3", liveRisk: 6.2, predictedRisk: 5.9 },
    { week: "Week 4", liveRisk: 8.5, predictedRisk: 8.2 },
  ]

  const workerDistributionData = [
    { name: "Breakdown", value: 27 },
    { name: "Unbroken", value: 29 },
    { name: "Others", value: 20 },
    { name: "Maintenance", value: 15 },
    { name: "Unassigned", value: 9 },
  ]

  const incidentCategoriesData = [
    { name: "Construction", value: 120 },
    { name: "Non-injury", value: 85 },
    { name: "Slip/Trips", value: 62 },
    { name: "Sprains", value: 45 },
    { name: "Other", value: 38 },
  ]

  const workerDistributionColors = ["#3b82f6", "#06b6d4", "#f59e0b", "#a855f7", "#6366f1"]
  const incidentCategoriesColors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4"]

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
          line-height: 1.6;
        }
        main {
          min-height: 100vh;
          background-color: #f8fafc;
        }
        .content-wrapper {
          padding: 2rem;
          margin: 0 auto;
        }
        .card {
          background-color: white;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .card-title h2 {
          font-size: 1.125rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        .card-title p {
          font-size: 0.875rem;
          color: #64748b;
        }
        .card-actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn {
          padding: 0.5rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #475569;
          background-color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #f1f5f9;
        }
        table {
          width: 100%;
          font-size: 0.875rem;
          border-collapse: collapse;
        }
        thead {
          border-bottom: 1px solid #e2e8f0;
          background-color: #f8fafc;
        }
        th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-weight: 600;
          color: #475569;
        }
        tbody tr {
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.2s;
        }
        tbody tr:hover {
          background-color: #f8fafc;
        }
        td {
          padding: 1rem;
          color: #475569;
        }
        .district-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          color: #1e293b;
        }
        .badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .badge-red {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        .badge-orange {
          background-color: #fed7aa;
          color: #b45309;
        }
        .badge-yellow {
          background-color: #fef3c7;
          color: #b45309;
        }
        .badge-green {
          background-color: #dcfce7;
          color: #166534;
        }
        .view-details-link {
          color: #2563eb;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
          border: none;
          background: none;
          padding: 0;
        }
        .view-details-link:hover {
          color: #1d4ed8;
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        .pagination-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .btn-next {
          padding: 0.5rem 1rem;
          background-color: #16a34a;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-next:hover {
          background-color: #15803d;
        }
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .chart-card {
          background-color: white;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          min-height: 320px;
          position: relative;
        }
        .chart-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
          width: 100%;
        }
        .chart-container {
          width: 100%;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .alerts-section {
          background-color: white;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .alerts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .alerts-title h3 {
          font-size: 1.125rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        .alerts-title p {
          font-size: 0.875rem;
          color: #64748b;
        }
        .view-all-btn {
          padding: 0.5rem 1rem;
          background-color: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .view-all-btn:hover {
          background-color: #fecaca;
        }
        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .alert-item {
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 4px solid #ccc;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .alert-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        .alert-content {
          flex: 1;
        }
        .alert-title {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
          font-size: 0.95rem;
        }
        .alert-description {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }
        .alert-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .alert-action-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: #2563eb;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .alert-action-link:hover {
          color: #1d4ed8;
        }
        .alert-time {
          font-size: 0.875rem;
          color: #94a3b8;
          flex-shrink: 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
          width: 100%;
        }
        .stat-card {
          border-radius: 1rem;
          padding: 2rem;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.25);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 150px;
          height: 150px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(40%, -40%);
        }
        .stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }
        .stat-badge {
          font-size: 0.75rem;
          font-weight: 600;
          background-color: rgba(255, 255, 255, 0.15);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          position: relative;
          z-index: 1;
        }
        .stat-label {
          font-size: 0.95rem;
          opacity: 0.95;
          position: relative;
          z-index: 1;
          font-weight: 500;
        }
        .stat-change {
          font-size: 0.8rem;
          opacity: 0.85;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 50;
        }
        .modal {
          background-color: white;
          border-radius: 0.5rem;
          width: 100%;
          max-width: 56rem;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          position: sticky;
          top: 0;
          background-color: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-header-content h2 {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1e293b;
        }
        .modal-header-content p {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.25rem;
        }
        .modal-close-btn {
          padding: 0.5rem;
          background-color: transparent;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .modal-close-btn:hover {
          background-color: #f1f5f9;
        }
        .modal-content {
          padding: 2rem;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .metric-card {
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
        }
        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .metric-icon {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .metric-icon-blue {
          background-color: #dbeafe;
          color: #2563eb;
        }
        .metric-icon-emerald {
          background-color: #d1fae5;
          color: #059669;
        }
        .metric-icon-yellow {
          background-color: #fef3c7;
          color: #d97706;
        }
        .metric-icon-red {
          background-color: #fee2e2;
          color: #dc2626;
        }
        .metric-icon-purple {
          background-color: #e9d5ff;
          color: #a855f7;
        }
        .metric-change {
          font-size: 0.75rem;
          font-weight: 600;
        }
        .change-green {
          color: #16a34a;
        }
        .change-gray {
          color: #64748b;
        }
        .metric-value {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        .metric-label {
          font-size: 0.75rem;
          color: #64748b;
        }
        .timeline-section {
          background-color: #f8fafc;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          padding: 1.5rem;
        }
        .timeline-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .timeline-title h3 {
          font-size: 1.125rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        .timeline-title p {
          font-size: 0.875rem;
          color: #64748b;
        }
        .view-all-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: #2563eb;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        .view-all-link:hover {
          color: #1d4ed8;
        }
        .timeline-events {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .timeline-event {
          display: flex;
          gap: 1rem;
        }
        .timeline-event-icon {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 0.25rem;
          font-size: 1.25rem;
        }
        .event-icon-red {
          background-color: #fee2e2;
          color: #dc2626;
        }
        .event-icon-blue {
          background-color: #dbeafe;
          color: #2563eb;
        }
        .event-icon-green {
          background-color: #dcfce7;
          color: #16a34a;
        }
        .event-icon-yellow {
          background-color: #fef3c7;
          color: #d97706;
        }
        .timeline-event-content {
          flex: 1;
          min-width: 0;
        }
        .timeline-event-header {
          display: flex;
          align-items: start;
          justify-content: space-between;
        }
        .event-title {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }
        .event-description {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.25rem;
        }
        .event-badges {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }
        .event-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .event-badge-red {
          background-color: #fee2e2;
          color: #b91c1c;
        }
        .event-badge-blue {
          background-color: #dbeafe;
          color: #1e40af;
        }
        .event-badge-green {
          background-color: #dcfce7;
          color: #15803d;
        }
        .event-badge-gray {
          background-color: #f3f4f6;
          color: #374151;
        }
        .event-badge-emerald {
          background-color: #d1fae5;
          color: #065f46;
        }
        .event-time {
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          flex-shrink: 0;
        }
        .event-time-red {
          color: #dc2626;
        }
        .chart-menu {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          padding: 0.5rem;
          cursor: pointer;
          font-size: 1.25rem;
        }
      `}</style>
      <main>
        {/* CONTENT */}
        <div className="content-wrapper">
          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Risk Trend Analysis Chart */}
            <div className="chart-card" style={{ position: "relative" }}>
              <div className="chart-title">Risk Trend Analysis</div>
              <div className="chart-menu">⋮</div>
              <svg width="100%" height="240" viewBox="0 0 280 200" style={{ marginTop: "0.5rem" }}>
                <defs>
                  <linearGradient id="gridGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f0f4f8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f8fafc" stopOpacity="1" />
                  </linearGradient>
                </defs>
                {/* Background */}
                <rect width="280" height="200" fill="url(#gridGrad)" />
                {/* Grid lines */}
                <line x1="20" y1="150" x2="260" y2="150" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="20" y1="110" x2="260" y2="110" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="20" y1="70" x2="260" y2="70" stroke="#e2e8f0" strokeWidth="1" />
                {/* Live Risk Line (red) */}
                <polyline points="30,140 90,110 150,80 210,40" fill="none" stroke="#ef4444" strokeWidth="2" />
                {/* Predicted Risk Line (blue dashed) */}
                <polyline
                  points="30,145 90,120 150,95 210,60"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                {/* X-axis labels */}
                <text x="30" y="175" fontSize="12" fill="#64748b" textAnchor="middle">
                  W1
                </text>
                <text x="90" y="175" fontSize="12" fill="#64748b" textAnchor="middle">
                  W2
                </text>
                <text x="150" y="175" fontSize="12" fill="#64748b" textAnchor="middle">
                  W3
                </text>
                <text x="210" y="175" fontSize="12" fill="#64748b" textAnchor="middle">
                  W4
                </text>
                {/* Y-axis labels */}
                <text x="12" y="155" fontSize="11" fill="#64748b" textAnchor="end">
                  2.5
                </text>
                <text x="12" y="115" fontSize="11" fill="#64748b" textAnchor="end">
                  5
                </text>
                <text x="12" y="75" fontSize="11" fill="#64748b" textAnchor="end">
                  7.5
                </text>
              </svg>
              <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <div style={{ width: "12px", height: "2px", backgroundColor: "#ef4444" }}></div>
                  <span style={{ color: "#64748b" }}>Live Risk</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "2px",
                      backgroundColor: "#3b82f6",
                      borderTop: "1px dashed #3b82f6",
                    }}
                  ></div>
                  <span style={{ color: "#64748b" }}>Predicted Risk</span>
                </div>
              </div>
            </div>

            {/* Worker Distribution Chart */}
            <div className="chart-card" style={{ position: "relative" }}>
              <div className="chart-title">Worker Distribution</div>
              <div className="chart-menu">⋮</div>
              <svg width="100%" height="240" viewBox="0 0 280 200" style={{ marginTop: "0.5rem" }}>
                {/* Pie Chart */}
                <circle cx="100" cy="100" r="70" fill="#3b82f6" />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="35"
                  strokeDasharray="48.7 307"
                  strokeDashoffset="0"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="35"
                  strokeDasharray="48.7 307"
                  strokeDashoffset="-48.7"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="35"
                  strokeDasharray="38.4 307"
                  strokeDashoffset="-97.4"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="35"
                  strokeDasharray="28.0 307"
                  strokeDashoffset="-135.8"
                />
                {/* Labels */}
                <text x="160" y="80" fontSize="11" fontWeight="600" fill="#1e293b">
                  Breakdown
                </text>
                <text x="160" y="95" fontSize="10" fill="#64748b">
                  27%
                </text>
                <text x="160" y="115" fontSize="11" fontWeight="600" fill="#1e293b">
                  Unbroken
                </text>
                <text x="160" y="130" fontSize="10" fill="#64748b">
                  29%
                </text>
              </svg>
            </div>

            {/* Incident Categories Chart */}
            <div className="chart-card" style={{ position: "relative" }}>
              <div className="chart-title">Incident Categories</div>
              <div className="chart-menu">⋮</div>
              <svg width="100%" height="240" viewBox="0 0 280 200" style={{ marginTop: "0.5rem" }}>
                {/* Bars */}
                <rect x="20" y="60" width="35" height="100" fill="#ef4444" />
                <rect x="65" y="90" width="35" height="70" fill="#f97316" />
                <rect x="110" y="110" width="35" height="50" fill="#eab308" />
                <rect x="155" y="130" width="35" height="30" fill="#22c55e" />
                <rect x="200" y="140" width="35" height="20" fill="#06b6d4" />
                {/* Labels */}
                <text x="37" y="175" fontSize="10" fill="#64748b" textAnchor="middle">
                  Construction
                </text>
                <text x="82" y="175" fontSize="10" fill="#64748b" textAnchor="middle">
                  Non-injury
                </text>
                <text x="127" y="175" fontSize="10" fill="#64748b" textAnchor="middle">
                  Slip/Trips
                </text>
                <text x="172" y="175" fontSize="10" fill="#64748b" textAnchor="middle">
                  Sprains
                </text>
                <text x="217" y="175" fontSize="10" fill="#64748b" textAnchor="middle">
                  Other
                </text>
                {/* Y-axis */}
                <line x1="15" y1="20" x2="15" y2="160" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="15" y1="160" x2="250" y2="160" stroke="#cbd5e1" strokeWidth="1" />
                {/* Y-axis labels */}
                <text x="10" y="165" fontSize="10" fill="#64748b" textAnchor="end">
                  0
                </text>
                <text x="10" y="125" fontSize="10" fill="#64748b" textAnchor="end">
                  50
                </text>
                <text x="10" y="85" fontSize="10" fill="#64748b" textAnchor="end">
                  100
                </text>
              </svg>
            </div>
          </div>
          {/* District Table */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">
                  <h2>District-wise Risk Summary</h2>
                  <p>Comprehensive overview of worker safety metrics across all districts</p>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn">📊 Filter</button>
                <button className="btn">📈 Sort</button>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>DISTRICT</th>
                    <th>WORKER COUNT</th>
                    <th>LIVE RISK SCORE</th>
                    <th>PREDICTED RISK SCORE</th>
                    <th>HIGH-RISK WORKSITES</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {districts.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="district-cell">
                          <span>{item.icon}</span>
                          <span>{item.district}</span>
                        </div>
                      </td>
                      <td>{item.workers}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.color === "red"
                              ? "badge-red"
                              : item.color === "orange"
                                ? "badge-orange"
                                : item.color === "yellow"
                                  ? "badge-yellow"
                                  : "badge-green"
                          }`}
                        >
                          {item.liveRisk}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.predictedRisk.includes("High") || item.predictedRisk.includes("Critical")
                              ? "badge-red"
                              : item.predictedRisk.includes("Moderate")
                                ? "badge-yellow"
                                : "badge-green"
                          }`}
                        >
                          {item.predictedRisk}
                        </span>
                      </td>
                      <td>{item.highRisk}</td>
                      <td>
                        <button onClick={() => setSelectedDistrict(item)} className="view-details-link">
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <p style={{ fontSize: "0.875rem", color: "#64748b" }}>Showing 8 of 14 districts</p>
              <div className="pagination-buttons">
                <button className="btn">Previous</button>
                <button className="btn-next">Next</button>
              </div>
            </div>
          </div>
          {/* Active Alerts & Notifications */}
          <div className="alerts-section">
            <div className="alerts-header">
              <div className="alerts-title">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "#dc2626" }}>🚨</span>
                  <h3>Active Alerts & Notifications</h3>
                </div>
                <p>Real-time updates on critical safety issues</p>
              </div>
              <button className="view-all-btn">View All Alerts</button>
            </div>
            <div className="alerts-list">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="alert-item"
                  style={{
                    backgroundColor: alert.bgColor,
                    borderLeftColor: alert.borderColor,
                  }}
                >
                  <div className="alert-icon">{alert.icon}</div>
                  <div className="alert-content">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-description">{alert.description}</div>
                    <div className="alert-actions">
                      {alert.actions.map((action, idx) => (
                        <a key={idx} className="alert-action-link">
                          {action}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="alert-time">{alert.time}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Stats Grid */}
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card" style={{ backgroundColor: stat.bgColor }}>
                <div className="stat-header">
                  <div></div>
                  <div className="stat-badge">{stat.badge}</div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-change">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>
        {/* MODAL - DISTRICT DETAILS */}
        {selectedDistrict && (
          <div className="modal-overlay">
            <div className="modal">
              {/* Modal Header */}
              <div className="modal-header">
                <div className="modal-header-content">
                  <h2>{selectedDistrict.district}</h2>
                  <p>District-wise detailed analysis and metrics</p>
                </div>
                <button onClick={() => setSelectedDistrict(null)} className="modal-close-btn">
                  ✕
                </button>
              </div>
              {/* Modal Content */}
              <div className="modal-content">
                {/* METRICS GRID */}
                <div className="metrics-grid">
                  {/* Total Workers */}
                  <div className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon metric-icon-blue">👥</div>
                      <span className="metric-change change-green">+12%</span>
                    </div>
                    <p className="metric-value">{selectedDistrict.workers}</p>
                    <p className="metric-label">Total Registered Workers</p>
                  </div>
                  {/* Active Worksites */}
                  <div className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon metric-icon-emerald">📖</div>
                      <span className="metric-change change-green">+8%</span>
                    </div>
                    <p className="metric-value">3,847</p>
                    <p className="metric-label">Active Worksites</p>
                  </div>
                  {/* Active Complaints */}
                  <div className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon metric-icon-yellow">⚠️</div>
                      <span className="metric-change change-gray">-</span>
                    </div>
                    <p className="metric-value">247</p>
                    <p className="metric-label">Active Complaints</p>
                  </div>
                  {/* Critical Risk Zones */}
                  <div className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon metric-icon-red">🚨</div>
                      <span className="metric-change change-gray">-</span>
                    </div>
                    <p className="metric-value">18</p>
                    <p className="metric-label">Critical Risk Zones</p>
                  </div>
                  {/* Safety Compliance Rate */}
                  <div className="metric-card">
                    <div className="metric-header">
                      <div className="metric-icon metric-icon-purple">📈</div>
                      <span className="metric-change change-green">+8%</span>
                    </div>
                    <p className="metric-value">94.2%</p>
                    <p className="metric-label">Safety Compliance Rate</p>
                  </div>
                </div>
                {/* RECENT ACTIVITY TIMELINE */}
                <div className="timeline-section">
                  <div className="timeline-header">
                    <div className="timeline-title">
                      <h3>Recent Activity Timeline</h3>
                      <p>Latest updates and system events</p>
                    </div>
                    <a className="view-all-link">View All</a>
                  </div>
                  <div className="timeline-events">
                    {/* Critical Alert */}
                    <div className="timeline-event">
                      <div className="timeline-event-icon event-icon-red">🚨</div>
                      <div className="timeline-event-content">
                        <div className="timeline-event-header">
                          <div>
                            <div className="event-title">Critical Alert Triggered</div>
                            <p className="event-description">
                              Safety violation detected at Construction Site B-247, {selectedDistrict.district} district
                            </p>
                            <div className="event-badges">
                              <span className="event-badge event-badge-red">Critical</span>
                              <span className="event-badge event-badge-blue">Inspection Required</span>
                            </div>
                          </div>
                          <span className="event-time event-time-red">5 minutes ago</span>
                        </div>
                      </div>
                    </div>
                    {/* AI Prediction */}
                    <div className="timeline-event">
                      <div className="timeline-event-icon event-icon-blue">⚡</div>
                      <div className="timeline-event-content">
                        <div className="timeline-event-header">
                          <div>
                            <div className="event-title">AI Prediction Generated</div>
                            <p className="event-description">
                              New 7-day risk forecast completed for all districts with 91.4% accuracy
                            </p>
                            <div className="event-badges">
                              <span className="event-badge event-badge-blue">AI Analysis</span>
                              <span className="event-badge event-badge-emerald">Forecast Available</span>
                            </div>
                          </div>
                          <span className="event-time">23 minutes ago</span>
                        </div>
                      </div>
                    </div>
                    {/* Inspection Completed */}
                    <div className="timeline-event">
                      <div className="timeline-event-icon event-icon-green">✓</div>
                      <div className="timeline-event-content">
                        <div className="timeline-event-header">
                          <div>
                            <div className="event-title">Inspection Completed</div>
                            <p className="event-description">
                              Inspector Rajesh Kumar completed routine inspection at Site A-189,{" "}
                              {selectedDistrict.district}
                            </p>
                            <div className="event-badges">
                              <span className="event-badge event-badge-green">Completed</span>
                              <span className="event-badge event-badge-gray">No Issues Found</span>
                            </div>
                          </div>
                          <span className="event-time">1 hour ago</span>
                        </div>
                      </div>
                    </div>
                    {/* New Complaint */}
                    <div className="timeline-event">
                      <div className="timeline-event-icon event-icon-yellow">📖</div>
                      <div className="timeline-event-content">
                        <div className="timeline-event-header">
                          <div>
                            <div className="event-title">New Complaint Filed</div>
                            <p className="event-description">
                              Worker health complaint registered for Fish Processing Zone, {selectedDistrict.district}
                            </p>
                            <div className="event-badges">
                              <span className="event-badge" style={{ backgroundColor: "#fef3c7", color: "#b45309" }}>
                                Pending Review
                              </span>
                              <span className="event-badge" style={{ backgroundColor: "#fef3c7", color: "#b45309" }}>
                                Health & Safety
                              </span>
                            </div>
                          </div>
                          <span className="event-time">2 hours ago</span>
                        </div>
                      </div>
                    </div>
                    {/* Training Session */}
                    <div className="timeline-event">
                      <div className="timeline-event-icon" style={{ backgroundColor: "#e9d5ff", color: "#a855f7" }}>
                        📖
                      </div>
                      <div className="timeline-event-content">
                        <div className="timeline-event-header">
                          <div>
                            <div className="event-title">Training Session Scheduled</div>
                            <p className="event-description">
                              Safety training program scheduled for 150 workers in {selectedDistrict.district}{" "}
                              manufacturing belt
                            </p>
                            <div className="event-badges">
                              <span className="event-badge" style={{ backgroundColor: "#e9d5ff", color: "#7e22ce" }}>
                                Training
                              </span>
                              <span className="event-badge" style={{ backgroundColor: "#e9d5ff", color: "#7e22ce" }}>
                                Dec 15, 2024
                              </span>
                            </div>
                          </div>
                          <span className="event-time">3 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
