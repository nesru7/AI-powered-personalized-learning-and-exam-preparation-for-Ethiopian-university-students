'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type CourseOption = { id: string; title: string }

export function MaterialUploadForm({ courses }: { courses: CourseOption[] }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsUploading(true)

    try {
      const form = event.currentTarget
      const response = await fetch('/api/materials', { method: 'POST', body: new FormData(form) })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error ?? 'The material could not be uploaded.')
        return
      }
      form.reset()
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5 rounded-xl border bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-2">
        <Label htmlFor="material-title">Title</Label>
        <Input id="material-title" name="title" required minLength={2} maxLength={150} placeholder="e.g. Chapter 1 study guide" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="material-course">Course</Label>
        <select id="material-course" name="courseId" required defaultValue="" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="" disabled>Select a course</option>
          {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="material-description">Description (optional)</Label>
        <textarea id="material-description" name="description" maxLength={2000} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="A brief description for students" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="material-file">PDF or PowerPoint file (maximum 20 MB)</Label>
        <Input id="material-file" name="file" type="file" accept="application/pdf,.pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,.pptx" required />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" value="true" className="h-4 w-4" />
        Publish immediately for enrolled students
      </label>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={isUploading || courses.length === 0}>
        {isUploading ? 'Uploading…' : 'Upload material'}
      </Button>
    </form>
  )
}
