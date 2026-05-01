import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Duality palette — paper & ink, with a single accent.
        paper: {
          DEFAULT: "#FAFAF7",
          dim: "#F2F1EC",
          edge: "#E8E6DF",
        },
        ink: {
          DEFAULT: "#0A0A0A",
          soft: "#1F1F1D",
          mute: "#5A5A56",
          faint: "#8C8C86",
        },
        // The accent — quiet ochre. Earned, not sprinkled.
        ochre: {
          DEFAULT: "#B8893A",
          deep: "#8E6826",
          glow: "#E5C77B",
        },
        // The "machine" side — cool steel for status, system, run states.
        steel: {
          DEFAULT: "#5B6B7A",
          deep: "#384654",
        },
      },
      fontFamily: {
        // Display serif — gravitas
        display: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        // Body sans
        sans: ['"Geist Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        // System / code
        mono: ['"JetBrains Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        prose: "68ch",
        screen: "1280px",
      },
      animation: {
        "fade-up": "fadeUp 600ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
        "draw-circle": "drawCircle 1400ms cubic-bezier(0.7, 0, 0.3, 1) both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drawCircle: {
          "0%": { strokeDashoffset: "300" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
