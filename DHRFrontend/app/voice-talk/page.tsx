"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Square, Volume2, Copy, Trash2 } from "lucide-react"

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

const languages = [
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "kn", name: "Kannada" },
  { code: "or", name: "Odia" },
  { code: "ml", name: "Malayalam" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
  { code: "bn", name: "Bengali" },
  { code: "pa", name: "Punjabi" },
  { code: "ur", name: "Urdu" },
  { code: "en", name: "English" },
]

const languageMap: { [key: string]: string } = {
  auto: "auto-detect",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  or: "Odia",
  ml: "Malayalam",
  mr: "Marathi",
  gu: "Gujarati",
  bn: "Bengali",
  pa: "Punjabi",
  ur: "Urdu",
  en: "English",
}

interface HistoryItem {
  id: number
  original: string
  translated: string
  sourceLanguage: string
  targetLanguage: string
  timestamp: string
}

interface TranslationResult {
  original: string
  translated: string
}

export default function VoiceTalkPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sourceLanguage, setSourceLanguage] = useState("auto")
  const [targetLanguage, setTargetLanguage] = useState("hi")
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speakError, setSpeakError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const savedHistory = localStorage.getItem("translationHistory")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to load history:", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("translationHistory", JSON.stringify(history))
  }, [history])

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      window.speechSynthesis.cancel()
    }
  }, [])

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        resolve(base64String.split(",")[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
      setIsRecording(false)
    } else {
      try {
        // Clear any previous errors
        setError(null)
        setSpeakError(null)

        // Request microphone permission and start recording
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true
          }
        })
        streamRef.current = stream

        // Initialize MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        })
        mediaRecorderRef.current = mediaRecorder
        audioChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstart = () => {
          console.log('Audio recording started')
          setIsRecording(true)
          setIsLoading(false)
        }

        mediaRecorder.onstop = async () => {
          console.log('Audio recording stopped')
          setIsRecording(false)

          try {
            // Convert audio chunks to base64
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
            const base64Audio = await blobToBase64(audioBlob)

            setIsLoading(true)

            // Send audio to API for transcription and translation
            const data = await makeAPICall({
              audio: base64Audio,
              sourceLanguage,
              targetLanguage,
            })

            setTranslationResult(data)

            const newHistory: HistoryItem = {
              id: Date.now(),
              original: data.original,
              translated: data.translated,
              sourceLanguage,
              targetLanguage,
              timestamp: new Date().toISOString(),
            }
            setHistory([newHistory, ...history.slice(0, 49)])

            // Auto-play after translation
            setTimeout(() => {
              handleSpeak(data.translated, targetLanguage)
            }, 500)

          } catch (apiError) {
            console.error('Translation API error:', apiError)
            setError(apiError instanceof Error ? apiError.message : "Translation failed")
          } finally {
            setIsLoading(false)
          }

          // Stop all tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
          }
        }

        mediaRecorder.onerror = (event: any) => {
          console.error('MediaRecorder error:', event.error)
          setError('Audio recording failed. Please try again.')
          setIsRecording(false)
          setIsLoading(false)

          // Stop all tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
          }
        }

        // Start recording
        console.log('Starting audio recording...')
        setIsLoading(true)
        mediaRecorder.start()

        // Auto-stop after 10 seconds to prevent long recordings
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop()
          }
        }, 10000)

      } catch (error) {
        console.error("Error accessing microphone:", error)
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            setError('Microphone access denied. Please allow microphone access in your browser settings.')
          } else if (error.name === 'NotFoundError') {
            setError('No microphone found. Please check your audio devices.')
          } else {
            setError('Failed to access microphone. Please check your browser settings.')
          }
        } else {
          setError('Failed to initialize audio recording. Please try again.')
        }
        setIsLoading(false)
      }
    }
  }

  const makeAPICall = async (body: object, maxRetries = 3) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        if (response.status === 429) {
          if (attempt < maxRetries - 1) {
            const waitTime = Math.min(1000 * Math.pow(2, attempt), 8000)
            console.log(`[v0] Rate limited. Retrying in ${waitTime}ms...`)
            await new Promise((resolve) => setTimeout(resolve, waitTime))
            continue
          } else {
            throw new Error(
              "API rate limit exceeded. Please wait a moment and try again. Consider getting a paid Gemini API key for higher limits.",
            )
          }
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Translation failed")
        }

        return await response.json()
      } catch (err) {
        if (attempt === maxRetries - 1) throw err
      }
    }
  }



  const getLanguageCode = (lang: string) => {
    const codeMap: { [key: string]: string } = {
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      kn: "kn-IN",
      or: "or-IN",
      ml: "ml-IN",
      mr: "mr-IN",
      gu: "gu-IN",
      bn: "bn-IN",
      pa: "pa-IN",
      ur: "ur-PK",
      en: "en-US",
    }
    return codeMap[lang] || "en-US"
  }

  const handleSpeak = (text: string, lang: string) => {
    setSpeakError(null)

    if (!("speechSynthesis" in window)) {
      setSpeakError("Speech synthesis not supported in your browser")
      return
    }

    try {
      setIsSpeaking(true)
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      const localeMap: { [key: string]: string } = {
        hi: "hi-IN",
        ta: "ta-IN",
        te: "te-IN",
        kn: "kn-IN",
        or: "or-IN",
        ml: "ml-IN",
        mr: "mr-IN",
        gu: "gu-IN",
        bn: "bn-IN",
        pa: "pa-IN",
        ur: "ur-PK",
        en: "en-US",
      }

      const targetLocale = localeMap[lang] || "en-US"
      utterance.lang = targetLocale
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1

      const voices = window.speechSynthesis.getVoices()
      console.log("[v0] Available voices count:", voices.length)
      console.log("[v0] Target locale:", targetLocale)
      console.log(
        "[v0] All voices:",
        voices.map((v) => `${v.name} (${v.lang})`),
      )

      // Try to find exact match, then language match, then Google voice, then fallback
      let selectedVoice = voices.find((voice) => voice.lang === targetLocale)

      if (!selectedVoice) {
        selectedVoice = voices.find((voice) => voice.lang.startsWith(targetLocale.split("-")[0]))
      }

      if (!selectedVoice) {
        selectedVoice = voices.find((voice) => voice.name.includes("Google"))
      }

      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[0]
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice
        console.log("[v0] Using voice:", selectedVoice.name, selectedVoice.lang)
      }

      utterance.onstart = () => {
        console.log("[v0] Speech started")
      }

      utterance.onend = () => {
        console.log("[v0] Speech ended")
        setIsSpeaking(false)
      }

      utterance.onerror = (event) => {
        console.error("[v0] Speech error:", event.error)
        setSpeakError(
          `Speech synthesis not available for ${languageMap[lang] || lang}. Try English or check browser settings.`,
        )
        setIsSpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    } catch (err) {
      console.error("[v0] Speak error:", err)
      setSpeakError(err instanceof Error ? err.message : "Failed to play audio")
      setIsSpeaking(false)
    }
  }

  const handleCopy = () => {
    if (translationResult) {
      navigator.clipboard.writeText(translationResult.translated)
    }
  }

  const handleHistorySelect = (item: HistoryItem) => {
    setTranslationResult({
      original: item.original,
      translated: item.translated,
    })
    setSourceLanguage(item.sourceLanguage)
    setTargetLanguage(item.targetLanguage)
    setSpeakError(null)
  }

  const handleClearHistory = () => {
    setHistory([])
    localStorage.removeItem("translationHistory")
  }

  const getLanguageName = (code: string) => {
    return languages.find((l) => l.code === code)?.name || code
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="flex gap-6 min-h-screen px-4 py-8">
          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 mb-3">
                Voice Communication
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Record, translate, and listen instantly</p>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-md">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8">
                {/* Language Selection */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
                    <select
                      value={sourceLanguage}
                      onChange={(e) => setSourceLanguage(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="auto">Auto-detect</option>
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Indicator */}
                {(isRecording || isLoading) && (
                  <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        {isRecording ? "Recording... Speak now" : isLoading ? "Translating... Please wait" : ""}
                      </p>
                    </div>
                  </div>
                )}

                {/* Record Button */}
                <div className="flex justify-center mb-8">
                  <button
                    onClick={handleToggleRecording}
                    disabled={isLoading}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
                    </div>
                    {isRecording && (
                      <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-pulse" />
                    )}
                  </button>
                </div>

                {/* Translation Result */}
                {translationResult && (
                  <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    {/* Original Text */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Original ({getLanguageName(sourceLanguage)})
                      </p>
                      <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed break-words">
                          {translationResult.original}
                        </p>
                      </div>
                    </div>

                    {/* Translated Text */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Translation ({getLanguageName(targetLanguage)})
                      </p>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                        <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed break-words">
                          {translationResult.translated}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => handleSpeak(translationResult.translated, targetLanguage)}
                        disabled={isSpeaking}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:opacity-75 font-medium text-sm"
                      >
                        <Volume2 className="w-4 h-4" />
                        {isSpeaking ? "Playing..." : "Listen"}
                      </button>
                      <button
                        onClick={handleCopy}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors font-medium text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                    </div>

                    {/* Speech Error */}
                    {speakError && (
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-yellow-700 dark:text-yellow-400 text-xs">{speakError}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Footer Info */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8">
                Powered by Gemini API • Works on modern browsers
              </p>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="w-80 hidden lg:flex flex-col">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">History</h2>
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-red-500 hover:text-red-600"
                    title="Clear all history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">No translations yet</p>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistorySelect(item)}
                      className="w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-slate-600"
                    >
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        {getLanguageName(item.sourceLanguage)} → {getLanguageName(item.targetLanguage)}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white truncate font-medium">{item.original}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">{item.translated}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                {history.length} / 50 translations
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
