import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { COMPUTING_DEPARTMENTS, ETHIOPIAN_UNIVERSITIES, LANGUAGES, THEMES } from '@/lib/education-options'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

const profileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  university: z.string().refine((value) => ETHIOPIAN_UNIVERSITIES.includes(value)).nullable().optional(),
  yearOfStudy: z.number().int().min(1).max(6).nullable().optional(),
  fieldOfStudy: z.enum(COMPUTING_DEPARTMENTS).nullable().optional(),
  language: z.enum(LANGUAGES).optional(),
  theme: z.enum(THEMES).optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, university: true, yearOfStudy: true, fieldOfStudy: true, language: true, theme: true, role: true },
  })
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  return NextResponse.json({ profile })
}

export async function POST(request: Request) {
  const parsed = profileSchema.extend({
    name: z.string().trim().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    university: z.string().refine((value) => ETHIOPIAN_UNIVERSITIES.includes(value)),
    yearOfStudy: z.number().int().min(1).max(6),
    fieldOfStudy: z.enum(COMPUTING_DEPARTMENTS),
  }).safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email }, select: { id: true } })
  if (existing) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  const { password, ...data } = parsed.data
  const user = await prisma.user.create({
    data: { ...data, password: await bcrypt.hash(password, 12) },
    select: { id: true, name: true, email: true },
  })
  return NextResponse.json({ user }, { status: 201 })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const parsed = profileSchema.safeParse(await request.json())
  if (!parsed.success || Object.keys(parsed.data ?? {}).length === 0) {
    return NextResponse.json({ error: parsed.success ? 'No profile fields provided.' : parsed.error.flatten() }, { status: 400 })
  }
  const data = { ...parsed.data }
  if (data.password) data.password = await bcrypt.hash(data.password, 12)
  try {
    const profile = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { id: true, name: true, email: true, university: true, yearOfStudy: true, fieldOfStudy: true, language: true, theme: true },
    })
    return NextResponse.json({ profile })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'That email address is already in use.' }, { status: 409 })
    }
    throw error
  }
}
