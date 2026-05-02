import { defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Product category",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (r) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 64 } },
  ],
});
