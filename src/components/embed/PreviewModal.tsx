"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { HiOutlineX, HiOutlineClipboard } from "react-icons/hi";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { EmbedData } from "@/types/embeds";
import { defaultVariables } from "@/types/embeds";
import { FiExternalLink } from "react-icons/fi";

interface PreviewModalProps {
  embed: EmbedData;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  onCopy: () => void;
}

const parseSpecialFormatting = (text: string) => {
  if (!text) return text;

  text = text.replace(/<#(\d+)>/g, (_, channelId) => {
    return `#channel-${channelId.substring(0, 4)}`;
  });

  text = text.replace(/<(?:a:|:)([a-zA-Z0-9_]+):(\d+)>/g, () => {
    return `🎮`;
  });

  text = text.replace(/\[guild\]/g, defaultVariables["guild.name"]);

  return text;
};

const processVariables = (text: string) => {
  if (!text) return text;

  text = parseSpecialFormatting(text);

  const variablePattern = /\{([a-zA-Z0-9_.]+)\}/g;
  return text.replace(variablePattern, (match, variable) => {
    return defaultVariables[variable as keyof typeof defaultVariables] || match;
  });
};

export const PreviewModal = ({
  embed,
  content,
  isOpen,
  onClose,
  onCopy,
}: PreviewModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, onClose);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-5 select-none"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{
          type: "tween",
          ease: "easeOut",
          duration: 0.2,
        }}
        className="bg-black/20 border border-white/[0.08] rounded-md max-w-lg w-full overflow-hidden shadow-xl"
      >
        <div className="relative border-b border-white/5 py-3 px-4 flex justify-between items-center">
          <h3 className="text-white font-medium">Embed Preview</h3>
          <button
            className="text-white/60 hover:text-white bg-black/20 hover:bg-black/30 rounded-full p-1 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <HiOutlineX className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5">
          <div className="bg-[#2b2d31] p-4 rounded-md">
            {content && (
              <div className="mb-2 text-white">{processVariables(content)}</div>
            )}

            <div
              className="border-l-4 rounded-sm pl-3 mb-2"
              style={{ borderColor: embed.color || "#CCCCFF" }}
            >
              <div className="bg-[#2b2d31] rounded relative">
                {embed.author.name && (
                  <div className="flex items-center gap-2 mb-2">
                    {embed.author.icon_url && (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-white/10">
                        <img
                          src={processVariables(embed.author.icon_url)}
                          alt="Author icon"
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>
                    )}
                    <div className="text-sm font-medium text-white/90">
                      {embed.author.url ? (
                        <a
                          href={processVariables(embed.author.url)}
                          className="hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {processVariables(embed.author.name)}
                        </a>
                      ) : (
                        processVariables(embed.author.name)
                      )}
                    </div>
                  </div>
                )}

                {embed.title && (
                  <div className="font-semibold text-white mb-1">
                    {embed.url ? (
                      <a
                        href={processVariables(embed.url)}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {processVariables(embed.title)}
                      </a>
                    ) : (
                      processVariables(embed.title)
                    )}
                  </div>
                )}

                {embed.description && (
                  <div className="text-white/90 text-sm mb-3 whitespace-pre-wrap">
                    {processVariables(embed.description)}
                  </div>
                )}

                {embed.fields.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {embed.fields.map((field, i) => (
                      <div
                        key={i}
                        className={`${
                          field.inline ? "col-span-1" : "col-span-2"
                        }`}
                      >
                        <div className="font-medium text-white/90 text-xs">
                          {processVariables(field.name)}
                        </div>
                        <div className="text-white/80 text-xs mt-0.5">
                          {processVariables(field.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {embed.image && (
                  <div className="mb-3 mt-2 max-w-full">
                    <img
                      src={processVariables(embed.image)}
                      alt="Embed image"
                      className="max-w-full rounded-md h-auto max-h-64 object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}

                {embed.timestamp && (
                  <div className="text-xs text-white/60 mt-2 mb-1">
                    {new Date().toLocaleString()}
                  </div>
                )}

                {embed.footer.text && (
                  <div className="flex items-center gap-2 mt-2">
                    {embed.footer.icon_url && (
                      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={processVariables(embed.footer.icon_url)}
                          alt="Footer icon"
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>
                    )}
                    <div className="text-xs text-white/70">
                      {processVariables(embed.footer.text)}
                    </div>
                  </div>
                )}

                {embed.thumbnail && (
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-md overflow-hidden">
                    <img
                      src={processVariables(embed.thumbnail)}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>
            </div>

            {embed.buttons.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {embed.buttons.map((button, i) => {
                  const buttonStyles = {
                    link: "bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white/30",
                    primary: "bg-[#5865f2] hover:bg-[#4752c4] text-white",
                    secondary: "bg-[#4e5058] hover:bg-[#5c5e66] text-white",
                    success: "bg-[#3ba55c] hover:bg-[#2d7d32] text-white",
                    danger: "bg-[#ed4245] hover:bg-[#c62d31] text-white",
                  };

                  return (
                    <button
                      key={i}
                      disabled={button.disabled}
                      className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-colors flex items-center gap-1.5 min-h-[32px] ${
                        buttonStyles[button.style]
                      } ${
                        button.disabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {button.emoji && (
                        <span className="text-base">
                          {processVariables(button.emoji)}
                        </span>
                      )}
                      <span>{processVariables(button.label)}</span>
                      {button.style === "link" && (
                        <FiExternalLink className="w-3 h-3 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-white/60">
              Preview as it would appear in Discord
            </div>
            <div className="flex gap-2">
              <button
                onClick={onCopy}
                className="px-3 py-1.5 bg-black/20 hover:bg-black/30 text-white text-xs rounded-md transition-colors flex items-center gap-1.5"
              >
                <HiOutlineClipboard size={12} />
                Copy
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-black/20 hover:bg-black/30 border border-white/[0.08] hover:border-white/20 rounded-md text-white/70 hover:text-white font-medium flex items-center gap-2 transition-all duration-200 relative"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
