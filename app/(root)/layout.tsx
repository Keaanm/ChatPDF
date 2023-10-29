import Header from '@/components/Header'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from '@/components/ui/toaster'
import "simplebar-react/dist/simplebar.min.css";
import TanstackProvider from '@/tanstack-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <TanstackProvider>
      <html lang="en">
        <body className={inter.className}>
          <Toaster/>
          <Header/>
            <div className='mx-auto w-full px-2.5 md:px-20'>
              {children}
            </div>
        </body>
      </html>
      </TanstackProvider>
    </ClerkProvider>
  )
}
