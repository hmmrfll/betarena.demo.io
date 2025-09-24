"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/auth-store"
import { Eye, EyeOff, User, Shield } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { login, loginWithGoogle, loginWithTelegram } = useAuthStore()

  const demoCredentials = [
    {
      type: "User",
      email: "user@example.com",
      password: "password123",
      icon: User,
      description: "Regular user account",
    },
    {
      type: "Admin",
      email: "admin@betarena.com",
      password: "admin123",
      icon: Shield,
      description: "Administrator account",
    },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to BetArena!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
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

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await loginWithGoogle()
      toast({
        title: "Login successful",
        description: "Welcome to BetArena!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Google login failed. Please try again.",
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
        title: "Login successful",
        description: "Welcome to BetArena!",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Telegram login failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl flex gap-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to BetArena</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
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
                    placeholder="Enter your password"
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                Forgot your password?
              </Link>
            </div>

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
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-lg">Demo Accounts</CardTitle>
            <CardDescription>Click to use test credentials for quick access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoCredentials.map((demo, index) => {
              const IconComponent = demo.icon
              return (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => fillDemoCredentials(demo.email, demo.password)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{demo.type} Account</div>
                      <div className="text-xs text-muted-foreground">{demo.description}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs space-y-1">
                    <div className="text-muted-foreground">
                      <span className="font-mono">{demo.email}</span>
                    </div>
                    <div className="text-muted-foreground">
                      <span className="font-mono">{demo.password}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground text-center">
                Click any demo account to auto-fill credentials
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
