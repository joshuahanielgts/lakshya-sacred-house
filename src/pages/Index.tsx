import { useState } from "react";
import ScrollVideoIntro from "@/components/ScrollVideoIntro";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PhilosophySection from "@/components/PhilosophySection";
import CollectionSection from "@/components/CollectionSection";
import ProcessSection from "@/components/ProcessSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!introComplete && (
        <ScrollVideoIntro onComplete={() => setIntroComplete(true)} />
      )}
      {introComplete && <LoadingScreen />}
      {introComplete && (
        <>
          <Navbar />
          <HeroSection />
          <PhilosophySection />
          <CollectionSection />
          <ProcessSection />
          <ContactSection />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;
