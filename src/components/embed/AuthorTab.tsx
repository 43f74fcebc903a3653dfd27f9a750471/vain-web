"use client";

import { EmbedData } from "@/types/embeds";
import { VariableInput } from "@/components/variable/VariableInput";

interface AuthorTabProps {
  embed: EmbedData;
  onChange: (section: "author" | "footer", key: string, value: string) => void;
}

export const AuthorTab = ({ embed, onChange }: AuthorTabProps) => (
  <div className="space-y-4">
    <div>
      <label className="block text-white/60 text-[11px] leading-none mb-1">
        Author Name
      </label>
      <VariableInput
        value={embed.author.name}
        onChange={(value) => onChange("author", "name", value)}
        className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
        placeholder="Author name"
      />
    </div>

    <div>
      <label className="block text-white/60 text-[11px] leading-none mb-1">
        Author URL
      </label>
      <VariableInput
        value={embed.author.url}
        onChange={(value) => onChange("author", "url", value)}
        className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
        placeholder="https://vain.bot"
      />
    </div>

    <div>
      <label className="block text-white/60 text-[11px] leading-none mb-1">
        Author Icon URL
      </label>
      <VariableInput
        value={embed.author.icon_url}
        onChange={(value) => onChange("author", "icon_url", value)}
        className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
        placeholder="https://example.com/icon.png"
      />
    </div>
  </div>
);
