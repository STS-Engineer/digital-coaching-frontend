// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Palette inspirée du logo AVO Carbon
        primary: {
          DEFAULT: "#0b6fb7",
          50: "#e7f2fb",
          100: "#cfe4f6",
          500: "#0b6fb7",
          600: "#095f9c",
          700: "#074574",
        },
        secondary: {
          DEFAULT: "#f47a1f",
          500: "#f47a1f",
          600: "#db6a15",
        },
        brand: {
          blue: "#0b6fb7",
          orange: "#f47a1f",
          graphite: "#5b6572",
          ink: "#0f1b2d",
        },
        // Tokens CSS (supporte text-muted-foreground, bg-card, border-border, etc.)
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        input: "var(--input)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
        display: ['"Sora"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
