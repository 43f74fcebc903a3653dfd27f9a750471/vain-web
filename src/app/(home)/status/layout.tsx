import { Metadata } from "next";

export const metadata: Metadata = {
  title: "vain • status",
  description: "View the current status of the bot",
};

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
