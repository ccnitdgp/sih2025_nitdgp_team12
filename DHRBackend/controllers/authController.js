import  authModel  from "../models/authModel.js";
import { generateToken } from "../config/authUtils.js";
import supabase from "../services/supabaseClient.js";

import crypto from "crypto";
import { sendSms } from "../services/snsClient.js";


const otpStore = {};

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}
function hashOtp(otp) {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
}
export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const newUser = await authModel.register(supabase, { email, password, name });
        res.status(201).json({
            success: true,
            user: newUser
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
};
export const doctorLoginUser = async (req, res) => {
    try {
        const { doctor_id, password } = req.body;

        const doctor = await authModel.doctorLogin(supabase, { doctor_id, password });

        // doctorLogin should return null/undefined if credentials are wrong
        if (!doctor) {
            return res.status(401).json({
                success: false,
                message: "Invalid doctor ID or password"
            });
        }

        // If login is valid
        return res.json({
            success: true,
            message: "Login successful",
            doctor: doctor
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
};


export const govLoginUser = async (req, res) => {
    try {
        const { email, password_hash } = req.body;
        const govrnment = await authModel.governmentLogin(supabase, { email, password_hash });
        res.json({
            success: true,
            message: "Login successful",
            gov: govrnment
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({  
            error: "Internal server error",
            details: error.message
        });
    }
};

//otp send /api/auth/send-otp
export const otpSend = async (req, res) => {
    try {
    const { phone } = req.body;
    if (!phone || typeof phone !== "string" || !phone.startsWith("+")) {
      return res.status(400).json({ error: "Phone required in E.164 format (e.g. +919876543210)" });
    }

    // TODO: optional: check phone exists in your DB
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
    const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");
    const ttlMs = 5 * 60 * 1000; // 5 minutes

    otpStore[phone] = {
      otpHash,
      expiresAt: Date.now() + ttlMs,
      attempts: 0
    };

    const message = `Your verification code is: ${otp}. It will expire in 5 minutes.`;

    try {
      const resp = await sendSms(phone, message);
      console.log("SNS MessageId:", resp.MessageId);
    } catch (snsErr) {
      console.error("SNS error:", snsErr);
      delete otpStore[phone]; // cleanup
      return res.status(500).json({ error: "Failed to send SMS" });
    }

    // NOTE: In dev you might want to return the otp for quick testing:
    // return res.json({ success: true, otp }); // debug only
    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


//otp verify
export const otpVerify = async (req, res) => {
    try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: "phone and otp required" });

    const rec = otpStore[phone];
    if (!rec) return res.status(400).json({ error: "No OTP requested for this phone" });

    if (Date.now() > rec.expiresAt) {
      delete otpStore[phone];
      return res.status(400).json({ error: "OTP expired" });
    }

    rec.attempts = (rec.attempts || 0) + 1;
    if (rec.attempts > 5) {
      delete otpStore[phone];
      return res.status(403).json({ error: "Too many attempts" });
    }

    const providedHash = hashOtp(String(otp).trim());
    if (providedHash !== rec.otpHash) {
      return res.status(400).json({ error: "Incorrect OTP" });
    }

     //Fetch user info from DB
        const user = await authModel.getUserByPhone(supabase, phone);
        if (!user) {
            return res.status(404).json({ error: "User not found in database" });
        }

    // success: clear store and respond
    delete otpStore[phone];
    // TODO: create session/JWT as needed
         // Payload for JWT token
        const payload = {
            id: user.id,
            phone: user.phone,
            role: "worker",
        };

        // Generate real JWT
        const token = generateToken(payload);

        return res.json({
            success: true,
            message: "OTP verified successfully",
            token,
            user: payload
        });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}