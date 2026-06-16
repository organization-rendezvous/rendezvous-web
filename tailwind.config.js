/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0A0A0A",
          card: "#141414",
          elevated: "#1A1A1A",
          border: "#242424",
        },
        yellow: {
          primary: "#F5C518",
          dim: "#C49A10",
          muted: "#2A2200",
          text: "#FFD84D",
        },
        text: {
          primary: "#F0F0F0",
          secondary: "#888888",
          muted: "#444444",
        },
        status: {
          rising: "#F5C518",
          success: "#22C55E",
          error: "#EF4444",
          warn: "#F97316",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
