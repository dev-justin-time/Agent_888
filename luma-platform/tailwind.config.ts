import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#061612",
          dim: "#061612",
          bright: "#2c3d37",
          variant: "#283833",
          container: {
            lowest: "#02110d",
            low: "#0e1f1a",
            DEFAULT: "#12231e",
            high: "#1d2d28",
            highest: "#283833",
          },
        },
        "on-surface": {
          DEFAULT: "#d4e7df",
          variant: "#bbcabf",
        },
        primary: {
          DEFAULT: "#4edea3",
          fixed: "#6ffbbe",
          dim: "#4edea3",
          container: "#10b981",
        },
        "on-primary": {
          DEFAULT: "#003824",
          container: "#00422b",
          fixed: "#002113",
        },
        secondary: {
          DEFAULT: "#b5cbc3",
          container: "#374b44",
          fixed: "#d1e8df",
          "fixed-dim": "#b5cbc3",
        },
        "on-secondary": {
          DEFAULT: "#21342e",
          container: "#a4bab2",
          fixed: "#0b1f1a",
        },
        tertiary: {
          DEFAULT: "#a8cfbc",
          container: "#84ab98",
          fixed: "#c3ecd7",
          "fixed-dim": "#a8cfbc",
        },
        "on-tertiary": {
          DEFAULT: "#113729",
          container: "#1b3f31",
          fixed: "#002115",
        },
        error: {
          DEFAULT: "#ffb4ab",
          container: "#93000a",
        },
        "on-error": {
          DEFAULT: "#690005",
          container: "#ffdad6",
        },
        outline: {
          DEFAULT: "#86948a",
          variant: "#3c4a42",
        },
        inverse: {
          surface: "#d4e7df",
          "on-surface": "#23342f",
          primary: "#006c49",
        },
      },
      fontFamily: {
        "display-lg": ["var(--font-manrope)", "sans-serif"],
        "headline-lg": ["var(--font-manrope)", "sans-serif"],
        "headline-lg-mobile": ["var(--font-manrope)", "sans-serif"],
        "headline-md": ["var(--font-manrope)", "sans-serif"],
        "body-lg": ["var(--font-manrope)", "sans-serif"],
        "body-md": ["var(--font-manrope)", "sans-serif"],
        "label-sm": ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": [
          "12px",
          { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" },
        ],
      },
      spacing: {
        unit: "8px",
        gutter: "16px",
        "section-gap": "48px",
        "container-margin": "24px",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-gentle": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-gentle": "pulse-gentle 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
