"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { fetchTicket, UserData, findUser } from "@/lib/actions";
import { Ticket, Embed } from "@/types/tickets";
import { format, formatDistance } from "date-fns";
import {
  HiOutlineExclamation,
  HiOutlineDocumentText,
  HiOutlineChat,
  HiOutlineTicket,
  HiOutlineUserCircle,
  HiOutlineCalendar,
} from "react-icons/hi";
import { FiExternalLink } from "react-icons/fi";

export default function TicketPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [ticketData, setTicketData] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMap, setUserMap] = useState<Record<string, UserData>>({});

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchTicket(ticketId);
        if (!ignore && data?.ticket) setTicketData(data.ticket);
      } catch {
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [ticketId]);

  useEffect(() => {
    if (!ticketData) return;
    let ignore = false;
    const ids = new Set([
      ...ticketData.users.map((u) => u.id),
      ...ticketData.messages.map((m) => m.author_id),
      ...(ticketData.ticket.opened_by_id
        ? [ticketData.ticket.opened_by_id]
        : []),
      ...(ticketData.ticket.closed_by_id
        ? [ticketData.ticket.closed_by_id]
        : []),
    ]);
    (async () => {
      const userArr = await Promise.all(
        Array.from(ids).map((id) => findUser(id))
      );
      const userMapping: Record<string, UserData> = {};
      Array.from(ids).forEach((id, i) => {
        const user = userArr[i];
        userMapping[id] = user ||
          ticketData.users.find((u) => u.id === id) || {
            id,
            username: "Unknown User",
            discriminator: "0000",
            avatar: "",
            bot: false,
            system: false,
          };
      });
      if (!ignore) setUserMap(userMapping);
    })();
    return () => {
      ignore = true;
    };
  }, [ticketData]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy, HH:mm");
    } catch {
      return "Unknown date";
    }
  };

  const formatRelativeDate = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), {
        addSuffix: true,
      });
    } catch {
      return "Unknown date";
    }
  };

  const getUserAvatar = (userId: string) => {
    const user = userMap[userId];
    return user?.avatar || "https://cdn.discordapp.com/embed/avatars/0.png";
  };

  const getUserName = (userId: string) =>
    userMap[userId]?.username || "Unknown User";

  const parseEmojis = (content: string) => {
    const emojiRegex = /<(a?):([^:]+):(\d+)>/g;
    return content.replace(emojiRegex, (match, animated, name, id) => {
      const ext = animated ? "gif" : "png";
      return `<img src="https://cdn.discordapp.com/emojis/${id}.${ext}" alt=":${name}:" class="inline object-contain mx-0.5" style="height: 1.375em; width: 1.375em; vertical-align: -0.25em;">`;
    });
  };

  const parseMentions = (content: string) => {
    const mentionRegex = /<@!?(\d+)>/g;
    const channelRegex = /<#(\d+)>/g;
    const roleRegex = /<@&(\d+)>/g;

    return content
      .replace(mentionRegex, (match, userId) => {
        return `<span class="text-vain-primary font-medium bg-vain-primary/10 px-1 py-0.5 rounded">@${getUserName(userId)}</span>`;
      })
      .replace(channelRegex, (match, channelId) => {
        const channelName = ticketData?.channel?.name || "unknown";
        return `<span class="text-vain-primary font-medium bg-vain-primary/10 px-1 py-0.5 rounded">#${channelName}</span>`;
      })
      .replace(roleRegex, () => {
        return `<span class="text-vain-primary font-medium bg-vain-primary/10 px-1 py-0.5 rounded">@role</span>`;
      });
  };

  const parseDiscordFormatting = (content: string) => {
    const escapeHtml = (text: string) =>
      text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    content = content.replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (match, lang, code) => {
        const language = lang || "text";
        const cleanCode = code.trim();
        return `<div class="my-1 rounded bg-vain-200/80 border border-white/10 overflow-hidden discord-code-block">${lang ? `<div class="px-2 py-1 bg-vain-100/50 text-xs text-white/60 border-b border-white/10 font-mono">${escapeHtml(language)}</div>` : ""}<pre class="p-2 text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"><code class="font-mono text-white/90 whitespace-pre">${escapeHtml(cleanCode)}</code></pre></div>`;
      }
    );

    content = content.replace(/`([^`\n]+?)`/g, (match, code) => {
      return `<code class="bg-vain-200/80 text-white/90 px-1 py-0.5 rounded text-sm font-mono border border-white/10">${escapeHtml(code)}</code>`;
    });

    content = content.replace(/\|\|([^|\n]+?)\|\|/g, (match, text) => {
      return `<span class="bg-vain-100 text-vain-100 hover:text-white/90 cursor-pointer transition-colors duration-200 px-1 rounded select-none discord-spoiler" title="Click to reveal spoiler" onclick="this.classList.toggle('text-vain-100'); this.classList.toggle('text-white/90')">${text}</span>`;
    });

    content = content.replace(
      /\*\*([^*\n]+?)\*\*/g,
      '<strong class="font-bold">$1</strong>'
    );
    content = content.replace(
      /__([^_\n]+?)__/g,
      '<strong class="font-bold">$1</strong>'
    );
    content = content.replace(
      /(?<!\*)\*([^*\n]+?)\*(?!\*)/g,
      '<em class="italic">$1</em>'
    );
    content = content.replace(
      /(?<!_)_([^_\n]+?)_(?!_)/g,
      '<em class="italic">$1</em>'
    );
    content = content.replace(
      /~~([^~\n]+?)~~/g,
      '<del class="line-through opacity-75">$1</del>'
    );

    content = content.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, text, url) => {
        try {
          const validUrl = new URL(url);
          if (validUrl.protocol === "http:" || validUrl.protocol === "https:") {
            return `<a href="${validUrl.href}" target="_blank" rel="noopener noreferrer" class="text-vain-primary hover:underline inline-flex items-center">${text}<svg class="ml-1 w-3 h-3 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>`;
          }
        } catch {}
        return text;
      }
    );

    content = content.replace(
      /<t:(\d+):?([tTdDfFR])?>/g,
      (match, timestamp, format) => {
        try {
          const date = new Date(parseInt(timestamp) * 1000);
          let formatted = date.toLocaleString();

          switch (format) {
            case "t":
              formatted = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              break;
            case "T":
              formatted = date.toLocaleTimeString();
              break;
            case "d":
              formatted = date.toLocaleDateString();
              break;
            case "D":
              formatted = date.toLocaleDateString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              break;
            case "f":
              formatted = date.toLocaleString([], {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              break;
            case "F":
              formatted = date.toLocaleString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              break;
            case "R":
              formatted = formatRelativeDate(date.toISOString());
              break;
          }

          return `<time class="bg-vain-200/60 px-1 py-0.5 rounded text-sm cursor-help" title="${date.toLocaleString()}">${formatted}</time>`;
        } catch {
          return match;
        }
      }
    );

    content = content.replace(/\n/g, "<br>");
    return content;
  };

  const parseContent = (content: string) => {
    let parsed = parseEmojis(content);
    parsed = parseMentions(parsed);
    parsed = parseDiscordFormatting(parsed);
    return <span dangerouslySetInnerHTML={{ __html: parsed }} />;
  };

  const sortedMessages = useMemo(() => {
    if (!ticketData) return [];
    return [...ticketData.messages].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [ticketData]);

  const renderEmbed = (embed: Embed) => {
    const hasAuthor = embed.author.name !== null;
    const hasTitle = embed.title !== null;
    const hasDescription = embed.description !== null;
    const hasFields = embed.fields.length > 0;
    const hasFooter = embed.footer.text !== null;
    const hasImage = embed.image.url !== null && embed.image.url !== "";
    const hasThumbnail =
      embed.thumbnail.url !== null && embed.thumbnail.url !== "";

    return (
      <div className="mt-1 border-l-4 border-l-vain-primary/50 bg-vain-300/50 rounded-r-md">
        <div className="p-2">
          {" "}
          {hasAuthor && (
            <div className="flex items-center mb-1">
              {embed.author.icon_url &&
                embed.author.icon_url !== "" &&
                embed.author.icon_url !== "None" && (
                  <img
                    src={embed.author.icon_url}
                    alt="Author"
                    className="w-4 h-4 mr-2 rounded-full object-cover"
                  />
                )}
              <span className="text-sm font-medium text-white/90">
                {embed.author.name ? parseContent(embed.author.name) : ""}
              </span>
            </div>
          )}
          {hasTitle && (
            <div className="mb-1">
              <h3 className="font-semibold text-white">
                {embed.url ? (
                  <a
                    href={embed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center"
                  >
                    {embed.title ? parseContent(embed.title) : ""}
                    <FiExternalLink className="ml-1 w-3 h-3 opacity-70" />
                  </a>
                ) : embed.title ? (
                  parseContent(embed.title)
                ) : (
                  ""
                )}
              </h3>
            </div>
          )}
          {hasDescription && (
            <div className="text-white/80 text-sm leading-relaxed">
              {embed.description ? parseContent(embed.description) : ""}
            </div>
          )}
          {hasFields && (
            <div className="grid gap-1 mb-1">
              {embed.fields.map((field, idx) => (
                <div
                  key={`field-${idx}`}
                  className="bg-vain-200/30 p-1.5 rounded"
                >
                  <h4 className="text-xs font-semibold text-white/90 mb-0.5">
                    {parseContent(field.name)}
                  </h4>
                  <p className="text-xs text-white/70">
                    {parseContent(field.value)}
                  </p>
                </div>
              ))}
            </div>
          )}
          {hasImage && embed.image.url && embed.image.url !== "None" && (
            <div className="mb-1 rounded overflow-hidden">
              <img
                src={embed.image.url}
                alt="Embed image"
                className="object-cover w-full max-h-80 rounded"
              />
            </div>
          )}
          {hasThumbnail &&
            embed.thumbnail.url &&
            embed.thumbnail.url !== "None" && (
              <div className="mb-1 rounded overflow-hidden">
                <img
                  src={embed.thumbnail.url}
                  alt="Thumbnail"
                  className="object-cover w-16 h-16 rounded"
                />
              </div>
            )}
          {hasFooter && (
            <div className="pt-1 border-t border-white/10 flex items-center">
              {embed.footer.icon_url &&
                embed.footer.icon_url !== "" &&
                embed.footer.icon_url !== "None" && (
                  <img
                    src={embed.footer.icon_url}
                    alt="Footer"
                    className="w-4 h-4 mr-2 rounded-full object-cover"
                  />
                )}
              <span className="text-xs text-white/50">
                {embed.footer.text ? parseContent(embed.footer.text) : ""}
                {embed.timestamp && ` • ${formatDate(embed.timestamp)}`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="relative pt-24 -mx-[calc((100vw-100%)/2)] bg-[#0A0B0B] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-vain-300 animate-pulse mb-4"></div>
              <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="relative pt-24 -mx-[calc((100vw-100%)/2)] bg-[#0A0B0B] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-vain-300 flex items-center justify-center mb-4">
                <HiOutlineExclamation className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Ticket not found</h2>
              <p className="text-white/60 max-w-sm">
                The ticket you are looking for does not exist or has been
                deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-24 -mx-[calc((100vw-100%)/2)] bg-[#0A0B0B] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row gap-5 mb-8 py-4 border-b border-white/10 items-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-vain-300 flex items-center justify-center flex-shrink-0 border border-white/10">
            <HiOutlineTicket className="h-6 w-6 sm:h-7 sm:w-7 text-vain-primary" />
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-xl sm:text-2xl font-bold">
                {ticketData.channel.name}
              </h1>
              {ticketData.ticket.closed_by_id && (
                <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20">
                  Closed
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-white/40 text-xs">ID: {ticketId}</span>
              <span className="text-white/40 text-xs">•</span>
              <span className="text-white/40 text-xs">
                {formatRelativeDate(ticketData.channel.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 pb-16">
          <div className="w-full lg:w-2/3">
            <div className="bg-vain-300 border border-white/5 rounded-md overflow-hidden">
              <div className="border-b border-white/10 px-4 py-3 flex justify-between items-center bg-vain-200/50">
                <h2 className="text-lg font-semibold flex items-center">
                  <HiOutlineChat className="mr-2 h-5 w-5 text-vain-primary" />
                  Messages
                </h2>
                <span className="text-xs text-white/50">
                  {ticketData.messages.length} messages
                </span>
              </div>
              <div className="h-[500px] sm:h-[600px] overflow-y-auto bg-[#0c0d0d]">
                {sortedMessages
                  .filter(
                    (message) =>
                      message.content.trim() ||
                      ticketData.embeds.some((e) => e.message_id === message.id)
                  )
                  .map((message, index, filteredMessages) => {
                    const prevMessage =
                      index > 0 ? filteredMessages[index - 1] : null;
                    const isSameAuthor =
                      prevMessage?.author_id === message.author_id;
                    const timeDiff = prevMessage
                      ? (new Date(message.timestamp).getTime() -
                          new Date(prevMessage.timestamp).getTime()) /
                        (1000 * 60)
                      : 0;
                    const isGrouped = isSameAuthor && timeDiff < 5;
                    const isFirstMessage =
                      index === 0 ||
                      !isSameAuthor ||
                      (prevMessage &&
                        (new Date(message.timestamp).getTime() -
                          new Date(prevMessage.timestamp).getTime()) /
                          (1000 * 60) >=
                          5);

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 px-4 hover:bg-white/[0.02] group ${isGrouped ? "py-0" : "py-2"}${isFirstMessage && index !== 0 ? " mt-1" : ""}`}
                      >
                        {isGrouped ? (
                          <div className="w-8 h-5 flex-shrink-0 flex items-center justify-center">
                            <span className="text-xs text-white/20 opacity-0 group-hover:opacity-100">
                              {formatDate(message.timestamp).split(" • ")[1]}
                            </span>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={getUserAvatar(message.author_id)}
                              alt={getUserName(message.author_id)}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://cdn.discordapp.com/embed/avatars/0.png";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          {!isGrouped && (
                            <div className="flex gap-2 items-baseline flex-wrap mb-0.5">
                              <span className="font-medium text-sm">
                                {getUserName(message.author_id)}
                              </span>
                              {userMap[message.author_id]?.bot && (
                                <span className="inline-flex items-center bg-vain-primary/50 rounded px-1 h-4 text-white text-[0.625rem] font-semibold uppercase relative">
                                  <svg
                                    className="w-3 h-3 mr-1"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M19.06 6.94a1.5 1.5 0 0 1 0 2.12l-8 8a1.5 1.5 0 0 1-2.12 0l-4-4a1.5 1.5 0 0 1 2.12-2.12L10 13.88l6.94-6.94a1.5 1.5 0 0 1 2.12 0Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  APP
                                </span>
                              )}
                              <span className="text-xs text-white/40">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                          )}
                          <div className="text-sm leading-relaxed break-words">
                            {parseContent(message.content)}
                          </div>
                          {ticketData.embeds
                            .filter((e) => e.message_id === message.id)
                            .map((embed, index) => (
                              <div key={`embed-${message.id}-${index}`}>
                                {renderEmbed(embed)}
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-vain-300 border border-white/5 rounded-md overflow-hidden">
              <div className="border-b border-white/10 px-4 py-3 bg-vain-200/50">
                <h2 className="text-lg font-semibold flex items-center">
                  <HiOutlineDocumentText className="mr-2 h-5 w-5 text-vain-primary" />
                  Details
                </h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/60">
                    <HiOutlineCalendar className="w-4 h-4" />
                    <span className="text-sm">Created</span>
                  </div>
                  <span className="text-sm text-white/90">
                    {formatDate(ticketData.channel.created_at)}
                  </span>
                </div>

                {ticketData.ticket.closed_at && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white/60">
                      <HiOutlineCalendar className="w-4 h-4" />
                      <span className="text-sm">Closed</span>
                    </div>
                    <span className="text-sm text-white/90">
                      {formatDate(ticketData.ticket.closed_at)}
                    </span>
                  </div>
                )}

                {ticketData.ticket.opened_by_id && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Created by</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={getUserAvatar(ticketData.ticket.opened_by_id)}
                        alt=""
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://cdn.discordapp.com/embed/avatars/0.png";
                        }}
                      />
                      <span className="text-sm text-white/90">
                        {getUserName(ticketData.ticket.opened_by_id)}
                      </span>
                    </div>
                  </div>
                )}

                {ticketData.ticket.closed_by_id && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Closed by</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={getUserAvatar(ticketData.ticket.closed_by_id)}
                        alt=""
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://cdn.discordapp.com/embed/avatars/0.png";
                        }}
                      />
                      <span className="text-sm text-white/90">
                        {getUserName(ticketData.ticket.closed_by_id)}
                      </span>
                    </div>
                  </div>
                )}

                {ticketData.ticket.reason && (
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-white/60 text-sm block mb-2">
                      Reason
                    </span>
                    <div className="bg-vain-200 p-3 rounded text-sm text-white/80">
                      {parseContent(ticketData.ticket.reason)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-vain-300 border border-white/5 rounded-md overflow-hidden">
              <div className="border-b border-white/10 px-4 py-3 bg-vain-200/50">
                <h2 className="text-lg font-semibold flex items-center">
                  <HiOutlineUserCircle className="mr-2 h-5 w-5 text-vain-primary" />
                  Participants
                  <span className="ml-2 text-xs text-white/50">
                    ({Object.keys(userMap).length})
                  </span>
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {Object.keys(userMap).map((userId) => (
                  <div key={userId} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={getUserAvatar(userId)}
                        alt={getUserName(userId)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://cdn.discordapp.com/embed/avatars/0.png";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className="text-sm text-white/90 truncate">
                        {getUserName(userId)}
                      </span>
                      {userMap[userId]?.bot && (
                        <span className="inline-flex items-center bg-vain-primary/50 rounded px-1 h-4 text-white text-[0.625rem] font-semibold uppercase relative">
                          <svg
                            className="w-3 h-3 mr-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M19.06 6.94a1.5 1.5 0 0 1 0 2.12l-8 8a1.5 1.5 0 0 1-2.12 0l-4-4a1.5 1.5 0 0 1 2.12-2.12L10 13.88l6.94-6.94a1.5 1.5 0 0 1 2.12 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          APP
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
