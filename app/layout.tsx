import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/components/providers/auth-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'VELUNE — Live your story',
  description: 'An AI-powered cinematic roleplay world where your choices shape the story.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0b12',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}