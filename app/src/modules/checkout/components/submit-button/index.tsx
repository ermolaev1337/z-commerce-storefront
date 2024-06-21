"use client"

import { Button } from "@medusajs/ui"
import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  disabled = false,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | undefined
  className?: string
  disabled?: boolean,
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      size="large"
      className={className}
      type="submit"
      isLoading={pending}
      variant={variant}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}
