"use server";

import { CommandsResponse } from "@/types/commands";
import { TicketResponse } from "@/types/tickets";
import { verifyPow, type PowChallenge, type PowSolution } from "@/lib/pow";
import { queryEngine } from "./actions/engine";

import { apiClient } from '@/lib/api';

import { BotStatus } from './api/methods/status';

import { AvatarHistoryItem } from './api/methods/avatars';

import { UserData } from './api/methods/user';

import { GuildData } from './api/methods/guilds';



export type { BotStatus, AvatarHistoryItem, UserData, GuildData };



export async function fetchCommands(): Promise<CommandsResponse> {
  return apiClient.commands.fetch();
}



export async function fetchStatus(p0?: string): Promise<BotStatus> {
  return apiClient.status.fetch();
}



export async function fetchAvatarHistory(
  userId: string
): Promise<AvatarHistoryItem[]> {
  return apiClient.avatars.fetchHistory(userId);
}



export async function findUser(userId: string): Promise<UserData | null> {
  return apiClient.user.find(userId);
}

export async function fetchTicket(id: string): Promise<TicketResponse | null> {
  return apiClient.tickets.fetch(id);
}

export async function generatePowChallenge(): Promise<PowChallenge> {
  return queryEngine.execute<PowChallenge>("pow.generate");
}



export async function fetchGuild(
  guildId: string,
  pow: PowSolution
): Promise<GuildData | null> {
  try {
    const { powManager } = await import("@/lib/pow/manager");
    const isValidPow = powManager.validateAndConsume(pow);

    if (!isValidPow) {
      throw new Error("Invalid POW solution");
    }

    return apiClient.guilds.fetch(guildId);
  } catch (error) {
    console.error("Error fetching guild:", error);
    return null;
  }
}
