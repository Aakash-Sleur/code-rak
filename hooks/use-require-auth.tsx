"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"

/**
 * Hook to require authentication for a page
 * Redirects to signin if not authenticated
 * Shows loading spinner while checking
 */
export function useRequireAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }
  }, [status, router])

  // Still loading
  if (status === "loading") {
    return {
      isLoading: true,
      isAuthenticated: false,
      session: null,
    }
  }

  return {
    isLoading: false,
    isAuthenticated: status === "authenticated",
    session: session,
  }
}

/**
 * Component wrapper that requires authentication
 * Shows children only if user is authenticated
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useRequireAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
