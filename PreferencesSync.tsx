'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/lib/translations'
import { type Language, type Theme } from '@/lib/education-options'
import { useTheme } from '@/components/providers/ThemeProvider'

export function PreferencesSync({ language, theme }: { language: Language; theme: Theme }) {
  const { setLanguage } = useLanguage()
  const { setTheme } = useTheme()

  useEffect(() => {
    setLanguage(language)
    setTheme(theme)
  }, [language, setLanguage, setTheme, theme])

  return null
}
