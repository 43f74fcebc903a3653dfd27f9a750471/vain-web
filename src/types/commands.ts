export interface PermissionInfo {
  name: string;
  value: boolean;
}

export type CommandType = "text" | "hybrid" | "slash" | "group";

export interface CommandParam {
  name: string;
  required: boolean;
  type: string;
  description?: string;
}

export interface Command {
  name: string;
  qualified_name: string;
  aliases: string[];
  description: string;
  help?: string;
  usage: string;
  example: string;
  type: CommandType;
  cog: string | null;
  permissions: PermissionInfo[];
  cooldown: Record<string, number | string> | null;
  hidden: boolean;
  enabled: boolean;
  parent: string | null;
  subcommands: Command[];
  params?: CommandParam[];
  is_subcommand?: boolean;
  is_group?: boolean;
}

export interface CommandsResponse {
  commands: Command[];
  total: number;
  cogs: string[];
}
