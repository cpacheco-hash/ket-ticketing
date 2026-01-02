import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import SessionProvider from '@/components/SessionProvider'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KET - Tu próximo evento te espera',
  description: 'Descubre y compra entradas para tus eventos favoritos',
  keywords: ['eventos', 'conciertos', 'tickets', 'entradas', 'música', 'Chile'],
  authors: [{ name: 'KET Team' }],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: 'https://ket.cl',
    siteName: 'KET',
    title: 'KET - Tu próximo evento te espera',
    description: 'Descubre y compra entradas para tus eventos favoritos',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
