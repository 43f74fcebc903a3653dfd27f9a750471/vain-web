"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RiLinksLine, RiTerminalBoxFill } from "react-icons/ri";
import { herov2Item, heroContainer } from "@/components/ui/animations";
import { buttonStyles } from "@/components/ui/styles";

export default function CTASection() {
  return (
    <motion.div
      variants={heroContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="text-center"
    >
      <motion.h2
        variants={herov2Item}
        className="text-4xl font-medium bg-gradient-to-br from-white via-white/90 to-white/80 bg-clip-text text-transparent leading-[1.2] pb-2 mb-6"
      >
        Ready to get started?
      </motion.h2>
      <motion.p
        variants={herov2Item}
        className="text-white/60 text-lg mb-8 max-w-2xl mx-auto"
      >
        Join thousands of Discord servers using vain for their moderation,
        music, and community management needs.
      </motion.p>
      <motion.div
        variants={herov2Item}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Link href="/invite" className={buttonStyles.primary}>
          Add to Discord
          <RiLinksLine className="w-4 h-4" />
        </Link>
        <Link href="/commands" className={buttonStyles.secondary}>
          <RiTerminalBoxFill className="w-4 h-4" />
          View Commands
        </Link>
      </motion.div>
    </motion.div>
  );
}
