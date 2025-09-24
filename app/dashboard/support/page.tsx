"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSupportStore } from "@/lib/support-store"
import {
  MessageCircle,
  Plus,
  Search,
  ThumbsUp,
  ThumbsDown,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Headphones,
  HelpCircle,
  Ticket,
  Sparkles,
  Zap,
  Heart,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const statusColors = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

const statusIcons = {
  open: Clock,
  "in-progress": AlertCircle,
  resolved: CheckCircle,
  closed: XCircle,
}

export default function SupportPage() {
  const { tickets, faqs, createTicket, addResponse, rateFAQ } = useSupportStore()
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    message: "",
    priority: "medium" as const,
    category: "technical" as const,
  })
  const [responseMessage, setResponseMessage] = useState("")
  const [faqSearch, setFaqSearch] = useState("")
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)

  const selectedTicketData = tickets.find((t) => t.id === selectedTicket)
  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase()),
  )

  const handleCreateTicket = () => {
    if (!newTicketForm.subject || !newTicketForm.message) return

    createTicket({
      subject: newTicketForm.subject,
      message: newTicketForm.message,
      priority: newTicketForm.priority,
      category: newTicketForm.category,
      status: "open",
    })

    setNewTicketForm({
      subject: "",
      message: "",
      priority: "medium",
      category: "technical",
    })
    setShowNewTicketForm(false)
  }

  const handleAddResponse = () => {
    if (!selectedTicket || !responseMessage) return

    addResponse(selectedTicket, {
      message: responseMessage,
      isAdmin: false,
    })
    setResponseMessage("")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero section with gradient background and icons */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles className="h-16 w-16" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <Heart className="h-12 w-12" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Headphones className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-balance">Support Center</h1>
                <p className="text-blue-100 mt-1">We're here to help you succeed</p>
              </div>
            </div>
            <p className="text-white/90 max-w-2xl">
              Get instant help with your account, tournaments, and payments. Our support team is ready to assist you
              24/7.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="relative overflow-hidden h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
            <CardContent className="p-4 relative z-10 flex items-center gap-4 h-full">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{tickets.filter((t) => t.status === "resolved").length}</div>
                <p className="text-sm text-muted-foreground">Resolved Tickets</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
            <CardContent className="p-4 relative z-10 flex items-center gap-4 h-full">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {tickets.filter((t) => t.status === "open" || t.status === "in-progress").length}
                </div>
                <p className="text-sm text-muted-foreground">Active Tickets</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
            <CardContent className="p-4 relative z-10 flex items-center gap-4 h-full">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">&lt; 2h</div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Support Tickets
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Your Support Tickets
              </h2>
              <Button
                onClick={() => setShowNewTicketForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>

            {showNewTicketForm && (
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Support Ticket
                  </CardTitle>
                  <CardDescription>Describe your issue and we'll help you resolve it quickly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTicketForm.priority}
                        onValueChange={(value: any) => setNewTicketForm((prev) => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newTicketForm.category}
                        onValueChange={(value: any) => setNewTicketForm((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="tournament">Tournament</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={newTicketForm.subject}
                      onChange={(e) => setNewTicketForm((prev) => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Provide detailed information about your issue"
                      rows={4}
                      value={newTicketForm.message}
                      onChange={(e) => setNewTicketForm((prev) => ({ ...prev, message: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateTicket}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Create Ticket
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewTicketForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  Tickets
                </h3>
                <div className="space-y-3">
                  {tickets.map((ticket) => {
                    const StatusIcon = statusIcons[ticket.status]
                    return (
                      <Card
                        key={ticket.id}
                        className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${selectedTicket === ticket.id ? "ring-2 ring-primary shadow-lg" : ""}`}
                        onClick={() => setSelectedTicket(ticket.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-sm line-clamp-1">{ticket.subject}</h4>
                            <div className="flex gap-2 flex-shrink-0 ml-2">
                              <Badge className={priorityColors[ticket.priority]} variant="secondary">
                                {ticket.priority}
                              </Badge>
                              <Badge className={statusColors[ticket.status]} variant="secondary">
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {ticket.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{ticket.message}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>#{ticket.id}</span>
                            <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {selectedTicketData && (
                <div className="space-y-4">
                  <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{selectedTicketData.subject}</CardTitle>
                          <CardDescription>Ticket #{selectedTicketData.id}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={priorityColors[selectedTicketData.priority]} variant="secondary">
                            {selectedTicketData.priority}
                          </Badge>
                          <Badge className={statusColors[selectedTicketData.status]} variant="secondary">
                            {selectedTicketData.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">You</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(selectedTicketData.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                              <p className="text-sm">{selectedTicketData.message}</p>
                            </div>
                          </div>
                        </div>

                        {selectedTicketData.responses.map((response) => (
                          <div key={response.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={response.isAdmin ? "bg-primary text-primary-foreground" : ""}>
                                {response.isAdmin ? "BA" : "You"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {response.isAdmin ? "BetArena Support" : "You"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <div className={`p-3 rounded-lg ${response.isAdmin ? "bg-primary/10" : "bg-muted"}`}>
                                <p className="text-sm">{response.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedTicketData.status !== "closed" && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <Label htmlFor="response">Add Response</Label>
                            <Textarea
                              id="response"
                              placeholder="Type your response..."
                              rows={3}
                              value={responseMessage}
                              onChange={(e) => setResponseMessage(e.target.value)}
                            />
                            <Button
                              onClick={handleAddResponse}
                              disabled={!responseMessage}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              Send Response
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Live Chat Support
                </CardTitle>
                <CardDescription>Chat with our support team in real-time</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Live Chat Coming Soon</h3>
                    <p className="text-muted-foreground mb-4">
                      We're working on bringing you real-time chat support. In the meantime, please use support tickets
                      for assistance.
                    </p>
                    <Button
                      onClick={() => setShowNewTicketForm(true)}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Create Support Ticket
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQ..."
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id} className="relative overflow-hidden hover:shadow-md transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
                    <CardContent className="p-6 relative z-10">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-purple-600" />
                            {faq.question}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                            {faq.category}
                          </Badge>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Was this helpful?</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => rateFAQ(faq.id, true)}
                                className="h-8 px-2 hover:bg-green-500/10"
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {faq.helpful}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => rateFAQ(faq.id, false)}
                                className="h-8 px-2 hover:bg-red-500/10"
                              >
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                {faq.notHelpful}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
