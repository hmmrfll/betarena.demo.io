"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye } from "lucide-react"

export default function PrivacyPage() {
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showBalance: false,
    showStats: true,
    allowMessages: true,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Eye className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Settings</h1>
              <p className="text-purple-100">Control your information visibility</p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>Control who can see your information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Visibility</Label>
              <Select
                value={privacy.profileVisibility}
                onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private - Only me</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Show Balance</Label>
                <p className="text-sm text-muted-foreground">Display your balance on your profile</p>
              </div>
              <Switch
                checked={privacy.showBalance}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, showBalance: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Show Statistics</Label>
                <p className="text-sm text-muted-foreground">Display your tournament statistics</p>
              </div>
              <Switch
                checked={privacy.showStats}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, showStats: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
