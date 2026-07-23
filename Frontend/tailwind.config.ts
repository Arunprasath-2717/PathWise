import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary-lavender)",
        },
        accent: {
          mint: "var(--accent-mint)",
          peach: "var(--accent-peach)",
          sky: "var(--accent-sky)",
          blush: "var(--accent-blush)",
        }
      }
    },
  },
  plugins: [],
};
export default config;
