import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IWKL Admin',
  description: 'Admin Panel',
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