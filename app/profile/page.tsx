"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { useUserInfo } from "@/hooks/use-auth"
import Link from "next/link"

export default function ProfilePage() {
  const { isLoading } = useRequireAuth()
  const { username, email, isVerified } = useUserInfo()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your profile
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your public profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Username
            </div>
            <div className="text-lg font-medium">{username}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Email
            </div>
            <div className="text-lg font-medium">{email}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Status
            </div>
            <div className="text-lg font-medium">
              {isVerified ? (
                <span className="text-green-600">Verified</span>
              ) : (
                <span className="text-yellow-600">Pending Verification</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
