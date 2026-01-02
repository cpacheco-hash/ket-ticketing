import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      avatar?: string
    }
  }

  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
    accessToken?: string
    provider?: string
  }
}
