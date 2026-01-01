"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStatusQuery, useUserQuery } from "@/hooks/useQueries";

import HeroSection from "@/components/home/hero";
// import SectionWrapper from "@/components/home/section";
// import SecuritySection from "@/components/home/security";
// import VoiceMasterSection from "@/components/home/voicemaster";
// import TicketsSection from "@/components/home/tickets";
// import MusicSection from "@/components/home/music";
// import FeaturesSection from "@/components/home/features";
// import CTASection from "@/components/home/cta";

const Home = () => {
  const { data: statusData } = useStatusQuery();

  const stats = {
    users: statusData?.total?.users || 0,
    guilds: statusData?.total?.guilds || 0,
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key="home"
        className="relative w-full overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <HeroSection stats={stats} />

        {/* <SectionWrapper>
          <SecuritySection />
          <VoiceMasterSection comminate={comminate || null} />
          <TicketsSection />
          <MusicSection femeie={femeie || null} />
        </SectionWrapper>

        <SectionWrapper>
          <FeaturesSection />
        </SectionWrapper>

        <SectionWrapper>
          <CTASection />
        </SectionWrapper> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default Home;
