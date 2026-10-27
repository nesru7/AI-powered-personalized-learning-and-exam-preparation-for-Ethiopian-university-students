'use client'

import { useEffect } from 'react'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-slate-600">Your work is safe. Try loading this page again.</p>
      {process.env.NODE_ENV === 'development' && <pre className="mt-4 max-w-2xl overflow-auto text-left text-xs text-red-700">{error.message}</pre>}
      <button onClick={reset} className="mt-6 rounded-lg bg-primary-900 px-5 py-3 font-semibold text-white">Try again</button>
    </main>
  )
}
