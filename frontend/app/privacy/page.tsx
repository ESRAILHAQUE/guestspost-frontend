import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-primary/5">
      <Header />

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Privacy Policy</h1>
            <p className="text-gray-600 text-lg">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-gray-400 text-sm mt-4">Last updated: January 2024</p>
          </div>

          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Information We Collect</h2>
                <div className="text-gray-600 space-y-4">
                  <p>We collect information you provide directly to us, such as when you:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Create an account or profile</li>
                    <li>Make a purchase or place an order</li>
                    <li>Contact us for support</li>
                    <li>Subscribe to our newsletter</li>
                    <li>Participate in surveys or promotions</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">How We Use Your Information</h2>
                <div className="text-gray-600 space-y-4">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Communicate with you about products, services, and events</li>
                    <li>Monitor and analyze trends and usage</li>
                    <li>Detect, investigate, and prevent fraudulent transactions</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Information Sharing</h2>
                <div className="text-gray-600 space-y-4">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your
                    consent, except as described in this policy. We may share your information with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Service providers who assist us in operating our website and conducting business</li>
                    <li>Legal authorities when required by law or to protect our rights</li>
                    <li>Business partners for joint marketing efforts (with your consent)</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Data Security</h2>
                <div className="text-gray-600 space-y-4">
                  <p>
                    We implement appropriate security measures to protect your personal information against unauthorized
                    access, alteration, disclosure, or destruction. However, no method of transmission over the internet
                    is 100% secure.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Your Rights</h2>
                <div className="text-gray-600 space-y-4">
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Request a copy of your data</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Cookies</h2>
                <div className="text-gray-600 space-y-4">
                  <p>
                    We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our
                    marketing efforts. You can control cookies through your browser settings.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
                <div className="text-gray-600 space-y-4">
                  <p>If you have any questions about this Privacy Policy, please contact us at:</p>
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
