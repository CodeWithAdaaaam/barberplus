/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom Barber Plus colors
        gold: {
          DEFAULT: "#C9A84C",
          light: "#D4B85A",
          dark: "#B8993F",
        },
        bp: {
          bg: "#0A0A0A",
          card: "#1A1A1A",
          border: "#2A2A2A",
          text: "#FFFFFF",
          muted: "#9A9A9A",
          tertiary: "#6A6A6A",
          overlay: "rgba(10, 10, 10, 0.85)",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        gold: "0 8px 32px rgba(201, 168, 76, 0.08)",
        "gold-lg": "0 0 0 3px rgba(201, 168, 76, 0.15)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "blur-scale": {
          "0%": { filter: "blur(12px) brightness(30%)", transform: "scale(0.85)", opacity: "0" },
          "100%": { filter: "blur(0px) brightness(100%)", transform: "scale(1)", opacity: "1" },
        },
        "draw-circle": {
          "0%": { strokeDashoffset: "283" },
          "100%": { strokeDashoffset: "0" },
        },
        "draw-check": {
          "0%": { strokeDashoffset: "40" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "blur-scale": "blur-scale 0.7s ease-out forwards",
        "draw-circle": "draw-circle 0.6s ease-out forwards",
        "draw-check": "draw-check 0.3s ease-out 0.5s forwards",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
