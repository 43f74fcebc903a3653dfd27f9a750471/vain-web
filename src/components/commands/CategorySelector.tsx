"use client";

import { memo, useMemo, useState, useRef, useEffect } from "react";
import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { ChevronDownIcon } from "lucide-react";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categoryData?: Array<{ name: string; count: number }>;
  totalCommands: number;
}

export const CategorySelector = memo(function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
  categoryData = [],
  totalCommands,
}: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (triggerRef.current && isOpen) {
      const width = triggerRef.current.offsetWidth;
      document.documentElement.style.setProperty(
        "--trigger-width",
        `${width}px`
      );
    }
  }, [isOpen]);
  const categoryCountMap = useMemo(() => {
    if (categoryData.length) {
      return new Map(categoryData.map((c) => [c.name, c.count]));
    }
    return new Map<string, number>();
  }, [categoryData]);

  const selectItems = useMemo(
    () => [
      { key: "", label: `All Categories (${totalCommands})` },
      ...categories.map((category) => ({
        key: category,
        label: `${category} (${categoryCountMap.get(category) || 0})`,
      })),
    ],
    [categories, categoryCountMap, totalCommands]
  );

  const selectedLabel = selectedCategory
    ? `${selectedCategory} (${categoryCountMap.get(selectedCategory) || 0})`
    : `All Categories (${totalCommands})`;

  return (
    <div className="w-full sm:w-auto sm:min-w-[180px] select-none">
      <Popover
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom"
        triggerScaleOnOpen={false}
        offset={4}
        containerPadding={0}
        shouldFlip={true}
        classNames={{
          content: "w-[var(--trigger-width)]",
        }}
      >
        <PopoverTrigger>
          <Button
            ref={triggerRef}
            variant="bordered"
            disableRipple
            disableAnimation
            className="w-full justify-between bg-black/20 border border-white/[0.08] hover:bg-black/10 hover:border-white/20 focus:border-white/20 text-white/90 h-10 rounded-md px-3 transition-colors scale-100 transform-none data-[pressed=true]:scale-100"
            endContent={<ChevronDownIcon className="w-4 h-4 text-white/40" />}
          >
            <span className="truncate text-sm">{selectedLabel}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="select-none p-0 bg-[#0A0B0B] border border-white/[0.08] shadow-xl sm:min-w-[200px]">
          <Listbox
            aria-label="Category selection"
            selectionMode="single"
            selectedKeys={
              selectedCategory ? new Set([selectedCategory]) : new Set([""])
            }
            onSelectionChange={(keys) => {
              const keysArray = Array.from(keys);
              const selected = keysArray[0] as string;
              onCategoryChange(selected === "" ? null : selected);
              setIsOpen(false);
            }}
            className="max-h-64 overflow-auto"
          >
            {selectItems.map((item) => (
              <ListboxItem
                key={item.key}
                className="text-white/80 hover:bg-black/10 data-[hover=true]:bg-black/10 data-[selected=true]:bg-vain-primary/10 data-[selected=true]:text-vain-primary px-3 py-2 text-sm"
              >
                {item.label}
              </ListboxItem>
            ))}
          </Listbox>
        </PopoverContent>
      </Popover>
    </div>
  );
});
