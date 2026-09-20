// Data for the India "footprint" map on the Projects page.
// Cities are derived from Sanity project locations, merged with additional
// coverage cities where work has been done but no project doc exists yet.

export type FootprintProject = { title: string; year?: number };
export type FootprintCity = {
  city: string;
  lon: number;
  lat: number;
  projects: FootprintProject[];
  dx: number;
  dy: number;
  anchor: "start" | "end" | "middle";
};

// Longitude / latitude for Indian cities we reference. Add more as needed.
const CITY_COORDS: Record<string, [number, number]> = {
  delhi: [77.21, 28.61],
  "new delhi": [77.21, 28.61],
  mumbai: [72.88, 19.08],
  goa: [73.9, 15.35],
  panaji: [73.83, 15.49],
  hyderabad: [78.47, 17.38],
  gorakhpur: [83.37, 26.76],
  lucknow: [80.95, 26.85],
  kanpur: [80.35, 26.45],
  bhopal: [77.41, 23.26],
  indore: [75.86, 22.72],
  bangalore: [77.59, 12.97],
  bengaluru: [77.59, 12.97],
  chennai: [80.27, 13.08],
  pune: [73.86, 18.52],
  jaipur: [75.79, 26.91],
  ahmedabad: [72.57, 23.02],
  kolkata: [88.36, 22.57],
  chandigarh: [76.78, 30.73],
  nagpur: [79.09, 21.15],
  surat: [72.83, 21.17],
  udaipur: [73.71, 24.58],
  kochi: [76.27, 9.93],
  patna: [85.14, 25.59],
};

// Label offset [dx, dy] and text-anchor, tuned so labels don't collide.
const LABEL_HINTS: Record<string, [number, number, FootprintCity["anchor"]]> = {
  delhi: [-11, -6, "end"],
  lucknow: [7, -13, "start"],
  kanpur: [-9, 15, "end"],
  gorakhpur: [12, 2, "start"],
  indore: [-12, 12, "end"],
  bhopal: [12, -4, "start"],
  mumbai: [-12, 0, "end"],
  hyderabad: [12, 2, "start"],
  goa: [-12, 2, "end"],
  bangalore: [-12, 6, "end"],
  bengaluru: [-12, 6, "end"],
  chennai: [12, 6, "start"],
};

// Cities where installations have been done but no project doc exists yet.
// These always appear on the map; they gain project names automatically once
// matching projects are added in Sanity.
export const COVERAGE_CITIES = [
  "Lucknow",
  "Kanpur",
  "Bhopal",
  "Indore",
  "Bangalore",
  "Chennai",
];

// Collapse spelling variants to one canonical key so the same place never
// produces two overlapping pins.
const ALIASES: Record<string, string> = {
  bengaluru: "bangalore",
  "new delhi": "delhi",
  panaji: "goa",
  bombay: "mumbai",
  madras: "chennai",
};

// Take the city part (before any ", State/IN"), lowercase, resolve aliases.
const norm = (s: string) => {
  const base = s.split(",")[0].trim().toLowerCase();
  return ALIASES[base] ?? base;
};
const title = (s: string) => s.replace(/\b\w/g, (m) => m.toUpperCase());

/** Build the merged, positioned city list from projects + coverage cities. */
export function buildFootprintCities(
  projects: { title?: string; location?: string; year?: number }[],
): FootprintCity[] {
  const byCity = new Map<string, FootprintCity>();

  const ensure = (rawName: string): FootprintCity | null => {
    const key = norm(rawName);
    const coords = CITY_COORDS[key];
    if (!coords) return null; // unknown city — skip rather than mis-place it
    if (!byCity.has(key)) {
      const [lon, lat] = coords;
      const [dx, dy, anchor] = LABEL_HINTS[key] ?? [12, 2, "start"];
      byCity.set(key, { city: title(key), lon, lat, projects: [], dx, dy, anchor });
    }
    return byCity.get(key)!;
  };

  for (const p of projects) {
    if (!p.location || !p.title) continue;
    const c = ensure(p.location);
    if (c) c.projects.push({ title: p.title, year: p.year });
  }
  for (const name of COVERAGE_CITIES) ensure(name);

  // newest project first within a city
  for (const c of byCity.values()) {
    c.projects.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }
  return [...byCity.values()];
}

// Stylised India outline (lon, lat), clockwise. Recognisable, not survey-grade.
export const INDIA_OUTLINE: [number, number][] = [
  [68.2, 23.9], [68.9, 22.4], [69.6, 22.7], [70.0, 20.9], [71.5, 20.9], [72.2, 21.7], [72.7, 20.5],
  [72.9, 18.5], [73.5, 16.0], [74.2, 14.5], [75.2, 12.0], [76.3, 9.5], [77.2, 8.2], [78.2, 8.8],
  [79.5, 10.3], [80.0, 12.0], [80.3, 13.5], [80.2, 16.0], [82.3, 16.8], [83.5, 18.0], [85.0, 19.6],
  [86.8, 21.0], [88.1, 21.6], [89.1, 22.0], [91.9, 23.6], [92.6, 24.9], [94.2, 27.0], [95.9, 28.1],
  [96.6, 28.4], [94.5, 27.6], [92.5, 27.5], [90.5, 27.3], [88.9, 27.1], [88.1, 26.4], [87.0, 26.4],
  [85.8, 27.0], [84.0, 28.6], [82.7, 29.6], [81.0, 30.3], [80.1, 30.3], [79.5, 32.4], [78.9, 34.3],
  [77.0, 35.5], [74.2, 34.6], [74.5, 32.6], [74.0, 30.2], [72.4, 28.9], [70.9, 27.9], [71.1, 24.7],
  [70.2, 24.3], [68.9, 24.3],
];
