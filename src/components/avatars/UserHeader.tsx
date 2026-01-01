"use client";

import { Chip, Skeleton } from "@heroui/react";
import { UserData, AvatarHistoryItem } from "@/lib/actions";

interface UserHeaderProps {
  userData: UserData | null;
  avatarHistory: AvatarHistoryItem[];
  isLoading: boolean;
}

export const UserHeader = ({
  userData,
  avatarHistory,
  isLoading,
}: UserHeaderProps) => {
  const hasAvatars = avatarHistory.length > 0;
  const username = userData?.username || "User";

  return (
    <div className="flex flex-row gap-5 mb-8 py-4 border-b border-white/10 items-center">
      <div className="flex-grow min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {isLoading ? (
            <>
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-8 w-32 rounded" />
            </>
          ) : (
            <>
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-vain-primary/20 flex-shrink-0 bg-white/5">
                <img
                  src={
                    userData?.avatar ||
                    (hasAvatars
                      ? avatarHistory[0].avatar_url
                      : `https://cdn.discordapp.com/embed/avatars/0.png`)
                  }
                  alt={`${username}'s avatar`}
                  className="w-full h-full object-cover opacity-0 transition-opacity duration-500"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.classList.remove("opacity-0");
                    img.classList.add("opacity-100");
                  }}
                />
              </div>
              <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold">
                {username}
              </h1>
            </>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-4 w-48 rounded mt-2" />
        ) : (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-white/40 text-sm sm:text-base">
              {avatarHistory.length > 0
                ? `View ${username}'s ${avatarHistory.length} ${
                    avatarHistory.length === 1 ? "avatar" : "avatars"
                  }`
                : `No avatars available for ${username}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
