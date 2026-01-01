"use server";

import { queryEngine } from "./engine";

export interface AvatarHistoryItem {
    avatar_url: string;
    timestamp: string;
}

export interface UserData {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot: boolean;
    system: boolean;
}

async function fetchAvatarHistory(params?: Record<string, any>): Promise<AvatarHistoryItem[]> {
    if (!params?.userId) throw new Error("userId is required");

    try {
        const response = await fetch("https://api.vain.bot/avatars", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: params.userId }),
            next: { revalidate: 90 },
        });

        if (!response.ok) throw new Error("Failed to fetch avatar history");

        const data = await response.json();
        return data.avatars || [];
    } catch (error) {
        console.error("Error fetching avatar history:", error);
        return [];
    }
}

async function findUser(params?: Record<string, any>): Promise<UserData | null> {
    if (!params?.userId) throw new Error("userId is required");

    try {
        const response = await fetch("http://127.0.0.1:6978/user/find", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: `{"user_id": ${params.userId}}`,
            next: { revalidate: 60 },
        });

        if (!response.ok) throw new Error("Failed to find user");

        const data = await response.json();
        return data || null;
    } catch (error) {
        console.error("Error finding user:", error);
        return null;
    }
}

queryEngine.register("user.find", findUser);
queryEngine.register("user.avatarHistory", fetchAvatarHistory);