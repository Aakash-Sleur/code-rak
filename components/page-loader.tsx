"use client"

import { IconLoader } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface PageLoaderProps {
  /**
   * Show the loader as a full-page overlay
   * @default false
   */
  fullPage?: boolean
  /**
   * Custom message to display below the loader
   */
  message?: string
  /**
   * Size of the loader icon
   * @default "lg"
   */
  size?: "sm" | "md" | "lg" | "xl"
  /**
   * Additional CSS classes
   */
  className?: string
}

const sizeMap = {
  sm: "size-6",
  md: "size-8",
  lg: "size-12",
  xl: "size-16",
}

export function PageLoader({
  fullPage = false,
  message = "Loading...",
  size = "lg",
  className,
}: PageLoaderProps) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated spinner with gradient background */}
      <div className="relative">
        {/* Background gradient circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-lg animate-pulse" />
        
        {/* Loader icon */}
        <IconLoader
          className={cn(
            "animate-spin text-primary relative z-10",
            sizeMap[size]
          )}
          strokeWidth={1.5}
        />
      </div>

      {/* Loading message */}
      {message && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground font-medium">{message}</p>
        </div>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          "bg-background/80 backdrop-blur-sm",
          className
        )}
      >
        {loaderContent}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      {loaderContent}
    </div>
  )
}
