"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserInfo } from "@/hooks/use-auth"
import { useRequireAuth } from "@/hooks/use-require-auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function Dashboard() {
  const { isLoading } = useRequireAuth()
  const { user, email, username, isVerified } = useUserInfo()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-svh flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome, {username}!</p>
        </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground">Username</div>
              <div className="font-medium">{username || "N/A"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="font-medium">{email || "N/A"}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Account Status</div>
              <div className="font-medium">
                {isVerified ? (
                  <span className="text-green-600 dark:text-green-400">Verified</span>
                ) : (
                  <span className="text-yellow-600 dark:text-yellow-400">Pending Verification</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full">
              <Link href="/settings">Settings</Link>
            </Button>
            <Button variant="outline" className="w-full">
              <Link href="/profile">View Profile</Link>
            </Button>
            <Button variant="outline" className="w-full">
              <Link href="/sessions">Active Sessions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>Your active sessions across devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Check your active sessions and manage your devices.</p>
            <Button variant="ghost" className="mt-2">
              <Link href="/sessions">Manage Sessions →</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
