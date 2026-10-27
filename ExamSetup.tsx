'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function ExamSetup() {
  const [subjects, setSubjects] = useState<string[]>([])
  const [subject, setSubject] = useState('')
  const [count, setCount] = useState(5)
  const [difficulty, setDifficulty] = useState('mixed')
  const [generate, setGenerate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/exam').then((response) => response.json()).then((body) => {
      const values = body.subjects as string[]
      setSubjects(values)
      setSubject(values[0] ?? '')
    }).catch(() => setError('Could not load available subjects.'))
  }, [])

  async function startExam(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (generate) {
        const generated = await fetch('/api/ai/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, count, difficulty: difficulty === 'mixed' ? 'medium' : difficulty }),
        })
        const generatedBody = await generated.json()
        if (!generated.ok) throw new Error(generatedBody.error ?? 'Question generation failed.')
      }
      const response = await fetch('/api/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, questionCount: count, difficulty }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error ?? 'Could not start the exam.')
      router.push(`/exam-prep/${body.sessionId}`)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not start the exam.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={startExam} className="space-y-5 rounded-xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <div>
        <label htmlFor="subject" className="mb-1 block text-sm font-medium">Subject</label>
        <select id="subject" required value={subject} onChange={(event) => setSubject(event.target.value)} className="w-full rounded-md border bg-white px-3 py-2 dark:bg-slate-900">
          {subjects.length === 0 && <option value="">No subjects yet</option>}
          {subjects.map((value) => <option key={value}>{value}</option>)}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="count" className="mb-1 block text-sm font-medium">Questions</label>
          <select id="count" value={count} onChange={(event) => setCount(Number(event.target.value))} className="w-full rounded-md border bg-white px-3 py-2 dark:bg-slate-900">
            {[5, 10, 15, 20].map((value) => <option key={value} value={value}>{value} questions</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="difficulty" className="mb-1 block text-sm font-medium">Difficulty</label>
          <select id="difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="w-full rounded-md border bg-white px-3 py-2 dark:bg-slate-900">
            {['mixed', 'easy', 'medium', 'hard'].map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={generate} onChange={(event) => setGenerate(event.target.checked)} />
        Generate fresh questions with AI first
      </label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading || !subject}>{loading ? 'Preparing exam…' : 'Start practice exam'}</Button>
    </form>
  )
}
