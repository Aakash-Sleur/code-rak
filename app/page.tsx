"use client"

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function Page() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">You are logged in as {(session.user as any)?.username || session.user?.email}</p>
        </div>
        <Button size="lg">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Code Rak</h1>
        <p className="text-muted-foreground">Build, test, and deploy with ease</p>
      </div>
      <div className="flex gap-2">
        <Button variant="default">
          <Link href="/signin">Sign In</Link>
        </Button>
        <Button variant="outline">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
      <div className="font-mono text-xs text-muted-foreground mt-8">
        (Press <kbd>d</kbd> to toggle dark mode)
      </div>
    </div>
  )
}
