import { useQuery } from "@tanstack/react-query";
import { UserData, AvatarHistoryItem, query, Operations } from "@/lib/actions/index";

interface UseUserDataResult {
    userData: UserData | null;
    avatarHistory: AvatarHistoryItem[];
    isLoading: boolean;
    error: Error | null;
}

async function fetchUserData(userId: string) {
    const userData = await query(Operations.USER_FIND, { userId });
    const avatarHistory = await query(Operations.USER_AVATAR_HISTORY, { userId });

    return {
        userData: userData || null,
        avatarHistory: avatarHistory || []
    };
} export const useUserData = (userId: string): UseUserDataResult => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["user-data", userId],
        queryFn: () => fetchUserData(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        userData: data?.userData || null,
        avatarHistory: data?.avatarHistory || [],
        isLoading,
        error: error as Error | null,
    };
};