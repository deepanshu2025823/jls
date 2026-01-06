import Header from "@/components/header/Header";
import Hero from "@/components/hero/Hero";
import HeroSearch from "@/components/HeroSearch";
import FleetSection from "@/components/sections/FleetSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CityRoutesSection from "@/components/sections/CityRoutesSection"; 
import AppDownloadSection from "@/components/sections/AppDownloadSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/footer/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <HeroSearch />
      <FleetSection />
      <ServicesSection />
      <CityRoutesSection /> 
      <AppDownloadSection />
      <FAQSection />
      <Footer />
    </>
  );
}