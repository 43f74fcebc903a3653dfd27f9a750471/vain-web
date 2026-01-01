import { Metadata } from "next";

export const metadata: Metadata = {
  title: "vain • commands",
  description: "View vain's full list of commands and their descriptions",
};

export default function CommandsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
