import axios, { AxiosInstance } from "axios";

// Use your backend port here
const BASE_URL =  process.env.NEXT_PUBLIC_BACKEND_URL;

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Minimal logging interceptor (optional)
    this.api.interceptors.request.use((config) => {
      console.log(`➡️ [Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("❌ API Error:", error.message);
        return Promise.reject(error);
      }
    );
  }

  /* =======================
      WORKER CRUD (Core)
  ======================== */

  async getWorkerDetails() {
    const res = await this.api.get("/api/worker");
    return res.data;
  }

  async getHealthIdCard(health_id:string) {
    const res = await this.api.post("/api/worker/health-card",{health_id:health_id});
    return res.data.healthCard;
  }

  async getWorkerDetailsByDoctor(health_id:string) {
    const res = await this.api.post("/api/patient/health-id",{health_id:health_id},);
    return res.data;
  }

  async getWorkerById(id: string) {
    const res = await this.api.get(`/api/worker/${id}`);
    return res.data;
  }

  async createWorker(workerData: any) {
    const res = await this.api.post("/api/worker", workerData);
    return res.data;
  }

  async updateWorker(id: string, workerData: any) {
    const res = await this.api.put(`/api/worker/${id}`, workerData);
    return res.data;
  }

  async deleteWorker(id: string) {
    const res = await this.api.delete(`/api/worker/${id}`);
    return res.data;
  }

  /* ===========================
       HEALTH RECORD MODULE
  ============================ */

  async getHealthRecord(workerId: string) {
    const res = await this.api.get(`/api/health/${workerId}`);
    return res.data;
  }

  async addHealthRecord(workerId: string, record: any) {
    const res = await this.api.post(`/api/health/${workerId}`, record);
    return res.data;
  }

  async updateHealthRecord(recordId: string, record: any) {
    const res = await this.api.put(`/api/health/record/${recordId}`, record);
    return res.data;
  }

  async deleteHealthRecord(recordId: string) {
    const res = await this.api.delete(`/api/health/record/${recordId}`);
    return res.data;
  }

  /* ===========================
        SEARCH / FILTER
  ============================ */

  async searchWorkers(filters: any) {
    const res = await this.api.get(`/api/worker/search`, { params: filters });
    return res.data;
  }
}

export const apiService = new ApiService();
