import { defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (r) => r.required() },
    { name: "category", title: "Category", type: "reference", to: [{ type: "category" }] },
    { name: "shortDesc", title: "Short description", type: "text", rows: 2 },
    {
      name: "metaDescription",
      title: "SEO meta description (optional)",
      type: "text",
      rows: 2,
      description: "Overrides the short description for search/social snippets. Leave blank to use the short description.",
      validation: (r) => r.max(200),
    },
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }] },
    { name: "images", title: "Images", type: "array", of: [{ type: "image", options: { hotspot: true } }] },
    {
      name: "specs",
      title: "Specifications",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Key", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
        },
      ],
    },
    { name: "datasheet", title: "Datasheet (PDF)", type: "file" },
  ],
  preview: { select: { title: "title", subtitle: "shortDesc", media: "images.0" } },
});
