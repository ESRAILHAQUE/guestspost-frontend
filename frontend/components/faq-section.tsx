"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How long does it take to get my guest post published?",
      answer:
        "Most guest posts are published within 24-72 hours. Premium websites like Forbes or TechCrunch may take 3-4 weeks due to their editorial review process.",
    },
    {
      question: "Do you guarantee the guest posts will be permanent?",
      answer:
        "Yes, all our guest posts come with a permanent placement guarantee. If a post is removed within the first 12 months, we'll replace it at no additional cost.",
    },
    {
      question: "Can I provide my own content for the guest posts?",
      answer:
        "You can provide your own content, or our professional writers can create high-quality, SEO-optimized content for you at no extra charge.",
    },
    {
      question: "What metrics do you use to measure website quality?",
      answer:
        "We evaluate websites based on Domain Authority (DA), organic traffic, content quality, editorial standards, and niche relevance to ensure maximum value for your investment.",
    },
    {
      question: "Do you offer refunds if I'm not satisfied?",
      answer:
        "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with our service, we'll work to make it right or provide a full refund.",
    },
    {
      question: "Can I track the performance of my guest posts?",
      answer:
        "Yes, we provide detailed reporting including publication confirmation, traffic metrics, backlink analysis, and SEO impact tracking through our client dashboard.",
    },
    {
      question: "Do you work with all industries and niches?",
      answer:
        "We work with most industries and niches. However, we don't accept content related to gambling, adult content, illegal activities, or other restricted categories.",
    },
    {
      question: "How do I get started with your service?",
      answer:
        "Simply book a consultation call with our team, and we'll discuss your goals, recommend the best strategy, and get your first guest posts scheduled within 48 hours.",
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
          <p className="text-primary/50 text-lg">Get answers to the most common questions about our guest post services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-primary/10 border border-primary/20 rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="text-lg font-semibold text-primary pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-primary leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-primary mb-4">Still have questions?</p>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-secondary">
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  )
}
