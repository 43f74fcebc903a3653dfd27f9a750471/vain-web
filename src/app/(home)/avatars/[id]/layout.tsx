import { executeQuery } from "@/lib/actions/client";
import { Metadata } from "next";
import mascot from "@/assets/vain/mascot.webp";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: userId } = await params;

  const [userData, avatarHistory] = await Promise.all([
    executeQuery("user.find", { userId }),
    executeQuery("user.avatarHistory", { userId }),
  ]);

  const username = (userData as any)?.username || "User";
  const avatarCount = (avatarHistory as any)?.length || 0;
  const thumbnailUrl =
    (userData as any)?.avatar ||
    ((avatarHistory as any)?.length > 0
      ? (avatarHistory as any)[0].avatar_url
      : mascot.src);

  return {
    title: `${username}'s avatar history`,
    description: `${avatarCount} avatar${avatarCount !== 1 ? "s" : ""} tracked by vain`,
    openGraph: {
      title: `${username}'s avatar history`,
      description: `${avatarCount} avatar${avatarCount !== 1 ? "s" : ""} tracked by vain`,
      url: `/avatars/${userId}`,
      siteName: "vain",
      images: [{ url: thumbnailUrl }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${username}'s avatar history`,
      description: `${avatarCount} avatar${avatarCount !== 1 ? "s" : ""} tracked by vain`,
      images: [thumbnailUrl],
    },
    icons: {
      icon: thumbnailUrl,
      apple: thumbnailUrl,
    },
    alternates: {
      canonical: `/avatars/${userId}`,
    },
  };
}

export default function AvatarsLayout({ children }: Props) {
  return <>{children}</>;
}
