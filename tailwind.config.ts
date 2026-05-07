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
        forest: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        dex: {
          bg:      "#0a0f0d",
          panel:   "#111a14",
          card:    "#162019",
          border:  "#1e3323",
          accent:  "#22c55e",
          glow:    "#4ade80",
          muted:   "#6b7c6e",
          dim:     "#2d3d30",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        mono:    ["var(--font-mono)", "monospace"],
        body:    ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glow:    "0 0 20px rgba(34,197,94,0.25), 0 0 60px rgba(34,197,94,0.1)",
        "glow-sm": "0 0 8px rgba(34,197,94,0.3)",
        card:    "0 4px 24px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)",
        "scan-line":    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "scan":       "scan 3s linear infinite",
        "fade-in":    "fadeIn 0.3s ease-out",
        "slide-up":   "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "ping-slow":  "ping 2s cubic-bezier(0,0,0.2,1) infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.6" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
