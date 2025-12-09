import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import workerRoutes from "./routes/workerRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import vitalsRoutes from "./routes/vitalsRoutes.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { corsOptions } from "./config/corsConfig.js";
const app = express();


// Actual CORS middleware
app.use(cors(corsOptions));




// Enhanced JSON parsing with better error handling
app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    // Ensure we're parsing JSON properly
    if (req.url.includes('/api/translate') && req.method === 'POST') {
      try {
        JSON.parse(buf.toString());
      } catch (e) {
        throw new Error('Invalid JSON in request body');
      }
    }
  }
}));

// Raw body parser for specific endpoints if needed
app.use(express.raw({ type: 'application/json', limit: '10mb' }));

app.get("/", (req, res) => {
  res.send("Hello, welcome to Digital Health Record Backend");
});

// Test route to verify JSON parsing
app.post("/api/test-json", (req, res) => {
  console.log("Test JSON received:", {
    bodyType: typeof req.body,
    bodyKeys: req.body ? Object.keys(req.body) : 'undefined',
    bodyContent: req.body
  });
  res.json({
    success: true,
    received: req.body,
    type: typeof req.body
  });
});

// API Routes
app.use("/api/worker", workerRoutes);
app.use("/api/translate", translateRoutes);


// Doctor Dashboard Routes
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/vitals", vitalsRoutes);
app.use("/api/medical-record", medicalRecordRoutes);
app.use("/api/appointment", appointmentRoutes);

app.use("/api/auth",authRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000/");
  console.log("Available routes:");
  console.log("  - /api/worker");
  console.log("  - /api/translate");
  console.log("  - /api/doctor");
  console.log("  - /api/patient");
  console.log("  - /api/prescription");
  console.log("  - /api/vitals");
  console.log("  - /api/medical-record");
  console.log("  - /api/appointment");
});
