"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"

/**
 * Hook to require authentication for a page
 * Redirects to signin if not authenticated
 * Shows loading spinner while checking
 */
export function useRequireAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [hasRefreshError, setHasRefreshError] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    }

    // Check for refresh token error in session
    if (session && (session as any).error === "RefreshAccessTokenError") {
      console.warn("Detected refresh token error - forcing re-authentication");
      setHasRefreshError(true);
      // Sign out and redirect to signin with message
      signOut({ redirect: false }).then(() => {
        router.push("/signin?error=session_expired");
      });
    }
  }, [status, router, session])

  // Still loading
  if (status === "loading") {
    return {
      isLoading: true,
      isAuthenticated: false,
      session: null,
      hasRefreshError: false,
    }
  }

  return {
    isLoading: false,
    isAuthenticated: status === "authenticated" && !hasRefreshError,
    session: session,
    hasRefreshError,
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
