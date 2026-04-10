"use client"

import { Input as BaseInput } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  hint?: string
  required?: boolean
  containerClassName?: string
}

export function CustomInput({
  label,
  error,
  icon,
  hint,
  required,
  containerClassName,
  className,
  ...props
}: CustomInputProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label htmlFor={props.id}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>}
        <BaseInput
          className={cn(
            "transition-colors",
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive/50",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
      {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
    </div>
  )
}
