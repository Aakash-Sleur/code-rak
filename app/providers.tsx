"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"

interface ProvidersProps {
  children: React.ReactNode
  session: any
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  )
}
