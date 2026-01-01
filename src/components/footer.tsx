"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  RiDiscordFill,
  RiFileTextFill,
  RiQuestionFill,
  RiLinksFill,
} from "react-icons/ri";

export const Footer = () => {
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const existingFooter = document.getElementById("vain-footer");
    if (
      existingFooter &&
      document.querySelectorAll("#vain-footer").length > 1
    ) {
      setShouldRender(false);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <footer
      id="vain-footer"
      className="border-t border-white/[0.03] bg-gradient-to-br from-[#0a0a0a] to-[#080808] backdrop-blur-md w-full relative z-10 font-sans"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-zinc-400 text-xs font-normal font-sans text-center sm:text-left">
            © 2025{" "}
            <Link
              href="https://vain.bot"
              className="text-zinc-400 hover:text-white transition-colors underline"
            >
              vain.bot
            </Link>{" "}
            on behalf of{" "}
            <Link
              href="https://aelix.ltd"
              target="_blank"
              className="text-zinc-400 hover:text-white transition-colors underline"
            >
              Aelix LLC
            </Link>
            . Owned and operated by{" "}
            <Link
              href="https://aelix.ltd"
              target="_blank"
              className="text-zinc-400 hover:text-white transition-colors underline"
            >
              Aelix LLC
            </Link>
            . All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/invite"
              className="flex items-center gap-1.5 text-zinc-400 text-xs font-normal font-sans hover:text-white transition-colors"
            >
              <RiLinksFill className="w-3.5 h-3.5" />
              Invite
            </Link>
            <Link
              href="https://docs.vain.bot/"
              className="flex items-center gap-1.5 text-zinc-400 text-xs font-normal font-sans hover:text-white transition-colors"
            >
              <RiFileTextFill className="w-3.5 h-3.5" />
              Docs
            </Link>
            <Link
              href="https://discord.gg/vainbot"
              target="_blank"
              className="flex items-center gap-1.5 text-zinc-400 text-xs font-normal font-sans hover:text-white transition-colors"
            >
              <RiDiscordFill className="w-3.5 h-3.5" />
              Support
            </Link>
            <Link
              href="/terms"
              className="flex items-center gap-1.5 text-zinc-400 text-xs font-normal font-sans hover:text-white transition-colors"
            >
              <RiFileTextFill className="w-3.5 h-3.5" />
              Terms
            </Link>
            <Link
              href="/privacy"
              className="flex items-center gap-1.5 text-zinc-400 text-xs font-normal font-sans hover:text-white transition-colors"
            >
              <RiQuestionFill className="w-3.5 h-3.5" />
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
