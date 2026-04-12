"use client"

import { Header } from "@/components/header"
import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react"

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { data: session, status } = useSession()

  // Sign out if refresh token error detected
  useEffect(() => {
    if ((session as any)?.error === "RefreshAccessTokenError") {
      console.log("Refresh token error detected, signing out...")
      signOut({ redirect: true, callbackUrl: "/signin" })
    }
  }, [session])

  if (status === "loading") {
    return <div className="p-8">Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div className="p-8">Redirecting to sign in...</div>
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      {children}
    </div>
  )
}
