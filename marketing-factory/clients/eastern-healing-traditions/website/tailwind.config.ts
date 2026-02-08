import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a6b5a",
          dark: "#145649",
          light: "#1f7d6a",
        },
        secondary: {
          DEFAULT: "#2d3436",
          light: "#636e72",
        },
        accent: {
          DEFAULT: "#c9a96e",
          dark: "#b8944f",
          light: "#d4ba85",
        },
        background: "#f8f9fa",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      lineHeight: {
        relaxed: "1.6",
      },
    },
  },
  plugins: [],
};

export default config;
