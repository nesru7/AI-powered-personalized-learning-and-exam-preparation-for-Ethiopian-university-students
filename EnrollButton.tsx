'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function EnrollButton({ courseId, enrolled }: { courseId: string; enrolled: boolean }) {
  const [isEnrolled, setIsEnrolled] = useState(enrolled)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function enroll() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' })
      const body = await response.json()
      if (!response.ok && response.status !== 409) throw new Error(body.error ?? 'Enrollment failed.')
      setIsEnrolled(true)
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Enrollment failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={enroll} disabled={isEnrolled || loading}>
        {isEnrolled ? 'Enrolled' : loading ? 'Enrolling…' : 'Enroll in course'}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
