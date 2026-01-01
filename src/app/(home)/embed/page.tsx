"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmbedData, initialEmbed, defaultVariables } from "@/types/embeds";
import { EmbedHeader } from "@/components/embed/EmbedHeader";
import { EmbedBuilder } from "@/components/embed/EmbedBuilder";
import { EmbedPreview } from "@/components/embed/EmbedPreview";
import { EmbedVariables } from "@/components/embed/EmbedVariables";
import { PreviewModal } from "@/components/embed/PreviewModal";
import { PageLayout } from "@/components/ui/PageLayout";
import { RiFilePaper2Fill } from "react-icons/ri";

const EmbedPage = () => {
  const [embed, setEmbed] = useState<EmbedData>(initialEmbed);
  const [content, setContent] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "author" | "fields" | "footer" | "buttons"
  >("general");

  const parseSpecialFormatting = (text: string) => {
    if (!text) return text;

    text = text.replace(/<#(\d+)>/g, (_, channelId) => {
      return `#channel-${channelId.substring(0, 4)}`;
    });

    text = text.replace(/<(?:a:|:)([a-zA-Z0-9_]+):(\d+)>/g, () => {
      return `[emoji]`;
    });

    text = text.replace(/\[guild\]/g, defaultVariables["guild.name"]);

    return text;
  };

  const processVariables = (text: string) => {
    if (!text) return text;

    text = parseSpecialFormatting(text);

    const variablePattern = /\{([a-zA-Z0-9_.]+)\}/g;
    return text.replace(variablePattern, (match, variable) => {
      return (
        defaultVariables[variable as keyof typeof defaultVariables] || match
      );
    });
  };

  const generateScript = () => {
    // eslint-disable-next-line prefer-const
    let script = [];

    if (content) {
      script.push(`{content: ${content}}`);
    }

    script.push("{embed}");

    if (embed.timestamp) {
      script.push("{timestamp}");
    }

    if (embed.color) {
      script.push(`{color: ${embed.color}}`);
    }

    if (embed.title) {
      script.push(`{title: ${embed.title}}`);
    }

    if (embed.url) {
      script.push(`{url: ${embed.url}}`);
    }

    if (embed.description) {
      script.push(`{description: ${embed.description}}`);
    }

    if (embed.thumbnail) {
      script.push(`{thumbnail: ${embed.thumbnail}}`);
    }

    if (embed.image) {
      script.push(`{image: ${embed.image}}`);
    }

    if (embed.author.name) {
      const authorParts = [embed.author.name];

      if (embed.author.url) {
        authorParts.push(embed.author.url);
      }

      if (embed.author.icon_url) {
        authorParts.push(embed.author.icon_url);
      }

      script.push(`{author: ${authorParts.join(" && ")}}`);
    }

    embed.fields.forEach((field) => {
      const fieldParts = [field.name, field.value];
      if (field.inline) {
        fieldParts.push("inline");
      }
      script.push(`{field: ${fieldParts.join(" && ")}}`);
    });

    if (embed.footer.text) {
      const footerParts = [embed.footer.text];

      if (embed.footer.icon_url) {
        footerParts.push(embed.footer.icon_url);
      }

      script.push(`{footer: ${footerParts.join(" && ")}}`);
    }

    embed.buttons.forEach((button) => {
      const buttonParts = [button.style, button.label, button.url];
      if (button.emoji) {
        buttonParts.push(button.emoji);
      }
      if (button.disabled) {
        buttonParts.push("disabled");
      }
      script.push(`{button: ${buttonParts.join(" && ")}}`);
    });

    return script.join("$v");
  };

  const copyToClipboard = () => {
    const script = generateScript();
    navigator.clipboard.writeText(script);
  };

  const downloadScript = () => {
    const script = generateScript();
    const element = document.createElement("a");
    const file = new Blob([script], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "script.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <PageLayout
      title="Embed Builder"
      subtitle="Create custom Discord embeds with variables"
      icon={<RiFilePaper2Fill className="w-6 h-6 text-vain-primary" />}
    >
      <div className="space-y-4 mb-12">
        <EmbedBuilder
          embed={embed}
          content={content}
          activeTab={activeTab}
          onEmbedChange={setEmbed}
          onContentChange={setContent}
          onTabChange={setActiveTab}
          onPreviewOpen={() => setPreviewOpen(true)}
          onCopyToClipboard={copyToClipboard}
          onDownloadScript={downloadScript}
        />

        <EmbedPreview
          embed={embed}
          content={content}
          script={generateScript()}
        />

        <EmbedVariables />
      </div>

      <AnimatePresence mode="wait">
        {previewOpen && (
          <PreviewModal
            embed={embed}
            content={content}
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
            onCopy={copyToClipboard}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default EmbedPage;
