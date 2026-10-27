'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

type Question = { id: string; text: string; options: Record<string, string>; correctAnswer?: string; explanation?: string }
type Exam = { id: string; subject: string; status: string; score: number }

export function ExamRunner({ examId }: { examId: string }) {
  const [exam, setExam] = useState<Exam | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Array<{ questionId: string; submitted: string; correct: string; isCorrect: boolean; explanation: string }> | null>(null)
  const [index, setIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(1800)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const submit = useCallback(async () => {
    if (!exam || busy || results) return
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: exam.id, answers }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error ?? 'Could not submit exam.')
      setResults(body.results)
      setExam({ ...exam, status: 'completed', score: body.score })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not submit exam.')
    } finally {
      setBusy(false)
    }
  }, [answers, busy, exam, results])

  useEffect(() => {
    fetch(`/api/exam/${examId}`).then(async (response) => {
      const body = await response.json()
      if (!response.ok) throw new Error(body.error ?? 'Could not load exam.')
      setExam(body.exam)
      setQuestions(body.questions)
      if (body.exam.status === 'completed') {
        const savedAnswers = body.answers as Record<string, string>
        setAnswers(savedAnswers)
        setResults(body.questions.map((question: Question) => ({
          questionId: question.id,
          submitted: savedAnswers[question.id] ?? '',
          correct: question.correctAnswer ?? '',
          isCorrect: savedAnswers[question.id] === question.correctAnswer,
          explanation: question.explanation ?? '',
        })))
      }
    }).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : 'Could not load exam.'))
  }, [examId])

  useEffect(() => {
    if (!exam || exam.status !== 'in_progress' || results) return
    if (secondsLeft <= 0) {
      void submit()
      return
    }
    const timer = window.setTimeout(() => setSecondsLeft((remaining) => remaining - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [exam, results, secondsLeft, submit])

  if (error && !exam) return <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
  if (!exam || questions.length === 0) return <p className="text-slate-500">Loading exam…</p>
  const question = questions[index]
  const time = `${Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`

  if (results) {
    return (
      <section className="space-y-5">
        <div className="rounded-xl bg-primary-900 p-7 text-white">
          <p className="text-sm text-blue-100">Exam complete · {exam.subject}</p>
          <p className="mt-2 text-4xl font-bold">{exam.score}%</p>
          <p className="mt-1">{results.filter((item) => item.isCorrect).length} of {results.length} correct</p>
        </div>
        {questions.map((item, itemIndex) => {
          const result = results.find((entry) => entry.questionId === item.id)
          return <article key={item.id} className="rounded-xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="font-semibold">{itemIndex + 1}. {item.text}</h3>
            <p className={result?.isCorrect ? 'mt-2 text-sm text-emerald-700' : 'mt-2 text-sm text-red-700'}>Your answer: {result?.submitted || 'Not answered'} · Correct: {result?.correct}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{result?.explanation}</p>
          </article>
        })}
        <Button onClick={() => router.push('/exam-prep')}>Back to exam prep</Button>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div><p className="text-sm text-slate-500">{exam.subject}</p><h1 className="text-xl font-bold">Question {index + 1} of {questions.length}</h1></div>
        <p className="rounded-lg bg-white px-3 py-2 font-mono font-semibold dark:bg-slate-950">{time}</p>
      </div>
      <Progress value={((index + 1) / questions.length) * 100} />
      <article className="rounded-xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-lg font-semibold">{question.text}</h2>
        <div className="mt-5 space-y-3">
          {Object.entries(question.options).map(([key, value]) => (
            <label key={key} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${answers[question.id] === key ? 'border-primary-700 bg-primary-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-900'}`}>
              <input type="radio" name={question.id} checked={answers[question.id] === key} onChange={() => setAnswers((current) => ({ ...current, [question.id]: key }))} />
              <span><strong>{key}.</strong> {value}</span>
            </label>
          ))}
        </div>
      </article>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end">
        {index < questions.length - 1
          ? <Button onClick={() => setIndex((current) => current + 1)}>Next question</Button>
          : <Button onClick={() => void submit()} disabled={busy}>{busy ? 'Submitting…' : 'Submit exam'}</Button>}
      </div>
    </section>
  )
}
