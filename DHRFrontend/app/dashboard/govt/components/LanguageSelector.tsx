"use client"

import React from 'react'
import { Languages } from 'lucide-react'
import { useGovtLanguage, GovtLanguage } from '../contexts/GovtLanguageContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LanguageSelectorProps {
  className?: string
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useGovtLanguage()

  const languages: { code: GovtLanguage; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  ]

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-2 ${className}`}>
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{t('language')}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {languages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded hover:bg-gray-100 ${
              language === lang.code ? 'bg-blue-500 text-white' : 'text-gray-900'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            {language === lang.code && <span className="text-xs font-bold">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
