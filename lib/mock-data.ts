export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "tournament_entry" | "tournament_win"
  amount: number
  status: "pending" | "confirmed" | "failed" | "canceled"
  date: string
  description: string
}

export interface Tournament {
  id: string
  name: string
  description: string
  buyIn: number
  prizePool: number
  participants: number
  maxParticipants: number
  startDate: string
  endDate: string
  status: "pending" | "active" | "completed" | "canceled"
  matches: Match[]
}

export interface Match {
  id: string
  team1: string
  team2: string
  date: string
  odds: {
    team1: number
    draw: number
    team2: number
  }
  result?: "team1" | "draw" | "team2"
}

export interface Referral {
  id: string
  email: string
  name: string
  registrationDate: string
  isActive: boolean
  totalTournaments: number
  totalSpent: number
}

// Mock data
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "deposit",
    amount: 500,
    status: "confirmed",
    date: "2024-01-15T10:30:00Z",
    description: "USDT Deposit via TRC-20",
  },
  {
    id: "2",
    type: "tournament_entry",
    amount: -50,
    status: "confirmed",
    date: "2024-01-14T15:45:00Z",
    description: "Premier League Predictions Tournament",
  },
  {
    id: "3",
    type: "tournament_win",
    amount: 150,
    status: "confirmed",
    date: "2024-01-13T20:00:00Z",
    description: "Champions League Tournament - 3rd Place",
  },
  {
    id: "4",
    type: "withdrawal",
    amount: -200,
    status: "pending",
    date: "2024-01-12T09:15:00Z",
    description: "USDC Withdrawal to 0x1234...5678",
  },
]

export const mockTournaments: Tournament[] = [
  {
    id: "1",
    name: "Premier League Predictions",
    description: "Predict the outcomes of Premier League matches this weekend",
    buyIn: 25,
    prizePool: 1000,
    participants: 38,
    maxParticipants: 50,
    startDate: "2024-01-20T00:00:00Z",
    endDate: "2024-01-22T23:59:59Z",
    status: "active",
    matches: [
      {
        id: "1",
        team1: "Manchester City",
        team2: "Arsenal",
        date: "2024-01-20T15:00:00Z",
        odds: { team1: 2.1, draw: 3.2, team2: 3.8 },
      },
      {
        id: "2",
        team1: "Liverpool",
        team2: "Chelsea",
        date: "2024-01-21T17:30:00Z",
        odds: { team1: 1.8, draw: 3.5, team2: 4.2 },
      },
      {
        id: "3",
        team1: "Manchester United",
        team2: "Tottenham",
        date: "2024-01-21T12:30:00Z",
        odds: { team1: 2.3, draw: 3.1, team2: 3.4 },
      },
      {
        id: "4",
        team1: "Newcastle",
        team2: "Brighton",
        date: "2024-01-22T14:00:00Z",
        odds: { team1: 1.9, draw: 3.4, team2: 4.1 },
      },
    ],
  },
  {
    id: "2",
    name: "Champions League Quarter Finals",
    description: "Predict the Champions League quarter-final results",
    buyIn: 50,
    prizePool: 2500,
    participants: 45,
    maxParticipants: 60,
    startDate: "2024-01-25T00:00:00Z",
    endDate: "2024-01-27T23:59:59Z",
    status: "pending",
    matches: [
      {
        id: "5",
        team1: "Real Madrid",
        team2: "Bayern Munich",
        date: "2024-01-25T20:00:00Z",
        odds: { team1: 2.2, draw: 3.0, team2: 3.5 },
      },
      {
        id: "6",
        team1: "Barcelona",
        team2: "PSG",
        date: "2024-01-26T20:00:00Z",
        odds: { team1: 2.0, draw: 3.2, team2: 3.8 },
      },
    ],
  },
  {
    id: "3",
    name: "La Liga Weekend Special",
    description: "Weekend La Liga matches prediction tournament",
    buyIn: 15,
    prizePool: 750,
    participants: 50,
    maxParticipants: 50,
    startDate: "2024-01-10T00:00:00Z",
    endDate: "2024-01-12T23:59:59Z",
    status: "completed",
    matches: [
      {
        id: "7",
        team1: "Real Madrid",
        team2: "Atletico Madrid",
        date: "2024-01-10T21:00:00Z",
        odds: { team1: 1.7, draw: 3.8, team2: 4.5 },
        result: "team1",
      },
      {
        id: "8",
        team1: "Barcelona",
        team2: "Sevilla",
        date: "2024-01-11T16:15:00Z",
        odds: { team1: 1.5, draw: 4.2, team2: 6.0 },
        result: "team1",
      },
    ],
  },
]

export const mockReferrals: Referral[] = [
  {
    id: "1",
    email: "friend1@example.com",
    name: "Alice Johnson",
    registrationDate: "2024-01-10T12:00:00Z",
    isActive: true,
    totalTournaments: 5,
    totalSpent: 125,
  },
  {
    id: "2",
    email: "friend2@example.com",
    name: "Bob Smith",
    registrationDate: "2024-01-08T14:30:00Z",
    isActive: true,
    totalTournaments: 3,
    totalSpent: 75,
  },
  {
    id: "3",
    email: "friend3@example.com",
    name: "Carol Davis",
    registrationDate: "2024-01-05T09:15:00Z",
    isActive: false,
    totalTournaments: 1,
    totalSpent: 25,
  },
]
