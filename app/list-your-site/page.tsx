"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  ID: string
  user_nicename: string
  user_email: string
  balance: string
}

export default function ListYourSitePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    siteDescription: "",
    monthlyTraffic: "",
    domainAuthority: "",
    domainRating: "",
    websiteOwner: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Load user data from Node.js backend
    const fetchUser = async () => {
      try {
        // Check if we're in browser environment
        if (typeof window === "undefined") {
          return;
        }

        const { endpoints } = await import("@/lib/api/client")
        const user_id = localStorage.getItem('user_id')
        if (!user_id) {
          setUser(null)
          return
        }

        // Get current user
        const response = await endpoints.auth.getMe()
        if (response.data && response.data.user_email === user_id) {
          setUser({
            ID: response.data.ID || response.data._id,
            user_nicename: response.data.user_nicename,
            user_email: response.data.user_email,
            balance: response.data.balance || "0"
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if(!user) {
      router.push('/login');
    }

    try {
      // Create submission object
      const submission = {
        id: Date.now().toString(),
        user_id: user?.ID,
        ...formData,
        submittedAt: new Date().toISOString(),
        status: "pending",
      }

      const { endpoints } = await import("@/lib/api/client")
      const response = await endpoints.siteSubmissions.createSiteSubmission(submission)
      const data = response.data
      // console.log(data);
      
      if (response && data) {
        // Save to localStorage for admin panel
        // const existingSubmissions = JSON.parse(localStorage.getItem("siteSubmissions") || "[]")
        // existingSubmissions.push(submission)
        // localStorage.setItem("siteSubmissions", JSON.stringify(existingSubmissions))
        // console.log("Site submission saved:", submission)
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Error submitting site:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-8">
              <Check className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">Application Submitted!</h1>
              <p className="text-gray-300 mb-6">
                Thank you for submitting your site. We'll review your application and get back to you within 2-3
                business days.
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/placeholder.svg?height=400&width=800&query=office desk with laptop and papers)",
            filter: "brightness(0.3)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/60" />

        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            List Your Site with
            <br />
            Guest Post Now
          </h1>
          <div className="text-xl text-white/90 mb-8">
            <p className="font-semibold">We write the article, you publish and start earning.</p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto max-w-4xl">
          <p className="text-gray-300 text-lg mb-6">
            Got a website with good stats, plenty of traffic, and would like to make some extra money? Apply today with
            your site and we'll take a look.
          </p>
          <p className="text-gray-400 mb-8">Please note, we are very picky with the sites we add to our inventory.</p>

          {/* Requirements Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">You must be...</h2>
            <ul className="space-y-3 text-gray-300">
              <li>• Very responsive and be able to post quickly.</li>
              <li>• Easy to work with.</li>
              <li>• Bonus points if you can provide WordPress logins for quick turnaround time.</li>
            </ul>
          </div>

          {/* Application Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-8">Apply Now</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name and Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Name</label>
                  <Input
                    placeholder="FULL NAME"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="email@domain.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Website and Description */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                    Website
                  </label>
                  <Input
                    placeholder="https://domain.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                    Site Description
                  </label>
                  <Textarea
                    placeholder="ENTER SITE DESCRIPTION"
                    value={formData.siteDescription}
                    onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                    required
                    className="bg-white min-h-[100px]"
                  />
                </div>
              </div>

              {/* Row 3: Traffic and Domain Authority */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                    Monthly Traffic (Ahrefs)
                  </label>
                  <Input
                    placeholder="MIN 1K ACCORDING TO AHREFS"
                    value={formData.monthlyTraffic}
                    onChange={(e) => handleInputChange("monthlyTraffic", e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                    Domain Authority
                  </label>
                  <Input
                    placeholder="MIN 20 ACCORDING TO AHREFS"
                    value={formData.domainAuthority}
                    onChange={(e) => handleInputChange("domainAuthority", e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
              </div>

              {/* Row 4: Domain Rating and Website Owner */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                    Domain Rating (Ahrefs)
                  </label>
                  <Input
                    placeholder="MIN 10 ACCORDING TO AHREFS"
                    value={formData.domainRating}
                    onChange={(e) => handleInputChange("domainRating", e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                    Are you the owner of this website?
                  </label>
                  <Select onValueChange={(value) => handleInputChange("websiteOwner", value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="SELECT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold uppercase tracking-wide"
                >
                  {isSubmitting ? "SUBMITTING..." : "APPLY"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-12 px-4 bg-gray-800/30">
        <div className="container mx-auto max-w-4xl">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Your site must...</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 rounded-full p-1 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-300">Have at least 1,000 organic visitors per month as per Ahrefs.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 rounded-full p-1 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-300">
                  Be absolutely 100% completely white hat. No blackhat links can be going to your site.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 rounded-full p-1 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-300">Never have been penalized.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 rounded-full p-1 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-300">Solid metrics.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 rounded-full p-1 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-300">
                  Must not mark the post with 'sponsored' / guest post / guest author or anything of this nature.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 rounded-full p-1 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-300">
                  Your website's header / footer / sidebar must not contain 'write for us', 'guest post' or anything of
                  this nature.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
