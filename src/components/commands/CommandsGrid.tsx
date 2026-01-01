"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Pagination } from "@heroui/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "@/types/commands";
import { CommandCard } from "./CommandCard";
import { CommandModal } from "./CommandModal";
interface CommandsGridProps {
  commands: Command[];
}

const ITEMS_PER_PAGE = 30;

const IGNORED_COMMAND_NAMES = ["aura", "jishaku"];

export const CommandsGrid = ({ commands }: CommandsGridProps) => {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<Command | null>(null);
  const [copied, setCopied] = useState("");

  const filteredCommands = useMemo(() => {
    return commands.filter((command) => {
      if (!command.name || !command.qualified_name) return false;
      if (IGNORED_COMMAND_NAMES.includes(command.name.toLowerCase()))
        return false;
      if (command.hidden) return false;
      if (!command.enabled) return false;

      return true;
    });
  }, [commands]);

  useEffect(() => {
    setPage(1);
  }, [filteredCommands]);

  const totalPages = Math.ceil(filteredCommands.length / ITEMS_PER_PAGE);
  const paginatedCommands = useMemo(
    () =>
      filteredCommands.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      ),
    [filteredCommands, page]
  );

  const copy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    } catch {}
  }, []);

  if (!filteredCommands.length) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-lg">No commands found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-8">
        {paginatedCommands.map((command, index) => {
          const uniqueKey =
            command.qualified_name || command.name || `command-${index}`;

          return (
            <CommandCard
              key={`${uniqueKey}-${index}`}
              command={command}
              onModalOpen={setModal}
              onCopy={copy}
              copied={copied}
            />
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center pt-4 border-t border-white/5">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            showControls
            size="lg"
            siblings={0}
            boundaries={1}
            classNames={{
              base: "bg-transparent",
              prev: "bg-black/20 border border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white transition-all duration-200 relative",
              next: "bg-black/20 border border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white transition-all duration-200 relative",
              item: "bg-black/20 border border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white transition-all duration-200 relative",
              cursor:
                "bg-black/30 border border-white/20 text-white transition-all duration-200 relative",
              forwardIcon: "text-white/70",
              ellipsis: "text-white/70",
              chevronNext: "text-white/70",
            }}
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        {modal && (
          <CommandModal
            command={modal}
            onClose={() => setModal(null)}
            onCopy={copy}
            copied={copied}
          />
        )}
      </AnimatePresence>
    </>
  );
};
