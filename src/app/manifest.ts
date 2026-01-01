import type { MetadataRoute } from 'next'
import mascot from "@/assets/vain/mascot.webp"

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "vain",
    short_name: "vain",
    description: "The only all-in-one Discord bot for your server.",
    lang: "en-US",
    dir: "ltr",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "fullscreen", "minimal-ui"],
    orientation: "portrait-primary",
    background_color: "#443D4B",
    theme_color: "#443D4B",
    categories: ["utilities", "social", "productivity", "games"],
    shortcuts: [
      {
        name: "Invite Vain",
        short_name: "Invite",
        description: "Invite Vain to your server",
        url: "/invite",
        icons: [
          {
            src: mascot.src,
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          }
        ]
      },
      {
        name: "Support",
        short_name: "Support",
        description: "Get help in our Discord",
        url: "/support",
        icons: [
          {
            src: mascot.src,
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          }
        ]
      }
    ],
    icons: [
      {
        src: `${mascot.src}`,
        sizes: "1000x1000",
        type: "image/png",
        purpose: "any"
      }
    ],
    prefer_related_applications: false
  }
}