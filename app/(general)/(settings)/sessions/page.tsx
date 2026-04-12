"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { useUserInfo } from "@/hooks/use-auth"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"

interface Session {
  id: string
  deviceName: string
  ipAddress: string
  isCurrent: boolean
  expiresAt: string
  createdAt: string
}

export default function SessionsPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const { id: userId } = useUserInfo()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchSessions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/auth/sessions?userId=${userId}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Failed to fetch sessions")
          return
        }

        setSessions(data.sessions || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [userId])

  const handleLogoutDevice = async (sessionId: string) => {
    try {
      const response = await fetch("/api/auth/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId }),
      })

      if (response.ok) {
        setSessions(sessions.filter((s) => s.id !== sessionId))
      } else {
        const data = await response.json()
        setError(data.error || "Failed to logout device")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Active Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Manage your devices and sessions
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              No active sessions found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {session.deviceName}
                      </CardTitle>
                      {session.isCurrent && (
                        <span className="inline-block rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          Current Device
                        </span>
                      )}
                    </div>
                    <CardDescription>
                      IP: {session.ipAddress}
                    </CardDescription>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleLogoutDevice(session.id)}
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-muted-foreground">Created</div>
                    <div className="font-medium">
                      {new Date(session.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Expires</div>
                    <div className="font-medium">
                      {new Date(session.expiresAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8 border-destructive/50 bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Logout from all devices at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={async () => {
              if (
                window.confirm(
                  "Are you sure? You will be logged out from all devices."
                )
              ) {
                try {
                  const response = await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userId,
                      logoutAllDevices: true,
                    }),
                  })

                  if (response.ok) {
                    setSessions([])
                    window.location.href = "/signin"
                  }
                } catch (err) {
                  setError(
                    err instanceof Error ? err.message : "An error occurred"
                  )
                }
              }
            }}
          >
            Logout All Devices
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
