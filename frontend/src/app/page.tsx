import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import DayrailShowcase from "@/components/landing/DayrailShowcase";
import BentoGrid from "@/components/landing/BentoGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import Roles from "@/components/landing/Roles";
import AiAssistant from "@/components/landing/AiAssistant";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import SmoothScroll from "@/components/landing/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div
        className="min-h-screen flex flex-col font-sans"
        style={{ background: "var(--canvas)", color: "var(--ink)" }}
      >
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <DayrailShowcase />
          <BentoGrid />
          <HowItWorks />
          <Roles />
          <AiAssistant />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
