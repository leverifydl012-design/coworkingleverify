import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Workspaces } from "@/components/site/Workspaces";
import { Availability } from "@/components/site/Availability";
import { Calendar } from "@/components/site/Calendar";
import { Pricing } from "@/components/site/Pricing";
import { Amenities } from "@/components/site/Amenities";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Leverify Coworking Islamabad — Premium Offices & Coworking Spaces" },
      {
        name: "description",
        content:
          "Premium coworking in F-7 Islamabad. Dedicated desks, private offices, meeting rooms & virtual offices for freelancers, agencies and startups. Book a tour today.",
      },
      { property: "og:title", content: "Leverify Coworking — Premium Workspace in Islamabad" },
      { property: "og:description", content: "Dedicated desks, private offices, meeting rooms & virtual offices in F-7 Islamabad." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Leverify Coworking",
          description: "Premium coworking space in Islamabad offering dedicated desks, private offices, meeting rooms and virtual offices.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "F-7 Markaz",
            addressLocality: "Islamabad",
            addressCountry: "PK",
          },
          telephone: "+92-51-123-4567",
          priceRange: "PKR 9,500–65,000/mo",
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Workspaces />
        <Availability />
        <Calendar />
        <Pricing />
        <Amenities />
        <Gallery />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
