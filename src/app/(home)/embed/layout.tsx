import { Metadata } from "next";

export const metadata: Metadata = {
  title: "vain • embed builder",
  description:
    "Create custom Discord embeds with vain's powerful embed scripting system",
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
