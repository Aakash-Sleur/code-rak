"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    setError(null)
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: checked,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("All fields are required")
        setIsLoading(false)
        return
      }

      if (!formData.email.includes("@")) {
        setError("Please enter a valid email")
        setIsLoading(false)
        return
      }

      if (formData.username.length < 3) {
        setError("Username must be at least 3 characters")
        setIsLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      if (!formData.agreeToTerms) {
        setError("You must agree to the terms of service")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Registration failed")
        setIsLoading(false)
        return
      }

      // Sign in with NextAuth after successful registration
      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (!signInResult?.ok) {
        setError("Registration successful but sign in failed. Please sign in manually.")
        setIsLoading(false)
        return
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred"
      setError(error)
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="border-b border-border/50">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="border-destructive/50 bg-destructive/10 text-destructive">
              <div className="text-xs">{error}</div>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={handleCheckboxChange}
              disabled={isLoading}
            />
            <Label htmlFor="agreeToTerms" className="font-normal leading-tight">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                terms of service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                privacy policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="size-3" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center text-xs">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/signin"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
