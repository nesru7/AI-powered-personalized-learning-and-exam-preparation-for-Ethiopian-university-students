'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function GenerateMaterialQuestionsButton({ materialId }: { materialId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generated, setGenerated] = useState(false)

  async function generateQuestions() {
    setLoading(true)
    setError('')
    setGenerated(false)
    try {
      const response = await fetch(`/api/ai/material-questions/${materialId}`, { method: 'POST' })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Could not generate questions.')
      setGenerated(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not generate questions.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3">
      <Button type="button" variant="outline" size="sm" disabled={loading} onClick={() => void generateQuestions()}>
        {loading ? 'Generating questions…' : 'Generate AI practice questions'}
      </Button>
      {generated && <p role="status" className="mt-2 text-sm text-green-700 dark:text-green-400">5 questions added. <Link href="/exam-prep" className="font-semibold underline">Go to practice exams</Link>.</p>}
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
