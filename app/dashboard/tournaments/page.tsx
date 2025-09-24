"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTournamentStore } from "@/lib/tournament-store"
import { useState } from "react"
import Link from "next/link"
import { Calendar, Users, DollarSign, Trophy, Search, Filter, Target, Crown, Medal, Award } from "lucide-react"

export default function TournamentsPage() {
  const { tournaments } = useTournamentStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sportFilter, setSportFilter] = useState("all")

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "completed":
        return "outline"
      case "canceled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch =
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter
    const matchesSport = sportFilter === "all" || tournament.sport === sportFilter
    return matchesSearch && matchesStatus && matchesSport
  })

  // Mock leaderboard data
  const leaderboard = [
    { id: 1, name: "Alex Johnson", points: 2450, earnings: 15420 },
    { id: 2, name: "Sarah Chen", points: 2380, earnings: 14200 },
    { id: 3, name: "Mike Rodriguez", points: 2290, earnings: 13100 },
    { id: 4, name: "Emma Wilson", points: 2150, earnings: 11800 },
    { id: 5, name: "David Kim", points: 2080, earnings: 10900 },
    { id: 6, name: "Lisa Brown", points: 1950, earnings: 9600 },
    { id: 7, name: "Tom Anderson", points: 1890, earnings: 8800 },
    { id: 8, name: "Anna Davis", points: 1820, earnings: 8200 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-balance">Tournaments</h1>
          <p className="text-purple-100">Join tournaments and compete with other players for amazing prizes!</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left side - Tournaments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tournaments</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs value={sportFilter} onValueChange={setSportFilter}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Sports</TabsTrigger>
                <TabsTrigger value="football">Football</TabsTrigger>
                <TabsTrigger value="hockey">Hockey</TabsTrigger>
                <TabsTrigger value="basketball">Basketball</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredTournaments.map((tournament) => (
                <Card key={tournament.id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-500" />
                        {tournament.name}
                      </CardTitle>
                      <Badge variant={getStatusColor(tournament.status)}>{tournament.status}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{tournament.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-4 text-sm flex-1">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>Buy-in: {formatBalance(tournament.buyIn)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span>Prize: {formatBalance(tournament.prizePool)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>
                          {tournament.participants}/{tournament.maxParticipants}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span>{formatDate(tournament.startDate)}</span>
                      </div>
                    </div>

                    <div className="pt-2 mt-auto">
                      <Button asChild className="w-full">
                        <Link href={`/dashboard/tournaments/${tournament.id}`}>
                          {tournament.status === "active" ? "Join Tournament" : "View Details"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTournaments.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Check back later for new tournaments"}
                </p>
                <Button>
                  <Trophy className="h-4 w-4 mr-2" />
                  Create Tournament
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Player Leaderboard
                </CardTitle>
                <CardDescription>Top players by points and earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {index === 0 && <Crown className="h-6 w-6 text-yellow-500" />}
                      {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                      {index === 2 && <Award className="h-6 w-6 text-amber-600" />}
                      {index > 2 && (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{player.name}</div>
                      <div className="text-sm text-muted-foreground">{player.points.toLocaleString()} pts</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{formatBalance(player.earnings)}</div>
                      <div className="text-xs text-muted-foreground">earned</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
