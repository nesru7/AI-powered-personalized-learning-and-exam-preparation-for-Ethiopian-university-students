/**
 * lib/auth.ts
 *
 * NextAuth v4 configuration.
 * Uses CredentialsProvider (email/password with bcryptjs) and GoogleProvider.
 * Augments next-auth module types to expose id, role, and university on
 * Session['user'] and JWT.
 */
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@/lib/prisma';

// ─── Module type augmentation ─────────────────────────────────────────────────
// Extend next-auth types to include custom fields on Session and JWT.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      university?: string | null;
    };
  }

  interface User {
    role: string;
    university?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    university?: string | null;
  }
}

// ─── AuthOptions ──────────────────────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          university: user.university,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, `user` is populated — persist extra fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.university = user.university;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose token fields on session.user for client components
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.university = token.university;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
