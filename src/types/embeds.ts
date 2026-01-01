export type EmbedField = {
  name: string;
  value: string;
  inline: boolean;
};

export type EmbedButton = {
  style: "link" | "primary" | "secondary" | "success" | "danger";
  label: string;
  url: string;
  emoji: string;
  disabled: boolean;
};

export type EmbedData = {
  title: string;
  description: string;
  color: string;
  url: string;
  thumbnail: string;
  image: string;
  timestamp: boolean;
  footer: {
    text: string;
    icon_url: string;
  };
  author: {
    name: string;
    url: string;
    icon_url: string;
  };
  fields: EmbedField[];
  buttons: EmbedButton[];
};

export const defaultVariables = {
  user: "vain#6621",
  "user.name": "vain",
  "user.mention": "@vain",
  "user.id": "1203514684326805524",
  "user.tag": "6621",
  "user.avatar": "https://r2.vain.bot/vain-marketing.png",
  "user.display_name": "vain",
  "guild.name": "vain",
  "guild.id": "892675627373699072",
  "guild.count": "1,234",
  "guild.icon": "https://r2.vain.bot/vain-marketing.png",
  "guild.boost_count": "14",
  "channel.name": "chat",
  "channel.id": "1356835408318566471",
  "channel.topic": "A general chat channel",
  "channel.position": "1",
};

export const initialEmbed: EmbedData = {
  title: "vain",
  description: "you can edit this description!",
  color: "#CCCCFF",
  url: "",
  thumbnail: "",
  image: "",
  timestamp: false,
  footer: {
    text: "",
    icon_url: "",
  },
  author: {
    name: "",
    url: "",
    icon_url: "",
  },
  fields: [],
  buttons: [],
};
