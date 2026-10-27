import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopNav } from '@/components/dashboard/TopNav'
import prisma from '@/lib/prisma'
import { PreferencesSync } from '@/components/providers/PreferencesSync'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  const preferences = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { language: true, theme: true },
  })
  const language = preferences?.language === 'am' || preferences?.language === 'om'
    ? preferences.language
    : 'en'
  const theme = preferences?.theme === 'dark' ? 'dark' : 'light'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <PreferencesSync language={language} theme={theme} />
      <Sidebar isAdmin={session.user.role === 'admin'} />
      <div className="md:pl-64">
        <TopNav />
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  )
}
