"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Trophy, Users, DollarSign, Target, ArrowRight, Play, Shield, Crown, Sparkles } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/dashboard/admin") // fixed admin redirect to avoid infinite loop
      } else {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, user, router, mounted])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">BetArena</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#tournaments" className="text-muted-foreground hover:text-foreground transition-colors">
                Tournaments
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Sparkles className="h-3 w-3 mr-1" />
                  The ultimate tournament platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                  The complete platform to{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    dominate tournaments
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                  Join competitive tournaments, build your skills, and earn real money. Compete with players worldwide
                  in the most exciting gaming arena.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="text-lg px-8">
                  <Link href="/auth/register">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl" />
              <Card className="relative bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Live Tournament</h3>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                        Live
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Prize Pool</span>
                        <span className="text-2xl font-bold text-green-400">$50,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Players</span>
                        <span className="font-semibold">1,247 / 2,000</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/5" />
                      </div>
                      <Button className="w-full">
                        <Trophy className="mr-2 h-4 w-4" />
                        Join Tournament
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">$2M+</div>
              <div className="text-muted-foreground">Total Prizes</div>
              <div className="text-sm text-green-400">↑ 150% this month</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">50K+</div>
              <div className="text-muted-foreground">Active Players</div>
              <div className="text-sm text-blue-400">↑ 98% growth</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">1,200+</div>
              <div className="text-muted-foreground">Tournaments</div>
              <div className="text-sm text-purple-400">↑ 300% increase</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl lg:text-4xl font-bold">24/7</div>
              <div className="text-muted-foreground">Support</div>
              <div className="text-sm text-orange-400">Less than 2 hours response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Target className="h-3 w-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-balance">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                win big
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Our platform provides all the tools and features you need to compete at the highest level and maximize
              your earnings.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 relative">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                  <Trophy className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Competitive Tournaments</h3>
                <p className="text-muted-foreground mb-6">
                  Join daily tournaments across multiple games and sports. Compete with players worldwide for massive
                  prize pools.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    Daily tournaments
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    Multiple game modes
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    Real-time leaderboards
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 relative">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Instant Payouts</h3>
                <p className="text-muted-foreground mb-6">
                  Secure and fast payment processing. Withdraw your winnings instantly to your preferred payment method.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    Instant withdrawals
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    Multiple payment methods
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    Bank-level security
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-8 relative">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community & Referrals</h3>
                <p className="text-muted-foreground mb-6">
                  Build your network and earn passive income through our referral program. Connect with like-minded
                  competitors.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    10% referral commission
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    Community features
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    Player rankings
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold text-balance">
                Ready to start{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  winning?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Join thousands of players who are already earning money through competitive tournaments. Your next big
                win is just one click away.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/auth/register">
                  <Crown className="mr-2 h-5 w-5" />
                  Start Competing
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                <Shield className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">BetArena</span>
              </div>
              <p className="text-muted-foreground">
                The ultimate competitive tournament platform for gamers and sports enthusiasts.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Tournaments
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 BetArena. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
