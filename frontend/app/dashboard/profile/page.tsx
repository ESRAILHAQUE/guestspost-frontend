"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Building, MapPin, Calendar, Edit, Save, X, Plus } from "lucide-react"
import { useCurrentUser } from "@/hooks/api/useUsers"
import { useUpdateUser } from "@/hooks/api/useUsers"
import { toast } from "sonner"

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser()
  const updateUserMutation = useUpdateUser()
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    address: "",
    bio: "",
    joinDate: "January 2024",
    accountType: "Professional",
  })

  useEffect(() => {
    if (user) {
      setUserData({
        id: user.ID,
        firstName: user.user_nicename || "",
        lastName: "",
        email: user.user_email || "",
        phone: user.user_phone || "",
        company: user.user_company || "",
        website: user.user_url || "",
        address: user.user_address || "",
        bio: user.user_bio || "",
        joinDate: user.registration_date || "January 2024",
        accountType: user.role === "admin" ? "Admin" : "Professional",
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!user) {
      toast.error("User not found")
      return
    }

    try {
      await updateUserMutation.mutateAsync({
        id: user.ID,
        userData: {
          user_nicename: userData.firstName,
          user_email: userData.email,
          user_phone: userData.phone,
          user_company: userData.company,
          user_url: userData.website,
          user_address: userData.address,
          user_bio: userData.bio,
        }
      })
      
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const handleCancel = () => {
    if (user) {
      setUserData({
        id: user.ID,
        firstName: user.user_nicename || "",
        lastName: "",
        email: user.user_email || "",
        phone: user.user_phone || "",
        company: user.user_company || "",
        website: user.user_url || "",
        address: user.user_address || "",
        bio: user.user_bio || "",
        joinDate: user.registration_date || "January 2024",
        accountType: user.role === "admin" ? "Admin" : "Professional",
      })
    }
    setIsEditing(false)
  }

  const getInitials = () => {
    if (userData.firstName) {
      return userData.firstName.charAt(0).toUpperCase()
    }
    return "U"
  }

  const getDisplayName = () => {
    return userData.firstName || "User"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Profile</h1>
            <p className="text-gray-800">Manage your account information and preferences.</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-secondary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-primary text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-primary mb-2">{getDisplayName()}</h2>
              <p className="text-gray-800 mb-4">{userData.email?.length > 15 ? userData.email?.slice(0, 15) + '...' : userData.email}</p>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-secondary">{userData.accountType}</Badge>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Joined {userData.joinDate}</span>
                </div>
                {userData.company && (
                  <div className="flex items-center justify-center text-gray-700">
                    <Building className="w-4 h-4 mr-2" />
                    <span className="text-sm">{userData.company}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    {isEditing ? (
                      <Input
                        value={userData.firstName}
                        onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                        placeholder="Enter your first name"
                        className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                      />
                    ) : (
                      <div className="flex items-center text-primary min-h-[40px]">
                        <User className="w-4 h-4 mr-2 text-gray-800" />
                        {userData.firstName}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">Last Name</label>
                    {isEditing ? (
                      <Input
                        value={userData.lastName}
                        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                        placeholder="Enter your last name"
                        className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                      />
                    ) : (
                      <div className="flex items-center text-primary min-h-[40px]">
                        <User className="w-4 h-4 mr-2 text-gray-800" />
                        {userData.lastName || <span className="text-gray-400 italic">Not provided</span>}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Email</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    />
                  ) : (
                    <div className="flex items-center text-primary min-h-[40px]">
                      <Mail className="w-4 h-4 mr-2 text-gray-800" />
                      {userData.email || <span className="text-gray-400 italic">Not provided</span>}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <Input
                      value={userData.phone}
                      onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    />
                  ) : (
                    <div className="flex items-center text-primary min-h-[40px]">
                      {userData.phone ? (
                        <>
                          <Phone className="w-4 h-4 mr-2 text-gray-800" />
                          {userData.phone}
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2 text-gray-800" />
                          <span className="text-gray-800 italic">Add phone number</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Business Information</CardTitle>
                <p className="text-gray-800 text-sm">Optional - Add your business details</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  {isEditing ? (
                    <Input
                      value={userData.company}
                      onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                      placeholder="Enter your company name"
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    />
                  ) : (
                    <div className="flex items-center text-primary min-h-[40px]">
                      {userData.company ? (
                        <>
                          <Building className="w-4 h-4 mr-2 text-gray-800" />
                          {userData.company}
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2 text-gray-800" />
                          <span className="text-gray-800 italic">Add company name</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  {isEditing ? (
                    <Input
                      value={userData.website}
                      onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    />
                  ) : (
                    <div className="flex items-center text-white min-h-[40px]">
                      {userData.website ? (
                        <a
                          href={userData.website.startsWith("http") ? userData.website : `https://${userData.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          <Building className="w-4 h-4 mr-2 text-gray-800" />
                          {userData.website}
                        </a>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2 text-gray-800" />
                          <span className="text-gray-800 italic">Add website URL</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Address</label>
                  {isEditing ? (
                    <Input
                      value={userData.address}
                      onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                      placeholder="Enter your business address"
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                    />
                  ) : (
                    <div className="flex items-center text-primary min-h-[40px]">
                      {userData.address ? (
                        <>
                          <MapPin className="w-4 h-4 mr-2 text-gray-800" />
                          {userData.address}
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2 text-gray-800" />
                          <span className="text-gray-800 italic">Add business address</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {isEditing ? (
                    <Textarea
                      value={userData.bio}
                      onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                      placeholder="Tell us about yourself and your business..."
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400 resize-none"
                      rows={3}
                    />
                  ) : (
                    <div className="text-primary min-h-[60px] flex items-start">
                      {userData.bio ? (
                        <div className="whitespace-pre-wrap">{userData.bio}</div>
                      ) : (
                        <div className="flex items-center">
                          <Plus className="w-4 h-4 mr-2 text-gray-800 mt-1" />
                          <span className="text-gray-800 italic">Add a bio to tell others about yourself</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
