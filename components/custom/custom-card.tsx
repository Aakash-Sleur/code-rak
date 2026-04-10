"use client"

import { Card as BaseCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface CustomCardProps {
  title: string
  description?: string
  children: ReactNode
  variant?: "default" | "highlight" | "accent"
  className?: string
  icon?: ReactNode
  footer?: ReactNode
}

export function CustomCard({
  title,
  description,
  children,
  variant = "default",
  className,
  icon,
  footer,
}: CustomCardProps) {
  return (
    <BaseCard
      className={cn(
        "transition-all duration-200",
        variant === "highlight" &&
          "border-primary/50 bg-gradient-to-br from-primary/5 to-transparent shadow-md hover:shadow-lg hover:border-primary",
        variant === "accent" &&
          "border-accent/50 bg-gradient-to-br from-accent/5 to-transparent shadow-md",
        variant === "default" && "hover:shadow-md",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {icon && <div className="text-primary">{icon}</div>}
              <CardTitle>{title}</CardTitle>
            </div>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      {footer && <div className="border-t border-border px-6 py-4">{footer}</div>}
    </BaseCard>
  )
}
