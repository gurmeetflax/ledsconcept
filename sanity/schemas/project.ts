import { defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() },
    { name: "featured", title: "Featured on home", type: "boolean", initialValue: false },
    { name: "sector", title: "Sector", type: "reference", to: [{ type: "sector" }] },
    { name: "client", title: "Client", type: "string" },
    { name: "year", title: "Year", type: "number" },
    { name: "location", title: "Location", type: "string" },
    { name: "summary", title: "Summary", type: "text", rows: 3 },
    {
      name: "body",
      title: "Case study",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Section (H2)", value: "h2" },
            { title: "Subsection (H3)", value: "h3" },
          ],
        },
      ],
    },
    { name: "heroImage", title: "Hero image", type: "image", options: { hotspot: true } },
    {
      name: "headerVideo",
      title: "Header video (MP4, muted loop)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description: "Small self-hosted clip (~5–10 MB, no audio) that plays as the page header background. Hero image is still required as the poster/thumbnail across the site.",
    },
    { name: "gallery", title: "Gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] },
    { name: "video", title: "YouTube video ID", type: "string", description: "Just the ID (e.g. ScMzIvxBSi4)" },
    { name: "gearUsed", title: "Gear used", type: "array", of: [{ type: "string" }] },
  ],
  preview: { select: { title: "title", subtitle: "location", media: "heroImage" } },
});
