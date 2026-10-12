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
        navy: {
          DEFAULT: "#0B1F3A",
          50: "#E8EEF5",
          100: "#C5D2E3",
          200: "#8FA6C4",
          700: "#143156",
          800: "#0F2948",
          900: "#0B1F3A",
          950: "#071628",
        },
        brand: {
          DEFAULT: "#1769E0",
          50: "#EAF3FF",
          100: "#D6E8FF",
          200: "#B3D4FF",
          300: "#7FB6F7",
          400: "#4B94F0",
          500: "#2F80ED",
          600: "#1769E0",
          700: "#1257BC",
          800: "#0F4596",
          900: "#0C3675",
        },
        page: "#F6F9FE",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F6F9FE",
          border: "#E2E8F0",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
        success: {
          DEFAULT: "#16A34A",
          soft: "#DCFCE7",
        },
        warning: {
          DEFAULT: "#F59E0B",
          soft: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#DC2626",
          soft: "#FEE2E2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "76rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11, 31, 58, 0.04), 0 4px 12px rgba(11, 31, 58, 0.04)",
        card: "0 8px 30px rgba(11, 31, 58, 0.06)",
        elevated: "0 16px 40px rgba(11, 31, 58, 0.10)",
        nav: "0 8px 24px rgba(11, 31, 58, 0.08)",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "splash-mark": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "splash-title": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "splash-tagline": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.45s ease-out forwards",
        "fade-up": "fade-up 0.55s ease-out forwards",
        "splash-mark": "splash-mark 0.5s ease-out forwards",
        "splash-title": "splash-title 0.55s ease-out 0.18s both",
        "splash-tagline": "splash-tagline 0.55s ease-out 0.38s both",
        float: "float 5.5s ease-in-out infinite",
        "float-slow": "float-slow 6.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
