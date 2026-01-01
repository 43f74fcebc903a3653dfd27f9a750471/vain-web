"use client";

import { FiPlus, FiTrash, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { EmbedData } from "@/types/embeds";
import { VariableInput } from "@/components/variable/VariableInput";

interface ButtonsTabProps {
  buttons: EmbedData["buttons"];
  onAdd: () => void;
  onUpdate: (
    index: number,
    key: keyof EmbedData["buttons"][0],
    value: any
  ) => void;
  onRemove: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const ButtonsTab = ({
  buttons,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}: ButtonsTabProps) => (
  <div className="space-y-4">
    {buttons.map((button, index) => (
      <div
        key={index}
        className="bg-black/20 border border-white/[0.08] rounded-md p-3"
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Button {index + 1}</h4>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onReorder(index, index - 1)}
              disabled={index === 0}
              className="text-white/60 hover:text-white p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move up"
            >
              <FiChevronUp size={14} />
            </button>
            <button
              onClick={() => onReorder(index, index + 1)}
              disabled={index === buttons.length - 1}
              className="text-white/60 hover:text-white p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move down"
            >
              <FiChevronDown size={14} />
            </button>
            <button
              onClick={() => onRemove(index)}
              className="text-white/60 hover:text-red-400 p-1 rounded transition-colors"
              title="Remove button"
            >
              <FiTrash size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-white/60 text-[11px] leading-none mb-1">
              Style
            </label>
            <select
              value={button.style}
              onChange={(e) => onUpdate(index, "style", e.target.value)}
              className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors text-sm"
            >
              <option value="link">Link</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="success">Success</option>
              <option value="danger">Danger</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-white/60 text-[11px] leading-none">
                Label
              </label>
              <span
                className={`text-[10px] ${button.label.length > 80 ? "text-red-400" : "text-white/40"}`}
              >
                {button.label.length}/80
              </span>
            </div>
            <VariableInput
              value={button.label}
              onChange={(value) => onUpdate(index, "label", value)}
              className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors text-sm"
              placeholder="Button text"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-white/60 text-[11px] leading-none">
                {button.style === "link" ? "URL" : "Custom ID"}
              </label>
              <span
                className={`text-[10px] ${
                  button.style === "link" &&
                  button.url &&
                  !isValidUrl(button.url)
                    ? "text-red-400"
                    : "text-white/40"
                }`}
              >
                {button.style === "link" && button.url
                  ? isValidUrl(button.url)
                    ? "Valid"
                    : "Invalid URL"
                  : ""}
              </span>
            </div>
            <VariableInput
              value={button.url}
              onChange={(value) => onUpdate(index, "url", value)}
              className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors text-sm"
              placeholder={
                button.style === "link" ? "https://vain.bot" : "custom_id"
              }
            />
          </div>

          <div>
            <label className="block text-white/60 text-[11px] leading-none mb-1">
              Emoji
            </label>
            <VariableInput
              value={button.emoji}
              onChange={(value) => onUpdate(index, "emoji", value)}
              className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors text-sm"
              placeholder="🎮"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id={`disabled-${index}`}
              checked={button.disabled}
              onChange={(e) => onUpdate(index, "disabled", e.target.checked)}
              className="mr-2 h-4 w-4 rounded border-white/30 text-vain-primary focus:ring-vain-primary/20"
            />
            <label
              htmlFor={`disabled-${index}`}
              className="text-xs text-white/70"
            >
              Disabled
            </label>
          </div>
        </div>
      </div>
    ))}

    <button
      onClick={onAdd}
      className="w-full py-2 border border-dashed border-white/[0.08] rounded-md text-white/60 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2"
    >
      <FiPlus size={16} />
      <span>Add Button</span>
    </button>
  </div>
);
