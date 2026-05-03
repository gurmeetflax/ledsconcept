// Fallback content used when Sanity is not yet configured.
// Once envs are set, real data from Sanity overrides these.

export const sampleSectors = [
  {
    _id: "s1",
    name: "Architectural",
    slug: "architectural",
    description: "Facade, interior and landscape lighting that turns buildings into icons.",
    image: "https://images.unsplash.com/photo-1545063328-c8e3faffa16f?w=1600&q=80",
  },
  {
    _id: "s2",
    name: "Events",
    slug: "events",
    description: "Concerts, weddings and brand activations powered by pixel-mapped LED.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80",
  },
  {
    _id: "s3",
    name: "Nightclubs",
    slug: "nightclubs",
    description: "Immersive club environments with Madrix-driven pixel control.",
    image: "https://images.unsplash.com/photo-1571266028243-d220bc1f4f70?w=1600&q=80",
  },
];

export const sampleProjects = [
  {
    _id: "p1",
    title: "The Pixel Atrium",
    slug: "pixel-atrium",
    year: 2025,
    location: "Mumbai, IN",
    sector: "Architectural",
    sectorSlug: "architectural",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1600&q=80",
  },
  {
    _id: "p2",
    title: "Sunburn Stage Wash",
    slug: "sunburn-stage",
    year: 2024,
    location: "Goa, IN",
    sector: "Events",
    sectorSlug: "events",
    image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=1600&q=80",
  },
  {
    _id: "p3",
    title: "Club Voltage",
    slug: "club-voltage",
    year: 2024,
    location: "Bengaluru, IN",
    sector: "Nightclubs",
    sectorSlug: "nightclubs",
    image: "https://images.unsplash.com/photo-1574391884720-bbc049ec09ad?w=1600&q=80",
  },
  {
    _id: "p4",
    title: "Skyline Facade",
    slug: "skyline-facade",
    year: 2024,
    location: "Delhi, IN",
    sector: "Architectural",
    sectorSlug: "architectural",
    image: "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?w=1600&q=80",
  },
  {
    _id: "p5",
    title: "Wedding of Lights",
    slug: "wedding-of-lights",
    year: 2023,
    location: "Udaipur, IN",
    sector: "Events",
    sectorSlug: "events",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
  },
  {
    _id: "p6",
    title: "Neon Speakeasy",
    slug: "neon-speakeasy",
    year: 2023,
    location: "Hyderabad, IN",
    sector: "Nightclubs",
    sectorSlug: "nightclubs",
    image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=1600&q=80",
  },
];

export const sampleProducts = [
  {
    _id: "pr1",
    title: "Pixel Tube 360",
    slug: "pixel-tube-360",
    category: "Pixel Tubes",
    categorySlug: "pixel-tubes",
    shortDesc: "1 m DMX-addressable RGB tube, 360° viewing.",
    image: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=1200&q=80",
  },
  {
    _id: "pr2",
    title: "Flex Strip Pro",
    slug: "flex-strip-pro",
    category: "Strips",
    categorySlug: "strips",
    shortDesc: "IP67 high-density flexible LED strip, 60 px/m.",
    image: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&q=80",
  },
  {
    _id: "pr3",
    title: "Madrix Ultimate License",
    slug: "madrix-ultimate",
    category: "Madrix",
    categorySlug: "madrix",
    shortDesc: "Top-tier pixel-mapping license for unlimited pixels.",
    image: "https://images.unsplash.com/photo-1535303311164-664fc9ec6532?w=1200&q=80",
  },
  {
    _id: "pr4",
    title: "DMX Node 4U",
    slug: "dmx-node-4u",
    category: "Controllers",
    categorySlug: "controllers",
    shortDesc: "4-universe Art-Net / sACN to DMX node, OLED display.",
    image: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=1200&q=80",
  },
];

export const sampleProductCategories = [
  { _id: "c1", name: "Pixel Tubes", slug: "pixel-tubes" },
  { _id: "c2", name: "Strips", slug: "strips" },
  { _id: "c3", name: "Controllers", slug: "controllers" },
  { _id: "c4", name: "Madrix", slug: "madrix" },
  { _id: "c5", name: "Accessories", slug: "accessories" },
];

export const sampleSiteSettings = {
  tagline: "The world of pixels is limitless",
  address: "Mumbai, India",
  phone: "+91 00000 00000",
  whatsapp: "+91 00000 00000",
  whatsappMessage: "Hi! I'd like to discuss a lighting project.",
  email: "hello@ledsconcept.com",
  instagram: "https://instagram.com/ledsconcept",
  youtube: "https://youtube.com/@ledsconcept",
  facebook: "https://facebook.com/ledsconcept",
  twitter: "https://twitter.com/ledsconcept",
  instagramWidgetId: "",
  beholdFeedId: "awDA3WLI489BQxzHqzAX",
  youtubeHeroId: "ScMzIvxBSi4",
  heroVideo: "",
  brochure: "",
};

export type Sector = (typeof sampleSectors)[number];
export type Project = (typeof sampleProjects)[number];
export type Product = (typeof sampleProducts)[number];
export type SiteSettings = typeof sampleSiteSettings;
