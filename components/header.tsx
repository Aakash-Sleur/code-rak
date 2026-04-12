"use client"

import { useState } from "react"
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { useUserInfo } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconChevronDown, IconMoon, IconSun } from "@tabler/icons-react"

export function Header() {
  const { user, username } = useUserInfo()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/signin" })
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (username) {
      return username.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* <Image
            src="/logo/logo.png"
            alt="RAK Logo"
            width={32}
            height={32}
            className="h-64 w-64"
          /> */}
          code_rak
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 flex-1 justify-center">
          <Link
            href="/explore"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/folders"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Folders
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link>
        </nav>

        {/* Right Side - Theme Toggle & Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 p-0 rounded-full hover:bg-accent"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <IconSun className="w-5 h-5" />
              ) : (
                <IconMoon className="w-5 h-5" />
              )}
            </Button>
          )}

          {/* Profile Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-10 px-3 rounded-full hover:bg-accent"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">{username}</span>
                  <IconChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/sessions">
                    <span>Active Sessions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
