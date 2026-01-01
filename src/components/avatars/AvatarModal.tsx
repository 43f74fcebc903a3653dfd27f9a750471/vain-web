"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { HiOutlineX, HiOutlineDownload } from "react-icons/hi";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { AvatarHistoryItem } from "@/lib/actions";

interface AvatarModalProps {
  avatar: AvatarHistoryItem;
  onClose: () => void;
}

export const AvatarModal = ({ avatar, onClose }: AvatarModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, onClose);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy • HH:mm");
    } catch {
      return "Unknown date";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-5 select-none"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 1,
          duration: 0.4,
        }}
        className="bg-[#0c0d0d] border border-white/10 rounded-md w-[min(90%,360px)] overflow-hidden shadow-xl"
      >
        <div className="relative">
          <button
            className="absolute top-2.5 right-2.5 z-10 text-white/60 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <HiOutlineX className="w-3.5 h-3.5" />
          </button>

          <div className="relative w-full aspect-square bg-gradient-to-b from-black/20 to-transparent">
            <Image
              src={avatar.avatar_url}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 448px, 512px"
              priority
            />
          </div>

          <div className="px-3 py-2 border-t border-white/10 bg-black/20">
            <div className="flex items-center justify-between">
              <p className="text-white/80 text-xs font-medium">
                {formatDate(avatar.timestamp)}
              </p>
              <a
                href={avatar.avatar_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-1.5 py-1 text-xs rounded-md border border-vain-primary/30 text-vain-primary/80 bg-vain-primary/10 hover:bg-vain-primary/20 flex items-center gap-1"
                aria-label="Download avatar"
              >
                <HiOutlineDownload className="w-3 h-3" />
                Download
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
