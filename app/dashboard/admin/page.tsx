"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAdminStore } from "@/lib/admin-store"
import { useState } from "react"
import { Users, Trophy, DollarSign, Settings, Plus, Edit, Trash2, Eye } from "lucide-react"

export default function AdminPage() {
  const { users, tournaments, createTournament, updateTournament, deleteTournament } = useAdminStore()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTournament, setEditingTournament] = useState<any>(null)
  const [newTournament, setNewTournament] = useState({
    name: "",
    description: "",
    game: "",
    buyIn: 0,
    maxParticipants: 100,
    startDate: "",
    endDate: "",
  })

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance)
  }

  const handleCreateTournament = () => {
    const tournament = {
      ...newTournament,
      id: Date.now().toString(),
      participants: 0,
      prizePool: newTournament.buyIn * newTournament.maxParticipants * 0.9, // 90% of total buy-ins
      status: "upcoming" as const,
    }
    createTournament(tournament)
    setNewTournament({
      name: "",
      description: "",
      game: "",
      buyIn: 0,
      maxParticipants: 100,
      startDate: "",
      endDate: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditTournament = (tournament: any) => {
    setEditingTournament(tournament)
    setNewTournament({
      name: tournament.name,
      description: tournament.description,
      game: tournament.game,
      buyIn: tournament.buyIn,
      maxParticipants: tournament.maxParticipants,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
    })
  }

  const handleUpdateTournament = () => {
    if (editingTournament) {
      const updatedTournament = {
        ...editingTournament,
        ...newTournament,
        prizePool: newTournament.buyIn * newTournament.maxParticipants * 0.9,
      }
      updateTournament(editingTournament.id, updatedTournament)
      setEditingTournament(null)
      setNewTournament({
        name: "",
        description: "",
        game: "",
        buyIn: 0,
        maxParticipants: 100,
        startDate: "",
        endDate: "",
      })
    }
  }

  const totalUsers = users.length
  const activeTournaments = tournaments.filter((t) => t.status === "active").length
  const totalRevenue = tournaments.reduce((sum, t) => sum + t.prizePool * 0.1, 0) // 10% platform fee

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-balance">Admin Dashboard</h1>
          <p className="text-purple-100">Manage users, tournaments, and platform settings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTournaments}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBalance(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">10% platform fee</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Tournament Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Tournament Management</CardTitle>
                <CardDescription>Create and manage tournaments</CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Tournament
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Tournament</DialogTitle>
                    <DialogDescription>Fill in the tournament details below</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Tournament Name</Label>
                        <Input
                          id="name"
                          value={newTournament.name}
                          onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                          placeholder="Enter tournament name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="game">Game</Label>
                        <Select
                          value={newTournament.game}
                          onValueChange={(value) => setNewTournament({ ...newTournament, game: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select game" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="football">Football</SelectItem>
                            <SelectItem value="basketball">Basketball</SelectItem>
                            <SelectItem value="soccer">Soccer</SelectItem>
                            <SelectItem value="tennis">Tennis</SelectItem>
                            <SelectItem value="esports">Esports</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTournament.description}
                        onChange={(e) => setNewTournament({ ...newTournament, description: e.target.value })}
                        placeholder="Enter tournament description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="buyIn">Buy-in Amount ($)</Label>
                        <Input
                          id="buyIn"
                          type="number"
                          value={newTournament.buyIn}
                          onChange={(e) =>
                            setNewTournament({ ...newTournament, buyIn: Number.parseFloat(e.target.value) || 0 })
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxParticipants">Max Participants</Label>
                        <Input
                          id="maxParticipants"
                          type="number"
                          value={newTournament.maxParticipants}
                          onChange={(e) =>
                            setNewTournament({
                              ...newTournament,
                              maxParticipants: Number.parseInt(e.target.value) || 100,
                            })
                          }
                          placeholder="100"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={newTournament.startDate}
                          onChange={(e) => setNewTournament({ ...newTournament, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={newTournament.endDate}
                          onChange={(e) => setNewTournament({ ...newTournament, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm font-medium mb-2">Tournament Summary</div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          Prize Pool: {formatBalance(newTournament.buyIn * newTournament.maxParticipants * 0.9)}
                        </div>
                        <div>
                          Platform Fee: {formatBalance(newTournament.buyIn * newTournament.maxParticipants * 0.1)}
                        </div>
                        <div>Max Revenue: {formatBalance(newTournament.buyIn * newTournament.maxParticipants)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTournament}>Create Tournament</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Game</TableHead>
                    <TableHead>Buy-in</TableHead>
                    <TableHead className="hidden md:table-cell">Participants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tournaments.map((tournament) => (
                    <TableRow key={tournament.id}>
                      <TableCell className="font-medium text-sm">{tournament.name}</TableCell>
                      <TableCell className="capitalize text-sm hidden sm:table-cell">{tournament.game}</TableCell>
                      <TableCell className="text-sm">{formatBalance(tournament.buyIn)}</TableCell>
                      <TableCell className="text-sm hidden md:table-cell">
                        {tournament.participants}/{tournament.maxParticipants}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tournament.status === "active"
                              ? "default"
                              : tournament.status === "upcoming"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {tournament.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleEditTournament(tournament)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteTournament(tournament.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Email</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead className="hidden md:table-cell">Role</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-sm">{user.name}</TableCell>
                      <TableCell className="text-sm hidden sm:table-cell">{user.email}</TableCell>
                      <TableCell className="text-sm">{formatBalance(user.balance)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Tournament Dialog */}
        {editingTournament && (
          <Dialog open={!!editingTournament} onOpenChange={() => setEditingTournament(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Tournament</DialogTitle>
                <DialogDescription>Update tournament details</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Tournament Name</Label>
                    <Input
                      id="edit-name"
                      value={newTournament.name}
                      onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-game">Game</Label>
                    <Select
                      value={newTournament.game}
                      onValueChange={(value) => setNewTournament({ ...newTournament, game: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="football">Football</SelectItem>
                        <SelectItem value="basketball">Basketball</SelectItem>
                        <SelectItem value="soccer">Soccer</SelectItem>
                        <SelectItem value="tennis">Tennis</SelectItem>
                        <SelectItem value="esports">Esports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={newTournament.description}
                    onChange={(e) => setNewTournament({ ...newTournament, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-buyIn">Buy-in Amount ($)</Label>
                    <Input
                      id="edit-buyIn"
                      type="number"
                      value={newTournament.buyIn}
                      onChange={(e) =>
                        setNewTournament({ ...newTournament, buyIn: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-maxParticipants">Max Participants</Label>
                    <Input
                      id="edit-maxParticipants"
                      type="number"
                      value={newTournament.maxParticipants}
                      onChange={(e) =>
                        setNewTournament({ ...newTournament, maxParticipants: Number.parseInt(e.target.value) || 100 })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingTournament(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateTournament}>Update Tournament</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}
