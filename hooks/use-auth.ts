"use client"

import { useSession } from "next-auth/react"

/**
 * Hook to get current user session
 * Returns null if not authenticated
 */
export function useCurrentUser() {
  const { data: session } = useSession()
  return session?.user || null
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: session } = useSession()
  return !!session
}

/**
 * Hook to get user info
 */
export function useUserInfo() {
  const { data: session } = useSession()

  return {
    user: session?.user,
    email: session?.user?.email,
    username: session?.user?.username,
    id: session?.user?.id,
    isVerified: (session?.user as any)?.isVerfied,
    accessToken: (session as any)?.accessToken,
  }
}
