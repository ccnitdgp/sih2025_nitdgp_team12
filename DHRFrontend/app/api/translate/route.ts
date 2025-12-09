<<<<<<< HEAD
// DHRFrontend/app/api/translate/route.ts (Next.js App Router API Route)

import { NextResponse } from "next/server";

// This is the URL of your main Express API running on the backend
// You might need to change the port based on your DHRBackend setup (e.g., 3001)
const BACKEND_API_URL = process.env.DHR_BACKEND_URL || "http://localhost:5000";

export async function POST(request: Request) {
=======
import { NextRequest, NextResponse } from 'next/server'
const BASE_URL =  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/translate';
export async function POST(request: NextRequest) {
>>>>>>> 504f43d964c0fa33bb0b3e4e5db4932f382dc3ad
  try {
    // 1. Get the JSON payload from the React component
    const body = await request.json();
    const { audio, sourceLanguage, targetLanguage } = body;

    if (!audio || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required fields (audio, sourceLanguage, targetLanguage)" },
        { status: 400 }
      );
    }
    
    // 2. Forward the request to your main DHRBackend API
    const backendResponse = await fetch(`${BACKEND_API_URL}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // **IMPORTANT:** If authentication is required for your backend, 
        // you would include a token here (e.g., Authorization: `Bearer ${token}`)
      },
      body: JSON.stringify(body),
    });

    // 3. Check the backend response status
    if (!backendResponse.ok) {
      // Re-throw the backend error to be caught below
      const errorData = await backendResponse.json();
      throw new Error(errorData.error || `Backend error: ${backendResponse.statusText}`);
    }

    // 4. Send the successful translation result back to the frontend component
    const translationResult = await backendResponse.json();
    return NextResponse.json(translationResult, { status: 200 });

  } catch (error) {
    console.error("Next.js API Error (translate):", error);
    // Send a generic 500 error back to the client
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred during translation." },
      { status: 500 }
    );
  }
}