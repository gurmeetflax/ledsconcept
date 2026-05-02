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
    { name: "youtubeHeroId", title: "Hero YouTube video ID", type: "string" },
    { name: "brochure", title: "E-brochure (PDF)", type: "file" },
  ],
});
