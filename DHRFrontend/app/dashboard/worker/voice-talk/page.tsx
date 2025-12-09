"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, ArrowRightLeft, Globe, Loader2, Copy, Check, AlertCircle, X, RefreshCw, ChevronsRight } from 'lucide-react';

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

export default function VoiceTalkPage() {
  // === State Management ===
  const [sourceLang, setSourceLang] = useState<Language>(LANGUAGES[9]); // Default: English
  const [targetLang, setTargetLang] = useState<Language>(LANGUAGES[0]); // Default: Hindi
  
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // === Refs ===
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldAutoStartRef = useRef(false);

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
      
      recognition.onstart = () => {
        setIsListening(true);
        setPermissionError(false);
        setStatusMessage('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
           setStatusMessage('No speech detected. Try again.');
        } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
           setPermissionError(true);
        } else {
           setStatusMessage('Error: ' + event.error);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // === 3. Update Listener & Handle Auto-Start ===
  useEffect(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.lang = sourceLang.speechCode;

    recognitionRef.current.onresult = (event: any) => {
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
        setStatusMessage('');
      }

      if (finalTranscript) {
        handleTranslate(finalTranscript, sourceLang.code, targetLang.code); 
      }
    };

    if (shouldAutoStartRef.current) {
        setTimeout(() => {
            if (recognitionRef.current && !isListening) {
                try {
                    recognitionRef.current.start();
                    shouldAutoStartRef.current = false; 
                } catch (e) {
                    console.error("Auto-start failed:", e);
                }
            }
        }, 300); 
    }

  }, [sourceLang, targetLang]); 

  // === Logic Handlers ===

  const toggleListening = async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setTranslatedText(''); 
        setInputText('');
        
        setPermissionError(false);
        setStatusMessage('');
        recognitionRef.current.start();
      } catch (err) {
        setPermissionError(true);
      }
    }
  };

  const handleMicInteraction = async (e: React.MouseEvent) => {
    e.preventDefault(); 

    if (isListening) {
        toggleListening();
        return;
    }

    if (e.detail === 1) {
        clickTimeoutRef.current = setTimeout(() => {
            toggleListening(); 
        }, 250);
    } else if (e.detail === 2) {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
        }
        
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            
            setIsSwapping(true);
            setTimeout(() => setIsSwapping(false), 500); 

            shouldAutoStartRef.current = true;
            setTranslatedText(''); 
            setInputText('');
            swapLanguages(); 
        } catch (err) {
            setPermissionError(true);
        }
    }
  };

  const handleTranslate = async (text: string, sourceCode: string, targetCode: string) => {
    if (!text) return;

    setIsLoading(true);
    try {
      const langPair = `${sourceCode}|${targetCode}`; 
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.responseData) {
        const result = data.responseData.translatedText;
        setTranslatedText(result);
        
        // Auto Read
        const currentTargetLang = LANGUAGES.find(l => l.code === targetCode);
        if (currentTargetLang) {
            setTimeout(() => {
                speakText(result, currentTargetLang.speechCode);
            }, 500);
        }
      }
    } catch (error) {
      setTranslatedText("Error translating.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string, langCode: string) => {
    if (!text) return;

    window.speechSynthesis.cancel();
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    let voice = availableVoices.find(v => v.lang === langCode);
    if (!voice) {
        const shortCode = langCode.split('-')[0];
        voice = availableVoices.find(v => v.lang.startsWith(shortCode));
    }

    if (voice) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        utterance.voice = voice;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    } else {
        // Fallback to Google TTS
        const shortLang = langCode.split('-')[0];
        const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${shortLang}&q=${encodeURIComponent(text)}`;
        const audio = new Audio(googleTTSUrl);
        audioRef.current = audio;
        
        audio.play().catch(e => console.error("Audio playback error", e));
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
    window.speechSynthesis.cancel();
    if (audioRef.current) {
        audioRef.current.pause();
    }
  };

  const copyToClipboard = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // === RENDER ===
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col lg:flex-row items-start justify-center p-4 font-sans text-slate-800 dark:text-slate-100 gap-6">
      
      {/* Main Bot Card Interface */}
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-[85vh] transition-all">
        
        {/* Header */}
        <div className="bg-blue-600 p-5 text-white flex justify-between items-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 flex items-center gap-2">
             <Globe className="w-5 h-5" />
             <h1 className="text-lg font-bold">Voice Translator</h1>
          </div>
          <button onClick={clearAll} className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors" title="Clear All">
             <RefreshCw className="w-4 h-4" />
          </button>
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
            
            {/* Source Selection */}
            <select 
              value={sourceLang.code}
              onChange={(e) => {
                  const l = LANGUAGES.find(lang => lang.code === e.target.value);
                  if(l) setSourceLang(l);
              }}
              className={`
                bg-transparent font-bold text-blue-700 dark:text-blue-400 w-[40%] outline-none cursor-pointer text-center text-sm p-2 rounded-lg transition-all appearance-none z-10
                ${isListening ? 'scale-105 text-blue-800 dark:text-blue-300' : ''}
              `}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="dark:bg-slate-800">{lang.name}</option>
              ))}
            </select>

            {/* ANIMATED MIDDLE SECTION */}
            <div className="relative flex items-center justify-center w-12 h-12">
               {/* 1. Double Tap Spin Animation */}
               <button 
                  onClick={swapLanguages} 
                  className={`
                    p-2 bg-white dark:bg-slate-600 rounded-full shadow-sm text-slate-500 dark:text-slate-200 hover:text-blue-600 z-20 transition-all duration-500
                    ${isSwapping ? 'rotate-[360deg] scale-110 bg-blue-100 text-blue-600' : ''}
                  `}
                >
                  <ArrowRightLeft className="w-4 h-4" />
               </button>

               {/* 2. Single Tap Flow Animation (Behind button) */}
               {isListening && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 z-10">
                    <ChevronsRight className="w-8 h-8 text-blue-400 animate-pulse" /> 
                 </div>
               )}
            </div>

            {/* Target Selection */}
            <select 
              value={targetLang.code}
              onChange={(e) => {
                  const l = LANGUAGES.find(lang => lang.code === e.target.value);
                  if(l) setTargetLang(l);
              }}
              className="bg-transparent font-bold text-blue-700 dark:text-blue-400 w-[40%] outline-none cursor-pointer text-center text-sm p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-600 transition-colors appearance-none z-10"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="dark:bg-slate-800">{lang.name}</option>
              ))}
            </select>
            
            {/* Visual Active Indicator Background (Subtle) */}
            {isListening && (
                <div className="absolute left-0 top-0 bottom-0 w-[50%] bg-blue-200/20 dark:bg-blue-400/10 pointer-events-none transition-all duration-300 rounded-l-xl"></div>
            )}
          </div>

          {/* Input Box */}
          <div className="relative group">
            <label className={`text-[10px] font-bold uppercase tracking-wider mb-1 block pl-2 transition-colors ${isListening ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
              {isListening ? 'Listening...' : `Speaking in ${sourceLang.name}`}
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                    isListening ? "Listening..." : 
                    statusMessage ? statusMessage : 
                    "Tap Mic & Speak..."
                }
                className={`
                  w-full h-32 p-4 pr-12 bg-white dark:bg-slate-700 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 outline-none resize-none transition-all text-xl font-medium leading-relaxed
                  ${isListening ? 'border-blue-500 shadow-lg shadow-blue-100 dark:shadow-blue-900/20 ring-4 ring-blue-50 dark:ring-blue-900/30' : 'border-slate-100 dark:border-slate-600 shadow-sm'} 
                  ${statusMessage && !inputText ? 'placeholder:text-red-400' : 'placeholder:text-slate-300 dark:placeholder:text-slate-500'}
                `}
              />
               {inputText && (
                <button onClick={() => setInputText('')} className="absolute top-3 right-3 text-slate-300 hover:text-slate-500 dark:hover:text-slate-200">
                    <X className="w-4 h-4" />
                </button>
              )}
               <button 
                  onClick={() => speakText(inputText, sourceLang.speechCode)}
                  className="absolute bottom-3 right-3 p-2 text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                  title="Listen (Browser or Google)"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* Action Area (Mic Button) */}
          <div className="flex justify-center -my-4 relative z-20">
             <button 
                onClick={handleMicInteraction}
                className={`
                  relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 border-4 select-none
                  ${isListening 
                    ? 'bg-red-500 border-red-100 dark:border-red-900 text-white scale-110 shadow-red-200 dark:shadow-red-900/30' 
                    : 'bg-blue-600 border-blue-100 dark:border-blue-900 text-white hover:scale-105 hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/30'
                  }
                `}
              >
                {isListening ? (
                    <div className="flex gap-1 h-6 items-center pointer-events-none">
                        <div className="w-1 bg-white animate-[bounce_1s_infinite] h-3"></div>
                        <div className="w-1 bg-white animate-[bounce_1.2s_infinite] h-5"></div>
                        <div className="w-1 bg-white animate-[bounce_0.8s_infinite] h-3"></div>
                    </div>
                ) : (
                    <Mic className="w-8 h-8 pointer-events-none" />
                )}
             </button>
             {/* Tooltip hint */}
             <div className="absolute top-full mt-2 w-max text-[10px] text-slate-400 font-medium tracking-wide">
               Single Tap: Speak | Double Tap: Swap & Speak
             </div>
          </div>

          {/* Output Box */}
          <div className="relative pt-4">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block pl-2">
              Translation ({targetLang.name})
            </label>
            <div className={`
              w-full min-h-[8rem] h-auto p-4 rounded-2xl border-2 transition-all flex flex-col justify-between
              ${translatedText ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}
            `}>
               {isLoading ? (
                  <div className="flex-1 flex items-center justify-center text-blue-400 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Translating...</span>
                  </div>
                ) : (
                  <div className="text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed min-h-[3rem]">
                    {translatedText || <span className="text-slate-300 dark:text-slate-600">Translation appears here</span>}
                  </div>
                )}

                {translatedText && (
                    <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-blue-100/50 dark:border-blue-800/30">
                        <button 
                        onClick={copyToClipboard}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:text-blue-600 dark:hover:text-blue-400"
                        >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                        </button>
                        <button 
                        onClick={() => speakText(translatedText, targetLang.speechCode)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                        <Volume2 className="w-3 h-3" />
                        Listen
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for History (Kept from your original code) */}
      <div className="w-80 hidden lg:flex flex-col h-[85vh]">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 flex flex-col h-full border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Live Status</h2>
              <div className="flex gap-2">
                 {/* Status Dot */}
                 <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-600">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                  Current Session
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                   <span>{sourceLang.name}</span>
                   <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                   <span>{targetLang.name}</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-600 my-2"></div>
                <p className="text-xs text-slate-400">
                    {isListening ? "Microphone active. Listening for speech..." : "Microphone idle. Tap mic to start."}
                </p>
              </div>
            </div>
            
            <div className="mt-4 text-center">
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    System Ready
                 </p>
            </div>
          </div>
      </div>

    </div>
  );
}