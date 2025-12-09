// API Service for Doctor Dashboard Backend
// Base URL for all API calls

import { verify } from "crypto";

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
async function handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}

// Doctor APIs
export const doctorAPI = {
    // Login doctor
    login: async (doctorId, password) => {
        const response = await fetch(`${API_BASE_URL}/doctor/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctor_id: doctorId, password })
        });
        return handleResponse(response);
    },

    // Get doctor profile
    getProfile: async (doctorId) => {
        const response = await fetch(`${API_BASE_URL}/doctor/profile/${doctorId}`);
        return handleResponse(response);
    },

    // Get doctor statistics
    getStats: async (doctorId) => {
        const response = await fetch(`${API_BASE_URL}/doctor/${doctorId}/stats`);
        return handleResponse(response);
    }
};

// Patient APIs
export const patientAPI = {
    // Get patient by ID
    getById: async (patientId) => {
        const response = await fetch(`${API_BASE_URL}/patient/${patientId}`);
        return handleResponse(response);
    },

    // Get patient by Health ID
    getByHealthId: async (healthId) => {
        const response = await fetch(`${API_BASE_URL}/patient/healthId/${healthId}`);
        return handleResponse(response);
    },

    // Get patient history
    getHistory: async (patientId) => {
        const response = await fetch(`${API_BASE_URL}/patient/${patientId}/history`);
        return handleResponse(response);
    },

    // Update patient
    update: async (patientId, data) => {
        const response = await fetch(`${API_BASE_URL}/patient/${patientId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    getHealthCard: async (healthId) => {
        const response = await fetch(`${API_BASE_URL}/patient/healthCard`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ healthId })
        });
         return handleResponse(response);
    }

};

// Prescription APIs
export const prescriptionAPI = {
    // Create prescription
    create: async (prescriptionData) => {
        const response = await fetch(`${API_BASE_URL}/prescription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prescriptionData)
        });
        return handleResponse(response);
    },

    // Create multiple prescriptions
    createBulk: async (patientId, doctorId, medicalRecordId, prescriptions) => {
        const response = await fetch(`${API_BASE_URL}/prescription/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patient_id: patientId, doctor_id: doctorId, medical_record_id: medicalRecordId, prescriptions })
        });
        return handleResponse(response);
    },

    // Get patient prescriptions
    getByPatient: async (patientId) => {
        const response = await fetch(`${API_BASE_URL}/prescription/patient/${patientId}`);
        return handleResponse(response);
    },

    // Update prescription
    update: async (prescriptionId, data) => {
        const response = await fetch(`${API_BASE_URL}/prescription/${prescriptionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // Delete prescription
    delete: async (prescriptionId) => {
        const response = await fetch(`${API_BASE_URL}/prescription/${prescriptionId}`, {
            method: 'DELETE'
        });
        return handleResponse(response);
    }
};

// Vitals APIs
export const vitalsAPI = {
    // Record vitals
    record: async (vitalsData) => {
        const response = await fetch(`${API_BASE_URL}/vitals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vitalsData)
        });
        return handleResponse(response);
    },

    // Get patient vitals
    getByPatient: async (patientId) => {
        const response = await fetch(`${API_BASE_URL}/vitals/patient/${patientId}`);
        return handleResponse(response);
    },

    // Get latest vitals
    getLatest: async (patientId) => {
        const response = await fetch(`${API_BASE_URL}/vitals/patient/${patientId}/latest`);
        return handleResponse(response);
    },

    // Update vitals
    update: async (vitalsId, data) => {
        const response = await fetch(`${API_BASE_URL}/vitals/${vitalsId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    }
};

// Medical Record APIs
export const medicalRecordAPI = {
    // Create medical record
    create: async (recordData) => {
        const response = await fetch(`${API_BASE_URL}/medical-record`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recordData)
        });
        return handleResponse(response);
    },

    // Get patient records
    getByPatient: async (patientId) => {
        const response = await fetch(`${API_BASE_URL}/medical-record/patient/${patientId}`);
        return handleResponse(response);
    },

    // Get active record
    getActive: async (patientId) => {
        const response = await fetch(`${API_BASE_URL}/medical-record/patient/${patientId}/active`);
        return handleResponse(response);
    },

    // Get comprehensive record
    getComprehensive: async (recordId) => {
        const response = await fetch(`${API_BASE_URL}/medical-record/${recordId}/comprehensive`);
        return handleResponse(response);
    },

    // Update record
    update: async (recordId, data) => {
        const response = await fetch(`${API_BASE_URL}/medical-record/${recordId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // Add file
    addFile: async (recordId, fileData) => {
        const response = await fetch(`${API_BASE_URL}/medical-record/${recordId}/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fileData)
        });
        return handleResponse(response);
    },

    // Complete record
    complete: async (recordId) => {
        const response = await fetch(`${API_BASE_URL}/medical-record/${recordId}/complete`, {
            method: 'POST'
        });
        return handleResponse(response);
    }
};

// Appointment APIs
export const appointmentAPI = {
    // Create appointment
    create: async (appointmentData) => {
        const response = await fetch(`${API_BASE_URL}/appointment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        });
        return handleResponse(response);
    },

    // Get patient appointments
    getByPatient: async (patientId) => {
        const response = await fetch(`${API_BASE_URL}/appointment/patient/${patientId}`);
        return handleResponse(response);
    },

    // Get doctor appointments
    getByDoctor: async (doctorId) => {
        const response = await fetch(`${API_BASE_URL}/appointment/doctor/${doctorId}`);
        return handleResponse(response);
    },

    // Get upcoming appointments
    getUpcoming: async (doctorId) => {
        const response = await fetch(`${API_BASE_URL}/appointment/doctor/${doctorId}/upcoming`);
        return handleResponse(response);
    },

    // Update appointment
    update: async (appointmentId, data) => {
        const response = await fetch(`${API_BASE_URL}/appointment/${appointmentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // Cancel appointment
    cancel: async (appointmentId, reason, cancelledBy = 'doctor') => {
        const response = await fetch(`${API_BASE_URL}/appointment/${appointmentId}/cancel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason, cancelled_by: cancelledBy })
        });
        return handleResponse(response);
    },

    // Complete appointment
    complete: async (appointmentId) => {
        const response = await fetch(`${API_BASE_URL}/appointment/${appointmentId}/complete`, {
            method: 'POST'
        });
        return handleResponse(response);
    }
};

export const authenication={

   otpSend: async(phone)=>{
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(phone)
        });
        return handleResponse(response);

   },

   verifyOtp : async(phone,otp)=>{
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({phone,otp})
        });
        return handleResponse(response);
    },

    doctorLogin: async(doctorId, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/doctorLogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ doctor_id: doctorId, password })
        });
        return handleResponse(response);
    },
     governmentLogin: async(email, password_hash) => {
        const response = await fetch(`${API_BASE_URL}/auth/governmentLogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password_hash })
        });
        return handleResponse(response);
    },
}
// Export all APIs
export default {
    doctor: doctorAPI,
    patient: patientAPI,
    prescription: prescriptionAPI,
    vitals: vitalsAPI,
    medicalRecord: medicalRecordAPI,
    appointment: appointmentAPI,
    auth:authenication
};
