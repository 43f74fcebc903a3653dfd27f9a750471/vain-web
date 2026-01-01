"use client";

import { FiPlus, FiTrash, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { EmbedData } from "@/types/embeds";
import { VariableInput } from "@/components/variable/VariableInput";

interface FieldsTabProps {
  fields: EmbedData["fields"];
  onAdd: () => void;
  onUpdate: (
    index: number,
    key: "name" | "value" | "inline",
    value: any
  ) => void;
  onRemove: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export const FieldsTab = ({
  fields,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}: FieldsTabProps) => (
  <div className="space-y-4">
    {fields.map((field, index) => (
      <div
        key={index}
        className="bg-black/20 border border-white/[0.08] rounded-md p-3"
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Field {index + 1}</h4>
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
              disabled={index === fields.length - 1}
              className="text-white/60 hover:text-white p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Move down"
            >
              <FiChevronDown size={14} />
            </button>
            <button
              onClick={() => onRemove(index)}
              className="text-white/60 hover:text-red-400 p-1 rounded transition-colors"
              title="Remove field"
            >
              <FiTrash size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-white/60 text-[11px] leading-none">
                Name
              </label>
              <span
                className={`text-[10px] ${field.name.length > 256 ? "text-red-400" : "text-white/40"}`}
              >
                {field.name.length}/256
              </span>
            </div>
            <VariableInput
              value={field.name}
              onChange={(value) => onUpdate(index, "name", value)}
              className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-white/60 text-[11px] leading-none">
                Value
              </label>
              <span
                className={`text-[10px] ${field.value.length > 1024 ? "text-red-400" : "text-white/40"}`}
              >
                {field.value.length}/1024
              </span>
            </div>
            <VariableInput
              type="textarea"
              value={field.value}
              onChange={(value) => onUpdate(index, "value", value)}
              className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors text-sm"
              rows={2}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id={`inline-${index}`}
              checked={field.inline}
              onChange={(e) => onUpdate(index, "inline", e.target.checked)}
              className="mr-2 h-4 w-4 rounded border-white/30 text-vain-primary focus:ring-vain-primary/20"
            />
            <label
              htmlFor={`inline-${index}`}
              className="text-xs text-white/70"
            >
              Inline field
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
      <span>Add Field</span>
    </button>
  </div>
);
