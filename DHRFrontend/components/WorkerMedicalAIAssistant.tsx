"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, ArrowRightLeft, Globe, Loader2, Copy, Check, AlertCircle, X, RefreshCw, MessageSquare, Bot, Stethoscope } from 'lucide-react';


const GEMINI_API_KEY = process.env.NEXT_PUBLIC_WORKER_DASHBOARD_GEMINI_API_KEY || "";

// === TypeScript Definitions ===
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    webkitAudioContext: typeof AudioContext
  }
}

interface Language {
  name: string
  code: string
  speechCode: string
}

interface ConversationEntry {
  id: number;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: string;
  isAiResponse?: boolean; // New flag to distinguish AI chats
}

// === Language Data ===
const LANGUAGES: Language[] = [
  { name: 'Hindi', code: 'hi', speechCode: 'hi-IN' },
  { name: 'Bengali', code: 'bn', speechCode: 'bn-IN' },
  { name: 'Tamil', code: 'ta', speechCode: 'ta-IN' },
  { name: 'Telugu', code: 'te', speechCode: 'te-IN' },
  { name: 'Marathi', code: 'mr', speechCode: 'mr-IN' },
  { name: 'Gujarati', code: 'gu', speechCode: 'gu-IN' },
  { name: 'Kannada', code: 'kn', speechCode: 'kn-IN' },
  { name: 'Malayalam', code: 'ml', speechCode: 'ml-IN' },
  { name: 'Punjabi', code: 'pa', speechCode: 'pa-IN' },
  { name: 'English', code: 'en', speechCode: 'en-GB' },
  { name: 'Spanish', code: 'es', speechCode: 'es-ES' },
  { name: 'French', code: 'fr', speechCode: 'fr-FR' },
  { name: 'German', code: 'de', speechCode: 'de-DE' },
  { name: 'Japanese', code: 'ja', speechCode: 'ja-JP' },
  { name: 'Chinese', code: 'zh', speechCode: 'zh-CN' },
  { name: 'Russian', code: 'ru', speechCode: 'ru-RU' },
];

interface WorkerMedicalAIAssistantProps {
  compact?: boolean; // For dashboard integration
}

export default function WorkerMedicalAIAssistant({ compact = false }: WorkerMedicalAIAssistantProps) {
  // === State Management ===
  const [mode, setMode] = useState<'translate' | 'ai'>('ai'); // Default to AI mode

  const [sourceLang, setSourceLang] = useState<Language>(LANGUAGES[9]); 
  const [targetLang, setTargetLang] = useState<Language>(LANGUAGES[0]); 
  
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([]);

  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  // === VISUALIZER STATE ===
  const [audioLevel, setAudioLevel] = useState<number[]>(new Array(5).fill(10)); 

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // === Refs ===
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  // === 1. Load Voices ===
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // === 2. Initialize Speech Recognition ===
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false; 
      recognition.interimResults = true; 
      recognition.lang = sourceLang.speechCode;

      recognition.onstart = () => {
        setIsListening(true);
        setPermissionError(false);
        setStatusMessage('');
      };

      recognition.onend = () => {
        stopVisualizer();
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        stopVisualizer();
        setIsListening(false);
        if (event.error === 'no-speech') {
           setStatusMessage('No speech detected.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
           setPermissionError(true);
        } else {
           setStatusMessage('Error: ' + event.error);
        }
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript || interimTranscript) {
          setInputText(finalTranscript || interimTranscript);
        }

        if (finalTranscript) {
          if (mode === 'translate') {
              handleManualTranslate(finalTranscript, sourceLang, targetLang, true);
          } else {
              handleGeminiQuery(finalTranscript, sourceLang, true); // Send to AI
          }
        }
      };

      recognitionRef.current = recognition;
    }
  }, [sourceLang, targetLang, mode]); 

  // === 3. Visualizer Logic ===
  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64; 
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      sourceRef.current = source;

      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        const indices = [2, 6, 10, 14, 18]; 
        const levels = indices.map(i => dataArray[i]);
        setAudioLevel(levels);
        rafIdRef.current = requestAnimationFrame(animate);
      };
      animate();
    } catch (err) {
      console.error("Visualizer error:", err);
    }
  };

  const stopVisualizer = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (sourceRef.current) {
      sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) audioContextRef.current.close();
    setAudioLevel([10, 10, 10, 10, 10]);
  };

  // === 4. Auto Scroll ===
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);


  // === Logic Handlers ===

  // --- A. TRANSLATION LOGIC ---
  const handleManualTranslate = async (text: string, srcLang: Language, trgLang: Language, isAuto = false) => {
    if (!text || isLoading) return;
    setIsLoading(true);
    if (!isAuto) setInputText(''); 

    try {
      const langPair = `${srcLang.code}|${trgLang.code}`; 
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
      const response = await fetch(url);
      const data = await response.json();

      let result = data.responseData ? data.responseData.translatedText : "Translation Error.";

      setTranslatedText(result);
      
      const newEntry: ConversationEntry = {
        id: Date.now(),
        sourceText: text,
        translatedText: result,
        sourceLang: srcLang.name,
        targetLang: trgLang.name,
        timestamp: new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'}),
        isAiResponse: false
      };
      
      setConversationHistory(prev => [...prev.slice(-49), newEntry]); 
      
      if (result !== "Translation Error.") {
          setTimeout(() => speakText(result, trgLang.speechCode), 600);
      }
    } catch (error) {
      setTranslatedText("Network Error.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- B. GEMINI AI LOGIC (FINAL FIX: gemini-2.5-flash) ---
  const handleGeminiQuery = async (text: string, lang: Language, isAuto = false) => {
      if (!text || isLoading) return;
      setIsLoading(true);
      if (!isAuto) setInputText('');

      try {
          if (!GEMINI_API_KEY || GEMINI_API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
              setTranslatedText("Please add your actual Gemini API Key in the environment variables!");
              setIsLoading(false);
              return;
          }

          // Combined Prompt (for reliable instruction delivery across models)
          const fullPrompt = `
          System: You are a compassionate, helpful medical AI assistant for migrant workers. 
          Your goal is to answer health-related queries simply and clearly. 
          IMPORTANT: Answer STRICTLY in the ${lang.name} language. 
          Keep the answer short (under 2 sentences) and simple.
          User Query: ${text}`;

          // Using the highly available model 'gemini-2.5-flash'
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
          
          const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  contents: [{ parts: [{ text: fullPrompt }] }]
              })
          });

          const data = await response.json();
          let aiResponse = "AI Error.";
          
          if (data.candidates && data.candidates[0].content) {
              aiResponse = data.candidates[0].content.parts[0].text;
          } else if (data.error) {
              console.error("Gemini Error:", data.error);
              aiResponse = `Error: API Key Issue or Access Denied for this model. (${data.error.message})`;
          }

          setTranslatedText(aiResponse);

          const newEntry: ConversationEntry = {
              id: Date.now(),
              sourceText: text,
              translatedText: aiResponse,
              sourceLang: "Worker",
              targetLang: "AI Assistant",
              timestamp: new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'}),
              isAiResponse: true
          };

          setConversationHistory(prev => [...prev.slice(-49), newEntry]);

          if (aiResponse !== "AI Error." && !aiResponse.startsWith("Error:")) {
              setTimeout(() => speakText(aiResponse, lang.speechCode), 600); 
          }

      } catch (error) {
          console.error("Network Error:", error);
          setTranslatedText("AI Network Error. Check your internet connection.");
      } finally {
          setIsLoading(false);
      }
  };

  // --- COMMON LOGIC ---
  const toggleListening = async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        startVisualizer();
        setTranslatedText(''); 
        setInputText('');
        setPermissionError(false);
        setStatusMessage('');
      } catch (err) {
        stopVisualizer();
      }
    }
  };

  const handleMicInteraction = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (inputText && !isListening) {
        if (mode === 'translate') {
            handleManualTranslate(inputText, sourceLang, targetLang, false);
        } else {
            handleGeminiQuery(inputText, sourceLang, false);
        }
        return;
    }
    
    if (isListening) {
        toggleListening();
        return;
    }

    if (e.detail === 1) {
        clickTimeoutRef.current = setTimeout(() => toggleListening(), 250);
    } else if (e.detail === 2) {
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
        if (mode === 'translate') {
            setIsSwapping(true);
            setTimeout(() => setIsSwapping(false), 500); 
            setTranslatedText(''); 
            setInputText('');
            swapLanguages();
        }
    }
  };
  
  const speakText = (text: string, langCode: string) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    const indianLangCodes = ['ta', 'te', 'gu', 'kn', 'ml', 'mr', 'pa', 'bn'];
    const shortLang = langCode.split('-')[0];
    let voice = availableVoices.find(v => v.lang === langCode);
    if (!voice) voice = availableVoices.find(v => v.lang.startsWith(shortLang));

    const isIndianAndMissing = indianLangCodes.includes(shortLang) && (!voice || !voice.name.toLowerCase().includes(shortLang));

    if (voice && !isIndianAndMissing) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.voice = voice;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    } else {
        const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&tl=${shortLang}&q=${encodeURIComponent(text)}`;
        const audio = new Audio(googleTTSUrl);
        audioRef.current = audio;
        audio.play().catch(e => console.error(e));
    }
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const clearAll = () => {
    setInputText('');
    setTranslatedText('');
    setStatusMessage('');
    setConversationHistory([]); 
    window.speechSynthesis.cancel();
    if (audioRef.current) audioRef.current.pause();
    stopVisualizer();
  };

  const copyToClipboard = (text: string) => { 
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // === COMPACT DASHBOARD VERSION ===
  if (compact) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Compact Header */}
        <div className={`p-4 text-white flex justify-between items-center ${mode === 'ai' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
          <div className="flex items-center gap-2">
              {mode === 'ai' ? <Bot className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
              <h3 className="font-bold text-lg">{mode === 'ai' ? 'AI Health Assistant' : 'Medical Translator'}</h3>
          </div>
          <button onClick={clearAll} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Mode Toggle */}
        <div className="p-2 bg-slate-100 dark:bg-slate-700">
          <div className="flex bg-black/20 p-1 rounded-lg">
             <button 
                onClick={() => setMode('translate')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'translate' ? 'bg-white text-blue-600' : 'text-blue-100 hover:bg-white/10'}`}
             >
                <ArrowRightLeft className="w-3 h-3" /> Translation
             </button>
             <button 
                onClick={() => setMode('ai')}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'ai' ? 'bg-white text-indigo-600' : 'text-indigo-100 hover:bg-white/10'}`}
             >
                <Bot className="w-3 h-3" /> Ask AI Bot
             </button>
          </div>
        </div>

        {/* Compact Language Selector (Hidden in AI mode) */}
        {mode === 'translate' && (
          <div className="p-3 bg-slate-50 dark:bg-slate-700">
            <div className="flex items-center justify-between text-sm">
              <select 
                value={sourceLang.code}
                onChange={(e) => {
                    const l = LANGUAGES.find(lang => lang.code === e.target.value);
                    if(l) setSourceLang(l);
                }}
                className="bg-transparent font-bold text-blue-700 dark:text-blue-400 outline-none cursor-pointer text-xs"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-800">{lang.name}</option>
                ))}
              </select>
              <button onClick={swapLanguages} className="p-1 bg-white dark:bg-slate-600 rounded-full shadow-sm">
                  <ArrowRightLeft className="w-3 h-3" />
              </button>
              <select 
                value={targetLang.code}
                onChange={(e) => {
                    const l = LANGUAGES.find(lang => lang.code === e.target.value);
                    if(l) setTargetLang(l);
                }}
                className="bg-transparent font-bold text-blue-700 dark:text-blue-400 outline-none cursor-pointer text-xs"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="dark:bg-slate-800">{lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Compact Input Area */}
        <div className="p-4 space-y-3">
          {permissionError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 p-2 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>Allow microphone access!</span>
            </div>
          )}

          {/* Input Text */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening..." : mode === 'ai' ? "Ask health question..." : "Speak in source language..."}
              className={`w-full h-20 p-3 pr-10 bg-white dark:bg-slate-700 border rounded-xl focus:ring-2 focus:ring-blue-100 outline-none resize-none text-sm ${
                isListening ? 'border-red-500 ring-2 ring-red-50' : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {inputText && (
              <button onClick={() => setInputText('')} className="absolute top-2 right-2 text-slate-300 hover:text-slate-500">
                  <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
             <button 
                onClick={() => mode === 'translate' ? handleManualTranslate(inputText, sourceLang, targetLang) : handleGeminiQuery(inputText, sourceLang)}
                disabled={!inputText || isLoading || isListening}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white shadow-md transition-all text-sm ${
                    !inputText || isLoading || isListening 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : mode === 'ai' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'
                }`}
             >
                {isLoading && !isListening ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4"/>}
                {isLoading && !isListening ? 'Processing...' : (mode === 'ai' ? 'Ask AI' : 'Translate')}
             </button>

             <button 
                onClick={handleMicInteraction}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all border-2 ${
                  isListening 
                    ? 'bg-white border-red-500 scale-105' 
                    : mode === 'ai' 
                        ? 'bg-indigo-600 border-indigo-100 text-white hover:scale-105'
                        : 'bg-blue-600 border-blue-100 text-white hover:scale-105'
                }`}
              >
                {isListening ? (
                    <div className="flex items-end justify-center gap-1 h-6 px-1">
                        {audioLevel.map((level, index) => (
                           <div key={index} className="w-1 bg-red-500 rounded-full transition-all duration-100" style={{ height: `${Math.max(15, Math.min(100, (level / 255) * 100))}%` }}></div>
                        ))}
                    </div>
                ) : (
                    <Mic className="w-6 h-6" />
                )}
             </button>
          </div>

          {/* Output Area */}
          {translatedText && (
            <div className={`p-3 rounded-xl border-2 ${
              mode === 'ai' ? 'bg-indigo-50 border-indigo-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-2">
                {translatedText}
              </div>
              <div className="flex justify-end gap-2">
                <button 
                onClick={() => copyToClipboard(translatedText)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white dark:bg-slate-700 text-xs font-semibold text-slate-600"
                >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
                <button 
                onClick={() => speakText(translatedText, mode === 'ai' ? sourceLang.speechCode : targetLang.speechCode)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-white ${mode === 'ai' ? 'bg-indigo-600' : 'bg-blue-600'}`}
                >
                <Volume2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === FULL VERSION (for standalone use) ===
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col lg:flex-row items-start justify-center p-4 font-sans text-slate-800 dark:text-slate-100 gap-6">
      
      {/* Main Interface */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-[85vh] transition-all">
        
        {/* Header with Mode Switcher */}
        <div className={`p-5 text-white flex flex-col gap-4 relative overflow-hidden shrink-0 transition-colors duration-500 ${mode === 'ai' ? 'bg-indigo-600' : 'bg-blue-600'}`}>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-2">
                {mode === 'ai' ? <Bot className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                <h1 className="text-xl font-bold">{mode === 'ai' ? 'AI Health Assistant' : 'Medical Translator'}</h1>
            </div>
            <button onClick={clearAll} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Clear All">
                <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Toggle Buttons */}
          <div className="relative z-10 flex bg-black/20 p-1 rounded-xl">
             <button 
                onClick={() => setMode('translate')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'translate' ? 'bg-white text-blue-600 shadow-md' : 'text-blue-100 hover:bg-white/10'}`}
             >
                <ArrowRightLeft className="w-4 h-4" /> Translation
             </button>
             <button 
                onClick={() => setMode('ai')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'ai' ? 'bg-white text-indigo-600 shadow-md' : 'text-indigo-100 hover:bg-white/10'}`}
             >
                <Bot className="w-4 h-4" /> Ask AI Bot
             </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Error Banner */}
          {permissionError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Allow microphone access! 🔒</span>
            </div>
          )}

          {/* Language Selectors */}
          <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-xl flex items-center justify-between shadow-inner relative overflow-hidden">
            
            {/* Left Side (Always User/Doctor) */}
            <div className={`${mode === 'ai' ? 'w-full' : 'w-[45%]'} text-center transition-all duration-300`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    {mode === 'ai' ? 'Worker\'s Native Language' : 'Doctor (Source)'}
                </p>
                <select 
                  value={sourceLang.code}
                  onChange={(e) => {
                      const l = LANGUAGES.find(lang => lang.code === e.target.value);
                      if(l) setSourceLang(l);
                  }}
                  className="bg-transparent font-bold text-blue-700 dark:text-blue-400 w-full outline-none cursor-pointer text-sm p-1 rounded-lg z-10 text-center"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code} className="dark:bg-slate-800">{lang.name}</option>
                  ))}
                </select>
            </div>

            {/* Middle & Right Side (Hidden in AI Mode) */}
            {mode === 'translate' && (
                <>
                    <div className="relative flex items-center justify-center w-8 h-8">
                    <button onClick={swapLanguages} className={`p-1 bg-white dark:bg-slate-600 rounded-full shadow-md text-slate-500 dark:text-slate-200 hover:text-blue-600 z-20 transition-all duration-300 ${isSwapping ? 'rotate-[360deg] scale-110 bg-blue-100 text-blue-600' : ''}`}>
                        <ArrowRightLeft className="w-4 h-4" />
                    </button>
                    </div>

                    <div className="w-[45%] text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">Patient (Target)</p>
                        <select 
                        value={targetLang.code}
                        onChange={(e) => {
                            const l = LANGUAGES.find(lang => lang.code === e.target.value);
                            if(l) setTargetLang(l);
                        }}
                        className="bg-transparent font-bold text-blue-700 dark:text-blue-400 w-full outline-none cursor-pointer text-sm p-1 rounded-lg z-10 text-center"
                        >
                        {LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code} className="dark:bg-slate-800">{lang.name}</option>
                        ))}
                        </select>
                    </div>
                </>
            )}
          </div>

          {/* Input Box */}
          <div className="relative group">
            <label className={`text-sm font-bold uppercase tracking-wider mb-2 block pl-2 transition-colors ${isListening ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
              {isListening ? 'LIVE LISTENING...' : mode === 'ai' ? `Ask query in ${sourceLang.name}` : `${sourceLang.name} Input`}
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? "Listening..." : mode === 'ai' ? "Tap mic and ask health question..." : "Tap Mic to Speak..."}
                className={`
                  w-full h-32 p-4 pr-12 bg-white dark:bg-slate-700 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 outline-none resize-none transition-all text-lg font-medium leading-relaxed
                  ${isListening ? 'border-red-500 shadow-lg shadow-red-100 dark:shadow-red-900/20 ring-4 ring-red-50 dark:ring-red-900/30' : 'border-slate-100 dark:border-slate-600 shadow-sm'} 
                `}
              />
               {inputText && (
                <button onClick={() => setInputText('')} className="absolute top-3 right-3 text-slate-300 hover:text-slate-500 dark:hover:text-slate-200">
                    <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Area */}
          <div className="flex justify-between items-center relative z-20">
             <button 
                onClick={() => mode === 'translate' ? handleManualTranslate(inputText, sourceLang, targetLang) : handleGeminiQuery(inputText, sourceLang)}
                disabled={!inputText || isLoading || isListening}
                className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-md transition-all duration-200
                    ${!inputText || isLoading || isListening 
                        ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed' 
                        : mode === 'ai' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300' : 'bg-green-600 hover:bg-green-700 shadow-green-300'
                    }
                `}
             >
                {isLoading && !isListening ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'ai' ? <Bot className="w-5 h-5"/> : <MessageSquare className="w-5 h-5" />}
                {isLoading && !isListening ? (mode === 'ai' ? 'Thinking...' : 'Translating...') : (mode === 'ai' ? 'Ask AI' : 'Log It')}
             </button>

             <button 
                onClick={handleMicInteraction}
                className={`
                  relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 border-4 select-none overflow-hidden
                  ${isListening 
                    ? 'bg-white border-red-500 scale-105 shadow-red-200' 
                    : mode === 'ai' 
                        ? 'bg-indigo-600 border-indigo-100 dark:border-indigo-900 text-white hover:scale-105 hover:bg-indigo-700 shadow-indigo-200'
                        : 'bg-blue-600 border-blue-100 dark:border-blue-900 text-white hover:scale-105 hover:bg-blue-700 shadow-blue-200'
                  }
                `}
              >
                {isListening ? (
                    <div className="flex items-end justify-center gap-1 h-10 w-full px-2">
                        {audioLevel.map((level, index) => (
                           <div key={index} className="w-2 bg-red-500 rounded-full transition-all duration-100 ease-in-out" style={{ height: `${Math.max(15, Math.min(100, (level / 255) * 100))}%`, opacity: 0.8 }}></div>
                        ))}
                    </div>
                ) : (
                    <Mic className="w-8 h-8 pointer-events-none" />
                )}
             </button>
          </div>
          
          {/* Output Box */}
          <div className="relative pt-4">
             <label className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 block pl-2">
              {mode === 'ai' ? 'AI Answer' : `Patient Output (${targetLang.name})`}
            </label>
            <div className={`
              w-full min-h-[6rem] h-auto p-4 rounded-2xl border-2 transition-all flex flex-col justify-between
              ${translatedText 
                ? mode === 'ai' ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}
            `}>
               {isLoading && !isListening ? (
                  <div className={`flex-1 flex items-center justify-center gap-2 ${mode === 'ai' ? 'text-indigo-400' : 'text-blue-400'}`}>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">{mode === 'ai' ? 'AI is thinking...' : 'Translating...'}</span>
                  </div>
                ) : (
                  <div className="text-lg font-medium text-slate-800 dark:text-slate-100 leading-relaxed min-h-[3rem]">
                    {translatedText || <span className="text-slate-300 dark:text-slate-600">{mode === 'ai' ? 'AI answer appears here' : 'Patient\'s translation appears here'}</span>}
                  </div>
                )}

                {translatedText && (
                    <div className={`flex justify-end gap-2 mt-2 pt-2 border-t ${mode === 'ai' ? 'border-indigo-100 dark:border-indigo-800' : 'border-blue-100 dark:border-blue-800'}`}>
                        <button 
                        onClick={() => copyToClipboard(translatedText)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:text-blue-600 dark:hover:text-blue-400"
                        >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <button 
                        onClick={() => speakText(translatedText, mode === 'ai' ? sourceLang.speechCode : targetLang.speechCode)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-colors ${mode === 'ai' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                        <Volume2 className="w-3 h-3" /> Listen
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar: Log */}
      <div className="w-full lg:w-80 flex flex-col h-[85vh] shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 flex flex-col h-full border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">History</h2>
              <button onClick={clearAll} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-500">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {conversationHistory.length === 0 ? (
                <p className="text-sm text-slate-400 text-center pt-8">Log will appear here.</p>
              ) : (
                conversationHistory.map((entry) => (
                    <div 
                        key={entry.id} 
                        className={`p-3 rounded-xl shadow-sm transition-colors border ${
                            entry.isAiResponse 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200' 
                                : entry.sourceLang === sourceLang.name
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200' 
                                    : 'bg-green-50 dark:bg-green-900/30 border-green-200'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${
                                entry.isAiResponse ? 'text-indigo-600' : entry.sourceLang === sourceLang.name ? 'text-blue-600' : 'text-green-600'
                            }`}>
                                {entry.isAiResponse ? 'AI ASSISTANT' : `${entry.sourceLang} → ${entry.targetLang}`}
                            </p>
                            <span className="text-[10px] text-slate-500">{entry.timestamp}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
                            {entry.sourceText}
                        </p>
                        <p className="text-sm italic text-slate-600 dark:text-slate-300">
                            {entry.translatedText}
                        </p>
                    </div>
                ))
              )}
              <div ref={historyEndRef} />
            </div>
          </div>
      </div>
    </div>
  );
}