import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { audio, sourceLanguage, targetLanguage } = body

    if (!audio) {
      return NextResponse.json({ error: "Audio data is required" }, { status: 400 })
    }

    // Proxy the request to the backend
    const backendResponse = await fetch('http://localhost:5000/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio,
        sourceLanguage,
        targetLanguage,
      }),
    })

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json()
      return NextResponse.json(errorData, { status: backendResponse.status })
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Translation failed' },
      { status: 500 }
    )
  }
}
