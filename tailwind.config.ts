import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#002045",
        "primary-container": "#1a365d",
        "on-primary": "#ffffff",
        "inverse-primary": "#adc7f7",
        secondary: "#795900",
        "secondary-container": "#ffc329",
        "secondary-fixed-dim": "#f9bd22",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#6f5100",
        "technical-blue": "#2B6CB0",
        "surface-gray": "#F7FAFC",
        "deep-charcoal": "#1A202C",
        "solar-orange": "#F59E0B",
        background: "#faf9fd",
        surface: "#faf9fd",
        "surface-container-low": "#f4f3f7",
        "surface-container-lowest": "#ffffff",
        "surface-container": "#efedf1",
        "surface-variant": "#e3e2e6",
        "on-surface": "#1a1c1e",
        "on-surface-variant": "#43474e",
        "on-background": "#1a1c1e",
        outline: "#74777f",
        "outline-variant": "#c4c6cf",
        error: "#ba1a1a",
        "on-error": "#ffffff",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-sm": ["14px", { lineHeight: "20px", fontWeight: "600" }],
      },
      spacing: {
        gutter: "24px",
        "margin-mobile": "16px",
        "section-padding": "80px",
        "container-max": "1280px",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      maxWidth: {
        "container-max": "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
