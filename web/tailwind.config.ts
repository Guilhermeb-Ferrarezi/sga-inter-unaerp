import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: {
          1: "var(--surface-1)",
          2: "var(--surface-2)",
          3: "var(--surface-3)",
        },
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        fg: {
          DEFAULT: "var(--fg)",
          soft: "var(--fg-soft)",
          mute: "var(--fg-mute)",
        },
        blue: {
          DEFAULT: "#0073B7",
          bright: "#1090D8",
          deep: "#0E4D8C",
        },
        navy: "#0A1A3D",
        teal: "#2EAA80",
        lime: "#A4CD3A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Barlow Condensed"', "Oswald", "sans-serif"],
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.5s infinite",
        "fade-up": "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
