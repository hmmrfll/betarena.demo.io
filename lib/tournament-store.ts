import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockTournaments, type Tournament } from "./mock-data"

interface Prediction {
  matchId: string
  prediction: "team1" | "draw" | "team2"
}

interface TournamentPredictions {
  tournamentId: string
  predictions: Prediction[]
  submitted: boolean
}

interface LeaderboardEntry {
  userId: string
  username: string
  points: number
  correctPredictions: number
  totalPredictions: number
}

interface TournamentState {
  tournaments: Tournament[]
  userPredictions: TournamentPredictions[]
  leaderboards: Record<string, LeaderboardEntry[]>
  joinTournament: (tournamentId: string) => Promise<boolean>
  savePredictions: (tournamentId: string, predictions: Prediction[]) => Promise<boolean>
  getTournamentPredictions: (tournamentId: string) => TournamentPredictions | undefined
  getLeaderboard: (tournamentId: string) => LeaderboardEntry[]
}

// Mock leaderboard data
const mockLeaderboards: Record<string, LeaderboardEntry[]> = {
  "1": [
    { userId: "1", username: "PredictionMaster", points: 85, correctPredictions: 17, totalPredictions: 20 },
    { userId: "2", username: "FootballGuru", points: 82, correctPredictions: 16, totalPredictions: 19 },
    { userId: "3", username: "BetKing", points: 78, correctPredictions: 15, totalPredictions: 18 },
    { userId: "4", username: "SportsFan", points: 75, correctPredictions: 15, totalPredictions: 20 },
    { userId: "5", username: "LuckyBetter", points: 72, correctPredictions: 14, totalPredictions: 18 },
  ],
  "2": [
    { userId: "6", username: "ChampionsExpert", points: 90, correctPredictions: 18, totalPredictions: 20 },
    { userId: "7", username: "EuropeKnows", points: 87, correctPredictions: 17, totalPredictions: 19 },
  ],
  "3": [
    { userId: "8", username: "LaLigaPro", points: 95, correctPredictions: 19, totalPredictions: 20 },
    { userId: "9", username: "SpanishFootball", points: 88, correctPredictions: 17, totalPredictions: 19 },
  ],
}

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set, get) => ({
      tournaments: mockTournaments,
      userPredictions: [],
      leaderboards: mockLeaderboards,

      joinTournament: async (tournamentId: string) => {
        // Mock joining tournament
        const tournaments = get().tournaments
        const tournament = tournaments.find((t) => t.id === tournamentId)
        if (tournament && tournament.participants < tournament.maxParticipants) {
          const updatedTournaments = tournaments.map((t) =>
            t.id === tournamentId ? { ...t, participants: t.participants + 1 } : t,
          )
          set({ tournaments: updatedTournaments })
          return true
        }
        return false
      },

      savePredictions: async (tournamentId: string, predictions: Prediction[]) => {
        const userPredictions = get().userPredictions
        const existingIndex = userPredictions.findIndex((p) => p.tournamentId === tournamentId)

        const newPrediction: TournamentPredictions = {
          tournamentId,
          predictions,
          submitted: true,
        }

        if (existingIndex >= 0) {
          const updated = [...userPredictions]
          updated[existingIndex] = newPrediction
          set({ userPredictions: updated })
        } else {
          set({ userPredictions: [...userPredictions, newPrediction] })
        }
        return true
      },

      getTournamentPredictions: (tournamentId: string) => {
        return get().userPredictions.find((p) => p.tournamentId === tournamentId)
      },

      getLeaderboard: (tournamentId: string) => {
        return get().leaderboards[tournamentId] || []
      },
    }),
    {
      name: "tournament-storage",
    },
  ),
)
