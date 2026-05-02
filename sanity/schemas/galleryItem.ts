import { defineType } from "sanity";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery item",
  type: "document",
  fields: [
    { name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (r) => r.required() },
    { name: "caption", title: "Caption", type: "string" },
    { name: "project", title: "Related project", type: "reference", to: [{ type: "project" }] },
  ],
  preview: { select: { title: "caption", media: "image" } },
});
