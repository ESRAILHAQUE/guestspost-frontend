// Website logo URLs for consistent use across the application
export const websiteLogos = {
  MSN: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
  "AP News": "https://apnews.com/apple-touch-icon.png",
  Barchart: "https://www.barchart.com/favicon.ico",
  Benzinga: "https://www.benzinga.com/favicon.ico",
  "Digital Journal": "https://www.digitaljournal.com/favicon.ico",
  "Business Insider Markets": "https://www.businessinsider.com/public/assets/BI/US/icon/favicon.ico",
  "NY Weekly": "https://nyweekly.com/favicon.ico",
  "IPS News": "https://www.ipsnews.net/favicon.ico",
  "Fintech News": "https://www.fintechnews.org/favicon.ico",
  "Outlook India": "https://www.outlookindia.com/favicon.ico",
  "Health Line": "https://www.healthline.com/hlcmsresource/images/frontend-static/health-nav/favicon.ico",
  "Travel Weekly": "https://www.travelweekly.com/favicon.ico",
  "Marketing Land": "https://marketingland.com/favicon.ico",
  "Education Week": "https://www.edweek.org/favicon.ico",
  "Better Homes & Gardens": "https://www.bhg.com/favicon.ico",
  "Entertainment Weekly": "https://ew.com/favicon.ico",
  ESPN: "https://www.espn.com/favicon.ico",
  "Car and Driver": "https://www.caranddriver.com/favicon.ico",
  "Law.com": "https://www.law.com/favicon.ico",
  "Green Tech Media": "https://www.greentechmedia.com/favicon.ico",
  RetailMeNot: "https://www.retailmenot.com/favicon.ico",
  PetMD: "https://www.petmd.com/favicon.ico",
  "Food Network": "https://www.foodnetwork.com/favicon.ico",
  "Realtor.com": "https://www.realtor.com/favicon.ico",
  "Indeed Career Guide": "https://www.indeed.com/favicon.ico",
  Forbes: "https://www.forbes.com/favicon.ico",
  TechCrunch: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png",
  "New York Times": "https://www.nytimes.com/vi-assets/static-assets/favicon-4bf96cb6a1093748bf5b3c429accb9b4.ico",
  BBC: "https://www.bbc.com/favicon.ico",
  "Business Insider": "https://www.businessinsider.com/public/assets/BI/US/icon/favicon.ico",
  Bloomberg: "https://www.bloomberg.com/favicon.ico",
  Entrepreneur: "https://www.entrepreneur.com/favicon.ico",
  "Yahoo Finance": "https://finance.yahoo.com/favicon.ico",
  CNBC: "https://www.cnbc.com/favicon.ico",
  "USA Today": "https://www.usatoday.com/favicon.ico",
  Wired: "https://www.wired.com/favicon.ico",
  "Harvard Health": "https://www.health.harvard.edu/favicon.ico",
  "Conde Nast Traveler": "https://www.cntraveler.com/favicon.ico",
  Vogue: "https://www.vogue.com/favicon.ico",
  Variety: "https://variety.com/favicon.ico",
  "Sports Illustrated": "https://www.si.com/favicon.ico",
  "Motor Trend": "https://www.motortrend.com/favicon.ico",
  "Harvard Law Review": "https://harvardlawreview.org/favicon.ico",
  "National Geographic": "https://www.nationalgeographic.com/favicon.ico",
  "Architectural Digest": "https://www.architecturaldigest.com/favicon.ico",
}

// Helper function to get logo URL with fallback
export const getWebsiteLogo = (websiteName: string): string => {
  return (
    websiteLogos[websiteName as keyof typeof websiteLogos] ||
    `/placeholder.svg?height=32&width=32&text=${websiteName.charAt(0)}`
  )
}
