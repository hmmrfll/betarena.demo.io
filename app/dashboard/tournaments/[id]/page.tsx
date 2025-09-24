import { TournamentDetailsClient } from "./tournament-details-client"

// Generate static params for all tournament IDs
export async function generateStaticParams() {
  // For static export, we need to provide all possible tournament IDs
  // Since this is a demo app, we'll return some sample IDs
  return [
    { id: "tournament-1" },
    { id: "tournament-2" },
    { id: "tournament-3" },
  ]
}

export default function TournamentDetailsPage() {
  return <TournamentDetailsClient />
}
