"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type GovtLanguage = 'en' | 'ml' | 'hi'

interface GovtLanguageContextType {
  language: GovtLanguage
  setLanguage: (lang: GovtLanguage) => void
  t: (key: string) => string
}

const GovtLanguageContext = createContext<GovtLanguageContextType | undefined>(undefined)

// Simple translation function - will be enhanced when translations are loaded
const simpleTranslation = (language: GovtLanguage, key: string): string => {
  // This will be replaced with proper translations
  // For now, return the key as fallback
  return key
}

export function GovtLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<GovtLanguage>('en')
  const [translations, setTranslations] = useState<Record<string, string>>({})

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await import(`@/app/dashboard/govt/locales/${language}.json`)
        setTranslations(response.default)
      } catch (error) {
        console.warn(`Failed to load ${language} translations:`, error)
        setTranslations({})
      }
    }

    loadTranslations()
  }, [language])

  const t = (key: string): string => {
    return translations[key] || simpleTranslation(language, key)
  }

  return (
    <GovtLanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </GovtLanguageContext.Provider>
  )
}

export function useGovtLanguage() {
  const context = useContext(GovtLanguageContext)
  if (context === undefined) {
    throw new Error('useGovtLanguage must be used within a GovtLanguageProvider')
  }
  return context
}