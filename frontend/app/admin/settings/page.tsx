"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Mail, Bell, Shield, Database, Save } from "lucide-react"

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage platform settings and configurations</p>
        </div>

        {/* Email Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Mail className="h-5 w-5 mr-2 text-white" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="admin-email" className="text-white">
                Admin Notification Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                defaultValue="info@guestpostnow.io"
                className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
              <p className="text-sm text-gray-400 mt-1">All admin notifications will be sent to this email address</p>
            </div>

            <div>
              <Label htmlFor="smtp-host" className="text-white">
                SMTP Host
              </Label>
              <Input
                id="smtp-host"
                placeholder="smtp.gmail.com"
                className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtp-port" className="text-white">
                  SMTP Port
                </Label>
                <Input
                  id="smtp-port"
                  placeholder="587"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="smtp-username" className="text-white">
                  SMTP Username
                </Label>
                <Input
                  id="smtp-username"
                  placeholder="your-email@gmail.com"
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <Button className="text-white">
              <Save className="h-4 w-4 mr-2 text-white" />
              Save Email Settings
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Bell className="h-5 w-5 mr-2 text-white" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">New User Registration</Label>
                <p className="text-sm text-gray-400">Get notified when new users register</p>
              </div>
              <Switch defaultChecked className="text-white" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Fund Requests</Label>
                <p className="text-sm text-gray-400">Get notified about new fund requests</p>
              </div>
              <Switch defaultChecked className="text-white" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Large Orders</Label>
                <p className="text-sm text-gray-400">Get notified about orders over $500</p>
              </div>
              <Switch className="text-white" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">System Errors</Label>
                <p className="text-sm text-gray-400">Get notified about system errors</p>
              </div>
              <Switch className="text-white" />
            </div>

            <Button className="text-white">
              <Save className="h-4 w-4 mr-2 text-white" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Shield className="h-5 w-5 mr-2 text-white" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-400">Enable 2FA for admin accounts</p>
              </div>
              <Switch className="text-white" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">IP Whitelist</Label>
                <p className="text-sm text-gray-400">Restrict admin access to specific IPs</p>
              </div>
              <Switch className="text-white" />
            </div>

            <div>
              <Label htmlFor="session-timeout" className="text-white">
                Session Timeout (minutes)
              </Label>
              <Input
                id="session-timeout"
                type="number"
                defaultValue="60"
                className="mt-1 max-w-xs bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            <Button className="text-white">
              <Save className="h-4 w-4 mr-2 text-white" />
              Save Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Database className="h-5 w-5 mr-2 text-white" />
              Platform Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="platform-name" className="text-white">
                Platform Name
              </Label>
              <Input
                id="platform-name"
                defaultValue="GuestPostNow.io"
                className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="support-email" className="text-white">
                Support Email
              </Label>
              <Input
                id="support-email"
                type="email"
                defaultValue="support@guestpostnow.io"
                className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="maintenance-message" className="text-white">
                Maintenance Message
              </Label>
              <Textarea
                id="maintenance-message"
                placeholder="We are currently performing scheduled maintenance..."
                className="mt-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Maintenance Mode</Label>
                <p className="text-sm text-gray-400">Enable maintenance mode for the platform</p>
              </div>
              <Switch className="text-white" />
            </div>

            <Button className="text-white">
              <Save className="h-4 w-4 mr-2 text-white" />
              Save Platform Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
