import { defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "address", title: "Address", type: "text", rows: 2 },
    { name: "phone", title: "Phone", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "instagram", title: "Instagram URL", type: "url" },
    { name: "youtube", title: "YouTube URL", type: "url" },
    { name: "facebook", title: "Facebook URL", type: "url" },
    { name: "twitter", title: "Twitter / X URL", type: "url" },
    { name: "instagramWidgetId", title: "Elfsight Instagram widget ID", type: "string" },
    { name: "beholdFeedId", title: "Behold Instagram feed ID", type: "string", description: "Feed ID from behold.so widget embed code (the feed-id attribute)." },
    { name: "youtubeHeroId", title: "Hero YouTube video ID", type: "string" },
    {
      name: "heroVideo",
      title: "Hero video (MP4)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description: "Self-hosted background video. Takes priority over YouTube ID and avoids YouTube's play button.",
    },
    { name: "brochure", title: "E-brochure (PDF)", type: "file" },
  ],
});
