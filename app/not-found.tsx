"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { IconAlertTriangle, IconHome, IconArrowLeft } from "@tabler/icons-react"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      {/* Content Card */}
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-5xl font-bold text-transparent">
              404
            </p>
            <p className="text-sm text-muted-foreground">
              It looks like you've ventured into uncharted territory. Let's get
              you back on track.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
            <Button variant="outline" className="gap-2">
              <Link href="/" className="flex items-center gap-1">
                <IconArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </Link>
            </Button>
            <Button className="gap-2">
              <Link href="/dashboard" className="flex items-center gap-1">
                <IconHome className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Text */}
      <div className="text-center text-xs text-muted-foreground">
        <p>Need help? Contact support or browse our documentation.</p>
      </div>
    </div>
  )
}
