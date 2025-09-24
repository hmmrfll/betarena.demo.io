"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, CheckCircle, AlertTriangle } from "lucide-react"

export default function SecurityPage() {
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: "30",
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Security Settings</h1>
              <p className="text-red-100">Protect your account</p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>Manage your account security and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <Label>Two-Factor Authentication</Label>
                  {security.twoFactorEnabled ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Disabled
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Button variant={security.twoFactorEnabled ? "outline" : "default"}>
                {security.twoFactorEnabled ? "Disable" : "Enable"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Change Password</Label>
              <div className="space-y-2">
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="outline" size="sm">
                Update Password
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Login Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
              </div>
              <Switch
                checked={security.loginNotifications}
                onCheckedChange={(checked) => setSecurity({ ...security, loginNotifications: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
