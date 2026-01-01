"use client";

import { EmbedData } from "@/types/embeds";
import { VariableInput } from "@/components/variable/VariableInput";
import { ColorPicker, HStack, Portal, parseColor } from "@chakra-ui/react";
import { useState, useMemo, useEffect, useRef } from "react";
import React from "react";
import colors from "@/lib/colors.json";

interface GeneralTabProps {
  embed: EmbedData;
  onChange: (key: string, value: string | boolean) => void;
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const colorDistance = (color1: string, color2: string) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return Infinity;
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );
};

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const GeneralTab = ({ embed, onChange }: GeneralTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const allColors = useMemo(
    () =>
      Object.entries(colors).map(([hex, name]) => ({ hex: `#${hex}`, name })),
    []
  );

  const randomColors = useMemo(() => {
    return allColors
      .filter((color) => {
        const rgb = hexToRgb(color.hex);
        if (!rgb) return false;
        const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
        return luminance < 150;
      })
      .slice(0, 18);
  }, [allColors]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  const filteredColors = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return randomColors;
    return allColors.filter(
      (color) =>
        color.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        color.hex.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, allColors, randomColors]);

  useEffect(() => {
    if (scrollRef.current) {
      setIsScrollable(
        scrollRef.current.scrollHeight > scrollRef.current.clientHeight
      );
    }
  }, [filteredColors]);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-white/60 text-[11px] leading-none">
            Title
          </label>
          <span
            className={`text-[10px] ${
              embed.title.length > 256 ? "text-red-400" : "text-white/40"
            }`}
          >
            {embed.title.length}/256
          </span>
        </div>
        <VariableInput
          value={embed.title}
          onChange={(value) => onChange("title", value)}
          className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
          placeholder="Embed title"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-white/60 text-[11px] leading-none">
            URL
          </label>
          <span
            className={`text-[10px] ${
              embed.url && !isValidUrl(embed.url)
                ? "text-red-400"
                : "text-white/40"
            }`}
          >
            {embed.url ? (isValidUrl(embed.url) ? "Valid" : "Invalid URL") : ""}
          </span>
        </div>
        <VariableInput
          value={embed.url}
          onChange={(value) => onChange("url", value)}
          className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
          placeholder="https://vain.bot/"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-white/60 text-[11px] leading-none">
            Description
          </label>
          <span
            className={`text-[10px] ${
              embed.description.length > 4096 ? "text-red-400" : "text-white/40"
            }`}
          >
            {embed.description.length}/4096
          </span>
        </div>
        <VariableInput
          type="textarea"
          value={embed.description}
          onChange={(value) => onChange("description", value)}
          className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
          placeholder="Embed description"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-white/60 text-[11px] leading-none mb-1">
          Color
        </label>
        <div className="space-y-3">
          <div className="bg-black/20 border border-white/[0.08] rounded-md p-2">
            <ColorPicker.Root
              value={parseColor(embed.color || "#CCCCFF")}
              onValueChange={(e) => onChange("color", e.value.toString("hex"))}
            >
              <ColorPicker.HiddenInput />
              <ColorPicker.Control className="flex items-center gap-2">
                <ColorPicker.Trigger className="h-8 w-8 rounded focus:outline-none transition-colors flex-shrink-0" />
                <ColorPicker.Input className="flex-1 bg-transparent border-0 text-white focus:outline-none placeholder:text-white/40 min-w-0 h-8" />
              </ColorPicker.Control>

              <Portal>
                <ColorPicker.Positioner>
                  <ColorPicker.Content className="bg-black/90 border border-white/[0.08] rounded-md shadow-2xl p-3">
                    <ColorPicker.Area className="rounded-md border border-white/[0.08]" />
                    <HStack className="mt-3">
                      <ColorPicker.ChannelSlider
                        channel="hue"
                        className="rounded-md border border-white/[0.08]"
                      />
                    </HStack>
                  </ColorPicker.Content>
                </ColorPicker.Positioner>
              </Portal>
            </ColorPicker.Root>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search colors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors text-sm"
            />
            <div
              ref={scrollRef}
              className="relative bg-black/10 rounded-lg max-h-32 overflow-y-auto p-2"
            >
              {filteredColors.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pr-2">
                  {filteredColors.slice(0, 20).map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => onChange("color", color.hex)}
                      className="group relative h-8 rounded-md border border-white/[0.08] hover:border-white/20 transition-colors"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      <div className="absolute inset-0 rounded-md bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] text-white font-medium truncate">
                          {color.name.split(" ")[0]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-white/60 text-sm p-2">No colors found</p>
              )}
              {isScrollable && (
                <>
                  <div className="absolute top-2 left-2 right-2 h-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 h-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-white/60 text-[11px] leading-none mb-1">
          Thumbnail URL
        </label>
        <VariableInput
          value={embed.thumbnail}
          onChange={(value) => onChange("thumbnail", value)}
          className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
          placeholder="https://example.com/image.png"
        />
      </div>

      <div>
        <label className="block text-white/60 text-[11px] leading-none mb-1">
          Image URL
        </label>
        <VariableInput
          value={embed.image}
          onChange={(value) => onChange("image", value)}
          className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
          placeholder="https://example.com/image.png"
        />
      </div>

      <div className="bg-black/20 border border-white/[0.08] rounded-md p-3 hover:border-white/20 transition-colors">
        <label
          htmlFor="timestamp"
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="text-white/70 text-sm font-medium">
            Include timestamp
          </span>
          <button
            type="button"
            onClick={() => onChange("timestamp", !embed.timestamp)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-vain-primary/20 ${
              embed.timestamp
                ? "bg-vain-primary"
                : "bg-black/40 border border-white/10"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                embed.timestamp ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </label>
      </div>
    </div>
  );
};
