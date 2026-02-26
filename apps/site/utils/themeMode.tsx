'use client'

import React from 'react'
import { ThemeProvider, useTheme } from 'next-themes'

type Props = {
   children: React.ReactNode
}

export function Providers({ children }: Props) {
   return (
      <ThemeProvider
         themes={[
            'light',
            'dark',
         ]}
         enableSystem={false}
      >
         {children}
      </ThemeProvider>
   )
}

const useMode = () => {
   const { themes, theme, setTheme, forcedTheme, systemTheme, resolvedTheme } =
      useTheme()
   const [lightMode, setLightMode] = React.useState(true)
   const [hydrationError, setHydrationError] = React.useState(false)

   React.useEffect(() => {
      if (theme === 'light') {
         setLightMode(true)
      } else if (theme === 'dark') {
         setLightMode(false)
      }
   }, [theme])

   // fix hydration error on next-themes
   React.useEffect(() => {
      setHydrationError(true)
   }, [])

   return {
      lightMode,
      themes,
      theme,
      setTheme,
      forcedTheme,
      systemTheme,
      resolvedTheme,
      hydrationError,
   }
}
export default useMode
