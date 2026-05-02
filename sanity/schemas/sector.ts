import { defineType } from "sanity";

export const sector = defineType({
  name: "sector",
  title: "Sector",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (r) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 64 } },
    { name: "description", title: "Description", type: "text", rows: 2 },
    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
  ],
});
