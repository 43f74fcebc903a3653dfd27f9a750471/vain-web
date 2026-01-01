"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { RiLinksLine, RiTerminalBoxFill } from "react-icons/ri";
import { buttonStyles } from "@/components/ui/styles";
import mascot from "@/assets/vain/mascot.webp";
import { Container } from "@/components/gradient/container";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import styles from "@/components/ui/css/hero/base.module.css";

gsap.registerPlugin(SplitText);

interface HeroSectionProps {
  stats: {
    users: number;
    guilds: number;
  };
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const [showStats, setShowStats] = useState(false);
  const [animatingStats, setAnimatingStats] = useState(false);
  const [displayStats, setDisplayStats] = useState({ users: 0, guilds: 0 });
  const hasStats = stats.users > 0 && stats.guilds > 0;

  useEffect(() => {
    if (hasStats && !showStats && !animatingStats) {
      const timeout = setTimeout(() => {
        setDisplayStats(stats);
        setAnimatingStats(true);
        setShowStats(true);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [hasStats, showStats, animatingStats, stats]);

  useEffect(() => {
    gsap.set([".title", ".subtitle", ".buttons"], { clearProps: "all" });
    gsap.set(".title", { y: 40, autoAlpha: 0 });
    gsap.set(".subtitle", { y: 24, autoAlpha: 0 });
    gsap.set(".buttons", { y: 50, rotationX: 90, autoAlpha: 0 });
    const tl = gsap.timeline();
    tl.to(".title", { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.45 })
      .to(
        ".subtitle",
        { y: 0, autoAlpha: 1, ease: "power3.out", duration: 0.28 },
        "+=0.25"
      )
      .to(
        ".buttons",
        {
          y: 0,
          rotationX: 0,
          autoAlpha: 1,
          stagger: { each: 0.08, from: "center" },
          ease: "back.out(1.2, 0.4)",
          duration: 0.8,
        },
        "-=0.18"
      );
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (showStats && animatingStats) {
      const usersSplit = new SplitText(".number-users", { type: "chars" });
      const guildsSplit = new SplitText(".number-guilds", { type: "chars" });

      const tl = gsap.timeline({
        onComplete: () => setAnimatingStats(false),
      });

      tl.to([".skeleton-users", ".skeleton-guilds"], {
        animation: "none",
        duration: 0.2,
      })
        .to(".skeleton-users", {
          width: `${displayStats.users.toLocaleString().length * 0.6}em`,
          duration: 0.8,
          ease: "power2.out",
        })
        .to(
          ".skeleton-guilds",
          {
            width: `${displayStats.guilds.toLocaleString().length * 0.6}em`,
            duration: 0.8,
            ease: "power2.out",
          },
          "<"
        )
        .to(
          [".skeleton-users", ".skeleton-guilds"],
          {
            backgroundColor: "transparent",
            duration: 0.4,
          },
          "-=0.3"
        )
        .from(
          [...usersSplit.chars, ...guildsSplit.chars],
          {
            opacity: 0,
            y: -20,
            duration: 0.6,
            ease: "power4",
            stagger: 0.04,
          },
          "-=0.2"
        );

      return () => {
        tl.kill();
        setAnimatingStats(false);
      };
    }
    return () => {};
  }, [showStats, animatingStats, displayStats]);
  return (
    <div className={styles.hero}>
      <Container />

      <div className={styles.content}>
        <div className={styles.heroMain}>
          <div className={`${styles.titleContainer} title`}>
            <Image
              src={mascot.src}
              alt="vain mascot"
              width={64}
              height={64}
              className={styles.logo}
              style={
                {
                  objectFit: "contain",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  WebkitUserDrag: "none",
                  WebkitTouchCallout: "none",
                } as React.CSSProperties
              }
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            <div
              style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))" }}
            >
              <h1 className={`${styles.heroTitle} text-gradient`}>Vain</h1>
            </div>
          </div>
          <div className={`${styles.subtitle} subtitle`}>
            <p>
              Serving{" "}
              <span
                className={`${styles.skeletonUsers} skeleton-users`}
                style={{
                  width: "6rem",
                  height: "1.5rem",
                  animation: showStats
                    ? "none"
                    : "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              >
                {showStats && (
                  <span className={`${styles.numberUsers} number-users`}>
                    {displayStats.users.toLocaleString()}
                  </span>
                )}
              </span>{" "}
              users across{" "}
              <span
                className={`${styles.skeletonGuilds} skeleton-guilds`}
                style={{
                  width: "5rem",
                  height: "1.5rem",
                  animation: showStats
                    ? "none"
                    : "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              >
                {showStats && (
                  <span className={`${styles.numberGuilds} number-guilds`}>
                    {displayStats.guilds.toLocaleString()}
                  </span>
                )}
              </span>{" "}
              guilds.
            </p>
          </div>
        </div>
        <div className={`${styles.buttons} buttons`}>
          <Link href="/invite" className={buttonStyles.primary}>
            Add to Discord
            <RiLinksLine className="w-4 h-4" />
          </Link>
          <Link href="/commands" className={buttonStyles.secondary}>
            <RiTerminalBoxFill className="w-4 h-4 text-vain-primary/80" />
            View Commands
          </Link>
        </div>
      </div>
    </div>
  );
}
