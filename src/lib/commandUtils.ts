import { Command } from "@/types/commands";

export function processParams(command: Command): Command {
  let params = command.params;
  if (!params || params.length === 0) {
    const usage = (command.usage || "").trim();
    const tokens = usage.match(/(<[^>]+>|\[[^\]]+\])/g) || [];
    params = tokens.map((tok) => {
      const required = tok.startsWith("<");
      const name = tok.slice(1, -1).trim().split("=")[0].trim();
      const lower = name.toLowerCase();
      let type = "string";

      if (/(amount|num|count|quantity|qty|page|limit|size)/i.test(lower)) {
        type = "integer";
      } else if (/(user|member|id|mention)/i.test(lower)) {
        type = "user";
      } else if (/(channel|role)/i.test(lower)) {
        type = "snowflake";
      }

      return { name, required, type } as any;
    });
  }

  if (!params || params.length === 0) return { ...command, params: [] };

  return {
    ...command,
    params: params.map((param) => {
      let type = param.type || "string";

      // partials, e.g.: Remove "partial" prefix from types like PartialAttachment, etc.
      if (type.startsWith("partial")) {
        type = type.substring(7).toLowerCase();
      } else {
        type = type.toLowerCase();
      }

      if (type.toLowerCase().startsWith("range[")) {
        const rangeMatch = type.match(
          /range\[(str|int),\s*(\d+),\s*(none|\d+)\]/i
        );
        if (rangeMatch) {
          const [_, dataType, min, max] = rangeMatch;
          const formattedMax = max.toLowerCase() === "none" ? "∞" : max;
          const friendlyType =
            dataType.toLowerCase() === "str"
              ? "string"
              : dataType.toLowerCase() === "int"
                ? "integer"
                : dataType.toLowerCase();
          type = `${friendlyType} (between ${min} and ${formattedMax})`;
        }
      }

      // <vesta.framework.tools.conversion.duration object at 0x7c59eee13800> -> duration
      if (type.includes("object at 0x")) {
        const className = type.split(" ")[0].split(".").pop() || "object";
        type = className.toLowerCase();
      }

      return { ...param, type };
    }),
  };
}

export function processCommands(commands: Command[]): Command[] {
  if (!commands.length) return [];

  const processedMap = new Map<string, Command>();
  const rootCommands: Command[] = [];
  const subcommandsByParent = new Map<string, Command[]>();

  for (const cmd of commands) {
    const key = cmd.qualified_name || cmd.name;
    if (processedMap.has(key)) continue;

    const processed = processParams(cmd);
    processedMap.set(key, processed);

    if (cmd.is_subcommand) {
      const parent = cmd.parent;
      if (parent) {
        if (!subcommandsByParent.has(parent)) {
          subcommandsByParent.set(parent, []);
        }
        subcommandsByParent.get(parent)!.push(processed);
      }
    } else {
      rootCommands.push(processed);
    }
  }

  for (const cmd of rootCommands) {
    if (cmd.is_group && subcommandsByParent.has(cmd.name)) {
      cmd.subcommands = subcommandsByParent.get(cmd.name) || [];
    }
  }

  return rootCommands;
}
