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
        background: "var(--background)",
        foreground: "var(--foreground)",
        dgm: {
          black: '#0A0A0A',
          gold: '#FDB813',
          gray: {
            dark: '#1A1A1A',
            DEFAULT: '#2A2A2A',
            light: '#3A3A3A',
          }
        }
      },
    },
  },
  plugins: [],
};
export default config;
