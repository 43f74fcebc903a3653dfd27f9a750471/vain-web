"use client";

import { useState, useCallback } from "react";
import { MdCreateNewFolder } from "react-icons/md";
import { FiEye, FiCopy, FiDownload } from "react-icons/fi";
import { EmbedData } from "@/types/embeds";
import { VariableInput } from "../variable/VariableInput";
import { GeneralTab } from "./GeneralTab";
import { AuthorTab } from "./AuthorTab";
import { FieldsTab } from "./FieldsTab";
import { FooterTab } from "./FooterTab";
import { ButtonsTab } from "./ButtonsTab";

interface EmbedBuilderProps {
  embed: EmbedData;
  content: string;
  activeTab: "general" | "author" | "fields" | "footer" | "buttons";
  onEmbedChange: (embed: EmbedData) => void;
  onContentChange: (content: string) => void;
  onTabChange: (
    tab: "general" | "author" | "fields" | "footer" | "buttons"
  ) => void;
  onPreviewOpen: () => void;
  onCopyToClipboard: () => void;
  onDownloadScript: () => void;
}

export const EmbedBuilder = ({
  embed,
  content,
  activeTab,
  onEmbedChange,
  onContentChange,
  onTabChange,
  onPreviewOpen,
  onCopyToClipboard,
  onDownloadScript,
}: EmbedBuilderProps) => {
  const handleInputChange = useCallback(
    (key: string, value: string | boolean) => {
      onEmbedChange({ ...embed, [key]: value });
    },
    [onEmbedChange, embed]
  );

  const handleNestedChange = (
    section: "author" | "footer",
    key: string,
    value: string
  ) => {
    onEmbedChange({
      ...embed,
      [section]: {
        ...embed[section],
        [key]: value,
      },
    });
  };

  const addField = () => {
    onEmbedChange({
      ...embed,
      fields: [
        ...embed.fields,
        { name: "New Field", value: "Field value", inline: false },
      ],
    });
  };

  const updateField = (
    index: number,
    key: "name" | "value" | "inline",
    value: any
  ) => {
    onEmbedChange({
      ...embed,
      fields: embed.fields.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      ),
    });
  };

  const removeField = (index: number) => {
    onEmbedChange({
      ...embed,
      fields: embed.fields.filter((_, i) => i !== index),
    });
  };

  const reorderField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= embed.fields.length) return;

    const newFields = [...embed.fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);

    onEmbedChange({
      ...embed,
      fields: newFields,
    });
  };

  const addButton = () => {
    onEmbedChange({
      ...embed,
      buttons: [
        ...embed.buttons,
        {
          style: "link",
          label: "Button",
          url: "https://vain.bot",
          emoji: "",
          disabled: false,
        },
      ],
    });
  };

  const updateButton = (
    index: number,
    key: keyof EmbedData["buttons"][0],
    value: any
  ) => {
    onEmbedChange({
      ...embed,
      buttons: embed.buttons.map((button, i) =>
        i === index ? { ...button, [key]: value } : button
      ),
    });
  };

  const removeButton = (index: number) => {
    onEmbedChange({
      ...embed,
      buttons: embed.buttons.filter((_, i) => i !== index),
    });
  };

  const reorderButton = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= embed.buttons.length) return;

    const newButtons = [...embed.buttons];
    const [movedButton] = newButtons.splice(fromIndex, 1);
    newButtons.splice(toIndex, 0, movedButton);

    onEmbedChange({
      ...embed,
      buttons: newButtons,
    });
  };

  return (
    <div className="bg-black/20 border border-white/[0.08] rounded-md shadow-md overflow-hidden">
      <div className="border-b border-white/[0.08] px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-1.5 rounded-md bg-black/30 border border-white/20 mr-2">
            <MdCreateNewFolder className="w-4 h-4 text-vain-primary/80" />
          </div>
          <h2 className="text-lg font-semibold text-white">Builder</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPreviewOpen}
            className="p-1.5 text-white/70 hover:text-white hover:bg-black/10 rounded-md transition-colors"
            title="Preview"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={onCopyToClipboard}
            className="p-1.5 text-white/70 hover:text-white hover:bg-black/10 rounded-md transition-colors"
            title="Copy to clipboard"
          >
            <FiCopy className="w-4 h-4" />
          </button>
          <button
            onClick={onDownloadScript}
            className="p-1.5 text-white/70 hover:text-white hover:bg-black/10 rounded-md transition-colors"
            title="Download script"
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-white/60 text-[11px] leading-none">
              Message Content
            </label>
            <span
              className={`text-[10px] ${content.length > 2000 ? "text-red-400" : "text-white/40"}`}
            >
              {content.length}/2000
            </span>
          </div>
          <VariableInput
            value={content}
            onChange={onContentChange}
            className="w-full bg-black/20 border border-white/[0.08] rounded-md px-3 py-2 text-white focus:outline-none focus:border-white/20 transition-colors"
            placeholder=":p"
            rows={2}
            type="textarea"
          />
        </div>

        <div className="border-t border-white/5 mb-4 pt-4">
          <div className="flex border-b border-white/5">
            {(
              ["general", "author", "fields", "footer", "buttons"] as const
            ).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-xs transition-colors ${
                  activeTab === tab
                    ? "text-vain-primary border-b-2 border-vain-primary"
                    : "text-white/70 hover:text-white/90"
                }`}
                onClick={() => onTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="pt-4">
            {activeTab === "general" && (
              <GeneralTab embed={embed} onChange={handleInputChange} />
            )}
            {activeTab === "author" && (
              <AuthorTab embed={embed} onChange={handleNestedChange} />
            )}
            {activeTab === "fields" && (
              <FieldsTab
                fields={embed.fields}
                onAdd={addField}
                onUpdate={updateField}
                onRemove={removeField}
                onReorder={reorderField}
              />
            )}
            {activeTab === "footer" && (
              <FooterTab embed={embed} onChange={handleNestedChange} />
            )}
            {activeTab === "buttons" && (
              <ButtonsTab
                buttons={embed.buttons}
                onAdd={addButton}
                onUpdate={updateButton}
                onRemove={removeButton}
                onReorder={reorderButton}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
