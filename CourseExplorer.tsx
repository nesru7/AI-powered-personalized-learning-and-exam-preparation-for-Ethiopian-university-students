'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Course = {
  id: string
  title: string
  description: string
  university: string
  department: string
  year: number
  chapters: unknown
}

export function CourseExplorer() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [university, setUniversity] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/courses')
      .then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error ?? 'Could not load courses.')
        setCourses(body.courses as Course[])
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load courses.'))
  }, [])

  const universities = useMemo(() => [...new Set(courses.map((course) => course.university))].sort(), [courses])
  const filtered = courses.filter((course) => (
    (university === 'all' || course.university === university)
    && `${course.title} ${course.department} ${course.university}`.toLowerCase().includes(search.toLowerCase())
  ))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search courses" className="pl-10" />
        </label>
        <select value={university} onChange={(event) => setUniversity(event.target.value)} className="rounded-md border bg-white px-3 py-2 dark:bg-slate-950">
          <option value="all">All universities</option>
          {universities.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!error && courses.length === 0 && <p className="rounded-xl border bg-white p-8 text-center text-slate-500 dark:bg-slate-950">Loading courses…</p>}
      {courses.length > 0 && filtered.length === 0 && <p className="rounded-xl border bg-white p-8 text-center text-slate-500 dark:bg-slate-950">No courses match your search.</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((course) => (
          <article key={course.id} className="flex flex-col rounded-xl border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-900 dark:bg-slate-800 dark:text-accent-400"><BookOpen size={21} /></div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent-700">{course.department} · Year {course.year}</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{course.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{course.university}</p>
            <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-600 dark:text-slate-300">{course.description}</p>
            <Link href={`/courses/${course.id}`} className="mt-5 font-semibold text-primary-800 hover:underline dark:text-accent-400">View course →</Link>
          </article>
        ))}
      </div>
    </div>
  )
}
