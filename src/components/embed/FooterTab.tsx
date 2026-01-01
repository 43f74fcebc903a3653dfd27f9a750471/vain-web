"use client";

import { EmbedData } from "@/types/embeds";
import { VariableInput } from "@/components/variable/VariableInput";

interface FooterTabProps {
  embed: EmbedData;
  onChange: (section: "author" | "footer", key: string, value: string) => void;
}

export const FooterTab = ({ embed, onChange }: FooterTabProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-white/60 text-[11px] leading-none mb-1">
        Footer Text
      </label>
      <VariableInput
        value={embed.footer.text}
        onChange={(value) => onChange("footer", "text", value)}
        className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
        placeholder="Footer text"
      />
    </div>

    <div>
      <label className="block text-white/60 text-[11px] leading-none mb-1">
        Footer Icon URL
      </label>
      <VariableInput
        value={embed.footer.icon_url}
        onChange={(value) => onChange("footer", "icon_url", value)}
        className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
        placeholder="https://example.com/icon.png"
      />
    </div>
  </div>
);
