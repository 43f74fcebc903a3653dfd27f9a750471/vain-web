"use client";

import { FaInfo, FaCheck } from "react-icons/fa6";
import { HiOutlineClipboard } from "react-icons/hi2";
import { Command, CommandParam } from "@/types/commands";
import { useDesktopHover } from "@/hooks/useDesktopHover";
import { useState } from "react";
import styles from "@/components/ui/css/commands/card.module.css";

interface CommandCardProps {
  command: Command;
  onModalOpen: (command: Command) => void;
  onCopy: (text: string, key: string) => void;
  copied: string;
}

export const CommandCard = ({
  command,
  onModalOpen,
  onCopy,
  copied,
}: CommandCardProps) => {
  const isDesktop = useDesktopHover();

  const name = command.qualified_name || command.name;
  const desc = command.help || command.description || "No description";
  const isPremium = command.permissions?.some((p) =>
    p.name.toLowerCase().includes("tier")
  );
  const hasPerms =
    command.permissions?.length > 0 && command.permissions[0].name !== "None";
  const params = command.params?.slice(0, 4) || [];
  const aliases = command.aliases?.slice(0, 3) || [];
  const copyKey = `${name}-card`;
  const copyText = `;${name}`;

  return (
    <div className={`${styles.card} ${isDesktop ? styles.cardHover : ""}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderFlex}>
          <div className={styles.cardNameFlex}>
            {isPremium && (
              <div className={styles.premiumIndicator}>
                <div className={styles.premiumDot} />
              </div>
            )}
            <p className={styles.cardName}>{name}</p>
          </div>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => onModalOpen(command)}
              className={styles.button}
            >
              <FaInfo className={styles.icon} />
            </button>
            <button
              onClick={() => onCopy(copyText, copyKey)}
              className={`${styles.button} ${
                copied === copyKey ? styles.copyButtonCopied : ""
              }`}
            >
              {copied === copyKey ? (
                <FaCheck className={styles.icon} />
              ) : (
                <HiOutlineClipboard className={styles.icon} />
              )}
            </button>
          </div>
        </div>
        <p className={styles.cardDescription}>
          {desc.length > 60 ? `${desc.slice(0, 60)}…` : desc}
        </p>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.separator} />
        <div className={styles.section}>
          <p className={styles.sectionTitle}>arguments</p>
          <div className={styles.paramList}>
            {params.length === 0 ? (
              <span className={styles.noneText}>none</span>
            ) : (
              params.map((param, idx) => (
                <span
                  key={idx}
                  className={
                    param.required ? styles.paramRequired : styles.paramOptional
                  }
                >
                  {param.required ? `<${param.name}>` : `[${param.name}]`}
                </span>
              ))
            )}
            {command.params && command.params.length > 4 && (
              <span className={styles.overflowText}>
                +{command.params.length - 4}
              </span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>
            {hasPerms ? "permissions" : "aliases"}
          </p>
          <div className={styles.paramList}>
            {hasPerms ? (
              command.permissions
                ?.filter((p) => p.name !== "None")
                .slice(0, 2)
                .map((perm, idx) => (
                  <span key={idx} className={styles.permission}>
                    {perm.name
                      .split("_")
                      .map(
                        (w: string) => w.charAt(0).toUpperCase() + w.slice(1)
                      )
                      .join(" ")}
                  </span>
                ))
            ) : aliases.length > 0 ? (
              aliases.map((alias, idx) => (
                <span key={idx} className={styles.paramRequired}>
                  {alias}
                </span>
              ))
            ) : (
              <span className={styles.noneText}>none</span>
            )}
            {aliases.length > 3 && (
              <span className={styles.overflowText}>+{aliases.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
