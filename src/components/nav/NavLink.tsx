import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type NavLinkProps = {
  href: string;
  isActive?: boolean;
  label: string;
  icon?: React.ReactNode;
  isHome?: boolean;
  dropdown?: {
    items: Array<{
      title: string;
      description?: string;
      href: string;
      icon?: React.ReactNode;
    }>;
  };
};

export const NavLink = ({
  href,
  label,
  icon,
  dropdown,
  isHome,
}: NavLinkProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  }, []);

  if (dropdown) {
    return (
      <div
        className="relative hidden md:block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="group relative px-4 py-2">
          <div
            className={`absolute inset-0 rounded-xl ${isHome ? "bg-white/10" : "bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]"} shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity before:-z-10 after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-t after:from-black/30 after:to-transparent after:z-[-1] border border-white/[0.03] transition-all duration-500 opacity-0 group-hover:opacity-100`}
          />
          <span className="relative flex items-center gap-2 text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
            {icon}
            {label}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.5,
                ease: "easeOut",
              }}
              className="transition-transform duration-500 ease-out"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </span>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.92, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(5px)" }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
                mass: 0.8,
                filter: { duration: 0.15 },
                opacity: { duration: 0.12 },
              }}
              className="absolute top-full left-0 pt-2 z-50"
            >
              <div className="w-[700px] relative bg-gradient-to-b from-vain-100/95 to-vain-200/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl shadow-black/20">
                <div className="p-4 grid grid-cols-[240px,1fr] gap-4">
                  <Link
                    href="/features/moderation"
                    className="group flex flex-col justify-between h-full p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-vain-primary/30"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white/5 border border-vain-primary/20">
                          {dropdown.items[0].icon}
                        </div>
                        <div className="font-medium text-white">
                          {dropdown.items[0].title}
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {dropdown.items[0].description}
                      </p>
                    </div>
                    <div className="text-xs text-zinc-500 mt-3 group-hover:text-vain-primary/60 transition-colors">
                      Protect your server with advanced filters →
                    </div>
                  </Link>

                  <div className="grid grid-cols-2 gap-3">
                    {dropdown.items.slice(1).map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-vain-primary/30"
                      >
                        <div className="flex items-center gap-3 mb-1.5">
                          <div className="p-2 rounded-lg bg-white/5 border border-vain-primary/20">
                            {item.icon}
                          </div>
                          <div className="font-medium text-white">
                            {item.title}
                          </div>
                        </div>
                        <p className="text-sm text-zinc-400 mb-1.5">
                          {item.description}
                        </p>
                        <div className="text-xs text-zinc-500 group-hover:text-vain-primary/60 transition-colors">
                          Learn more →
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link href={href} className="group relative px-4 py-2">
      <div
        className={`absolute inset-0 rounded-xl ${isHome ? "bg-white/10" : "bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]"} shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity before:-z-10 after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-t after:from-black/30 after:to-transparent after:z-[-1] border border-white/[0.03] transition-all duration-500 opacity-0 group-hover:opacity-100`}
      />
      <span className="relative flex items-center gap-2 text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
        {icon}
        {label}
      </span>
    </Link>
  );
};
