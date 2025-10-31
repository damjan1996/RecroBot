import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RecroBot - KI-gestütztes Interview-System',
  description: 'Revolutioniere dein Recruiting mit KI-gestützten Interviews. Schnell, effizient und DSGVO-konform.',
  keywords: ['Recruiting', 'KI', 'Interview', 'AI', 'Voice', 'HR'],
  authors: [{ name: 'Everlast Consulting GmbH' }],
  openGraph: {
    title: 'RecroBot - KI-gestütztes Interview-System',
    description: 'Revolutioniere dein Recruiting mit KI-gestützten Interviews.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}