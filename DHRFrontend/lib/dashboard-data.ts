// /lib/dashboard-data.ts

// 1. Interfaces (Needed for types)
export interface DataItem { name: string; value: number; }
export interface DistrictData { name: string; workers: number; cases: number; coverage: number; status: 'critical' | 'warning' | 'safe'; }

// 2. Data Generator
export const generateRandomData = (count: number, min: number, max: number) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

// 3. Static Data Definitions (Moved outside the component)
export const districtsData: DistrictData[] = [
    { name: "Ernakulam", workers: 100414, cases: 2890, coverage: 15, status: "critical" },
    { name: "Thrissur", workers: 78230, cases: 1890, coverage: 12, status: "critical" },
    { name: "Kochi", workers: 65450, cases: 1560, coverage: 14, status: "warning" },
    { name: "Palakkad", workers: 54320, cases: 1210, coverage: 18, status: "warning" },
    { name: "Kozhikode", workers: 48760, cases: 980, coverage: 16, status: "safe" },
    { name: "Kannur", workers: 38940, cases: 760, coverage: 19, status: "safe" },
];

export const originStatesData = [
    { name: "West Bengal", percentage: 40.8 },
    { name: "Assam", percentage: 16.5 },
    { name: "Odisha", percentage: 11.0 },
    { name: "Bihar", percentage: 9.8 },
    { name: "Others", percentage: 21.9 },
];

export const diseaseBreakdownData: DataItem[] = [
    { name: "TB/Respiratory", value: 45 },
    { name: "Vector Borne", value: 30 },
    { name: "Water Borne", value: 15 },
    { name: "Skin", value: 10 },
];