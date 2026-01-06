import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import SpotifyProvider from 'next-auth/providers/spotify'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import { compare } from 'bcryptjs'

// Ensure NEXTAUTH_SECRET is set
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('Warning: NEXTAUTH_SECRET is not set. Using default for development.')
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) {
            return null
          }

          // Compare password with hashed password
          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar || undefined,
            role: user.role
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: [
            'user-read-email',
            'user-read-private',
            'user-top-read',
            'user-follow-read',
            'user-read-recently-played',
            'playlist-read-private',
          ].join(' '),
        },
      },
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
    newUser: '/events' // Redirect new users to events page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Spotify sign in
      if (account?.provider === 'spotify' && user.email) {
        try {
          await prisma.user.update({
            where: { email: user.email },
            data: {
              spotifyConnected: true,
              spotifyId: (profile as any)?.id,
              spotifyAccessToken: account.access_token,
              spotifyRefreshToken: account.refresh_token,
            },
          })
        } catch (error) {
          console.error('Error updating Spotify data:', error)
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = (user as any).firstName
        token.lastName = (user as any).lastName
        token.avatar = (user as any).avatar
        token.role = (user as any).role || 'USER'
      }

      // Store OAuth access tokens
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider

        // Store Spotify tokens
        if (account.provider === 'spotify') {
          token.spotifyAccessToken = account.access_token
          token.spotifyRefreshToken = account.refresh_token
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.avatar = token.avatar as string | undefined
        session.user.role = token.role as string || 'USER'
        ;(session.user as any).spotifyAccessToken = token.spotifyAccessToken
        ;(session.user as any).spotifyRefreshToken = token.spotifyRefreshToken
      }

      return session
    }
  },
  debug: process.env.NODE_ENV === 'development'
}
