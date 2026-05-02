import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./sanity/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        paper: "#fafafa",
        neon: { magenta: "#ff2bd6", cyan: "#22e2ff", lime: "#c4ff3d" },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "neon-grad": "linear-gradient(90deg, #ff2bd6 0%, #22e2ff 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
