export interface TicketChannel {
  created_at: string;
  id: string;
  name: string;
  type: string;
}

export interface EmbedAuthor {
  name: string | null;
  icon_url: string | null;
  url: string | null;
}

export interface EmbedFooter {
  text: string | null;
  icon_url: string | null;
}

export interface EmbedImage {
  url: string | null;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface Embed {
  title: string | null;
  description: string | null;
  url: string | null;
  color: string;
  message_id: string;
  author: EmbedAuthor;
  footer: EmbedFooter;
  timestamp: string | null;
  thumbnail: EmbedImage;
  image: EmbedImage;
  fields: EmbedField[];
}

export interface Message {
  id: string;
  author_id: string;
  channel_id: string;
  content: string;
  created_at: string;
  edited_timestamp: string | null;
  pinned: boolean;
  timestamp: string;
}

export interface TicketData {
  channel_id: number;
  closed_at: string | null;
  closed_by_id: string | null;
  guild_id: number;
  opened_by_id: string | null;
  reason: string;
}

export interface User {
  accent_color: string | null;
  author_id: string;
  avatar: string;
  banner: string | null;
  bot: boolean;
  channel_id: string;
  content: string;
  created_at: string;
  discriminator: string;
  edited_timestamp: string | null;
  global_name: string | null;
  id: string;
  pinned: boolean;
  system: boolean;
  timestamp: string;
  username: string;
}

export interface Ticket {
  channel: TicketChannel;
  embeds: Embed[];
  mentions: string[];
  messages: Message[];
  reactions: any[];
  buttons: any[];
  ticket: TicketData;
  users: User[];
  attachments: any[];
}

export interface TicketResponse {
  ticket: Ticket;
  people: number[];
}
