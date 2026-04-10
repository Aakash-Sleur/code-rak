"use client"

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner"
import { IconCircleCheck, IconAlertTriangle, IconAlertOctagon, IconInfoCircle } from "@tabler/icons-react"

// Re-export sonner's toast function with custom types
export function showNotification(
  message: string,
  options?: {
    type?: "default" | "success" | "warning" | "error" | "info"
    description?: string
    duration?: number
    action?: {
      label: string
      onClick: () => void
    }
  }
) {
  const { type = "default", description, duration = 5000, action } = options || {}

  const toastConfig = {
    description,
    duration,
    action,
  }

  switch (type) {
    case "success":
      return sonnerToast.success(message, {
        ...toastConfig,
        icon: <IconCircleCheck className="h-5 w-5 text-green-600" />,
      })
    case "warning":
      return sonnerToast(message, {
        ...toastConfig,
        icon: <IconAlertTriangle className="h-5 w-5 text-yellow-600" />,
      })
    case "error":
      return sonnerToast.error(message, {
        ...toastConfig,
        icon: <IconAlertOctagon className="h-5 w-5 text-red-600" />,
      })
    case "info":
      return sonnerToast.info(message, {
        ...toastConfig,
        icon: <IconInfoCircle className="h-5 w-5 text-blue-600" />,
      })
    default:
      return sonnerToast(message, toastConfig)
  }
}

// Toast component to include in layout
export function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      theme="light"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "gap-3",
          description: "text-xs",
        },
      }}
    />
  )
}

// Re-exports for direct access
export { sonnerToast as toast }
