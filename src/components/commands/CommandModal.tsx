"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Code } from "@chakra-ui/react";
import { Command, CommandParam } from "@/types/commands";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { HiOutlineClipboard, HiCheck } from "react-icons/hi2";
import { AiFillCloseCircle } from "react-icons/ai";
import { useDesktopHover } from "@/hooks/useDesktopHover";
import styles from "@/components/ui/css/commands/modal.module.css";

interface CommandModalProps {
  command: Command | null;
  onClose: () => void;
  onCopy: (text: string, key: string) => void;
  copied: string;
}

export const CommandModal = ({
  command,
  onClose,
  onCopy,
  copied,
}: CommandModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isDesktop = useDesktopHover();

  useOnClickOutside(modalRef, onClose);

  if (!command) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={styles.overlay}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.92 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9, y: 10 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 1,
          duration: 0.4,
        }}
        className={styles.modal}
      >
        <div className={styles.modalInner}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              {command.qualified_name || command.name}
            </h2>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.button} ${isDesktop ? styles.buttonHover : ""} ${copied === `${command.name}-modal` ? styles.buttonCopied : ""}`}
                onClick={() =>
                  onCopy(
                    `;${command.qualified_name || command.name}`,
                    `${command.name}-modal`
                  )
                }
              >
                {copied === `${command.name}-modal` ? (
                  <HiCheck className="h-3 w-3" />
                ) : (
                  <HiOutlineClipboard className="h-3 w-3" />
                )}
                <span>
                  {copied === `${command.name}-modal` ? "Copied" : "Copy"}
                </span>
              </button>
              <button
                className={`${styles.button} ${isDesktop ? styles.buttonHover : ""}`}
                onClick={onClose}
              >
                <AiFillCloseCircle className="h-3 w-3" />
                <span>Close</span>
              </button>
            </div>
          </div>
          <div className={styles.description}>
            <span>
              <p>
                {command.help ||
                  command.description ||
                  "No description available"}
              </p>
            </span>
          </div>
          <hr className={styles.hr} />
          <div className={styles.content}>
            <div className={styles.grid}>
              <div className={styles.section}>
                <h6 className={styles.sectionTitle}>Aliases</h6>
                {command.aliases && command.aliases.length > 0 ? (
                  <div className={styles.tagList}>
                    {command.aliases.slice(0, 2).map((alias, idx) => (
                      <span key={idx} className={styles.tag}>
                        {alias}
                      </span>
                    ))}
                    {command.aliases.length > 2 && (
                      <span className={styles.overflowTag}>
                        +{command.aliases.length - 2}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className={styles.noneText}>N/A</p>
                )}
              </div>
              <div className={styles.section}>
                <h6 className={styles.sectionTitle}>Parameters</h6>
                {command.params && command.params.length > 0 ? (
                  <div className={styles.tagList}>
                    {command.params.slice(0, 2).map((param, idx) => (
                      <span
                        key={idx}
                        className={`${styles.tag} ${param.required ? styles.tagRequired : ""}`}
                      >
                        {param.required ? `<${param.name}>` : `[${param.name}]`}
                      </span>
                    ))}
                    {command.params.length > 2 && (
                      <span className={styles.overflowTag}>
                        +{command.params.length - 2}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className={styles.noneText}>N/A</p>
                )}
              </div>
              <div className={styles.section}>
                <h6 className={styles.sectionTitle}>Information</h6>
                {/* 
                    This would be used for later
                    Dni for now
                */}
                <div>
                  {command.permissions?.some((p) =>
                    p.name.toLowerCase().includes("tier")
                  ) ? (
                    <span className={styles.premiumBadge}>
                      <div className={styles.premiumIndicator}>
                        <div className={styles.premiumDot} />
                      </div>
                      <p className={styles.premiumText}>Server Booster</p>
                    </span>
                  ) : command.permissions &&
                    command.permissions.some((p) => p.name !== "None") ? (
                    <div className={styles.tagList}>
                      {command.permissions
                        .filter((p) => p.name !== "None")
                        .slice(0, 1)
                        .map((perm, idx) => (
                          <span key={idx} className={styles.permissionTag}>
                            {perm.name
                              .split("_")
                              .map(
                                (w: string) =>
                                  w.charAt(0).toUpperCase() + w.slice(1)
                              )
                              .join(" ")}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <p className={styles.noneText}>N/A</p>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.syntax}>
              <h6 className={styles.syntaxTitle}>Syntax</h6>
              <Code
                whiteSpace="pre"
                p={2}
                color="white"
                rounded="md"
                fontSize="sm"
                w="full"
                className={styles.syntaxCode}
              >
                ;{command.qualified_name || command.name}
                {command.params?.map((param, idx) => (
                  <span
                    key={idx}
                    className={param.required ? styles.syntaxRequired : ""}
                  >
                    {" "}
                    {param.required ? `<${param.name}>` : `[${param.name}]`}
                  </span>
                ))}
              </Code>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
