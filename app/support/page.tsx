"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MessageCircle, Clock, Users, Award, ChevronDown } from "lucide-react"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.subject && formData.message) {
      // Simulate form submission
      // console.log("Form submitted:", formData)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  const handleLiveChat = () => {
    alert("Live chat will be available soon! Please use email or phone support for immediate assistance.")
  }

  const handleEmailSupport = () => {
    const subject = encodeURIComponent("Support Request - GuestPostNow")
    const body = encodeURIComponent(
      "Hello,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nThank you!",
    )
    window.location.href = `mailto:support@guestpostnow.io?subject=${subject}&body=${body}`
  }

  const handlePhoneSupport = () => {
    window.location.href = "tel:+1-555-123-4567"
  }

  return (
    <div className="min-h-screen bg-primary/5">
      <Header />

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Support Center</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We're here to help you succeed with your guest posting campaigns. Get expert support when you need it.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-primary/5 backdrop-blur-sm border-primary/20 text-primary">
              <CardHeader className="text-center">
                <Phone className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <CardTitle>Phone Support</CardTitle>
                <CardDescription className="text-gray-500">Speak directly with our experts</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold mb-4">+1 (639) 392 7334</p>
                <p className="text-sm text-gray-400 mb-4">Mon-Fri, 9AM-6PM EST</p>
                <Button onClick={handlePhoneSupport} className="w-full bg-blue-600 hover:bg-blue-700">
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 backdrop-blur-sm border-primary/20 text-primary">
              <CardHeader className="text-center">
                <Mail className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <CardTitle>Email Support</CardTitle>
                <CardDescription className="text-gray-500">Get detailed help via email</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg font-semibold mb-4">support@guestpostnow.io</p>
                <p className="text-sm text-gray-400 mb-4">Response within 24 hours</p>
                <Button onClick={handleEmailSupport} className="w-full bg-green-600 hover:bg-green-700">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 backdrop-blur-sm border-primary/20 text-primary">
              <CardHeader className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <CardTitle>Live Chat</CardTitle>
                <CardDescription className="text-gray-500">Instant help when you need it</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg font-semibold mb-4">Chat with us now</p>
                <p className="text-sm text-gray-400 mb-4">Available 24/7</p>
                <Button onClick={handleLiveChat} className="w-full bg-purple-600 hover:bg-purple-700">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="bg-primary/5 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary text-center">Send us a Message</CardTitle>
                <CardDescription className="text-gray-500 text-center">
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="text-green-400 text-lg font-semibold mb-2">Message Sent Successfully!</div>
                    <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-primary">
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-primary/5 border-primary/20 text-primary placeholder:text-gray-400"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-primary">
                          Email
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-primary/5 border-primary/20 text-primary placeholder:text-gray-400"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-primary">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="bg-primary/5 border-primary/20 text-primary placeholder:text-gray-400"
                        placeholder="What can we help you with?"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-primary">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bg-primary/5 border-primary/20 text-primary placeholder:text-gray-400 min-h-[120px]"
                        placeholder="Please describe your question or issue in detail..."
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-primary/5 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center justify-between">
                    How long does it take to get published?
                    <ChevronDown className="w-5 h-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Most guest posts are published within 7-14 business days after content approval. Premium sites may
                    take up to 21 days.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center justify-between">
                    Do you provide content writing?
                    <ChevronDown className="w-5 h-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Yes! We offer professional content writing services. You can provide your own content or have our
                    expert writers create it for you.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center justify-between">
                    What if my post gets rejected?
                    <ChevronDown className="w-5 h-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    We offer unlimited revisions and will work with you to ensure your content meets the site's
                    guidelines. If still rejected, we'll find an alternative site.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 backdrop-blur-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center justify-between">
                    Can I get a refund?
                    <ChevronDown className="w-5 h-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    We offer a 30-day money-back guarantee if we're unable to secure publication on an approved site
                    that meets your requirements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Support Stats */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <div className="text-3xl font-bold text-primary mb-2">24hrs</div>
              <p className="text-gray-500">Average Response Time</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <p className="text-gray-500">Customer Satisfaction</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <div className="text-3xl font-bold text-primary mb-2">5+ Years</div>
              <p className="text-gray-500">Industry Experience</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
