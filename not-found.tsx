import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">404</p>
      <h1 className="mt-3 text-3xl font-bold text-primary-900">We couldn’t find that page</h1>
      <p className="mt-2 text-slate-600">The page may have moved or the link may be incorrect.</p>
      <Link href="/" className="mt-6 rounded-lg bg-primary-900 px-5 py-3 font-semibold text-white">Return home</Link>
    </main>
  )
}
