"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Bell, Mail, Smartphone, Save } from "lucide-react"

export default function NotificationsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    tournamentUpdates: true,
    referralNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
  })

  const handleSaveNotifications = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Notifications Updated",
        description: "Your notification preferences have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Bell className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Notification Settings</h1>
              <p className="text-green-100">Control how you receive updates</p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose how you want to be notified about updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <Label>Email Notifications</Label>
                </div>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <Label>Push Notifications</Label>
                </div>
                <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Tournament Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about tournament results and updates</p>
              </div>
              <Switch
                checked={notifications.tournamentUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, tournamentUpdates: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Referral Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about referral bonuses and activity</p>
              </div>
              <Switch
                checked={notifications.referralNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, referralNotifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Important security notifications</p>
              </div>
              <Switch
                checked={notifications.securityAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, securityAlerts: checked })}
              />
            </div>
          </div>

          <Button onClick={handleSaveNotifications} disabled={loading} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
