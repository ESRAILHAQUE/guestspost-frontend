"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Clock, MessageCircle, Calendar, Phone } from "lucide-react"

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us a message and we'll respond within 24 hours",
      contact: "info@guestpostnow.io",
      action: "mailto:info@guestpostnow.io",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our team",
      contact: "+1 (639) 392 7334",
      action: "tel:+16393927334",
    },
    {
      icon: Calendar,
      title: "Book a Call",
      description: "Schedule a free consultation with our experts",
      contact: "30-minute strategy session",
      action: "https://calendly.com/guestpostnow-io/30min",
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would send the form data to your backend
    alert("Thank you for your message! We'll get back to you within 24 hours.")
  }

  return (
    <div className="min-h-screen bg-primary/5">
      <Header />

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Contact Us</h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Have questions about our guest post services? We're here to help! Reach out to us through any of the
              methods below.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="bg-primary/5 border-primary/10 hover:bg-primary/10 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <method.icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <p className="text-blue-400 font-medium mb-4">{method.contact}</p>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-secondary"
                    asChild
                  >
                    <a
                      href={method.action}
                      target={method.action.startsWith("http") ? "_blank" : "_self"}
                      rel={method.action.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {method.title === "Email Us"
                        ? "Send Email"
                        : method.title === "Call Us"
                          ? "Call Now"
                          : method.title === "Book a Call"
                            ? "Schedule Now"
                            : "Start Chat"}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="text-primary text-2xl">Send us a Message</CardTitle>
                <p className="text-gray-600">Fill out the form below and we'll get back to you soon.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">First Name *</label>
                      <Input
                        required
                        className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Last Name *</label>
                      <Input
                        required
                        className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Email Address *</label>
                    <Input
                      type="email"
                      required
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Company Name</label>
                    <Input
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400"
                      placeholder="Your Company Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Subject *</label>
                    <Select required>
                      <SelectTrigger className="bg-primary/10 border-primary/20 text-primary">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-200 border-primary/20">
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="pricing">Pricing Questions</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                        <SelectItem value="custom">Custom Package Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Message *</label>
                    <Textarea
                      required
                      rows={5}
                      className="bg-primary/10 border-primary/20 text-primary placeholder-gray-400 resize-none"
                      placeholder="Tell us about your project and how we can help..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-secondary"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Company Information */}
            <div className="space-y-8">
              <Card className="bg-primary/5 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-primary text-2xl">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-primary font-semibold mb-1">Email</h3>
                      <a
                        href="mailto:info@guestpostnow.io"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        info@guestpostnow.io
                      </a>
                      <p className="text-gray-400 text-sm mt-1">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-primary font-semibold mb-1">Phone</h3>
                      <a href="tel:+16393927334" className="text-blue-400 hover:text-blue-300 transition-colors">
                        +1 (639) 392 7334
                      </a>
                      <p className="text-gray-400 text-sm mt-1">Available during business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-primary font-semibold mb-1">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 4:00 PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MessageCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-primary font-semibold mb-1">Live Support</h3>
                      <p className="text-gray-600">24/7 chat support available</p>
                      <p className="text-gray-400 text-sm mt-1">Average response time: 5 minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3">Need Immediate Help?</h3>
                  <p className="text-gray-600 mb-4">
                    Book a free consultation call with our guest post experts to discuss your specific needs and get
                    personalized recommendations.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-secondary"
                    asChild
                  >
                    <a href="https://calendly.com/guestpostnow-io/30min" target="_blank" rel="noopener noreferrer">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Free Call
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
