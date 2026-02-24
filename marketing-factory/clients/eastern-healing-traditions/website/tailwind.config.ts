import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
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
        cream: "#FFFCF7",
        warm: {
          50: "#FAF8F5",
          100: "#F5F0EB",
          200: "#EBE3DA",
          300: "#DDD2C4",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.12em",
      },
      maxWidth: {
        content: "1140px",
      },
    },
  },
  plugins: [],
};

export default config;
