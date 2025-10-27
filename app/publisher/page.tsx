import { PublisherForm } from "@/components/publisher-form"
import { FAQSection } from "@/components/faq-section"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"


export default function PublisherPage() {

    return (
        <main className="min-h-screen">
            <Header />
            {/* Hero Section with Background */}
            <div className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                <div className="relative px-4 py-16 md:py-24">
                    <div className="max-w-6xl mx-auto">
                        {/* Hero Content */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                            <div className="text-center lg:text-left">
                                <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
                                    Standard Publisher Network
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
                                    Join as a Publisher – Submit Your Websites for Guest Posting
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
                                    List your sites individually or in bulk to earn from guest posting opportunities. Connect with quality
                                    content creators and monetize your platform with our trusted network.
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-6 mt-10">
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
                                        <div className="text-sm text-muted-foreground mt-1">Publishers</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
                                        <div className="text-sm text-muted-foreground mt-1">Posts Published</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl md:text-4xl font-bold text-primary">98%</div>
                                        <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="relative">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/modern-professional-workspace-with-laptop-showing-.jpg"
                                        alt="Publisher Dashboard"
                                        width={800}
                                        height={600}
                                        className="w-full h-auto"
                                    />
                                </div>
                                {/* Floating Card */}
                                <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl shadow-xl border hidden md:block">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-foreground">$2,500+</div>
                                            <div className="text-sm text-muted-foreground">Avg. Monthly Earnings</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            <div className="bg-card p-6 rounded-xl shadow-lg border">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Quick Approval</h3>
                                <p className="text-muted-foreground">
                                    Get approved within 2-3 business days and start earning immediately.
                                </p>
                            </div>

                            <div className="bg-card p-6 rounded-xl shadow-lg border">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Quality Content</h3>
                                <p className="text-muted-foreground">
                                    Work with vetted content creators who deliver high-quality posts.
                                </p>
                            </div>

                            <div className="bg-card p-6 rounded-xl shadow-lg border">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Flexible Pricing</h3>
                                <p className="text-muted-foreground">Set your own rates and control which posts you accept.</p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="max-w-5xl mx-auto">
                            <PublisherForm />
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <FAQSection />
            <Footer />
        </main>
    )
}
