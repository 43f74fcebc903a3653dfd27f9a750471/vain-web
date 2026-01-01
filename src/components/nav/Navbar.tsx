/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { RiFilePaper2Fill } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, FileText, Terminal, Gauge } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "./NavLink";
import { SiInstatus } from "react-icons/si";
import mascot from "@/assets/vain/mascot.webp";
import { HiMiniCommandLine } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import styles from "@/components/ui/css/navbar.module.css";

const FileTextIcon = <FileText className="w-4 h-4 text-vain-primary/80" />;

const mobileMenuItems = [
  [
    {
      label: "Commands",
      href: "/commands",
      icon: <HiMiniCommandLine className="w-4 h-4 text-vain-primary/80" />,
    },
    {
      label: "Embeds",
      href: "/embed",
      icon: <RiFilePaper2Fill className="w-4 h-4 text-vain-primary/80" />,
    },
  ],
  [
    {
      label: "Status",
      href: "/status",
      icon: <SiInstatus className="w-4 h-4 text-vain-primary/80" />,
    },
  ],
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > window.innerHeight * 0.1);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navItems = [
    {
      label: "Commands",
      href: "/commands",
      icon: <HiMiniCommandLine className="w-4 h-4 text-vain-primary/80" />,
    },
    {
      label: "Embeds",
      href: "/embed",
      icon: <RiFilePaper2Fill className="w-4 h-4 text-vain-primary/80" />,
    },
  ];

  return (
    <motion.div
      className={styles.navbar}
      // onDragStart={(e) => e.preventDefault()}
      // onContextMenu={(e) => e.preventDefault()}
    >
      <div className={styles.navContainer}>
        <div className={styles.navWrapper}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.1 }}
            className={styles.navBackground}
          />
          <div
            className={`${styles.navbarBase} ${isHome ? styles.navbarHome : styles.navbarNotHome} ${scrolled ? styles.navbarScrolled : ""}`}
          >
            <div className={styles.navContent}>
              <div className={styles.navLeft}>
                <Link href="/" className={styles.logoLink}>
                  <Image
                    src={mascot.src}
                    alt="vain"
                    width={32}
                    height={32}
                    className={styles.logoImage}
                    loading="eager"
                  />
                </Link>
                <nav className={styles.navLinks}>
                  {navItems.map((item) => (
                    <NavLink key={item.href} {...item} isHome={isHome} />
                  ))}
                </nav>
              </div>

              <div className={styles.navRight}>
                <Link href="/status" className={styles.statusLink}>
                  <div className={styles.statusHover} />
                  <span className={styles.statusText}>
                    <SiInstatus className="w-4 h-4 text-vain-primary/80" />
                    Status
                  </span>
                </Link>
                <div className={styles.divider} />
                <Link href="/invite" className={styles.inviteLink}>
                  <span className={styles.inviteText}>
                    Add to Discord
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.182 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </span>
                </Link>
              </div>

              <div className={styles.mobileRight}>
                <Link href="/invite" className={styles.mobileInvite}>
                  <div className={styles.mobileInviteBg} />
                  <div className={styles.mobileInviteGradient} />
                  <span className={styles.mobileInviteText}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.182 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={styles.menuButton}
                >
                  <div className={styles.menuHover} />
                  <span className={styles.menuIcon}>
                    <span className="relative w-5 h-5 block">
                      <AnimatePresence mode="wait" initial={false}>
                        {isMobileMenuOpen ? (
                          <motion.span
                            key="close"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              transition: {
                                duration: 0.13,
                                ease: [0.4, 0, 0.2, 1],
                              },
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.96,
                              transition: { duration: 0.13 },
                            }}
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <X className="w-5 h-5" />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="open"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              transition: {
                                duration: 0.13,
                                ease: [0.4, 0, 0.2, 1],
                              },
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.96,
                              transition: { duration: 0.13 },
                            }}
                            style={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Menu className="w-5 h-5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </span>
                </button>
              </div>
            </div>

            <MobileMenu
              open={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              isHome={isHome}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MobileMenu = ({
  open,
  onClose,
  isHome,
}: {
  open: boolean;
  onClose: () => void;
  isHome: boolean;
}) => (
  <AnimatePresence initial={false} mode="popLayout">
    <motion.div
      key="mobile-menu"
      initial={{
        height: 0,
        opacity: 0,
        y: -16,
        marginTop: 0,
        minHeight: 0,
        paddingLeft: 0,
        paddingRight: 0,
      }}
      animate={
        open
          ? {
              height: "auto",
              opacity: 1,
              y: 0,
              marginTop: 12,
              minHeight: 32,
              paddingLeft: 4,
              paddingRight: 4,
              transition: { duration: 0.44, ease: [0.23, 1, 0.32, 1] },
            }
          : {
              height: 0,
              opacity: 0,
              y: -16,
              marginTop: 0,
              minHeight: 0,
              paddingLeft: 0,
              paddingRight: 0,
              transition: { duration: 0.32, ease: [0.23, 1, 0.32, 1] },
            }
      }
      style={{ overflow: "hidden", pointerEvents: open ? "auto" : "none" }}
      className={styles.mobileMenu}
    >
      <div className={styles.mobileMenuItems}>
        {mobileMenuItems.flat().map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={styles.mobileMenuItem}
          >
            <span className={styles.mobileMenuLabel}>{item.label}</span>
            <span className={styles.mobileMenuIcon}>{item.icon}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  </AnimatePresence>
);

export default Navbar;
