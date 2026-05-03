import { createClient, type QueryParams } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-10-01";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

const builder = imageUrlBuilder({ projectId, dataset });
export function urlFor(source: unknown) {
  return builder.image(source as never);
}

export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return [] as unknown as T;
  }
  return sanityClient.fetch<T>(query, params, { next: { revalidate: 60 } });
}

export const queries = {
  featuredProjects: `*[_type == "project" && featured == true]|order(year desc)[0...6]{
    _id, title, "slug": slug.current, year, location, "sector": sector->name,
    "image": heroImage.asset->url
  }`,
  allProjects: `*[_type == "project"]|order(year desc){
    _id, title, "slug": slug.current, year, location,
    "sector": sector->name, "sectorSlug": sector->slug.current,
    "image": heroImage.asset->url
  }`,
  projectBySlug: `*[_type == "project" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, year, location, summary, body, zones, video, gearUsed,
    "sector": sector->name, "image": heroImage.asset->url,
    "headerVideo": headerVideo.asset->url,
    "gallery": gallery[].asset->url
  }`,
  sectors: `*[_type == "sector"]|order(name asc){ _id, name, "slug": slug.current, description, "image": image.asset->url }`,
  products: `*[_type == "product"]|order(title asc){
    _id, title, "slug": slug.current, shortDesc, "image": images[0].asset->url,
    "category": category->name, "categorySlug": category->slug.current
  }`,
  productCategories: `*[_type == "category"]|order(name asc){ _id, name, "slug": slug.current }`,
  productBySlug: `*[_type == "product" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, shortDesc, body, specs,
    "images": images[].asset->url, "datasheet": datasheet.asset->url,
    "category": category->name
  }`,
  gallery: `*[_type == "galleryItem"]|order(_createdAt desc){ _id, "image": image.asset->url, caption }`,
  siteSettings: `*[_type == "siteSettings"][0]{
    tagline, address, phone, email,
    instagram, youtube, facebook, twitter,
    instagramWidgetId, beholdFeedId, youtubeHeroId,
    "heroVideo": heroVideo.asset->url,
    "brochure": brochure.asset->url
  }`,
};
