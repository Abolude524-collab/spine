import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0A0A0C",
        foreground: "#EDEDED",
        zinc: {
          950: "#0A0A0C",
          900: "#121215",
          850: "#16161A",
          800: "#222226",
          700: "#333338",
          600: "#52525B",
        },
        emerald: {
          400: "#00E699",
          500: "#00E699",
          600: "#00C782",
        },
        "neon-emerald": "#00E699",
        "neon-emerald-glow": "#00FF9D",
        "electric-yellow": "#FFE600",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
      },
      borderWidth: {
        DEFAULT: "1px",
      },
    },
  },
  plugins: [],
};

export default config;
