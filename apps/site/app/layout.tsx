import './globals.css'
import React from 'react'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { GlobalProvider } from '@/utils/store'
import Header from '@/components/organism/header'
import Footer from '@/components/organism/footer'
import { Providers } from '@/utils/themeMode'

const inter = Inter({
   weight: ['300', '400', '500', '600', '700'],
   style: ['normal'],
   subsets: ['latin'],
   display: 'swap',
   variable: '--font-inter',
})

export const metadata: Metadata = {
   title: 'Labtec | Blog',
   icons: {
      icon: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/favicon-labtec.ico`
   }
} 

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html
         lang="en"
         suppressHydrationWarning
         className={`${inter.variable} font-sans`}
      >
         <body>
            <Providers>
               <GlobalProvider>
                  <Header />
                  {children}
                  <Footer />
               </GlobalProvider>
            </Providers>
         </body>
      </html>
   )
}
