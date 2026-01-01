"use client";

import { useState, useMemo, useCallback } from "react";
import { CategorySelector } from "@/components/commands/CategorySelector";
import { CommandsGrid } from "@/components/commands/CommandsGrid";
import { useCommandsQuery } from "@/hooks/useQueries";
import { useOptimizedDebounce } from "@/hooks/useOptimizedDebounce";
import { Loader2, AlertCircle } from "lucide-react";
import { HiMagnifyingGlass, HiXMark, HiMiniCommandLine } from "react-icons/hi2";
import { PageLayout } from "@/components/ui/PageLayout";

export default function CommandsPage() {
  const { data, isLoading, error } = useCommandsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    commands = {},
    searchIndex = new Map(),
    categories = [],
    totalCommands = 0,
  } = data || {};

  const debouncedSearchTerm = useOptimizedDebounce(searchTerm, 200);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const clearCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const allFilteredCommands = useMemo(() => {
    const { allCommands = [] } = data || {};

    if (!allCommands.length) return [];

    const term = debouncedSearchTerm.toLowerCase().trim();

    if (!term && !selectedCategory) return allCommands;

    return allCommands.filter((cmd) => {
      for (const [key, { command, category, searchText }] of searchIndex) {
        if (command !== cmd) continue;

        if (selectedCategory && category !== selectedCategory) return false;
        if (term && !searchText.includes(term)) return false;

        return true;
      }
      return false;
    });
  }, [data, debouncedSearchTerm, selectedCategory, searchIndex]);

  return (
    <PageLayout
      title="Commands"
      subtitle={
        <>
          View all {totalCommands.toLocaleString()} commands from{" "}
          {categories.length} categories.
        </>
      }
      icon={<HiMiniCommandLine className="w-6 h-6 text-vain-primary" />}
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <HiMagnifyingGlass className="h-4 w-4 text-white/40" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-9 py-2 bg-black/20 border border-white/[0.08] rounded-md text-white/90 placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors text-sm h-10"
            placeholder="Search commands, descriptions, or aliases..."
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-white/40 hover:text-white/70 transition-colors"
            >
              <HiXMark className="h-4 w-4" />
            </button>
          )}
        </div>
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categoryData={data?.categoryData}
          totalCommands={totalCommands}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-vain-primary/70 animate-spin mb-4" />
          <p className="text-white/60 text-lg">Loading commands ...</p>
          <p className="text-white/40 text-sm mt-1">Hold on a bit...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 border border-white/[0.08] rounded-3xl bg-white/[0.008]">
          <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/20">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-white/90 text-xl font-medium mb-2">
            I couldn't load the commands
          </h3>
          <p className="text-white/60 text-center max-w-md mb-6">
            {error?.message || "Sorry 😭😭😭"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-vain-primary/10 hover:bg-vain-primary/20 border border-vain-primary/30 rounded-xl text-vain-primary font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : !isLoading && allFilteredCommands.length > 0 ? (
        <CommandsGrid commands={allFilteredCommands} />
      ) : (
        <div className="flex flex-col items-center py-20 border border-white/5 rounded-md bg-white/[0.01]">
          <p className="text-white/60">
            {searchTerm || selectedCategory
              ? "No commands match your search or category filter."
              : "No commands are currently available."}
          </p>
        </div>
      )}
    </PageLayout>
  );
}
