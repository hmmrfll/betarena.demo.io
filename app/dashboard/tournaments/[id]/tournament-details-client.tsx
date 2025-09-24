"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTournamentStore } from "@/lib/tournament-store"
import { useAuthStore } from "@/lib/auth-store"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Users, DollarSign, Trophy, Clock, Target, Medal } from "lucide-react"

export function TournamentDetailsClient() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const { tournaments, joinTournament, savePredictions, getTournamentPredictions, getLeaderboard } =
    useTournamentStore()

  const [predictions, setPredictions] = useState<Record<string, "team1" | "draw" | "team2">>({})
  const [isJoining, setIsJoining] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const tournamentId = params.id as string
  const tournament = tournaments.find((t) => t.id === tournamentId)
  const userPredictions = getTournamentPredictions(tournamentId)
  const leaderboard = getLeaderboard(tournamentId)

  useEffect(() => {
    if (userPredictions) {
      const predictionMap: Record<string, "team1" | "draw" | "team2"> = {}
      userPredictions.predictions.forEach((p) => {
        predictionMap[p.matchId] = p.prediction
      })
      setPredictions(predictionMap)
    }
  }, [userPredictions])

  if (!tournament) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Tournament not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </DashboardLayout>
    )
  }

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const handleJoinTournament = async () => {
    if (!user || user.balance < tournament.buyIn) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to join this tournament",
        variant: "destructive",
      })
      return
    }

    setIsJoining(true)
    try {
      const success = await joinTournament(tournamentId)
      if (success) {
        toast({
          title: "Tournament joined!",
          description: "You have successfully joined the tournament",
        })
      } else {
        toast({
          title: "Failed to join",
          description: "Tournament is full or no longer available",
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
      setIsJoining(false)
    }
  }

  const handlePredictionChange = (matchId: string, prediction: "team1" | "draw" | "team2") => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: prediction,
    }))
  }

  const handleSavePredictions = async () => {
    const predictionArray = Object.entries(predictions).map(([matchId, prediction]) => ({
      matchId,
      prediction,
    }))

    if (predictionArray.length === 0) {
      toast({
        title: "No predictions",
        description: "Please make at least one prediction",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const success = await savePredictions(tournamentId, predictionArray)
      if (success) {
        toast({
          title: "Predictions saved!",
          description: "Your predictions have been submitted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save predictions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const predictionCount = Object.keys(predictions).length
  const maxPredictions = 10

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Tournament Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-balance">{tournament.name}</h1>
              <Badge variant={getStatusColor(tournament.status)}>{tournament.status}</Badge>
            </div>
            <p className="text-muted-foreground">{tournament.description}</p>
          </div>
          {tournament.status === "active" && !userPredictions?.submitted && (
            <Button onClick={handleJoinTournament} disabled={isJoining} size="lg">
              {isJoining ? "Joining..." : `Join for ${formatBalance(tournament.buyIn)}`}
            </Button>
          )}
        </div>

        {/* Tournament Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buy-in</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBalance(tournament.buyIn)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prize Pool</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatBalance(tournament.prizePool)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tournament.participants}/{tournament.maxParticipants}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div>{formatDate(tournament.startDate)}</div>
                <div className="text-muted-foreground">to {formatDate(tournament.endDate)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tournament Content */}
        <Tabs defaultValue="matches" className="space-y-4">
          <TabsList>
            <TabsTrigger value="matches">Matches & Predictions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="matches" className="space-y-4">
            {tournament.matches.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    <span className="font-medium">
                      Predictions: {predictionCount}/{maxPredictions} (max)
                    </span>
                  </div>
                  {tournament.status === "active" && predictionCount > 0 && (
                    <Button onClick={handleSavePredictions} disabled={isSaving || userPredictions?.submitted}>
                      {isSaving
                        ? "Saving..."
                        : userPredictions?.submitted
                          ? "Predictions Submitted"
                          : "Save Predictions"}
                    </Button>
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Match Predictions</CardTitle>
                    <CardDescription>
                      Select your predictions for each match. You can predict up to {maxPredictions} matches.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tournament.matches.map((match) => (
                        <div key={match.id} className="border rounded-lg p-4">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-4 text-lg font-semibold">
                                <span>{match.team1}</span>
                                <span className="text-muted-foreground">vs</span>
                                <span>{match.team2}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">{formatDate(match.date)}</div>
                              <div className="flex gap-4 text-sm">
                                <span>1: {match.odds.team1}</span>
                                <span>X: {match.odds.draw}</span>
                                <span>2: {match.odds.team2}</span>
                              </div>
                            </div>

                            {tournament.status === "active" && !userPredictions?.submitted && (
                              <div className="flex gap-2">
                                <Button
                                  variant={predictions[match.id] === "team1" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handlePredictionChange(match.id, "team1")}
                                  disabled={predictionCount >= maxPredictions && !predictions[match.id]}
                                >
                                  1
                                </Button>
                                <Button
                                  variant={predictions[match.id] === "draw" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handlePredictionChange(match.id, "draw")}
                                  disabled={predictionCount >= maxPredictions && !predictions[match.id]}
                                >
                                  X
                                </Button>
                                <Button
                                  variant={predictions[match.id] === "team2" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handlePredictionChange(match.id, "team2")}
                                  disabled={predictionCount >= maxPredictions && !predictions[match.id]}
                                >
                                  2
                                </Button>
                              </div>
                            )}

                            {userPredictions?.submitted && predictions[match.id] && (
                              <Badge variant="secondary">
                                Predicted:{" "}
                                {predictions[match.id] === "team1" ? "1" : predictions[match.id] === "draw" ? "X" : "2"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No matches available</h3>
                  <p className="text-muted-foreground">Matches will be added closer to the tournament start date.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5" />
                  Tournament Leaderboard
                </CardTitle>
                <CardDescription>Current standings and player performance</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Correct</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Accuracy</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((entry, index) => (
                        <TableRow key={entry.userId}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {index + 1}
                              {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                              {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                              {index === 2 && <Medal className="h-4 w-4 text-amber-600" />}
                            </div>
                          </TableCell>
                          <TableCell>{entry.username}</TableCell>
                          <TableCell className="font-semibold">{entry.points}</TableCell>
                          <TableCell>{entry.correctPredictions}</TableCell>
                          <TableCell>{entry.totalPredictions}</TableCell>
                          <TableCell>
                            {entry.totalPredictions > 0
                              ? `${Math.round((entry.correctPredictions / entry.totalPredictions) * 100)}%`
                              : "0%"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No leaderboard data</h3>
                    <p className="text-muted-foreground">Leaderboard will be available once the tournament starts.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How to Play</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Join the tournament by paying the buy-in fee</li>
                    <li>Make predictions on match outcomes (1 = Team 1 wins, X = Draw, 2 = Team 2 wins)</li>
                    <li>You can predict up to {maxPredictions} matches maximum</li>
                    <li>Predictions must be submitted before the tournament deadline</li>
                    <li>Points are awarded for correct predictions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Scoring System</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Correct prediction: 5 points</li>
                    <li>Incorrect prediction: 0 points</li>
                    <li>Bonus points may be awarded for difficult predictions</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Prize Distribution</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>1st Place: 50% of prize pool</li>
                    <li>2nd Place: 30% of prize pool</li>
                    <li>3rd Place: 20% of prize pool</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Important Notes</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>All predictions are final once submitted</li>
                    <li>Tournament results are based on official match outcomes</li>
                    <li>Prizes are automatically credited to your account</li>
                    <li>In case of ties, prizes are split equally</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
