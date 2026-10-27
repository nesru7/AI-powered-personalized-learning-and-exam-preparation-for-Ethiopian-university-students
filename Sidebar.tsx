'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  BookOpen,
  Bot,
  CreditCard,
  FileQuestion,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/translations'

const links: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: '/dashboard', label: 'overview', icon: LayoutDashboard },
  { href: '/courses', label: 'courses', icon: BookOpen },
  { href: '/materials', label: 'courseMaterials', icon: FileText },
  { href: '/exam-prep', label: 'examPractice', icon: FileQuestion },
  { href: '/flashcards', label: 'flashcards', icon: CreditCard },
  { href: '/ai-tutor', label: 'aiTutor', icon: Bot },
  { href: '/progress', label: 'myProgress', icon: BarChart3 },
  { href: '/profile', label: 'profile', icon: UserRound },
]

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useStore()

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
        className="fixed left-4 top-4 z-50 rounded-lg border bg-white p-2 text-primary-900 shadow md:hidden"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      {sidebarOpen && (
        <button
          aria-label="Close navigation"
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white px-4 py-6 transition-transform dark:border-slate-800 dark:bg-slate-950',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <Link href="/dashboard" className="mb-10 flex items-center gap-3 px-2">
          <span className="rounded-xl bg-primary-900 p-2 text-white">
            <GraduationCap size={22} />
          </span>
          <span className="text-lg font-bold text-primary-900 dark:text-white">EthioLearn</span>
        </Link>
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => {
                  if (sidebarOpen) toggleSidebar()
                }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-50 text-primary-900 dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900',
                )}
              >
                <Icon size={18} />
                {t(label as Parameters<typeof t>[0])}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              href="/materials/manage"
              onClick={() => {
                if (sidebarOpen) toggleSidebar()
              }}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                pathname === '/materials/manage'
                  ? 'bg-primary-50 text-primary-900 dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900',
              )}
            >
              <FileText size={18} />
              {t('manageMaterials')}
            </Link>
          )}
        </nav>
        <div className="mt-auto rounded-xl bg-primary-50 p-4 text-sm text-primary-900 dark:bg-slate-900 dark:text-slate-200">
          <p className="font-semibold">{t('keepLearning')}</p>
          <p className="mt-1 text-xs opacity-75">{t('dailySteps')}</p>
        </div>
      </aside>
    </>
  )
}
