"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { IconX } from "@tabler/icons-react"

interface CustomModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  showClose?: boolean
  closeOnBackgroundClick?: boolean
}

export function CustomModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  showClose = true,
  closeOnBackgroundClick = true,
}: CustomModalProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("gap-6", sizeClasses[size])}
        onClick={(e) => {
          if (!closeOnBackgroundClick && e.target === e.currentTarget) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </div>
            {/* {showClose && (
              <DialogClose>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <IconX className="h-4 w-4" />
                </Button>
              </DialogClose>
            )} */}
          </div>
        </DialogHeader>

        <div className="space-y-4">{children}</div>

        {footer && <div className="flex gap-3 justify-end border-t border-border pt-4">{footer}</div>}
      </DialogContent>
    </Dialog>
  )
}
