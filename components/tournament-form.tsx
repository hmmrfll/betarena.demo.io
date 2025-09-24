"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, Trophy, Users, DollarSign, Save, X } from "lucide-react"

interface Tournament {
  id?: string
  name: string
  description: string
  game: string
  entryFee: number
  maxParticipants: number
  startDate: string
  endDate: string
  prizePool: number
  status: string
  isPublic: boolean
  rules: string
}

interface TournamentFormProps {
  tournament?: Tournament
  onSave: (tournament: Tournament) => void
  onCancel: () => void
}

export function TournamentForm({ tournament, onSave, onCancel }: TournamentFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Tournament>({
    name: tournament?.name || "",
    description: tournament?.description || "",
    game: tournament?.game || "",
    entryFee: tournament?.entryFee || 0,
    maxParticipants: tournament?.maxParticipants || 100,
    startDate: tournament?.startDate || "",
    endDate: tournament?.endDate || "",
    prizePool: tournament?.prizePool || 0,
    status: tournament?.status || "upcoming",
    isPublic: tournament?.isPublic ?? true,
    rules: tournament?.rules || "",
    ...tournament,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form
      if (!formData.name || !formData.game || !formData.startDate) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Calculate prize pool if not set
      if (formData.prizePool === 0) {
        formData.prizePool = formData.entryFee * formData.maxParticipants * 0.9 // 90% of total entry fees
      }

      await onSave(formData)

      toast({
        title: tournament ? "Tournament Updated" : "Tournament Created",
        description: `Tournament "${formData.name}" has been ${tournament ? "updated" : "created"} successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${tournament ? "update" : "create"} tournament. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          {tournament ? "Edit Tournament" : "Create New Tournament"}
        </CardTitle>
        <CardDescription>
          {tournament ? "Update tournament details and settings" : "Set up a new tournament for your platform"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter tournament name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="game">Game *</Label>
              <Select value={formData.game} onValueChange={(value) => setFormData({ ...formData, game: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CS2">Counter-Strike 2</SelectItem>
                  <SelectItem value="Valorant">Valorant</SelectItem>
                  <SelectItem value="League of Legends">League of Legends</SelectItem>
                  <SelectItem value="Dota 2">Dota 2</SelectItem>
                  <SelectItem value="Fortnite">Fortnite</SelectItem>
                  <SelectItem value="Apex Legends">Apex Legends</SelectItem>
                  <SelectItem value="Rocket League">Rocket League</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the tournament..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="entryFee" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Entry Fee ($)
              </Label>
              <Input
                id="entryFee"
                type="number"
                min="0"
                step="0.01"
                value={formData.entryFee}
                onChange={(e) => setFormData({ ...formData, entryFee: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxParticipants" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Max Participants
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                min="2"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: Number.parseInt(e.target.value) || 100 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prizePool" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Prize Pool ($)
              </Label>
              <Input
                id="prizePool"
                type="number"
                min="0"
                step="0.01"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: Number.parseFloat(e.target.value) || 0 })}
                placeholder="Auto-calculated if empty"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                End Date
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Public Tournament</Label>
                <p className="text-sm text-muted-foreground">Make this tournament visible to all users</p>
              </div>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rules">Tournament Rules</Label>
              <Textarea
                id="rules"
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                placeholder="Enter tournament rules and regulations..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : tournament ? "Update Tournament" : "Create Tournament"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
