'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { COMPUTING_DEPARTMENTS, ETHIOPIAN_UNIVERSITIES, type Language, type Theme } from '@/lib/education-options'
import { useLanguage } from '@/lib/translations'
import { useTheme } from '@/components/providers/ThemeProvider'

type Profile = { name: string; email: string; university: string | null; yearOfStudy: number | null; fieldOfStudy: string | null; language: Language; theme: Theme }

export default function ProfilePage() {
  const { setLanguage, t } = useLanguage()
  const { setTheme } = useTheme()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/users/profile').then(async (response) => {
      const body = await response.json()
      if (!response.ok) throw new Error(body.error ?? 'Could not load profile.')
      setProfile(body.profile)
    }).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load profile.'))
  }, [])

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!profile) return
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, yearOfStudy: profile.yearOfStudy ? Number(profile.yearOfStudy) : null }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(typeof body.error === 'string' ? body.error : 'Could not save profile.')
      setProfile({ ...profile, ...body.profile })
      setLanguage(body.profile.language)
      setTheme(body.profile.theme)
      setMessage(t('profileUpdated'))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return <p role={error ? 'alert' : undefined} className={error ? 'text-red-700' : 'text-slate-500'}>{error || t('loadingProfile')}</p>

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div><p className="text-sm font-semibold uppercase tracking-wide text-accent-700">{t('accountSettings')}</p><h1 className="mt-1 text-3xl font-bold">{t('yourProfile')}</h1><p className="mt-2 text-slate-600 dark:text-slate-300">{t('profileDescription')}</p></div>
      <form onSubmit={(event) => void save(event)} className="space-y-4 rounded-xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <label className="block space-y-1 text-sm font-medium">{t('fullName')}<Input required minLength={2} value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
        <label className="block space-y-1 text-sm font-medium">{t('emailAddress')}<Input type="email" required value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label>
        <label className="block space-y-1 text-sm font-medium">{t('university')}
          <select required value={profile.university ?? ''} onChange={(event) => setProfile({ ...profile, university: event.target.value })} className="h-10 w-full rounded-md border bg-white px-3 dark:bg-slate-900">
            <option value="" disabled>{t('selectUniversity')}</option>
            {ETHIOPIAN_UNIVERSITIES.map((university) => <option key={university} value={university}>{university}</option>)}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm font-medium">{t('yearOfStudy')}<Input type="number" min={1} max={6} value={profile.yearOfStudy ?? ''} onChange={(event) => setProfile({ ...profile, yearOfStudy: event.target.value ? Number(event.target.value) : null })} /></label>
          <label className="block space-y-1 text-sm font-medium">{t('department')}
            <select required value={COMPUTING_DEPARTMENTS.includes(profile.fieldOfStudy as (typeof COMPUTING_DEPARTMENTS)[number]) ? profile.fieldOfStudy! : ''} onChange={(event) => setProfile({ ...profile, fieldOfStudy: event.target.value })} className="h-10 w-full rounded-md border bg-white px-3 dark:bg-slate-900">
              <option value="" disabled>{t('selectDepartment')}</option>
              {COMPUTING_DEPARTMENTS.map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">{t('language')}
            <select value={profile.language} onChange={(event) => setProfile({ ...profile, language: event.target.value as Language })} className="h-10 w-full rounded-md border bg-white px-3 dark:bg-slate-900">
              <option value="en">{t('english')}</option><option value="am">{t('amharic')}</option><option value="om">{t('afaanOromo')}</option>
            </select>
          </label>
          <label className="space-y-1 text-sm font-medium">{t('theme')}
            <select value={profile.theme} onChange={(event) => setProfile({ ...profile, theme: event.target.value as Theme })} className="h-10 w-full rounded-md border bg-white px-3 dark:bg-slate-900">
              <option value="light">{t('light')}</option><option value="dark">{t('dark')}</option>
            </select>
          </label>
        </div>
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={saving}>{saving ? t('saving') : t('saveChanges')}</Button>
      </form>
    </section>
  )
}
