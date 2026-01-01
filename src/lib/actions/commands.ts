"use server";

import { queryEngine } from "./engine";
import { CommandsResponse } from "@/types/commands";

const FALLBACK_COMMANDS: CommandsResponse = {
    commands: [
        {
            name: "play",
            qualified_name: "play",
            description: "Play a track in the voice channel.",
            aliases: ["p"],
            usage: "[query]",
            example: ";play Never Gonna Give You Up",
            type: "text",
            cog: "Audio",
            permissions: [],
            cooldown: null,
            hidden: false,
            enabled: true,
            parent: null,
            subcommands: [],
        },
        {
            name: "queue",
            qualified_name: "queue",
            description: "View the tracks in the queue",
            aliases: ["q"],
            usage: "",
            example: ";queue",
            type: "text",
            cog: "Audio",
            permissions: [],
            cooldown: null,
            hidden: false,
            enabled: true,
            parent: null,
            subcommands: [],
        },
        {
            name: "skip",
            qualified_name: "skip",
            description: "Skip the current track.",
            aliases: ["s", "next"],
            usage: "",
            example: ";skip",
            type: "text",
            cog: "Audio",
            permissions: [],
            cooldown: null,
            hidden: false,
            enabled: true,
            parent: null,
            subcommands: [],
        },
        {
            name: "ban",
            qualified_name: "ban",
            description: "Ban a user from the server.",
            aliases: [],
            usage: "<user> [reason]",
            example: ";ban @user Spamming",
            type: "text",
            cog: "Moderation",
            permissions: [{ name: "BanMembers", value: true }],
            cooldown: null,
            hidden: false,
            enabled: true,
            parent: null,
            subcommands: [],
        },
        {
            name: "purge",
            qualified_name: "purge",
            description: "Delete multiple messages at once.",
            aliases: ["clear"],
            usage: "<amount>",
            example: ";purge 10",
            type: "text",
            cog: "Moderation",
            permissions: [{ name: "ManageMessages", value: true }],
            cooldown: null,
            hidden: false,
            enabled: true,
            parent: null,
            subcommands: [],
        },
        {
            name: "avatar",
            qualified_name: "avatar",
            description: "Get a user's avatar.",
            aliases: ["pfp"],
            usage: "[user]",
            example: ";avatar @user",
            type: "text",
            cog: "Utility",
            permissions: [],
            cooldown: null,
            hidden: false,
            enabled: true,
            parent: null,
            subcommands: [],
        },
        {
            name: "ping",
            qualified_name: "ping",
            description: "Check bot latency.",
            aliases: [],
            usage: "",
            example: ";ping",
            type: "text",
            cog: "Utility",
            permissions: [],
            cooldown: null,
            hidden: false,
            enabled: true,
            parent: null,
            subcommands: [],
        },
        {
            name: "serverinfo",
            qualified_name: "serverinfo",
            description: "Display information about the server.",
            aliases: ["server"],
            usage: "",
            example: ";serverinfo",
            type: "text",
            cog: "Utility",
            permissions: [],
            cooldown: null,
            hidden: false,
            enabled: true,
            parent: null,
            subcommands: [],
        },
    ],
    total: 8,
    cogs: ["Audio", "Moderation", "Utility"],
};

async function fetchCommands(): Promise<CommandsResponse> {
    try {
        const response = await fetch("https://s.vain.bot/commands", {
            next: { revalidate: 3600 },
        });

        if (!response.ok) throw new Error("Failed to fetch commands");

        const data = await response.json();

        if (data && data.commands && Array.isArray(data.commands)) {
            return data;
        }

        return FALLBACK_COMMANDS;
    } catch (error) {
        console.error("Error fetching commands:", error);
        return FALLBACK_COMMANDS;
    }
}

queryEngine.register("commands.fetch", fetchCommands);