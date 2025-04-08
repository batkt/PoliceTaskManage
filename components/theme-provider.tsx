"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: {
  children: React.ReactNode
} & ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props}>
      <ThemeScript />
      {children}
    </NextThemesProvider>
  )
}

// This script runs before React hydration to prevent flash of light theme
function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          const theme = localStorage.getItem('theme') || 'system';
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          document.documentElement.classList.add(theme === 'system' ? systemTheme : theme);
        `,
      }}
    />
  )
}

