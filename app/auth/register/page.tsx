"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth-store"
import { Eye, EyeOff, Gift } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { register, loginWithGoogle, loginWithTelegram } = useAuthStore()

  useEffect(() => {
    const ref = searchParams.get("ref")
    if (ref) {
      setReferralCode(ref)
    }
  }, [searchParams])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await register(email, password, name)
      if (success) {
        toast({
          title: "Registration successful",
          description: referralCode
            ? "Welcome to BetArena! You've been referred by a friend and will receive a $5 bonus!"
            : "Welcome to BetArena!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Registration failed",
          description: "Please try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await loginWithGoogle()
      toast({
        title: "Registration successful",
        description: referralCode
          ? "Welcome to BetArena! You've been referred by a friend and will receive a $5 bonus!"
          : "Welcome to BetArena!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Google registration failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTelegramLogin = async () => {
    setIsLoading(true)
    try {
      await loginWithTelegram()
      toast({
        title: "Registration successful",
        description: referralCode
          ? "Welcome to BetArena! You've been referred by a friend and will receive a $5 bonus!"
          : "Welcome to BetArena!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Telegram registration failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Join BetArena</CardTitle>
          <CardDescription>Create your account to start betting</CardDescription>

          {referralCode && (
            <div className="mt-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <Gift className="h-3 w-3 mr-1" />
                Referral Bonus: $5 Welcome Bonus!
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {referralCode && (
              <div className="space-y-2">
                <Label>Referral Code</Label>
                <Input value={referralCode} readOnly className="bg-muted" />
                <p className="text-xs text-muted-foreground">
                  You were referred by a friend and will receive a $5 welcome bonus!
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <Separator />

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleTelegramLogin}
              disabled={isLoading}
            >
              Continue with Telegram
            </Button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
