import { decode } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export interface MobileUserPayload {
  id: string
  email: string
  name: string
  role: string
  university?: string | null
}

export async function getMobileUser(req: NextRequest): Promise<MobileUserPayload | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7).trim()
  if (!token) return null

  try {
    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET || 'development-secret-key-ethiolearn-ai-2025',
    })

    if (!decoded || !decoded.id) return null

    return {
      id: decoded.id as string,
      email: decoded.email as string,
      name: decoded.name as string,
      role: (decoded.role as string) || 'student',
      university: decoded.university as string | null,
    }
  } catch (error) {
    return null
  }
}
