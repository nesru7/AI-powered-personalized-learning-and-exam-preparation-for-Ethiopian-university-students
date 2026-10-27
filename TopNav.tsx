'use client'

import { signOut, useSession } from 'next-auth/react'
import { LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useLanguage } from '@/lib/translations'
import { LANGUAGES, type Language, type Theme } from '@/lib/education-options'
import { useToast } from '@/components/ui/use-toast'

export function TopNav() {
  const { data } = useSession()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { toast } = useToast()

  async function savePreference(preference: { language?: Language; theme?: Theme }) {
    const response = await fetch('/api/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preference),
    })
    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      throw new Error(typeof result.error === 'string' ? result.error : 'Could not save preference.')
    }
  }

  async function changeLanguage(nextLanguage: Language) {
    const previousLanguage = language
    setLanguage(nextLanguage)
    try {
      await savePreference({ language: nextLanguage })
    } catch (error) {
      setLanguage(previousLanguage)
      toast({ title: t('preferenceSaveFailed'), description: error instanceof Error ? error.message : t('tryAgain'), variant: 'destructive' })
    }
  }

  async function toggleTheme() {
    const previousTheme = theme
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    try {
      await savePreference({ theme: nextTheme })
    } catch (error) {
      setTheme(previousTheme)
      toast({ title: t('preferenceSaveFailed'), description: error instanceof Error ? error.message : t('tryAgain'), variant: 'destructive' })
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/90 px-5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:px-8">
      <div className="pl-12 md:pl-0">
        <p className="text-sm font-medium text-slate-500">{t('learningWorkspace')}</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {data?.user?.name ?? t('student')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="topnav-language">{t('language')}</label>
        <select
          id="topnav-language"
          value={language}
          onChange={(event) => {
            const next = event.target.value
            if (LANGUAGES.includes(next as Language)) void changeLanguage(next as Language)
          }}
          className="h-9 rounded-md border bg-white px-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="en">English</option>
          <option value="am">አማርኛ</option>
          <option value="om">Afaan Oromo</option>
        </select>
        <button
          type="button"
          onClick={() => void toggleTheme()}
          aria-label={t('toggleTheme')}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">{t('signOut')}</span>
        </button>
      </div>
    </header>
  )
}
