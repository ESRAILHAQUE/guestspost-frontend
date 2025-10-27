import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-primary/5">
      <Header />

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Terms of Service</h1>
            <p className="text-gray-600 text-lg">Please read these terms carefully before using our services.</p>
            <p className="text-gray-400 text-sm mt-4">Last updated: January 2024</p>
          </div>

          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Acceptance of Terms</h2>
                <div className="text-gray-600 space-y-4">
                  <p>
                    By accessing and using GuestPostNow.io, you accept and agree to be bound by the terms and provision
                    of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Service Description</h2>
                <div className="text-gray-600 space-y-4">
                  <p>
                    GuestPostNow.io provides guest post placement services, connecting clients with premium websites for
                    content publication. Our services include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Guest post placement on high-authority websites</li>
                    <li>Content creation and optimization</li>
                    <li>SEO and marketing consultation</li>
                    <li>Performance tracking and reporting</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">User Responsibilities</h2>
                <div className="text-gray-600 space-y-4">
                  <p>As a user of our services, you agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use our services in compliance with all applicable laws</li>
                    <li>Not engage in any fraudulent or harmful activities</li>
                    <li>Respect intellectual property rights</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Payment Terms</h2>
                <div className="text-gray-600 space-y-4">
                  <p>
                    Payment for services must be made in advance. We accept various payment methods including PayPal and
                    bank transfers. All prices are in USD and subject to change with notice.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Payments are processed securely through third-party providers</li>
                    <li>Refunds are subject to our refund policy</li>
                    <li>Account balances do not expire</li>
                    <li>Bonus amounts are added after payment confirmation</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Service Guarantees</h2>
                <div className="text-gray-600 space-y-4">
                  <p>We guarantee:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Permanent placement of guest posts (12-month guarantee)</li>
                    <li>High-quality, original content</li>
                    <li>Compliance with website editorial guidelines</li>
                    <li>Timely delivery as specified for each website</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Limitation of Liability</h2>
                <div className="text-gray-600 space-y-4">
                  <p>
                    GuestPostNow.io shall not be liable for any indirect, incidental, special, consequential, or
                    punitive damages resulting from your use of our services. Our total liability shall not exceed the
                    amount paid for the specific service in question.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Intellectual Property</h2>
                <div className="text-gray-600 space-y-4">
                  <p>
                    All content created by GuestPostNow.io becomes the property of the client upon payment. However, we
                    retain the right to use anonymized case studies and performance data for marketing purposes.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Termination</h2>
                <div className="text-gray-600 space-y-4">
                  <p>
                    Either party may terminate this agreement at any time. Upon termination, you will retain access to
                    completed services, but pending orders may be subject to cancellation fees.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Changes to Terms</h2>
                <div className="text-gray-600 space-y-4">
                  <p>
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon
                    posting. Continued use of our services constitutes acceptance of modified terms.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Contact Information</h2>
                <div className="text-gray-600 space-y-4">
                  <p>For questions about these Terms of Service, please contact us at:</p>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="text-primary font-medium">Email: info@guestpostnow.io</p>
                    <p className="text-gray-600">Website: www.guestpostnow.io</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
