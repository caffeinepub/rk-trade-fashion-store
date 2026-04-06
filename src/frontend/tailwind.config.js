/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        chart: {
          1: "oklch(var(--chart-1) / <alpha-value>)",
          2: "oklch(var(--chart-2) / <alpha-value>)",
          3: "oklch(var(--chart-3) / <alpha-value>)",
          4: "oklch(var(--chart-4) / <alpha-value>)",
          5: "oklch(var(--chart-5) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "#B79A5A",
          dark: "#9A7F45",
          light: "#D4B87A",
        },
        charcoal: {
          DEFAULT: "#2B2B2B",
          light: "#3A3A3A",
        },
        nearblack: "#1A1A1A",
        offwhite: "#F3F2EE",
      },
      fontFamily: {
        serif: ["Playfair Display", "PlayfairDisplay", "Georgia", "serif"],
        sans: ["Inter", "GeneralSans", "system-ui", "sans-serif"],
        display: ["Playfair Display", "PlayfairDisplay", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(0,0,0,0.07)",
        header: "0 1px 0 0 rgba(0,0,0,0.08)",
        drawer: "-4px 0 32px 0 rgba(0,0,0,0.12)",
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.3em",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
