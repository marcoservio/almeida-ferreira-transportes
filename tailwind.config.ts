import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      colors: {
        /** Azul corporativo — cor principal da marca no site. */
        brand: {
          50: "#EEF5FC",
          100: "#D6E7F7",
          200: "#AECFEF",
          300: "#7FB2E4",
          400: "#4E90D6",
          500: "#2A6FBE",
          600: "#1B579C",
          700: "#14427A",
          800: "#0E3159",
          900: "#0A2440",
          950: "#061728",
        },
        /** Grafite azulado — fundos escuros, textos e superfícies. */
        ink: {
          50: "#F4F7FB",
          100: "#E6EDF5",
          200: "#C9D8E8",
          300: "#9DB4CE",
          400: "#6A88AC",
          500: "#47688E",
          600: "#345273",
          700: "#2A415C",
          800: "#1B2E44",
          900: "#101F31",
          950: "#0A1420",
        },
        /** Vermelho da logo (#E21B23) — acentos, CTAs e destaques. */
        signal: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F26B6B",
          500: "#E21B23",
          600: "#C3151C",
          700: "#A11318",
          800: "#841217",
          900: "#6E1216",
        },
        /* Usados no globals.css para o fundo, o texto e a borda padrão. */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(10 20 32 / 0.04), 0 8px 24px -12px rgb(10 20 32 / 0.12)",
        "card-hover":
          "0 1px 2px 0 rgb(10 20 32 / 0.06), 0 18px 40px -16px rgb(10 20 32 / 0.22)",
        glow: "0 20px 60px -20px rgb(226 27 35 / 0.45)",
      },
      backgroundImage: {
        "grid-ink":
          "linear-gradient(to right, rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.06) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        "slide-down": "slide-down 0.2s ease-out both",
      },
    },
  },
} satisfies Config;
