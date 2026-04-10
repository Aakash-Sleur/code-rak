"use client"

import { Alert as BaseAlert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconAlertOctagon } from "@tabler/icons-react"

interface CustomAlertProps {
  type?: "default" | "success" | "warning" | "destructive" | "info"
  title?: string
  description?: string | ReactNode
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

const alertConfig = {
  default: {
    className: "border-border bg-card",
    icon: IconInfoCircle,
    iconColor: "text-foreground",
  },
  success: {
    className: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950",
    icon: IconCircleCheck,
    iconColor: "text-green-600 dark:text-green-400",
  },
  warning: {
    className: "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950",
    icon: IconAlertTriangle,
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  destructive: {
    className: "border-destructive/50 bg-destructive/10",
    icon: IconAlertOctagon,
    iconColor: "text-destructive",
  },
  info: {
    className: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950",
    icon: IconInfoCircle,
    iconColor: "text-blue-600 dark:text-blue-400",
  },
}

export function CustomAlert({
  type = "default",
  title,
  description,
  action,
  icon: customIcon,
  className,
}: CustomAlertProps) {
  const config = alertConfig[type]
  const IconComponent = config.icon

  return (
    <BaseAlert className={cn(config.className, className)}>
      <div className="flex gap-4">
        {customIcon ? (
          <div className="flex-shrink-0">{customIcon}</div>
        ) : (
          <IconComponent className={cn("h-5 w-5 flex-shrink-0 mt-0.5", config.iconColor)} />
        )}
        <div className="flex-1">
          {title && (
            <AlertTitle className={cn(type === "destructive" && "text-destructive font-semibold")}>
              {title}
            </AlertTitle>
          )}
          {description && (
            <AlertDescription className="mt-1 text-sm">{description}</AlertDescription>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </BaseAlert>
  )
}
