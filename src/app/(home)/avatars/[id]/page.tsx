"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { UserHeader } from "@/components/avatars/UserHeader";
import { MemoizedAvatarGrid as AvatarGrid } from "@/components/avatars/AvatarGrid";
import { Pagination } from "@/components/avatars/Pagination";
import { useUserData } from "@/hooks/useUserData";
import { useResponsiveGrid } from "@/hooks/useResponsiveGrid";
import { PageLayout } from "@/components/ui/PageLayout";

export default function AvatarsPage() {
  const params = useParams();
  const userId = params.id as string;
  const [currentPage, setCurrentPage] = useState(1);

  const { userData, avatarHistory, isLoading, error } = useUserData(userId);
  const { itemsPerPage, totalPages } = useResponsiveGrid(avatarHistory.length);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (error) {
    return (
      <PageLayout
        hasHeader={false}
        title="Error"
        subtitle="Unable to load user data"
      >
        <div className="flex flex-col items-center py-20 border border-white/5 rounded-md bg-white/[0.01]">
          <p className="text-white/60">
            Error loading user data: {error.message}
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Avatars"
      subtitle={
        avatarHistory.length > 0
          ? `View all ${avatarHistory.length} avatars for @${userData?.username || "User"}`
          : `No avatars available for @${userData?.username || "User"}`
      }
      icon={
        isLoading ? null : (
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-vain-primary/20 flex-shrink-0 bg-white/5">
            <img
              src={
                userData?.avatar ||
                (avatarHistory.length > 0
                  ? avatarHistory[0].avatar_url
                  : `https://cdn.discordapp.com/embed/avatars/0.png`)
              }
              alt={`${userData?.username || "User"}'s avatar`}
              className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                img.classList.remove("opacity-0");
                img.classList.add("opacity-100");
              }}
            />
          </div>
        )
      }
    >
      <AvatarGrid
        avatars={avatarHistory}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        isLoading={isLoading}
      />

      {!isLoading && avatarHistory.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </PageLayout>
  );
}
