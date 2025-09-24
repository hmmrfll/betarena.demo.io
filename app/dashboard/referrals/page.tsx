"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useReferralStore } from "@/lib/referral-store"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Users, DollarSign, TrendingUp, Copy, Share2, Gift, UserPlus, Calendar, Activity, Target } from "lucide-react"

export default function ReferralsPage() {
  const { referrals, generateReferralLink, copyReferralLink, getReferralStats } = useReferralStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  const stats = getReferralStats()
  const referralLink = generateReferralLink()

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleCopyLink = async () => {
    const success = await copyReferralLink()
    if (success) {
      toast({
        title: "Link copied!",
        description: "Referral link has been copied to your clipboard",
      })
    } else {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: "Join BetArena",
          text: "Join me on BetArena and start winning tournaments!",
          url: referralLink,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      handleCopyLink()
    }
  }

  const filteredReferrals = referrals.filter(
    (referral) =>
      referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-balance">Referral Program</h1>
          <p className="text-blue-100">Invite friends and earn 10% commission on their tournament entries</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="h-32">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invited</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full pb-4">
              <div className="flex-1" />
              <div>
                <div className="text-2xl font-bold">{stats.totalInvited}</div>
                <p className="text-xs text-muted-foreground">Friends invited</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-32">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full pb-4">
              <div className="flex-1" />
              <div>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-32">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full pb-4">
              <div className="flex-1" />
              <div>
                <div className="text-2xl font-bold">{formatBalance(stats.totalEarnings)}</div>
                <p className="text-xs text-muted-foreground">All time earnings</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-32">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-full pb-4">
              <div className="flex-1" />
              <div>
                <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Signup to active</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invite" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invite" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Invite Friends
            </TabsTrigger>
            <TabsTrigger value="referrals">My Referrals</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="invite" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invite Friends & Earn</CardTitle>
                <CardDescription>
                  Share your referral link and earn 10% commission on every tournament entry your friends make
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Referral Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Referral Link</label>
                  <div className="flex gap-2">
                    <Input value={referralLink} readOnly className="font-mono text-sm" />
                    <Button variant="outline" onClick={handleCopyLink}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-muted border rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    How the Referral Program Works
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <Share2 className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h4 className="font-medium">1. Share Your Link</h4>
                      <p className="text-sm text-muted-foreground">Send your unique referral link to friends</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <UserPlus className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h4 className="font-medium">2. Friends Sign Up</h4>
                      <p className="text-sm text-muted-foreground">They register using your referral link</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <DollarSign className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h4 className="font-medium">3. You Earn</h4>
                      <p className="text-sm text-muted-foreground">Get 10% of their tournament entries</p>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 p-4 rounded-lg bg-muted">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Gift className="h-5 w-5 text-green-600" />
                      Your Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• 10% commission on all tournament entries</li>
                      <li>• Lifetime earnings from your referrals</li>
                      <li>• No limit on number of referrals</li>
                      <li>• Instant payouts to your balance</li>
                    </ul>
                  </div>
                  <div className="space-y-3 p-4 rounded-lg bg-muted">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Friend Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• $5 welcome bonus on first deposit</li>
                      <li>• Access to exclusive tournaments</li>
                      <li>• Lower tournament entry fees</li>
                      <li>• Priority customer support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>My Referrals ({filteredReferrals.length})</CardTitle>
                <CardDescription>Track your referred users and their activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search referrals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {/* Referrals Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tournaments</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Your Earnings</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReferrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{referral.name}</div>
                            <div className="text-sm text-muted-foreground">{referral.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={referral.isActive ? "default" : "secondary"}>
                            {referral.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{referral.totalTournaments}</TableCell>
                        <TableCell>{formatBalance(referral.totalSpent)}</TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          {formatBalance(referral.totalSpent * 0.1)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(referral.registrationDate)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredReferrals.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No referrals yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm ? "No referrals match your search" : "Start inviting friends to see them here"}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => {
                        if (typeof window !== 'undefined') {
                          document.querySelector('[value="invite"]')?.click()
                        }
                      }}>
                        Invite Friends
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Earnings Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Earnings Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <div>
                        <div className="text-sm text-green-700">Total Earnings</div>
                        <div className="text-2xl font-bold text-green-900">{formatBalance(stats.totalEarnings)}</div>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>

                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <div>
                        <div className="text-sm text-blue-700">This Month</div>
                        <div className="text-xl font-bold text-blue-900">{formatBalance(stats.thisMonthEarnings)}</div>
                      </div>
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Commission Rate</h4>
                    <div className="text-2xl font-bold text-primary">10%</div>
                    <p className="text-sm text-muted-foreground">On all tournament entries</p>
                  </div>
                </CardContent>
              </Card>

              {/* Top Referrals */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Earning Referrals</CardTitle>
                  <CardDescription>Your most valuable referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referrals
                      .sort((a, b) => b.totalSpent - a.totalSpent)
                      .slice(0, 5)
                      .map((referral, index) => (
                        <div key={referral.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{referral.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {referral.totalTournaments} tournaments
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              {formatBalance(referral.totalSpent * 0.1)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              from {formatBalance(referral.totalSpent)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {referrals.length === 0 && (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No earnings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
