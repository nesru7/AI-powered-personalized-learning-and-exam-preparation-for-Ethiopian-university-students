'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
import { COMPUTING_DEPARTMENTS, ETHIOPIAN_UNIVERSITIES, type Language, type Theme } from '@/lib/education-options'
import { useLanguage } from '@/lib/translations'
import { useTheme } from '@/components/providers/ThemeProvider'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    university: z.string().min(1, 'Please select your university'),
    yearOfStudy: z.string().min(1, 'Please select your year of study'),
    fieldOfStudy: z.enum(COMPUTING_DEPARTMENTS, { required_error: 'Please select your department' }),
    language: z.enum(['en', 'am', 'om']),
    theme: z.enum(['light', 'dark']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { language, theme },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          university: data.university,
          yearOfStudy: parseInt(data.yearOfStudy, 10),
          fieldOfStudy: data.fieldOfStudy,
          language: data.language,
          theme: data.theme,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        toast({
          title: 'Registration failed',
          description: errorData.message || 'Could not create your account. Please try again.',
          variant: 'destructive',
        })
        return
      }

      setLanguage(data.language)
      setTheme(data.theme)
      toast({
        title: 'Account created!',
        description: 'Your account has been created. Please sign in.',
      })
      router.push('/login')
    } catch {
      toast({
        title: 'Something went wrong',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Full name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">{t('fullName')}</Label>
        <Input id="name" placeholder="Tigist Alemu" autoComplete="name" {...register('name')} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email">{t('emailAddress')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('emailPlaceholder')}
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password">{t('password')}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t('passwordPlaceholder')}
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={t('confirmPasswordPlaceholder')}
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* University */}
      <div className="space-y-1.5">
        <Label htmlFor="university">{t('university')}</Label>
        <Controller
          name="university"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="university">
                <SelectValue placeholder={t('selectUniversity')} />
              </SelectTrigger>
              <SelectContent>
                {ETHIOPIAN_UNIVERSITIES.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.university && <p className="text-xs text-red-500">{errors.university.message}</p>}
      </div>

      {/* Year of study */}
      <div className="space-y-1.5">
        <Label htmlFor="yearOfStudy">{t('yearOfStudy')}</Label>
        <Controller
          name="yearOfStudy"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="yearOfStudy">
                <SelectValue placeholder={t('selectYear')} />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {t('year')} {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.yearOfStudy && <p className="text-xs text-red-500">{errors.yearOfStudy.message}</p>}
      </div>

      {/* Field of study */}
      <div className="space-y-1.5">
        <Label htmlFor="fieldOfStudy">{t('department')}</Label>
        <Controller
          name="fieldOfStudy"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="fieldOfStudy"><SelectValue placeholder={t('selectDepartment')} /></SelectTrigger>
              <SelectContent>{COMPUTING_DEPARTMENTS.map((department) => <SelectItem key={department} value={department}>{department}</SelectItem>)}</SelectContent>
            </Select>
          )}
        />
        {errors.fieldOfStudy && (
          <p className="text-xs text-red-500">{errors.fieldOfStudy.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium">{t('language')}
          <select {...register('language', { onChange: (event) => setLanguage(event.target.value as Language) })} className="h-10 w-full rounded-md border bg-white px-3 dark:bg-slate-900">
            <option value="en">{t('english')}</option><option value="am">{t('amharic')}</option><option value="om">{t('afaanOromo')}</option>
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-medium">{t('theme')}
          <select {...register('theme', { onChange: (event) => setTheme(event.target.value as Theme) })} className="h-10 w-full rounded-md border bg-white px-3 dark:bg-slate-900">
            <option value="light">{t('light')}</option><option value="dark">{t('dark')}</option>
          </select>
        </label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('creatingAccount')}</> : t('createAccount')}
      </Button>

      <p className="text-center text-sm text-gray-500">
        {t('alreadyHaveAccount')}{' '}
        <Link href="/login" className="font-medium text-[#1e3a5f] hover:underline">
          {t('signIn')}
        </Link>
      </p>
    </form>
  )
}
