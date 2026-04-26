import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vigilant | Automated Staff Engineer',
  description: 'High-trust architectural oversight for scaling engineering teams.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}