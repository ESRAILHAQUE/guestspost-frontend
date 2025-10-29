"use client";

import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { StatsSection } from "@/components/stats-section";
import { UnifiedWebsiteCatalog } from "@/components/unified-website-catalog";
import { WhyChooseSection } from "@/components/why-choose-section";
import { GrowthStrategySection } from "@/components/growth-strategy-section";
import { ClientReviewsSection } from "@/components/client-reviews-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { MessageCircleMore, UserCheck } from "lucide-react";
import { useEffect, useRef } from "react";

export default function HomePage() {
  // const chatContainerRef = useRef(null);
  // const buttonRef = useRef(null);

  // const toggleChat = () => {
  //   if (chatContainerRef?.current) {
  //     const isHidden = chatContainerRef?.current?.classList.contains("hidden")
  //     chatContainerRef?.current?.classList.toggle("hidden", !isHidden)
  //     chatContainerRef?.current?.classList.toggle("flex", isHidden) // Show as flex when visible
  //   }
  // }

  // useEffect(() => {
  //   const handleClickOutside = (event: any) => {
  //     if (
  //       chatContainerRef.current &&
  //       !chatContainerRef?.current?.contains(event.target) &&
  //       !buttonRef?.current?.contains(event.target) &&
  //       !chatContainerRef?.current?.classList?.contains("hidden")
  //     ) {
  //       chatContainerRef?.current?.classList?.add("hidden");
  //       chatContainerRef?.current?.classList?.remove("flex");
  //     }
  //   };
  //   // Add event listener
  //   window.addEventListener("click", handleClickOutside);

  //   // Cleanup event listener on component unmount
  //   return () => {
  //     window.removeEventListener("click", handleClickOutside);
  //   };
  // }, [])

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <HeroSection />
      <StatsSection />
      <WhyChooseSection />
      <GrowthStrategySection />
      <UnifiedWebsiteCatalog
        title="Featured Websites"
        description="Discover premium guest post opportunities on high-authority websites across various industries"
        maxItems={9}
        showViewAllButton={true}
      />
      <ClientReviewsSection />
      <FAQSection />
      <Footer />

      {/* <div
        ref={buttonRef}
        className="w-auto p-3 hover:p-4 fixed bottom-12 right-12 text-center rounded-full flex justify-center items-center bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md shadow-gray-500 text-white cursor-pointer"
        onClick={toggleChat}
      >
        <MessageCircleMore className="h-8 w-8 text-white" />
      </div>

      <div
        ref={chatContainerRef}
        className="w-[400px] h-[500px] fixed bottom-10 right-10 hidden flex-col bg-white shadow-lg shadow-neutral-500 p-6 rounded-xl overflow-hidden"
      >
        <UserChat />
      </div> */}
    </div>
  );
}
